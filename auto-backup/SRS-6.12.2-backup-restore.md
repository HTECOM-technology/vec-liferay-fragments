# 6.12.2 Quy trình sao lưu – khôi phục

Quy trình sao lưu – khôi phục của hệ thống VEC Portal được triển khai bằng một bộ công cụ đặt tại thư mục `auto-backup`, gồm:

- `script.sh`: script chính (Bash) thực hiện kiểm tra hệ thống, sao lưu, khôi phục, xoá backup và quản lý lịch cron.
- `.env`: file cấu hình (đường dẫn, thông tin MySQL, SMTP, lịch cron, số bản giữ lại, cấu hình status server).
- `status_server.py`: web server độc lập để theo dõi trạng thái/log kể cả khi Liferay đang dừng.
- `liferay-restore-status.service`: systemd service cho status server.
- Module `vec-backup-admin` (Java/OSGi trong `custom-bundles/admin-ui`): cung cấp màn hình quản trị Backup & Restore trên giao diện Liferay và REST API để gọi các lệnh của `script.sh`.

Toàn bộ quy trình được thiết kế cho kiến trúc thực tế: **Liferay 7.4 (bundle Tomcat, khởi động/dừng bằng `blade server`) + MySQL/MariaDB + Elasticsearch nhúng (sidecar)** trên máy chủ Ubuntu.

---

## a) Cơ chế sao lưu (Backup Mechanism)

### a.1) Đối tượng sao lưu

Hệ thống sao lưu **hai đối tượng**, được đóng gói trong cùng một bản backup:

1. **Cơ sở dữ liệu MySQL** – toàn bộ database của Liferay (mặc định `vec_db`), lấy qua kết nối TCP tới `MYSQL_HOST:MYSQL_PORT`.
2. **Thư mục bundle Liferay** (`BUNDLE_DIR`, ví dụ `/home/vecadmin/vec/bundles`) – chứa toàn bộ ứng dụng: Tomcat, các Java module OSGi đã triển khai (`osgi/modules`), cấu hình OSGi (`osgi/configs`), `portal-ext.properties`, thư mục dữ liệu người dùng `data/document_library` (ảnh, tài liệu, video upload qua Liferay), Freemarker template, v.v.

> **Lưu ý về Elasticsearch:** Khi nén bundle, hệ thống **loại trừ** dữ liệu Elasticsearch (`data/elasticsearch7/*`). Index Elasticsearch được tái tạo bằng chức năng *Reindex* của Liferay từ dữ liệu MySQL sau khi khôi phục, giúp giảm dung lượng và thời gian sao lưu.

Ngoài ra, một số thư mục runtime không cần sao lưu cũng được loại trừ khỏi bundle để tối ưu dung lượng: `logs/*`, `temp/*`, `work/*`, `osgi/state/*`.

### a.2) Cách thức đóng gói và cấu trúc lưu trữ

Mỗi lần sao lưu tạo ra **một thư mục backup** trong `BACKUP_DIR` (mặc định `/backup/liferay`) theo định dạng:

```
/backup/liferay/liferay_backup_YYYYMMDD_HHMMSS/
├── sql_backup_YYYYMMDD_HHMMSS.tar.gz      # dump MySQL (chứa file <db>_<timestamp>.sql)
├── bundles_backup_YYYYMMDD_HHMMSS.tar.gz  # toàn bộ bundle Liferay (đã loại trừ như trên)
└── manifest_YYYYMMDD_HHMMSS.txt           # metadata bản backup
```

- **Sao lưu database:** dùng `mysqldump` với các tuỳ chọn `--single-transaction --quick --routines --events --triggers --no-tablespaces` (đảm bảo tính nhất quán ở mức snapshot InnoDB mà không khoá bảng, đồng thời sao lưu cả stored routine/trigger/event). File `.sql` sau đó được nén thành `.tar.gz`.
- **Sao lưu bundle:** dùng `tar -czf` nén toàn bộ `BUNDLE_DIR` với các mẫu loại trừ ở mục a.1.
- **File manifest** ghi lại: thời điểm tạo, hostname, `BUNDLE_DIR`, thông tin MySQL, tên các archive thành phần và thành phần nào được bao gồm (bundle/sql). Manifest được dùng để hiển thị thông tin bản backup trên giao diện quản trị.

Backup được ghi vào thư mục tạm (`.tmp_liferay_backup_*`) rồi mới `mv` sang tên chính thức khi hoàn tất, tránh để lại bản backup dở dang nếu tiến trình bị gián đoạn.

### a.3) Các chế độ sao lưu

| Lệnh | Nội dung |
| --- | --- |
| `backup` | Sao lưu **đầy đủ**: database + bundle. |
| `backup-database` | Chỉ sao lưu database (vẫn tạo thư mục backup theo cấu trúc chuẩn). |
| `backup-bundles` | Chỉ sao lưu bundle (vẫn tạo thư mục backup theo cấu trúc chuẩn). |

### a.4) Lịch sao lưu tự động (cron) và chính sách lưu trữ

- **Lịch chạy:** Lệnh `cron-install` cài đặt một cron job chạy `script.sh backup` (sao lưu đầy đủ). Mặc định `CRON_SCHEDULE="30 17 * * *"`; do máy chủ staging chạy theo giờ UTC nên thời điểm này tương ứng **00:30 giờ Việt Nam** hằng ngày. Múi giờ ghi log theo `CRON_TIMEZONE="Asia/Ho_Chi_Minh"`. Lịch có thể chỉnh qua `.env`. Cron job được đánh dấu bằng chú thích `# vec-liferay-auto-backup`; lệnh `cron-uninstall` sẽ gỡ bỏ.
- **Chính sách lưu trữ (retention):** Hệ thống chỉ giữ tối đa `BACKUP_RETENTION_COUNT` bản backup gần nhất (**mặc định 3 bản**). Sau khi tạo bản mới, các bản cũ vượt quá giới hạn sẽ **tự động bị xoá** (giữ theo thời gian sửa đổi mới nhất).

### a.5) Kiểm tra điều kiện trước khi sao lưu

Trước khi backup (và qua lệnh `health` để kiểm tra chủ động), hệ thống thực hiện:

- **Kiểm tra dung lượng đĩa:** yêu cầu còn tối thiểu `MIN_FREE_GB` GB trống tại `BACKUP_DIR` (mặc định 40 GB); nếu không đủ sẽ dừng và cảnh báo.
- **Kiểm tra kết nối MySQL:** thực hiện truy vấn `SELECT 1` để xác nhận kết nối tới database trước khi dump.

### a.6) Chế độ dừng dịch vụ khi sao lưu

Biến `STOP_SERVICE_DURING_BACKUP` quyết định cách backup:

- `false` (mặc định): **backup nóng**, không dừng Liferay – gần như không gián đoạn dịch vụ.
- `true`: dừng Liferay (`blade server stop`) trước khi dump SQL và nén bundle, sau đó khởi động lại (`blade server start`) – dữ liệu nhất quán hơn nhưng có downtime.

### a.7) Kiểm soát đồng thời, ghi log và cảnh báo

- **Khoá tiến trình:** dùng `flock` trên `/tmp/liferay-backup.lock` để đảm bảo **tại một thời điểm chỉ có một tiến trình backup/restore** chạy. Nếu đang có tiến trình khác, lệnh mới sẽ bị từ chối.
- **Ghi log theo ngày:** log được chia theo ngày trong `LOG_DIR` (mặc định `/var/log/liferay-backup`):
  - `YYYY-MM-DD/actions.log`: toàn bộ output thao tác, kèm mốc `started at`/`finished at (exit=...)`.
  - `YYYY-MM-DD/backup-history.log`: mỗi dòng một bản backup, gồm `started_at`, `finished_at`, `backup_name`, `backup_mode`, `status`, tên archive bundle/sql, tổng dung lượng, đường dẫn log.
  - `YYYY-MM-DD/restore-history.log`: lịch sử khôi phục (chi tiết ở phần b).
- **Cảnh báo qua email:** khi có lỗi (kiểm tra thất bại hoặc lệnh dừng bất thường), hệ thống gửi email cảnh báo qua SMTP (`MAIL_*`) tới đội vận hành, kèm hostname, thời gian, action, nội dung lỗi, đường dẫn log và trạng thái dịch vụ.

### a.8) Vận hành qua giao diện quản trị (Web Admin)

Module `vec-backup-admin` cung cấp màn hình **Backup & Restore** trên giao diện Liferay, **chỉ dành cho tài khoản admin**. Qua REST API (`/o/vec-backup-admin/...`), quản trị viên có thể:

- Xem tổng quan: cấu hình (`BACKUP_DIR`, `BUNDLE_DIR`), trạng thái auto backup (cron đang bật/tắt), cảnh báo retention, danh sách backup hiện có (dung lượng, thời gian tạo, có thành phần bundle/database hay không).
- Thực thi các lệnh: `health`, `backup`, `backup-database`, `backup-bundles`, `restore`, `delete`, `cron-install`, `cron-uninstall`. Mỗi lệnh chạy nền dưới dạng **job** (theo dõi trạng thái `queued/running/success/failed`, exit code, output trực tiếp). Hệ thống chỉ cho phép **một job hoạt động tại một thời điểm** (trả về lỗi 409 nếu đang có job chạy).
- Xem log thao tác, lịch sử backup và lịch sử restore theo ngày.
- **Tải bản backup** (bundle hoặc database) về máy để lưu trữ ngoài: tạo token tải một lần có thời hạn (5 phút) rồi tải qua đường dẫn được cấp. Đây là cơ chế để chủ động sao chép backup sang nơi lưu trữ khác (thủ công).

### a.9) Theo dõi trạng thái độc lập (Status Server)

`status_server.py` (chạy qua systemd service `liferay-restore-status`, mặc định cổng `18080`) là web độc lập với Liferay, dùng để theo dõi kể cả **khi Liferay đang dừng** (ví dụ trong lúc restore). Trang hiển thị: trạng thái khoá backup/restore (RUNNING/IDLE), tình trạng Liferay (`APP_HEALTH_URL`), action hiện tại, lần chạy gần nhất, kết quả backup/restore gần nhất và phần đuôi log; hỗ trợ endpoint `/status.json`, `/log.txt` và cơ chế token tuỳ chọn.

---

## b) Cơ chế khôi phục dữ liệu (Data Recovery)

Việc khôi phục được thực hiện bằng lệnh `restore <index>` (hoặc chọn theo tên backup trên giao diện quản trị). Danh sách backup được liệt kê qua lệnh `list`, sắp xếp mới nhất trước; `index = 0` là bản gần nhất.

### b.1) Nguyên tắc chung khi khôi phục

- **Luôn dừng Liferay trong suốt quá trình restore** (`blade server stop` → xử lý → `blade server start`). Vì vậy restore **có downtime**.
- **Tự động nhận diện thành phần** trong bản backup: có `bundles_backup_*.tar.gz` và/hoặc `sql_backup_*.tar.gz`. Chế độ restore sẽ là một trong: `bundles+database`, `bundles`, hoặc `database`.
- **Cổng chặn restore database:** biến `RESTORE_SQL_ENABLED` (mặc định `true`). Nếu đặt `false`, phần database sẽ bị bỏ qua (chỉ restore bundle); nếu bản backup chỉ có database mà `RESTORE_SQL_ENABLED=false` thì restore sẽ báo lỗi.
- **Xác nhận thủ công:** khi chạy trực tiếp trên terminal (TTY), script yêu cầu gõ `YES` để xác nhận thay thế `BUNDLE_DIR`. Khi chạy qua giao diện quản trị (không tương tác), bước này được bỏ qua.
- **Cơ chế rollback bundle:** trước khi giải nén bundle mới, thư mục bundle hiện tại được **đổi tên** thành `BUNDLE_DIR.before_restore_YYYYMMDD_HHMMSS` (không xoá), để có thể quay lại nếu cần.
- **Tự phục hồi khi lỗi:** nếu tiến trình thất bại trong lúc Liferay đang dừng, script sẽ **tự động thử khởi động lại** Liferay và gửi email cảnh báo kèm vị trí thư mục rollback.
- **Khoá đồng thời:** restore dùng chung khoá `flock` với backup nên không thể chạy song song với một tiến trình khác.

### b.2) Trình tự khôi phục database

Khi bản backup có phần SQL và `RESTORE_SQL_ENABLED=true`:

1. Giải nén `sql_backup_*.tar.gz` ra thư mục tạm.
2. `DROP DATABASE IF EXISTS` và `CREATE DATABASE` lại với `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`.
3. Import dữ liệu từ file `.sql` (hoặc `.sql.gz` qua `gunzip`) vào database.

### b.3) Trình tự khôi phục bundle

Khi bản backup có phần bundle:

1. Đổi tên `BUNDLE_DIR` hiện tại sang thư mục rollback `*.before_restore_*`.
2. Giải nén `bundles_backup_*.tar.gz` vào thư mục cha của `BUNDLE_DIR`, khôi phục lại toàn bộ ứng dụng, module OSGi, cấu hình và `data/document_library`.

### b.4) Khôi phục Elasticsearch (Reindex)

Do index Elasticsearch **không nằm trong backup**, sau khi restore và Liferay khởi động lại, cần thực hiện **Reindex** từ *Control Panel → Search* (Reindex all search indexes / Reindex Documents and Media) để tái tạo lại toàn bộ index tìm kiếm từ dữ liệu MySQL và Document Library vừa khôi phục. Đây là bước vận hành bắt buộc sau restore để chức năng tìm kiếm hoạt động đầy đủ.

### b.5) Các kịch bản khôi phục

Vì hệ thống sao lưu **full** theo lịch, **RPO = khoảng cách giữa hai lần backup** (mặc định tối đa ~24 giờ). **RTO** phụ thuộc dung lượng database và bundle; các con số dưới đây là ước lượng vận hành.

**Kịch bản 1 – Khôi phục toàn bộ (bundle + database) (RPO: ≤ chu kỳ backup, RTO ước tính: 1–4h tuỳ dung lượng)**
Áp dụng khi cần đưa hệ thống về đúng trạng thái tại thời điểm một bản backup đầy đủ.
(1) Chọn bản backup cần khôi phục (`list`/giao diện); (2) Chạy `restore <index>` – hệ thống tự dừng Liferay, tạo rollback bundle, giải nén bundle mới, drop/tạo lại database utf8mb4 và import SQL; (3) Khởi động lại Liferay; (4) Thực hiện Reindex Elasticsearch; (5) Kiểm tra dữ liệu và chức năng qua giao diện.

**Kịch bản 2 – Khôi phục chỉ database (RTO ước tính: 30ph–2h)**
Áp dụng khi dữ liệu/bundle hiện tại vẫn tốt nhưng cần đưa database về bản backup (hoặc khi chỉ có bản `backup-database`). Đặt `RESTORE_SQL_ENABLED=true`, chạy restore trên bản backup chứa SQL; hệ thống dừng Liferay, tái tạo database và import, khởi động lại, sau đó Reindex. Nếu bản backup có cả bundle nhưng chỉ muốn thay database, có thể dùng bản `backup-database` tương ứng.

**Kịch bản 3 – Khôi phục chỉ bundle/mã nguồn module (RTO ước tính: 15ph–1h)**
Áp dụng khi cần rollback mã nguồn/module/cấu hình mà giữ nguyên database (ví dụ deploy lỗi). Dùng bản `backup-bundles`, hoặc đặt `RESTORE_SQL_ENABLED=false` khi restore bản đầy đủ để bỏ qua database. Hệ thống dừng Liferay, tạo rollback, giải nén bundle, khởi động lại.

**Kịch bản 4 – Quay lui (rollback) khi restore gặp sự cố (RTO ước tính: 15–30ph)**
Nếu sau khi restore hệ thống không đạt yêu cầu, hoặc restore bị lỗi giữa chừng: (1) Dừng Liferay; (2) Xoá/di chuyển bundle vừa restore và đổi tên thư mục `*.before_restore_*` trở lại thành `BUNDLE_DIR`; (3) (Nếu đã restore database) import lại database từ bản backup phù hợp; (4) Khởi động lại Liferay và Reindex. Thư mục rollback được giữ lại tự động nên luôn có đường lui.

**Kịch bản 5 – Khôi phục thảm hoạ trên máy chủ mới (Disaster Recovery) (RTO ước tính: 4–8h)**
Khi mất toàn bộ máy chủ: (1) Chuẩn bị máy chủ mới cài Ubuntu và các thành phần cùng phiên bản (Java JDK, MySQL/MariaDB, `blade`, các công cụ `mysqldump/mysql/tar/gzip/flock`); (2) Copy bản backup gần nhất (đã tải/lưu trữ ngoài qua giao diện quản trị) vào `BACKUP_DIR` trên máy mới; (3) Cấu hình `.env` (`BUNDLE_DIR`, thông tin MySQL, SMTP…); (4) Chạy `health` rồi `restore <index>` để phục hồi bundle + database; (5) Khởi động Liferay, thực hiện Full Reindex Elasticsearch; (6) Kiểm tra toàn diện chức năng và các tích hợp hệ thống ngoài trước khi thông báo hệ thống hoạt động trở lại.

### b.6) Khuyến nghị an toàn khi khôi phục

- Luôn kiểm tra đúng backup (index/tên) trước khi xác nhận; restore sẽ **thay thế** `BUNDLE_DIR` và có thể **drop/tạo lại** database.
- Nên chạy `health` và tạo một bản backup mới **trước khi** restore.
- Sau khi restore ổn định, dọn dẹp thư mục rollback `*.before_restore_*` để giải phóng dung lượng.
- Định kỳ thực hiện restore thử trên môi trường staging; một bản backup **chưa từng được restore thử** thì chưa thể coi là đã được kiểm chứng.
