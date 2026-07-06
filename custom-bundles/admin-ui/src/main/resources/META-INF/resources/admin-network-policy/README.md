# VEC Admin Network Policy

Module này bổ sung cơ chế quản lý và thực thi whitelist IPv4/IP CIDR cho khu vực quản trị Liferay 7.4 CE GA132.

## Thành phần

- Control Panel portlet: `Admin Network Policy`.
- Static UI: `/o/vec-custom-admin-ui/admin-network-policy/index.html`.
- REST API: `/o/vec-admin/admin-network-policies`.
- Servlet filter: `VEC Admin Network Policy Filter`.
- Bảng dữ liệu: `VEC_AdminNetworkPolicy`.

## Build và deploy

Build bundle theo convention hiện tại:

```bash
cd custom-bundles/admin-ui
gradle build
```

Trước khi bật filter, chạy SQL:

```sql
custom-bundles/admin-ui/sql/admin-network-policy.sql
```

Deploy file JAR của `admin-ui` vào Liferay OSGi modules như các custom bundle hiện có.

## Cấu hình filter

PID OSGi:

```text
vn.vec.custom.admin.networkpolicy.filter.AdminNetworkPolicyFilter
```

Ví dụ file cấu hình:

```properties
enabled=true
failClosed=false
allowWhenNoPolicy=true
trustedProxyCidrs=127.0.0.1/32,10.0.0.0/8,192.168.0.0/16
```

Các giá trị mặc định:

- `enabled=false`: deploy xong không tự khóa admin.
- `failClosed=false`: nếu DB/config lỗi thì cho qua và ghi WARN log.
- `allowWhenNoPolicy=true`: tránh khóa ngoài khi chưa tạo whitelist.
- `trustedProxyCidrs` rỗng: không tin `X-Forwarded-For`/`X-Real-IP`.

Sau khi đã tạo whitelist đúng, có thể cân nhắc đặt:

```properties
enabled=true
allowWhenNoPolicy=false
failClosed=true
```

## Trusted proxy

Filter chỉ đọc header theo thứ tự `X-Forwarded-For`, `X-Real-IP`, `remoteAddr` khi `request.getRemoteAddr()` thuộc `trustedProxyCidrs`.

Ví dụ sau Nginx/LB nội bộ:

```properties
trustedProxyCidrs=10.10.0.0/16,172.16.20.10/32
```

Nếu request đến trực tiếp từ IP không thuộc trusted proxy, mọi header IP bị bỏ qua để tránh spoof.

## URL mặc định được bảo vệ

- `/group/*/~/control_panel/*`
- `/group/control_panel/*`
- `/c/portal/layout`
- `/api/jsonws/*`
- `/api/json/*`
- `/c/portal/json_service/*`
- `/api/liferay/do`
- `/o/vec-admin/*`
- `/o/vec-custom-admin-ui/admin-network-policy/*`

Static resource như `.css`, `.js`, ảnh, font được exclude mặc định.

## Whitelist

Hỗ trợ:

- IPv4 single IP: `203.113.10.20`
- IPv4 CIDR: `10.0.0.0/8`, `192.168.1.0/24`

Hiện tại chưa hỗ trợ IPv6. Không được lưu policy rỗng, IP/CIDR sai định dạng, hoặc duplicate cùng `companyId + networkAddress + enabled`.

## Log deny

Khi deny, filter ghi WARN gồm `companyId`, `userId`, `clientIp`, `remoteAddr`, `requestURI`, `queryString`, HTTP method, user-agent và reason.

## Test thủ công

1. Chạy SQL tạo bảng.
2. Deploy bundle.
3. Vào Control Panel -> Configuration -> Admin Network Policy.
4. Tạo policy disabled trước, ví dụ `203.113.10.20`.
5. Bật policy.
6. Cấu hình OSGi `enabled=true`.
7. Từ IP hợp lệ truy cập `/group/guest/~/control_panel/manage`.
8. Từ IP không hợp lệ truy cập cùng URL và kiểm tra HTTP 403 + WARN log.
9. Kiểm tra public site, CSS/JS và ảnh vẫn tải bình thường.
10. Khi chạy sau proxy, cấu hình `trustedProxyCidrs`, gửi `X-Forwarded-For` từ proxy tin cậy và xác nhận IP được parse đúng.

Repo hiện chưa có test setup JUnit. Có self-test không phụ thuộc JUnit cho validator/matcher tại:

```text
src/test/java/vn/vec/custom/admin/networkpolicy/AdminNetworkPolicyUtilitySelfTest.java
```

Có thể chạy sau khi compile classpath main/test tương ứng để kiểm tra nhanh utility.
