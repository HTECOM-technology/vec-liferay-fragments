# vec-liferay-fragments

Repository chứa mã nguồn React dùng để build fragment intranet của VEC trên Liferay, các custom module OSGi và nhóm công cụ vận hành liên quan như backup, LDAP sync, fragment Internet và kiểm thử tải.

## Thành phần chính

| Đường dẫn | Mục đích | Tài liệu |
| --- | --- | --- |
| `src/` | Mã nguồn React của intranet. | Xem phần build bên dưới. |
| `liferay-build/` | Project Liferay Fragments dùng để đóng gói file import. | Được điều khiển bởi `build.sh`. |
| `custom-bundles/` | Custom module OSGi, REST API, portlet, filter, listener và scheduler cho Liferay. | [`custom-bundles/README.md`](custom-bundles/README.md) |
| `auto-backup/` | Script backup, restore và status server. | [`auto-backup/README.md`](auto-backup/README.md) |
| `internet-fragment/` | Bản backup HTML, CSS và JavaScript của các fragment Internet chỉnh sửa thủ công. | [`internet-fragment/README.md`](internet-fragment/README.md) |
| `sync-ldap/` | Script Groovy chẩn đoán và đồng bộ LDAP thủ công. | [`sync-ldap/README.md`](sync-ldap/README.md) |
| `test-performance/` | Kịch bản kiểm thử tải bằng k6. | [`test-performance/README.md`](test-performance/README.md) |

## Tech stack chính

- React 19, React Router 7, Ant Design 6 và styled-components 6.
- Craco/React Scripts cho frontend build.
- Java, Gradle, Liferay API và OSGi Declarative Services cho custom bundle.
- Groovy cho script chạy trong Server Administration của Liferay.
- Bash/Python cho công cụ backup và k6 cho kiểm thử tải.

## Build React fragment intranet

Luồng build đầy đủ:

```bash
./build.sh
```

Script thực hiện:

1. Chạy production build React.
2. Đồng bộ output từ `build/` sang project trong `liferay-build/`.
3. Nén Liferay fragment package.
4. Copy file kết quả `liferay-fragments.zip` ra thư mục gốc.

Có thể chạy từng bước khi cần chẩn đoán:

```bash
yarn build
node sync-to-liferay.js
cd liferay-build
npm run compress
```

Không thay đổi production public path `/o/liferay-react-fragment/` nếu chưa kiểm tra lại cách Liferay phục vụ static resource.

## Build custom module Liferay

Ví dụ build/deploy module `admin-ui` từ máy local:

```bash
cp custom-bundles/.env.example custom-bundles/.env
# Cập nhật thông tin SSH trong custom-bundles/.env
bash custom-bundles/deploy-admin-ui.sh 1
```

Chi tiết module, yêu cầu server và các lựa chọn deploy xem tại [`custom-bundles/README.md`](custom-bundles/README.md).

## Công cụ vận hành

- Backup/restore: xem [`auto-backup/README.md`](auto-backup/README.md).
- Đồng bộ LDAP thủ công: xem [`sync-ldap/README.md`](sync-ldap/README.md).
- Kiểm thử tải: xem [`test-performance/README.md`](test-performance/README.md).
- Fragment Internet chỉnh sửa thủ công: xem [`internet-fragment/README.md`](internet-fragment/README.md).

## Quy ước an toàn

- Không commit `.env`, mật khẩu, SSH key, LDAP bind credential, cookie hoặc token.
- Thử thay đổi dữ liệu, restore và load test trên staging trước khi áp dụng production.
- Sau khi deploy OSGi JAR, kiểm tra bundle `ACTIVE` và log Liferay.
- Với frontend, ưu tiên chạy build trước khi bàn giao.
- Với tài liệu/script đã chỉnh sửa, chạy `git diff --check` để phát hiện lỗi whitespace.
