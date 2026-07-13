# Custom bundles cho Liferay

Thư mục `custom-bundles` chứa mã nguồn các custom module và tài nguyên mở rộng cho Liferay. Các module Java được build thành JAR OSGi rồi deploy vào thư mục `osgi/modules` của Liferay.

## Cấu trúc chính

| Đường dẫn | Mục đích |
| --- | --- |
| `admin-ui/` | Module OSGi chính `vn.vec.custom.admin.ui`, chứa REST API, portlet, filter, listener, scheduler và giao diện quản trị. |
| `vec-expired-password-force-change/` | Module buộc người dùng xử lý mật khẩu hết hạn. |
| `frontend-ui/` | CSS và JavaScript custom cho giao diện frontend. |
| `workflow/` | Các định nghĩa workflow XML dùng trong Liferay. |
| `libs/` | Thư viện cục bộ phục vụ quá trình build. |
| `deploy-admin-ui.sh` | Script upload mã nguồn, build module trên server và deploy JAR. |

## Chuẩn bị cấu hình deploy

Tạo file cấu hình local từ file mẫu:

```bash
cp custom-bundles/.env.example custom-bundles/.env
```

Khai báo các giá trị sau trong `.env`:

```dotenv
SERVER_USER=...
SERVER_IP=...
SSH_KEY_PATH=...
```

Không commit `.env`, SSH key, mật khẩu hoặc token lên Git.

Máy local cần có `bash`, `rsync` và `ssh`. Server build cần có Blade CLI, Gradle wrapper hoặc Gradle, đồng thời phải có Liferay bundle tại `LIFERAY_HOME` (mặc định `/root/vec/bundles`).

## Build và deploy

Chạy từ thư mục gốc dự án:

```bash
# Build/deploy admin-ui
bash custom-bundles/deploy-admin-ui.sh 1

# Build/deploy module force change password
bash custom-bundles/deploy-admin-ui.sh 2
```

Luồng chạy từ local:

1. Đọc cấu hình kết nối trong `custom-bundles/.env`.
2. Dùng `rsync --delete` để đồng bộ `custom-bundles` lên `/root/vec/custom-bundles/` trên server.
3. Chạy script với chế độ `--server` để build module đã chọn.
4. Copy JAR trong `build/libs` vào `$LIFERAY_HOME/osgi/modules/`.
5. Copy file `.config` của module vào `$LIFERAY_HOME/osgi/configs/` nếu module có thư mục `osgi/configs`.

Có thể build trực tiếp khi đang ở server:

```bash
bash /root/vec/custom-bundles/deploy-admin-ui.sh --server 1
```

## Kiểm tra sau deploy

- Kiểm tra log Liferay để chắc chắn bundle đã được cập nhật và không có lỗi activate.
- Kiểm tra bundle có trạng thái `ACTIVE` trong Gogo Shell hoặc màn hình quản lý module.
- Nếu vừa thay đổi class/service OSGi nhưng portal vẫn dùng code cũ, kiểm tra đúng JAR trong `osgi/modules`, clean build và deploy lại.
- Với thay đổi SQL trong `admin-ui/sql/`, phải chạy migration phù hợp và kiểm tra model/repository tương ứng.

## Lưu ý

- `deploy-admin-ui.sh` dùng `rsync --delete`; không đặt file chỉ tồn tại trên server bên trong `/root/vec/custom-bundles/` nếu không muốn chúng bị xóa khi deploy.
- Các service wrapper, listener, filter và scheduler chạy trong luồng Liferay core/background. Cần xử lý null và lỗi theo hướng không làm hỏng thao tác chính của portal.
- Tài liệu chi tiết của module mật khẩu hết hạn nằm tại [`vec-expired-password-force-change/README.md`](vec-expired-password-force-change/README.md).
