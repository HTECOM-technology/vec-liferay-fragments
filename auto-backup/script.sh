#!/usr/bin/env bash

if [ -z "${BASH_VERSION:-}" ]; then
  echo "ERROR: Script nay phai chay bang bash, khong duoc dung sh." >&2
  echo "Hay dung: bash $0 help" >&2
  exit 1
fi

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/.env"

RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m"

if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${RED}ERROR: Không tìm thấy file cấu hình: $CONFIG_FILE${NC}"
  exit 1
fi

# shellcheck disable=SC1090
source "$CONFIG_FILE"

LEGACY_LOG_FILE="${LOG_FILE:-}"
if [ -n "$LEGACY_LOG_FILE" ]; then
  LOG_DIR="${LOG_DIR:-$(dirname "$LEGACY_LOG_FILE")}"
  LOG_FILE_BASENAME="${LOG_FILE_BASENAME:-$(basename "$LEGACY_LOG_FILE")}"
else
  LOG_DIR="${LOG_DIR:-${SCRIPT_DIR}/logs}"
  LOG_FILE_BASENAME="${LOG_FILE_BASENAME:-actions.log}"
fi

RESTORE_HISTORY_FILE_BASENAME="${RESTORE_HISTORY_FILE_BASENAME:-restore-history.log}"
CRON_SCHEDULE="${CRON_SCHEDULE:-30 17 * * *}"
CRON_TIMEZONE="${CRON_TIMEZONE:-Asia/Ho_Chi_Minh}"
STATUS_HOST="${STATUS_HOST:-0.0.0.0}"
STATUS_PORT="${STATUS_PORT:-18080}"
STATUS_LOG_LINES="${STATUS_LOG_LINES:-300}"
STATUS_TOKEN="${STATUS_TOKEN:-}"
APP_HEALTH_URL="${APP_HEALTH_URL:-http://127.0.0.1:8080}"
BACKUP_RETENTION_COUNT="${BACKUP_RETENTION_COUNT:-3}"
LOCK_FILE="/tmp/liferay-backup.lock"
CRON_MARKER="# vec-liferay-auto-backup"

CURRENT_ACTION=""
CURRENT_TMP_DIR=""
SERVICE_WAS_STOPPED="false"
SERVICE_RESTART_ATTEMPTED="false"
ROLLBACK_DIR=""
ACTION_LOG_FILE=""
RESTORE_HISTORY_FILE=""
ACTION_STARTED_AT=""
ACTION_FINISHED_AT=""
ACTION_FAILURE_MESSAGE=""
LOGGING_READY="false"
RESTORE_HISTORY_PENDING="false"
RESTORE_BACKUP_NAME=""
RESTORE_MODE="unknown"
RESTORE_STARTED_AT=""
RESTORE_FINISHED_AT=""

timestamp_now() {
  date "+%Y-%m-%d %H:%M:%S"
}

timestamp_compact() {
  date "+%Y%m%d_%H%M%S"
}

timestamp_timezone() {
  date "+%Z %z"
}

print_line() {
  local level="$1"
  local message="$2"

  printf '[%s] [%s] %s\n' "$(timestamp_now)" "$level" "$message"
}

append_file_line() {
  local file_path="$1"
  local message="$2"

  mkdir -p "$(dirname "$file_path")" 2>/dev/null || true
  printf '%s\n' "$message" >> "$file_path" 2>/dev/null || true
}

info() {
  local message="$1"
  print_line "INFO" "$message"
}

warn() {
  local message="$1"
  print_line "WARN" "$message"
}

error_msg() {
  local message="$1"
  print_line "ERROR" "$message" >&2
}

prepare_log_files() {
  local log_date daily_dir

  log_date="$(date "+%Y-%m-%d")"
  daily_dir="${LOG_DIR}/${log_date}"

  mkdir -p "$daily_dir"

  ACTION_LOG_FILE="${daily_dir}/${LOG_FILE_BASENAME}"
  RESTORE_HISTORY_FILE="${daily_dir}/${RESTORE_HISTORY_FILE_BASENAME}"
  LOG_FILE="$ACTION_LOG_FILE"
}

setup_logging() {
  if [ "$LOGGING_READY" = "true" ]; then
    return 0
  fi

  LOGGING_READY="true"
  ACTION_STARTED_AT="$(timestamp_now)"

  exec > >(tee -a "$ACTION_LOG_FILE") 2>&1

  printf '========== [%s] started at %s ==========\n' \
    "${CURRENT_ACTION:-unknown}" "$ACTION_STARTED_AT"
  printf 'Command: /bin/bash %s %s\n' "$0" "$*"
  printf 'Log file: %s\n' "$ACTION_LOG_FILE"
}

record_restore_history() {
  local status="$1"

  if [ "$CURRENT_ACTION" != "restore" ] || [ "$RESTORE_HISTORY_PENDING" != "true" ]; then
    return 0
  fi

  if [ -z "$RESTORE_FINISHED_AT" ]; then
    RESTORE_FINISHED_AT="$(timestamp_now)"
  fi

  append_file_line \
    "$RESTORE_HISTORY_FILE" \
    "started_at=${RESTORE_STARTED_AT:-$ACTION_STARTED_AT}|finished_at=${RESTORE_FINISHED_AT}|backup_name=${RESTORE_BACKUP_NAME:-unknown}|restore_mode=${RESTORE_MODE:-unknown}|status=${status}|log_file=${ACTION_LOG_FILE}"

  RESTORE_HISTORY_PENDING="false"
}

run_blade_server_safe() {
  local blade_action="$1"

  if ! command -v blade >/dev/null 2>&1; then
    error_msg "Thiếu command: blade"
    return 1
  fi

  if [ ! -d "${BUNDLE_DIR:-}" ]; then
    error_msg "Không tìm thấy BUNDLE_DIR để chạy blade: ${BUNDLE_DIR:-}"
    return 1
  fi

  info "Đang chạy 'blade server ${blade_action}' trong ${BUNDLE_DIR}..."
  (
    cd "$BUNDLE_DIR" || exit 1
    blade server "$blade_action"
  )
}

ensure_service_running_after_failure() {
  local errexit_was_on="false"
  local restart_exit_code

  if [ "$SERVICE_WAS_STOPPED" != "true" ] || [ "$SERVICE_RESTART_ATTEMPTED" = "true" ]; then
    return 0
  fi

  SERVICE_RESTART_ATTEMPTED="true"

  case "$-" in
    *e*)
      errexit_was_on="true"
      ;;
  esac

  trap - ERR
  set +e

  warn "Tiến trình kết thúc lỗi khi server đang dừng. Đang thử start lại server..."
  run_blade_server_safe start
  restart_exit_code=$?

  if [ "$restart_exit_code" -eq 0 ]; then
    SERVICE_WAS_STOPPED="false"
    info "Đã start lại server sau khi restore/backup lỗi."
  else
    error_msg "Không thể start lại server tự động. Vui lòng kiểm tra thủ công."
  fi

  trap 'handle_unexpected_error $? $LINENO "$BASH_COMMAND"' ERR

  if [ "$errexit_was_on" = "true" ]; then
    set -e
  fi
}

handle_exit() {
  local exit_code="$?"

  if [ "$exit_code" -ne 0 ]; then
    ensure_service_running_after_failure
  fi

  ACTION_FINISHED_AT="$(timestamp_now)"

  if [ "$LOGGING_READY" = "true" ]; then
    printf '========== [%s] finished at %s (exit=%s) ==========\n' \
      "${CURRENT_ACTION:-unknown}" "$ACTION_FINISHED_AT" "$exit_code"
    if [ -n "$ACTION_FAILURE_MESSAGE" ]; then
      printf 'Failure: %s\n' "$ACTION_FAILURE_MESSAGE"
    fi
  fi

  if [ "$exit_code" -eq 0 ]; then
    record_restore_history "success"
  else
    record_restore_history "failed"
  fi

  cleanup_tmp
}

send_mail() {
  local subject="$1"
  local body="$2"

  if [ -z "${MAIL_HOST:-}" ] || [ -z "${MAIL_PORT:-}" ] || \
    [ -z "${MAIL_USERNAME:-}" ] || [ -z "${MAIL_PASSWORD:-}" ] || \
    [ -z "${MAIL_FROM_ADDRESS:-}" ] || [ -z "${MAIL_TO:-}" ]; then
    return 0
  fi

  set +e

  local mail_file
  mail_file="$(mktemp)"

  cat > "$mail_file" <<EOF
From: ${MAIL_FROM_ADDRESS}
To: ${MAIL_TO}
Subject: ${subject}
Content-Type: text/plain; charset=UTF-8

${body}
EOF

  if ! curl --silent --show-error --fail \
    --url "smtp://${MAIL_HOST}:${MAIL_PORT}" \
    --ssl-reqd \
    --user "${MAIL_USERNAME}:${MAIL_PASSWORD}" \
    --mail-from "${MAIL_FROM_ADDRESS}" \
    --mail-rcpt "${MAIL_TO}" \
    --upload-file "$mail_file" >/dev/null; then
    append_file_line "$LOG_FILE" "[${CURRENT_ACTION:-unknown}] WARN Không gửi được email cảnh báo tới ${MAIL_TO}."
  fi

  rm -f "$mail_file"
  set -e
}

build_failure_mail_body() {
  local message="$1"

  cat <<EOF
Host: $(hostname)
Thời gian: $(timestamp_now)
Action: ${CURRENT_ACTION:-unknown}
Lỗi: ${message}
Config file: ${CONFIG_FILE}
Log file: ${ACTION_LOG_FILE:-$LOG_FILE}
EOF

  if [ "$SERVICE_WAS_STOPPED" = "true" ]; then
    printf '\nLưu ý: Tomcat/Liferay đã được stop bằng blade và chưa được start lại.\n'
  fi

  if [ -n "$ROLLBACK_DIR" ]; then
    printf 'Bundles cũ đang nằm tại: %s\n' "$ROLLBACK_DIR"
  fi
}

cleanup_tmp() {
  if [ -n "$CURRENT_TMP_DIR" ] && [ -d "$CURRENT_TMP_DIR" ]; then
    rm -rf "$CURRENT_TMP_DIR"
    CURRENT_TMP_DIR=""
  fi
}

error_exit() {
  local message="$1"

  ACTION_FAILURE_MESSAGE="$message"
  error_msg "ERROR: ${message}"
  send_mail "[Liferay Backup] ERROR on $(hostname)" "$(build_failure_mail_body "$message")"
  exit 1
}

handle_unexpected_error() {
  local exit_code="$1"
  local line_no="$2"
  local failed_command="$3"
  local message="Lệnh thất bại tại dòng ${line_no}: ${failed_command} (exit code: ${exit_code})"

  trap - ERR
  set +e
  ACTION_FAILURE_MESSAGE="$message"
  error_msg "ERROR: ${message}"
  send_mail "[Liferay Backup] CRITICAL on $(hostname)" "$(build_failure_mail_body "$message")"
  exit "$exit_code"
}

trap 'handle_unexpected_error $? $LINENO "$BASH_COMMAND"' ERR
trap 'handle_exit' EXIT

require_commands() {
  local missing=0
  local cmd

  for cmd in "$@"; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
      error_msg "Thiếu command: $cmd"
      missing=1
    fi
  done

  [ "$missing" -eq 0 ] || error_exit "Thiếu dependency cần thiết để chạy lệnh ${CURRENT_ACTION:-unknown}."
}

require_config_vars() {
  local missing=""
  local var_name

  for var_name in "$@"; do
    if [ -z "${!var_name:-}" ]; then
      missing="${missing} ${var_name}"
    fi
  done

  if [ -n "$missing" ]; then
    error_exit "Thiếu cấu hình bắt buộc trong .env: ${missing# }"
  fi
}

initialize_runtime() {
  require_config_vars BACKUP_DIR MAIL_HOST MAIL_PORT MAIL_USERNAME MAIL_PASSWORD MAIL_FROM_ADDRESS MAIL_TO

  mkdir -p "$BACKUP_DIR"
  mkdir -p "$LOG_DIR"
}

prune_old_backups() {
  local entries count retention timestamp file

  retention="${BACKUP_RETENTION_COUNT:-3}"

  case "$retention" in
    ''|*[!0-9]*)
      error_exit "BACKUP_RETENTION_COUNT không hợp lệ: ${retention}"
      ;;
  esac

  entries="$(get_backup_entries || true)"
  count=0

  while IFS="|" read -r timestamp file; do
    [ -z "${file:-}" ] && continue

    count=$((count + 1))
    if [ "$count" -le "$retention" ]; then
      continue
    fi

    warn "Đang xoá backup cũ do vượt quá giới hạn ${retention} bản: $file"
    rm -rf "$file"
  done <<EOF
$entries
EOF
}

check_free_space() {
  local free_kb required_kb free_gb
  free_kb="$(df -Pk "$BACKUP_DIR" | awk 'NR==2 {print $4}')"
  required_kb=$((MIN_FREE_GB * 1024 * 1024))
  free_gb=$((free_kb / 1024 / 1024))

  if [ "$free_kb" -lt "$required_kb" ]; then
    error_exit "Không đủ dung lượng backup. Còn ${free_gb}GB, yêu cầu tối thiểu ${MIN_FREE_GB}GB."
  fi

  info "Disk OK: còn ${free_gb}GB trống tại ${BACKUP_DIR}."
}

check_mysql_connection() {
  require_config_vars MYSQL_HOST MYSQL_PORT MYSQL_DATABASE MYSQL_USER MYSQL_PASSWORD

  info "Đang kiểm tra kết nối MySQL tới ${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}..."
  mysql \
    --protocol=TCP \
    --connect-timeout=5 \
    -h "$MYSQL_HOST" \
    -P "$MYSQL_PORT" \
    -u "$MYSQL_USER" \
    "-p${MYSQL_PASSWORD}" \
    -e "SELECT 1;" \
    "$MYSQL_DATABASE" >/dev/null

  info "MySQL OK: kết nối thành công."
}

run_health_check() {
  require_commands df awk mysql mysqldump
  check_free_space
  check_mysql_connection
}

run_status_command() {
  if ! command -v python3 >/dev/null 2>&1; then
    echo "ERROR: Thieu command: python3" >&2
    exit 1
  fi

  STATUS_SCRIPT_DIR="$SCRIPT_DIR" \
  CONFIG_FILE="$CONFIG_FILE" \
  LOG_DIR="$LOG_DIR" \
  LOG_FILE_BASENAME="$LOG_FILE_BASENAME" \
  RESTORE_HISTORY_FILE_BASENAME="$RESTORE_HISTORY_FILE_BASENAME" \
  LOCK_FILE="$LOCK_FILE" \
  BUNDLE_DIR="${BUNDLE_DIR:-}" \
  STATUS_HOST="$STATUS_HOST" \
  STATUS_PORT="$STATUS_PORT" \
  STATUS_LOG_LINES="$STATUS_LOG_LINES" \
  STATUS_TOKEN="$STATUS_TOKEN" \
  APP_HEALTH_URL="$APP_HEALTH_URL" \
  TZ="${TZ:-$CRON_TIMEZONE}" \
    python3 "${SCRIPT_DIR}/status_server.py" --once
}

run_status_server() {
  if ! command -v python3 >/dev/null 2>&1; then
    echo "ERROR: Thieu command: python3" >&2
    exit 1
  fi

  STATUS_SCRIPT_DIR="$SCRIPT_DIR" \
  CONFIG_FILE="$CONFIG_FILE" \
  LOG_DIR="$LOG_DIR" \
  LOG_FILE_BASENAME="$LOG_FILE_BASENAME" \
  RESTORE_HISTORY_FILE_BASENAME="$RESTORE_HISTORY_FILE_BASENAME" \
  LOCK_FILE="$LOCK_FILE" \
  BUNDLE_DIR="${BUNDLE_DIR:-}" \
  STATUS_HOST="$STATUS_HOST" \
  STATUS_PORT="$STATUS_PORT" \
  STATUS_LOG_LINES="$STATUS_LOG_LINES" \
  STATUS_TOKEN="$STATUS_TOKEN" \
  APP_HEALTH_URL="$APP_HEALTH_URL" \
  TZ="${TZ:-$CRON_TIMEZONE}" \
    exec python3 "${SCRIPT_DIR}/status_server.py"
}

get_backup_entries() {
  find "$BACKUP_DIR" -maxdepth 1 \
    \( -type d -name "liferay_backup_*" -o -type f -name "liferay_full_backup_*.tar.gz" \) \
    -printf "%T@|%p\n" | sort -rn
}

list_backups() {
  require_config_vars BACKUP_DIR

  local index=0
  local found=0
  local entries

  printf "%-8s %-45s %-25s\n" "INDEX" "FILE" "BACKUP_TIME"
  printf "%-8s %-45s %-25s\n" "-----" "----" "-----------"

  entries="$(get_backup_entries || true)"

  while IFS="|" read -r timestamp file; do
    [ -z "${file:-}" ] && continue

    found=1
    local name backup_time
    name="$(basename "$file")"
    backup_time="$(date -d "@${timestamp%.*}" "+%Y-%m-%d %H:%M:%S")"

    printf "%-8s %-45s %-25s\n" "$index" "$name" "$backup_time"
    index=$((index + 1))
  done <<EOF
$entries
EOF

  if [ "$found" -eq 0 ]; then
    warn "Chưa có file backup nào trong $BACKUP_DIR"
  fi
}

get_backup_by_index() {
  local target_index="$1"
  local index=0
  local entries

  entries="$(get_backup_entries || true)"

  while IFS="|" read -r _ file; do
    [ -z "${file:-}" ] && continue

    if [ "$index" = "$target_index" ]; then
      echo "$file"
      return 0
    fi

    index=$((index + 1))
  done <<EOF
$entries
EOF

  return 1
}

run_blade_server() {
  local blade_action="$1"

  require_commands blade

  if [ ! -d "$BUNDLE_DIR" ]; then
    error_exit "Không tìm thấy BUNDLE_DIR để chạy blade: $BUNDLE_DIR"
  fi

  run_blade_server_safe "$blade_action"
}

stop_liferay() {
  run_blade_server stop
  SERVICE_WAS_STOPPED="true"
}

start_liferay() {
  run_blade_server start
  SERVICE_WAS_STOPPED="false"
}

create_sql_archive() {
  local sql_archive="$1"
  local timestamp="$2"
  local tmp_sql_dir sql_dump_file

  require_commands mysqldump tar
  require_config_vars MYSQL_HOST MYSQL_PORT MYSQL_DATABASE MYSQL_USER MYSQL_PASSWORD

  tmp_sql_dir="${CURRENT_TMP_DIR}/sql_dump_${timestamp}"
  sql_dump_file="${tmp_sql_dir}/${MYSQL_DATABASE}_${timestamp}.sql"

  mkdir -p "$tmp_sql_dir"

  info "Đang dump MySQL từ ${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}..."
  mysqldump \
    --protocol=TCP \
    --single-transaction \
    --quick \
    --routines \
    --events \
    --triggers \
    --no-tablespaces \
    -h "$MYSQL_HOST" \
    -P "$MYSQL_PORT" \
    -u "$MYSQL_USER" \
    "-p${MYSQL_PASSWORD}" \
    "$MYSQL_DATABASE" > "$sql_dump_file"

  info "Đang nén SQL backup..."
  tar -czf "$sql_archive" \
    -C "$tmp_sql_dir" \
    "$(basename "$sql_dump_file")"
}

create_bundle_archive() {
  local bundle_file="$1"
  local bundle_name bundle_parent

  if [ ! -d "$BUNDLE_DIR" ]; then
    error_exit "Không tìm thấy BUNDLE_DIR: $BUNDLE_DIR"
  fi

  bundle_name="$(basename "$BUNDLE_DIR")"
  bundle_parent="$(dirname "$BUNDLE_DIR")"

  info "Đang nén bundles từ ${BUNDLE_DIR}..."
  tar -czf "$bundle_file" \
    --exclude="${bundle_name}/logs/*" \
    --exclude="${bundle_name}/temp/*" \
    --exclude="${bundle_name}/work/*" \
    --exclude="${bundle_name}/osgi/state/*" \
    --exclude="${bundle_name}/data/elasticsearch7/*" \
    -C "$bundle_parent" \
    "$bundle_name"
}

create_backup_with_options() {
  local include_database="$1"
  local include_bundles="$2"
  local action_label="$3"
  local timestamp started_at completed_at bundle_file sql_file manifest_file final_dir bundle_archive_name sql_archive_name

  require_config_vars BACKUP_DIR STOP_SERVICE_DURING_BACKUP MIN_FREE_GB
  require_commands tar curl find awk date df mktemp sort flock

  if [ "$include_database" != "true" ] && [ "$include_bundles" != "true" ]; then
    error_exit "Phải chọn ít nhất một thành phần để backup."
  fi

  if [ "$STOP_SERVICE_DURING_BACKUP" = "true" ]; then
    require_commands blade
  fi

  if [ "$include_database" = "true" ]; then
    require_config_vars MYSQL_HOST MYSQL_PORT MYSQL_DATABASE MYSQL_USER MYSQL_PASSWORD
    require_commands mysqldump
  fi

  if [ "$include_bundles" = "true" ]; then
    require_config_vars BUNDLE_DIR
  fi

  check_free_space

  timestamp="$(timestamp_compact)"
  started_at="$(timestamp_now)"
  CURRENT_TMP_DIR="$(mktemp -d "${BACKUP_DIR}/.tmp_liferay_backup_${timestamp}_XXXXXX")"

  bundle_file="${CURRENT_TMP_DIR}/bundles_backup_${timestamp}.tar.gz"
  sql_file="${CURRENT_TMP_DIR}/sql_backup_${timestamp}.tar.gz"
  manifest_file="${CURRENT_TMP_DIR}/manifest_${timestamp}.txt"
  final_dir="${BACKUP_DIR}/liferay_backup_${timestamp}"
  bundle_archive_name=""
  sql_archive_name=""

  info "Bắt đầu tạo ${action_label} lúc ${started_at}"

  if [ "$STOP_SERVICE_DURING_BACKUP" = "true" ]; then
    stop_liferay
  fi

  if [ "$include_database" = "true" ]; then
    create_sql_archive "$sql_file" "$timestamp"
    sql_archive_name="$(basename "$sql_file")"
  else
    rm -f "$sql_file"
  fi

  if [ "$include_bundles" = "true" ]; then
    create_bundle_archive "$bundle_file"
    bundle_archive_name="$(basename "$bundle_file")"
  else
    rm -f "$bundle_file"
  fi

  if [ "$STOP_SERVICE_DURING_BACKUP" = "true" ]; then
    start_liferay
  fi

  completed_at="$(timestamp_now)"

  cat > "$manifest_file" <<EOF
created_at=${timestamp}
created_at_local=${started_at}
completed_at_local=${completed_at}
timezone=${TZ:-$(timestamp_timezone)}
hostname=$(hostname)
bundle_dir=${BUNDLE_DIR:-}
mysql_host=${MYSQL_HOST:-}
mysql_port=${MYSQL_PORT:-}
mysql_database=${MYSQL_DATABASE:-}
bundle_archive=${bundle_archive_name}
sql_archive=${sql_archive_name}
bundle_included=${include_bundles}
sql_included=${include_database}
EOF

  info "Đang hoàn tất backup folder: ${final_dir}"
  mv "$CURRENT_TMP_DIR" "$final_dir"
  CURRENT_TMP_DIR=""
  prune_old_backups

  info "Backup thành công: $final_dir"
}

create_backup() {
  create_backup_with_options "true" "true" "backup đầy đủ"
}

create_database_backup() {
  create_backup_with_options "true" "false" "backup database"
}

create_bundles_backup() {
  create_backup_with_options "false" "true" "backup bundles"
}

restore_sql_from_archive() {
  local sql_archive="$1"
  local tmp_sql_dir="$2"

  require_commands mysql gunzip
  require_config_vars MYSQL_HOST MYSQL_PORT MYSQL_DATABASE MYSQL_USER MYSQL_PASSWORD

  mkdir -p "$tmp_sql_dir"
  tar -xzf "$sql_archive" -C "$tmp_sql_dir"

  local sql_file sql_gz_file
  sql_file="$(find "$tmp_sql_dir" -type f -name "*.sql" | head -n 1 || true)"
  sql_gz_file="$(find "$tmp_sql_dir" -type f -name "*.sql.gz" | head -n 1 || true)"

  info "Đang drop và tạo lại database ${MYSQL_DATABASE} với charset utf8mb4..."
  mysql \
    --protocol=TCP \
    -h "$MYSQL_HOST" \
    -P "$MYSQL_PORT" \
    -u "$MYSQL_USER" \
    "-p${MYSQL_PASSWORD}" \
    -e "DROP DATABASE IF EXISTS \`${MYSQL_DATABASE}\`; CREATE DATABASE \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

  if [ -n "$sql_file" ]; then
    info "Đang restore SQL file: $sql_file"
    mysql \
      --protocol=TCP \
      -h "$MYSQL_HOST" \
      -P "$MYSQL_PORT" \
      -u "$MYSQL_USER" \
      "-p${MYSQL_PASSWORD}" \
      "$MYSQL_DATABASE" < "$sql_file"
    return 0
  fi

  if [ -n "$sql_gz_file" ]; then
    info "Đang restore SQL gzip file: $sql_gz_file"
    gunzip -c "$sql_gz_file" | mysql \
      --protocol=TCP \
      -h "$MYSQL_HOST" \
      -P "$MYSQL_PORT" \
      -u "$MYSQL_USER" \
      "-p${MYSQL_PASSWORD}" \
      "$MYSQL_DATABASE"
    return 0
  fi

  error_exit "Không tìm thấy file .sql hoặc .sql.gz trong SQL archive."
}

restore_backup() {
  local index="${1:-}"
  local should_restore_bundles="false"
  local should_restore_sql="false"

  if [ -z "$index" ]; then
    error_exit "Thiếu index backup cần restore. Ví dụ: $0 restore 0"
  fi

  require_config_vars BACKUP_DIR BUNDLE_DIR RESTORE_SQL_ENABLED
  require_commands tar find awk date df mktemp sort flock blade mv

  if [ "$RESTORE_SQL_ENABLED" = "true" ]; then
    require_commands mysql gunzip
  fi

  local backup_file
  if ! backup_file="$(get_backup_by_index "$index")"; then
    error_exit "Không tìm thấy backup với index: $index"
  fi

  RESTORE_STARTED_AT="$(timestamp_now)"
  RESTORE_BACKUP_NAME="$(basename "$backup_file")"

  info "Backup được chọn: $backup_file"

  if [ -t 0 ]; then
    read -r -p "Restore sẽ thay thế BUNDLE_DIR hiện tại. Tiếp tục? Gõ YES: " confirm
    if [ "$confirm" != "YES" ]; then
      warn "Đã huỷ restore."
      exit 0
    fi
  fi

  RESTORE_HISTORY_PENDING="true"
  RESTORE_MODE="detecting"

  local timestamp bundle_archive sql_archive
  timestamp="$(timestamp_compact)"
  CURRENT_TMP_DIR="$(mktemp -d "${BACKUP_DIR}/.tmp_liferay_restore_${timestamp}_XXXXXX")"

  if [ -d "$backup_file" ]; then
    bundle_archive="$(find "$backup_file" -maxdepth 1 -type f -name "bundles_backup_*.tar.gz" | head -n 1 || true)"
    sql_archive="$(find "$backup_file" -maxdepth 1 -type f -name "sql_backup_*.tar.gz" | head -n 1 || true)"
  else
    info "Đang giải nén backup tổng cũ..."
    tar -xzf "$backup_file" -C "$CURRENT_TMP_DIR"
    bundle_archive="$(find "$CURRENT_TMP_DIR" -maxdepth 1 -type f -name "bundles_backup_*.tar.gz" | head -n 1 || true)"
    sql_archive="$(find "$CURRENT_TMP_DIR" -maxdepth 1 -type f -name "sql_backup_*.tar.gz" | head -n 1 || true)"
  fi

  if [ -n "$bundle_archive" ] && [ -f "$bundle_archive" ]; then
    should_restore_bundles="true"
  fi

  if [ -n "$sql_archive" ] && [ -f "$sql_archive" ]; then
    should_restore_sql="true"
  fi

  if [ "$should_restore_bundles" != "true" ] && [ "$should_restore_sql" != "true" ]; then
    error_exit "Backup được chọn không chứa bundles hoặc database để restore."
  fi

  if [ "$should_restore_sql" = "true" ] && [ "$RESTORE_SQL_ENABLED" != "true" ]; then
    if [ "$should_restore_bundles" = "true" ]; then
      warn "Backup có database nhưng RESTORE_SQL_ENABLED=false, sẽ bỏ qua phần restore database."
      should_restore_sql="false"
    else
      error_exit "Backup chỉ có database nhưng RESTORE_SQL_ENABLED=false nên không thể restore."
    fi
  fi

  if [ "$should_restore_bundles" = "true" ] && [ "$should_restore_sql" = "true" ]; then
    RESTORE_MODE="bundles+database"
  elif [ "$should_restore_bundles" = "true" ]; then
    RESTORE_MODE="bundles"
  else
    RESTORE_MODE="database"
  fi

  stop_liferay

  if [ "$should_restore_bundles" = "true" ]; then
    ROLLBACK_DIR="${BUNDLE_DIR}.before_restore_${timestamp}"
    if [ -d "$BUNDLE_DIR" ]; then
      info "Đang đổi tên bundles hiện tại sang rollback: $ROLLBACK_DIR"
      mv "$BUNDLE_DIR" "$ROLLBACK_DIR"
    fi

    info "Đang restore bundles..."
    tar -xzf "$bundle_archive" -C "$(dirname "$BUNDLE_DIR")"
  else
    ROLLBACK_DIR=""
    warn "Backup này không có bundles, sẽ bỏ qua restore bundles."
  fi

  if [ "$should_restore_sql" = "true" ]; then
    info "Đang restore SQL..."
    restore_sql_from_archive "$sql_archive" "${CURRENT_TMP_DIR}/sql_extract"
  else
    warn "Backup này không có database, sẽ bỏ qua restore database."
  fi

  start_liferay
  RESTORE_FINISHED_AT="$(timestamp_now)"
  cleanup_tmp
  info "Restore hoàn tất."

  if [ -n "$ROLLBACK_DIR" ]; then
    warn "Rollback bundles cũ: $ROLLBACK_DIR"
  fi
}

delete_backup() {
  local index="${1:-}"

  if [ -z "$index" ]; then
    error_exit "Thiếu index backup cần xoá. Ví dụ: $0 delete 1"
  fi

  local backup_file
  if ! backup_file="$(get_backup_by_index "$index")"; then
    error_exit "Không tìm thấy backup với index: $index"
  fi

  info "Backup sẽ xoá: $backup_file"

  if [ -t 0 ]; then
    read -r -p "Gõ DELETE để xác nhận xoá: " confirm
    if [ "$confirm" != "DELETE" ]; then
      warn "Đã huỷ xoá."
      exit 0
    fi
  fi

  rm -rf "$backup_file"
  info "Đã xoá backup: $backup_file"
}

install_cron_job() {
  require_commands crontab grep mktemp

  local cron_cmd cron_line current_crontab tmp_file
  cron_cmd="TZ=${CRON_TIMEZONE} /bin/bash ${SCRIPT_DIR}/script.sh backup >> /dev/null 2>&1 ${CRON_MARKER}"
  cron_line="${CRON_SCHEDULE} ${cron_cmd}"
  current_crontab="$(crontab -l 2>/dev/null || true)"

  if printf '%s\n' "$current_crontab" | grep -Fqx "$cron_line"; then
    info "Cron backup đã tồn tại: $cron_line"
    return 0
  fi

  tmp_file="$(mktemp)"
  if [ -n "$current_crontab" ]; then
    while IFS= read -r line; do
      case "$line" in
        *"${CRON_MARKER}"*|*"${SCRIPT_DIR}/script.sh backup"*|*"script.sh backup"*)
          continue
          ;;
      esac

      printf '%s\n' "$line" >> "$tmp_file"
    done <<EOF
$current_crontab
EOF
  fi
  printf '%s\n' "$cron_line" >> "$tmp_file"

  crontab "$tmp_file"
  rm -f "$tmp_file"

  info "Đã thêm cron backup tự động."
  info "Cron hiện tại: $cron_line"
}

uninstall_cron_job() {
  require_commands crontab mktemp

  local current_crontab tmp_file found=0
  current_crontab="$(crontab -l 2>/dev/null || true)"

  if [ -z "$current_crontab" ]; then
    info "Chưa có cron nào được cấu hình."
    return 0
  fi

  tmp_file="$(mktemp)"

  while IFS= read -r line; do
    case "$line" in
      *"${CRON_MARKER}"*|*"${SCRIPT_DIR}/script.sh backup"*|*"script.sh backup"*)
        found=1
        continue
        ;;
    esac

    printf '%s\n' "$line" >> "$tmp_file"
  done <<EOF
$current_crontab
EOF

  if [ "$found" -eq 0 ]; then
    rm -f "$tmp_file"
    info "Không tìm thấy cron auto backup để gỡ."
    return 0
  fi

  crontab "$tmp_file"
  rm -f "$tmp_file"

  info "Đã tắt cron auto backup."
}

show_help() {
  cat <<EOF
Usage:
  $0 help
  $0 list
  $0 health
  $0 backup
  $0 backup-database
  $0 backup-bundles
  $0 status
  $0 status-server
  $0 restore <index>
  $0 delete <index>
  $0 cron-install

Ví dụ:
  $0 help
  $0 list
  $0 health
  $0 backup
  $0 backup-database
  $0 backup-bundles
  $0 status
  $0 status-server
  $0 restore 0
  $0 delete 2
  $0 cron-install
  $0 cron-uninstall

Mô tả:
  help            Xem danh sách lệnh đang có
  list            Liệt kê backup theo index, tên file, thời gian
  health          Kiểm tra dung lượng disk và kết nối MySQL
  backup          Tạo 1 thư mục backup chứa file .tar.gz của SQL và bundles
  backup-database Tạo backup chỉ chứa database, giữ nguyên cấu trúc thư mục backup
  backup-bundles  Tạo backup chỉ chứa bundles, giữ nguyên cấu trúc thư mục backup
  status          In trạng thái backup/restore, log mới nhất và trạng thái app
  status-server   Mở web status độc lập tại ${STATUS_HOST}:${STATUS_PORT}
  restore         Restore backup theo index, bắt buộc stop Tomcat bằng blade
  delete          Xoá backup theo index
  cron-install    Thêm cron chạy backup lúc 00:30 hằng ngày nếu chưa tồn tại
  cron-uninstall  Gỡ cron chạy auto backup hiện tại
EOF
}

main() {
  CURRENT_ACTION="${1:-help}"

  if [ "$CURRENT_ACTION" = "help" ]; then
    show_help
    return 0
  fi

  if [ "$CURRENT_ACTION" = "status" ]; then
    run_status_command
    return 0
  fi

  if [ "$CURRENT_ACTION" = "status-server" ]; then
    run_status_server
    return 0
  fi

  prepare_log_files
  setup_logging "$@"
  initialize_runtime

  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    error_exit "Đang có tiến trình backup/restore khác chạy. Lock file: $LOCK_FILE"
  fi

  case "$CURRENT_ACTION" in
    list)
      list_backups
      ;;
    health)
      run_health_check
      ;;
    backup)
      create_backup
      ;;
    backup-database)
      create_database_backup
      ;;
    backup-bundles)
      create_bundles_backup
      ;;
    restore)
      restore_backup "${2:-}"
      ;;
    delete)
      delete_backup "${2:-}"
      ;;
    cron-install)
      install_cron_job
      ;;
    cron-uninstall)
      uninstall_cron_job
      ;;
    *)
      show_help
      exit 1
      ;;
  esac
}

main "$@"
