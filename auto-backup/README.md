# Auto backup Liferay

Thư mục `auto-backup` chứa các script backup, restore và theo dõi trạng thái backup cho server Liferay. Script hỗ trợ backup database MySQL/MariaDB, thư mục Liferay bundles hoặc cả hai.

## Thành phần

| File | Mục đích |
| --- | --- |
| `script.sh` | Script chính để kiểm tra hệ thống, backup, restore, xóa backup và quản lý cron. |
| `.env.example` | Mẫu cấu hình đường dẫn, database, SMTP, lịch cron và status server. |
| `status_server.py` | Web server độc lập để xem trạng thái/log khi Liferay đang dừng. |
| `liferay-restore-status.service` | Mẫu systemd service cho status server. |

## Cài đặt

```bash
cd auto-backup
cp .env.example .env
```

Cập nhật tối thiểu các nhóm cấu hình trong `.env`:

- `BACKUP_DIR`, `BUNDLE_DIR`, dung lượng trống tối thiểu và số bản giữ lại.
- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`.
- SMTP và email nhận cảnh báo nếu sử dụng gửi mail.
- `LOG_DIR`, lịch cron và cấu hình status server.

Giới hạn quyền đọc file chứa mật khẩu:

```bash
chmod 600 .env
```

Server cần có các công cụ tương ứng với tác vụ sử dụng, ví dụ: `bash`, `blade`, `mysqldump`, `mysql`, `tar`, `gzip`, `flock`, `python3` và `crontab`.

## Các lệnh chính

Chạy trong thư mục `auto-backup`:

```bash
bash script.sh help
bash script.sh health
bash script.sh list
bash script.sh backup
bash script.sh backup-database
bash script.sh backup-bundles
bash script.sh status
bash script.sh status-server
bash script.sh restore 0
bash script.sh delete 2
bash script.sh cron-install
bash script.sh cron-uninstall
```

| Lệnh | Chức năng |
| --- | --- |
| `health` | Kiểm tra dung lượng ổ đĩa và kết nối database. |
| `backup` | Tạo backup gồm database và Liferay bundles. |
| `backup-database` | Chỉ backup database. |
| `backup-bundles` | Chỉ backup thư mục bundles. |
| `list` | Liệt kê các bản backup theo index. |
| `restore <index>` | Restore bản backup theo index. |
| `delete <index>` | Xóa bản backup theo index. |
| `status` | Hiển thị trạng thái backup/restore và log gần nhất. |
| `status-server` | Chạy web status độc lập. |
| `cron-install` / `cron-uninstall` | Cài đặt hoặc gỡ cron backup tự động. |

## Cron và log

Lịch chạy được cấu hình bằng `CRON_SCHEDULE` và `CRON_TIMEZONE`. Sau khi chạy `cron-install`, kiểm tra lại bằng:

```bash
crontab -l
```

Log được chia theo ngày trong `LOG_DIR`, gồm log thao tác chung, lịch sử backup và lịch sử restore.

## Cảnh báo an toàn

- `restore` có thể thay thế toàn bộ `BUNDLE_DIR` và có thể drop/tạo lại database nếu `RESTORE_SQL_ENABLED=true`. Luôn kiểm tra đúng backup index trước khi xác nhận.
- Nên chạy `health` và tạo một bản backup mới trước khi restore.
- `STOP_SERVICE_DURING_BACKUP=true` cho dữ liệu nhất quán hơn nhưng gây downtime.
- Không commit `.env`, mật khẩu database, SMTP token hoặc file backup lên Git.
- Nên thử quy trình restore trên staging định kỳ; backup chưa từng restore thử chưa thể coi là đã được kiểm chứng.
