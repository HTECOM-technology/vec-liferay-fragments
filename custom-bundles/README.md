# Custom bundles cho Liferay

Thư mục `custom-bundles` chứa mã nguồn các custom module và tài nguyên mở rộng cho Liferay. Các module Java được build thành JAR OSGi rồi deploy vào thư mục `osgi/modules` của Liferay.

## Cấu trúc chính

| Đường dẫn | Mục đích |
| --- | --- |
| `admin-ui/` | Module OSGi chính `vn.vec.custom.admin.ui`, chứa REST API, portlet, filter, listener, scheduler và giao diện quản trị. |
| `vec-expired-password-force-change/` | Module buộc người dùng xử lý mật khẩu hết hạn. |
| `comment-management/` | Module OSGi `comment.management`, portlet quản lý bình luận (Site Administration → Content). |
| `counter/` | Module OSGi `vn.vec.custom.counter`, 3 counter (lượt truy cập, người online, lượt đọc bài viết) kèm REST API không cần xác thực. |
| `frontend-ui/` | CSS và JavaScript custom cho giao diện frontend. |
| `workflow/` | Các định nghĩa workflow XML dùng trong Liferay. |
| `libs/` | Thư viện cục bộ phục vụ quá trình build. |
| `dist/` | JAR build ra từ Docker, được commit vào git. |
| `deploy-admin-ui.sh` | Script upload mã nguồn, build module trên server và deploy JAR. |

## Build bằng Docker (build local, không cần server)

Chạy từ thư mục gốc dự án. Không cần cài JDK, Gradle hay Liferay bundle trên máy:

```bash
bash build-custom-bundles.sh all      # build cả 4 module
bash build-custom-bundles.sh 3        # chỉ comment-management
bash build-custom-bundles.sh 1 3      # admin-ui + comment-management
bash build-custom-bundles.sh --clean all
```

Module: `1` = admin-ui, `2` = expired-password, `3` = comment-management, `4` = counter (đánh số giống `deploy-admin-ui.sh`).

JAR kết quả nằm ở `custom-bundles/dist/`. Copy thủ công vào `$LIFERAY_HOME/osgi/modules/` trên server, hoặc dùng `deploy-admin-ui.sh` để build+deploy trên server như trước.

Cách hoạt động:

- [`Dockerfile.custom-bundles`](../Dockerfile.custom-bundles) tạo image chỉ gồm JDK 17 (Liferay 7.4.3.132 yêu cầu `osgi.ee=JavaSE 17`) và Gradle 7.6.4.
- Container **không** set `LIFERAY_HOME`, nên các `build.gradle` tự đi nhánh fallback Maven `com.liferay.portal:release.portal.api:7.4.3.132`. Artifact này chứa đủ `portal-kernel`, `javax.portlet`, các app API (journal, message-boards, application-list…) và OSGi annotations, nên build được mà không cần bundle Liferay. Trên server có `LIFERAY_HOME` thì vẫn ưu tiên JAR thật như trước — hành vi build trên server không đổi.
- Logic build nằm trong [`build-custom-bundles.sh`](../build-custom-bundles.sh) (mount cùng repo), nên sửa script **không** cần rebuild image. Chỉ rebuild khi sửa Dockerfile: `bash build-custom-bundles.sh --rebuild-image all`.
- Cache Gradle nằm ở `.gradle-docker/` trong repo (gitignore) để lần build sau nhanh (~1-3 giây/module) và file sinh ra thuộc đúng user, không bị root-owned.
- Debug trong container: `bash build-custom-bundles.sh --shell`.

Lưu ý: **giữ Gradle 7.x**. Liferay Gradle plugin còn dùng API đã bị bỏ ở Gradle 8 (build sẽ báo "incompatible with Gradle 8.0").

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

# Build/deploy comment-management
bash custom-bundles/deploy-admin-ui.sh 3

# Build/deploy counter
bash custom-bundles/deploy-admin-ui.sh 4
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
- Tài liệu API của module counter nằm tại [`counter/README.md`](counter/README.md). Module này tự tạo bảng khi activate; schema tham chiếu ở `counter/sql/counter.sql`.
