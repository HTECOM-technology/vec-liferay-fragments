#!/usr/bin/env python3
import argparse
import datetime as dt
import fcntl
import html
import json
import os
import re
import socket
import sys
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


START_RE = re.compile(r"^=+ \[(?P<action>[^\]]+)\] started at (?P<time>.*?) =+$")
FINISH_RE = re.compile(
    r"^=+ \[(?P<action>[^\]]+)\] finished at (?P<time>.*?) \(exit=(?P<exit>\d+)\) =+$"
)


def read_env_file(path):
    values = {}
    if not path or not Path(path).is_file():
        return values

    for raw_line in Path(path).read_text(encoding="utf-8", errors="replace").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
            value = value[1:-1]
        values[key] = value
    return values


def merged_config():
    script_dir = Path(os.environ.get("STATUS_SCRIPT_DIR") or Path(__file__).resolve().parent)
    config_file = os.environ.get("CONFIG_FILE") or str(script_dir / ".env")
    file_values = read_env_file(config_file)

    def get(name, default=""):
        return os.environ.get(name) or file_values.get(name) or default

    tz_name = os.environ.get("TZ") or file_values.get("CRON_TIMEZONE") or "Asia/Ho_Chi_Minh"
    os.environ["TZ"] = tz_name
    if hasattr(time, "tzset"):
        time.tzset()

    legacy_log_file = get("LOG_FILE")
    log_dir = get("LOG_DIR")
    log_file_basename = get("LOG_FILE_BASENAME")

    if not log_dir:
        log_dir = str(Path(legacy_log_file).parent) if legacy_log_file else str(script_dir / "logs")
    if not log_file_basename:
        log_file_basename = Path(legacy_log_file).name if legacy_log_file else "actions.log"

    return {
        "script_dir": str(script_dir),
        "config_file": config_file,
        "log_dir": log_dir,
        "log_file_basename": log_file_basename,
        "backup_history_file_basename": get("BACKUP_HISTORY_FILE_BASENAME", "backup-history.log"),
        "restore_history_file_basename": get("RESTORE_HISTORY_FILE_BASENAME", "restore-history.log"),
        "lock_file": get("LOCK_FILE", "/tmp/liferay-backup.lock"),
        "bundle_dir": get("BUNDLE_DIR"),
        "status_host": get("STATUS_HOST", "0.0.0.0"),
        "status_port": int(get("STATUS_PORT", "18080")),
        "status_log_lines": int(get("STATUS_LOG_LINES", "300")),
        "status_token": get("STATUS_TOKEN"),
        "app_health_url": get("APP_HEALTH_URL", "http://127.0.0.1:8080"),
        "timezone": time.strftime("%Z %z"),
        "tz_name": tz_name,
        "hostname": socket.gethostname(),
    }


CONFIG = merged_config()


def now_text():
    return dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def latest_daily_file(log_dir, basename):
    root = Path(log_dir)
    candidates = []

    if root.is_dir():
        for day_dir in root.iterdir():
            if day_dir.is_dir():
                file_path = day_dir / basename
                if file_path.is_file():
                    candidates.append(file_path)

        fallback = root / basename
        if fallback.is_file():
            candidates.append(fallback)

    if not candidates:
        return None

    return max(candidates, key=lambda item: item.stat().st_mtime)


def tail_lines(path, line_count):
    if not path or not Path(path).is_file():
        return []

    try:
        with Path(path).open("rb") as handle:
            handle.seek(0, os.SEEK_END)
            size = handle.tell()
            block_size = 8192
            data = b""

            while size > 0 and data.count(b"\n") <= line_count:
                read_size = min(block_size, size)
                size -= read_size
                handle.seek(size)
                data = handle.read(read_size) + data

        return data.decode("utf-8", errors="replace").splitlines()[-line_count:]
    except OSError as exc:
        return [f"ERROR reading log: {exc}"]


def parse_action(lines):
    last_start = None
    last_finish = None

    for line in lines:
        start_match = START_RE.match(line)
        if start_match:
            last_start = {
                "action": start_match.group("action"),
                "started_at": start_match.group("time"),
            }
            continue

        finish_match = FINISH_RE.match(line)
        if finish_match:
            last_finish = {
                "action": finish_match.group("action"),
                "finished_at": finish_match.group("time"),
                "exit_code": int(finish_match.group("exit")),
            }

    running = bool(last_start and (not last_finish or last_finish.get("finished_at") < last_start.get("started_at", "")))
    return {
        "last_started": last_start,
        "last_finished": last_finish,
        "looks_running_from_log": running,
    }


def parse_history_line(line):
    values = {}
    for part in line.split("|"):
        if "=" in part:
            key, value = part.split("=", 1)
            values[key] = value
    return values


def latest_restore_history():
    history_file = latest_daily_file(
        CONFIG["log_dir"],
        CONFIG["restore_history_file_basename"],
    )
    lines = tail_lines(history_file, 20) if history_file else []
    last = next((line for line in reversed(lines) if line.strip()), "")
    return {
        "file": str(history_file) if history_file else "",
        "last": parse_history_line(last) if last else {},
    }


def latest_backup_history():
    history_file = latest_daily_file(
        CONFIG["log_dir"],
        CONFIG["backup_history_file_basename"],
    )
    lines = tail_lines(history_file, 20) if history_file else []
    last = next((line for line in reversed(lines) if line.strip()), "")
    return {
        "file": str(history_file) if history_file else "",
        "last": parse_history_line(last) if last else {},
    }


def lock_status():
    lock_path = Path(CONFIG["lock_file"])
    if not lock_path.exists():
        return {"busy": False, "file": str(lock_path), "message": "lock file not found"}

    try:
        with lock_path.open("a+") as handle:
            try:
                fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
                fcntl.flock(handle.fileno(), fcntl.LOCK_UN)
                return {"busy": False, "file": str(lock_path), "message": "lock is free"}
            except BlockingIOError:
                return {"busy": True, "file": str(lock_path), "message": "backup/restore lock is held"}
    except OSError as exc:
        return {"busy": None, "file": str(lock_path), "message": str(exc)}


def app_health():
    url = CONFIG["app_health_url"]
    if not url:
        return {"configured": False, "up": None, "message": "APP_HEALTH_URL is empty"}

    request = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            status = response.getcode()
            return {
                "configured": True,
                "url": url,
                "up": status < 500,
                "http_status": status,
                "message": f"HTTP {status}",
            }
    except urllib.error.HTTPError as exc:
        return {
            "configured": True,
            "url": url,
            "up": exc.code < 500,
            "http_status": exc.code,
            "message": f"HTTP {exc.code}",
        }
    except Exception as exc:
        return {
            "configured": True,
            "url": url,
            "up": False,
            "message": str(exc),
        }


def collect_status():
    log_file = latest_daily_file(CONFIG["log_dir"], CONFIG["log_file_basename"])
    lines = tail_lines(log_file, CONFIG["status_log_lines"]) if log_file else []
    lock = lock_status()
    action = parse_action(lines)

    return {
        "now": now_text(),
        "timezone": CONFIG["timezone"],
        "tz_name": CONFIG["tz_name"],
        "hostname": CONFIG["hostname"],
        "lock": lock,
        "app": app_health(),
        "action": action,
        "backup_history": latest_backup_history(),
        "restore_history": latest_restore_history(),
        "log": {
            "file": str(log_file) if log_file else "",
            "lines": lines,
        },
    }


def badge(label, ok):
    if ok is True:
        css = "ok"
    elif ok is False:
        css = "bad"
    else:
        css = "warn"
    return f'<span class="badge {css}">{html.escape(label)}</span>'


def render_html(data):
    lock_label = "RUNNING" if data["lock"]["busy"] else "IDLE"
    app = data["app"]
    app_label = "UP" if app.get("up") else "DOWN"
    current = data["action"].get("last_started") or {}
    last_finished = data["action"].get("last_finished") or {}
    backup_history = data["backup_history"].get("last") or {}
    history = data["restore_history"].get("last") or {}
    log_text = "\n".join(data["log"]["lines"])

    return f"""<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="10">
  <title>Liferay restore status</title>
  <style>
    :root {{ color-scheme: light dark; }}
    body {{ margin: 0; font-family: system-ui, -apple-system, Segoe UI, sans-serif; background: #f7f8fa; color: #171a1f; }}
    main {{ max-width: 1180px; margin: 0 auto; padding: 24px; }}
    h1 {{ margin: 0 0 16px; font-size: 24px; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 16px; }}
    .panel {{ background: #fff; border: 1px solid #dfe3ea; border-radius: 8px; padding: 14px; }}
    .label {{ color: #5c6573; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }}
    .value {{ margin-top: 6px; font-size: 16px; font-weight: 650; word-break: break-word; }}
    .badge {{ display: inline-flex; padding: 4px 8px; border-radius: 999px; font-weight: 700; font-size: 12px; }}
    .ok {{ background: #dff6e5; color: #12622d; }}
    .bad {{ background: #ffe3e3; color: #941b1b; }}
    .warn {{ background: #fff1cf; color: #7a5200; }}
    pre {{ overflow: auto; white-space: pre-wrap; word-break: break-word; margin: 0; padding: 16px; background: #111827; color: #e5e7eb; border-radius: 8px; line-height: 1.45; }}
    a {{ color: #2563eb; }}
    @media (prefers-color-scheme: dark) {{
      body {{ background: #0b1020; color: #edf1f7; }}
      .panel {{ background: #111827; border-color: #273244; }}
      .label {{ color: #9aa6b8; }}
    }}
  </style>
</head>
<body>
<main>
  <h1>Liferay Restore Status</h1>
  <section class="grid">
    <div class="panel"><div class="label">Backup/restore lock</div><div class="value">{badge(lock_label, not data["lock"]["busy"])}</div></div>
    <div class="panel"><div class="label">Liferay app</div><div class="value">{badge(app_label, app.get("up"))} {html.escape(app.get("message", ""))}</div></div>
    <div class="panel"><div class="label">Current action</div><div class="value">{html.escape(current.get("action", "unknown"))}</div></div>
    <div class="panel"><div class="label">Started at</div><div class="value">{html.escape(current.get("started_at", ""))}</div></div>
    <div class="panel"><div class="label">Last finished</div><div class="value">{html.escape(last_finished.get("finished_at", ""))} exit={html.escape(str(last_finished.get("exit_code", "")))}</div></div>
    <div class="panel"><div class="label">Last backup</div><div class="value">{html.escape(backup_history.get("status", ""))} {html.escape(backup_history.get("finished_at", ""))}</div></div>
    <div class="panel"><div class="label">Last restore</div><div class="value">{html.escape(history.get("status", ""))} {html.escape(history.get("finished_at", ""))}</div></div>
  </section>
  <section class="panel">
    <div class="label">Server</div>
    <div class="value">{html.escape(data["hostname"])} | {html.escape(data["now"])} {html.escape(data["timezone"])} | health: {html.escape(app.get("url", ""))}</div>
  </section>
  <section style="margin-top:16px">
    <div class="label" style="margin-bottom:8px">Latest log: {html.escape(data["log"]["file"])}</div>
    <pre>{html.escape(log_text)}</pre>
  </section>
</main>
</body>
</html>"""


class Handler(BaseHTTPRequestHandler):
    def auth_ok(self):
        token = CONFIG.get("status_token")
        if not token:
            return True

        query = parse_qs(urlparse(self.path).query)
        supplied = self.headers.get("X-Status-Token") or query.get("token", [""])[0]
        return supplied == token

    def send_body(self, status, content_type, body, include_body=True):
        payload = body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if include_body:
            self.wfile.write(payload)

    def do_GET(self):
        if not self.auth_ok():
            self.send_body(401, "text/plain; charset=utf-8", "unauthorized\n")
            return

        path = urlparse(self.path).path
        data = collect_status()

        if path == "/status.json":
            self.send_body(200, "application/json; charset=utf-8", json.dumps(data, ensure_ascii=False, indent=2))
            return

        if path == "/log.txt":
            self.send_body(200, "text/plain; charset=utf-8", "\n".join(data["log"]["lines"]) + "\n")
            return

        self.send_body(200, "text/html; charset=utf-8", render_html(data))

    def do_HEAD(self):
        if not self.auth_ok():
            self.send_body(401, "text/plain; charset=utf-8", "unauthorized\n", include_body=False)
            return

        path = urlparse(self.path).path
        if path == "/status.json":
            self.send_body(200, "application/json; charset=utf-8", "", include_body=False)
        elif path == "/log.txt":
            self.send_body(200, "text/plain; charset=utf-8", "", include_body=False)
        else:
            self.send_body(200, "text/html; charset=utf-8", "", include_body=False)

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (now_text(), fmt % args))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--once", action="store_true", help="print status JSON once and exit")
    args = parser.parse_args()

    if args.once:
        print(json.dumps(collect_status(), ensure_ascii=False, indent=2))
        return

    server = ThreadingHTTPServer((CONFIG["status_host"], CONFIG["status_port"]), Handler)
    print(
        f"Status server listening on http://{CONFIG['status_host']}:{CONFIG['status_port']} "
        f"({CONFIG['tz_name']})",
        flush=True,
    )
    server.serve_forever()


if __name__ == "__main__":
    main()
