# vec-expired-password-force-change

OSGi module cho Liferay CE 7.4 — bắt buộc user đổi mật khẩu ngay sau khi grace login thành công do mật khẩu hết hạn.

## Yêu cầu bắt buộc về Password Policy

| Cài đặt | Giá trị yêu cầu | Ghi chú |
|---------|-----------------|---------|
| Changeable | **ON** | User phải được phép tự đổi mật khẩu |
| Enable Expiration | **ON** | Mật khẩu mới có hạn sử dụng |
| Maximum Age | Tùy cấu hình (vd: 2 Weeks) | |
| **Grace Limit** | **>= 1** | **BẮT BUỘC** — xem lưu ý bên dưới |

### Lưu ý quan trọng: Grace Limit

- Nếu `Grace Limit = 0`: Liferay chặn login ngay khi mật khẩu hết hạn. Post-login hook của module này **không bao giờ** được gọi. Feature sẽ không hoạt động.
- Nếu `Grace Limit >= 1`: Liferay cho phép grace login (giảm grace count). Post-login hook chạy, detect expired, set session flag, filter redirect sang change password.
- **Khuyến nghị**: Đặt `Grace Limit = 1` — cho phép đúng một lần đăng nhập với mật khẩu hết hạn để user có thể đổi.

## Flow hoạt động

```
User nhập mật khẩu (đã hết hạn)
    └─> Liferay authenticate thành công (grace login, grace count giảm)
        └─> login.events.post → ForcePasswordChangePostLoginAction
            └─> Phát hiện expired → set session["VEC_FORCE_PASSWORD_CHANGE"] = true
                └─> Liferay redirect về trang chủ (hoặc referer)
                    └─> ForcePasswordChangeFilter intercept
                        └─> Kiểm tra session flag → redirect /c/portal/update_password
                            └─> User đổi mật khẩu thành công
                                └─> Liferay redirect về trang chủ
                                    └─> Filter re-check: password không còn expired
                                        └─> Clear session flag → cho qua
```

## Cài đặt và kích hoạt

### 1. Build

```bash
cd custom-bundles/vec-expired-password-force-change
gradle build
# JAR tạo ra tại: build/libs/vn.vec.custom.admin.password-1.0.0.jar
```

### 2. Deploy

Copy JAR vào `$LIFERAY_HOME/deploy/` hoặc `$LIFERAY_HOME/osgi/modules/`.

### 3. Kích hoạt qua OSGi Configuration

Module **mặc định disabled** để an toàn khi deploy. Kích hoạt bằng một trong hai cách:

**Cách A — Tạo file `.config`** (khuyến nghị cho môi trường server):

Tạo file: `$LIFERAY_HOME/osgi/configs/vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter.config`

```properties
enabled=B"true"
changePasswordURL="/c/portal/update_password"
includeOmniAdmin=B"false"
checkOnEveryRequest=B"true"
logDeniedNavigation=B"true"
excludedPathPatterns=["/c/portal/login","/c/portal/logout","/c/portal/update_password","/c/portal/update_password/*","*.css","*.js","*.map","*.png","*.jpg","*.jpeg","*.gif","*.svg","*.ico","*.woff","*.woff2","*.ttf","*.eot","*.otf"]
```

**Cách B — Qua Liferay System Settings**:

Control Panel → System → System Settings → tìm PID `vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter`.

*(Lưu ý: không có UI generated vì module dùng POJO config, không @Meta.OCD. Dùng file `.config` là cách đơn giản hơn.)*

## Tham số cấu hình

| Tham số | Mặc định | Mô tả |
|---------|----------|-------|
| `enabled` | `false` | Bật/tắt toàn bộ feature |
| `changePasswordURL` | `/c/portal/update_password` | URL trang đổi mật khẩu |
| `includeOmniAdmin` | `false` | Áp dụng flow cho omniadmin không. Mặc định **không** áp dụng — tránh khóa admin khỏi hệ thống |
| `checkOnEveryRequest` | `true` | Re-check password expiry mỗi request (bắt auto-login session với mật khẩu đã hết hạn sau khi login) |
| `logDeniedNavigation` | `true` | Log INFO khi chặn navigation |
| `excludedPathPatterns` | Xem mặc định | Các URL/pattern không bị filter. Luôn bao gồm `changePasswordURL` |

## Excluded URL mặc định

Ngoài danh sách `excludedPathPatterns`, filter **luôn tự động** loại trừ `changePasswordURL` (dù không có trong list) để tránh redirect loop.

Mặc định loại trừ:
- `/c/portal/login` — trang login
- `/c/portal/logout` — logout
- `/c/portal/update_password` và `/c/portal/update_password/*` — trang đổi mật khẩu
- Các extension tĩnh: `.css`, `.js`, `.map`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.ico`, `.woff`, `.woff2`, `.ttf`, `.eot`, `.otf`

## Test thủ công

### Chuẩn bị
1. Vào Password Policy: Control Panel → Security → Password Policy
2. Đặt Enable Expiration = ON, Maximum Age = 1 Minute (để test nhanh), Grace Limit = 1
3. Enable module bằng file `.config`

### Test case 1 — User bình thường (mật khẩu chưa hết hạn)
- Login bình thường → vào trang chủ → không bị redirect

### Test case 2 — User có mật khẩu hết hạn (Grace Limit = 1)
- Đợi 1 phút (theo Maximum Age test)
- Login → thành công (grace login)
- Ngay sau login → tự động redirect sang `/c/portal/update_password`
- Thử truy cập `/group/guest/home` → bị redirect về `/c/portal/update_password`
- Đổi mật khẩu thành công → redirect về trang chủ
- Thử lại các trang khác → không bị block nữa

### Test case 3 — Static resources
- Khi đang bị force change, mở DevTools
- Kiểm tra CSS/JS của trang đổi mật khẩu load bình thường (không bị redirect)

### Test case 4 — Feature disabled
- Đặt `enabled=B"false"` trong config → restart module
- Kể cả user có mật khẩu expired → vào được mọi trang bình thường

### Test case 5 — Omniadmin
- `includeOmniAdmin=B"false"` (default): omniadmin không bị chặn dù mật khẩu expired
- `includeOmniAdmin=B"true"`: omniadmin cũng bị force change

## Logging

Module ghi log ở các thời điểm sau:

| Level | Khi nào |
|-------|---------|
| `INFO` | Kích hoạt filter với config hiện tại |
| `INFO` | Post-login: phát hiện password expired, set session flag |
| `INFO` | Filter: chặn navigation, redirect về change password |
| `INFO` | Filter: phát hiện auto-login session với password expired |
| `WARN` | Grace Limit = 0 detected (configuration không đúng) |
| `ERROR` | Redirect safety limit exceeded (config sai changePasswordURL) |
| `ERROR` | Lỗi không xác định trong post-login hook |

Không có log nào chứa mật khẩu hoặc dữ liệu nhạy cảm.

## Hạn chế đã biết

1. **Custom change-password page**: VEC chưa có custom UI đổi mật khẩu. Module redirect về `/c/portal/update_password` (Liferay native). Nếu Liferay native page bị theme override hoặc không accessible, cần cấu hình `changePasswordURL` về URL thực tế.

2. **Auto-login (Remember Me)**: Nếu user dùng Remember Me và mật khẩu hết hạn sau khi tạo cookie, lần truy cập kế tiếp sẽ được `checkOnEveryRequest` phát hiện và redirect. Post-login hook không chạy trong trường hợp auto-login.

3. **Multi-company**: Filter kiểm tra password policy theo từng user (mỗi user có thể thuộc company khác nhau). Không cần cấu hình riêng per-company.

4. **API calls (AJAX)**: Các AJAX request từ trang đổi mật khẩu đến `/o/api/*` hoặc `/api/jsonws/*` sẽ bị filter redirect về HTML. Nếu trang đổi mật khẩu cần AJAX, thêm các pattern đó vào `excludedPathPatterns`.

## Cấu trúc module

```
vec-expired-password-force-change/
├── bnd.bnd
├── build.gradle
├── README.md
└── src/main/java/vn/vec/custom/admin/password/
    ├── configuration/
    │   └── ForcePasswordChangeConfiguration.java   # POJO config
    ├── filter/
    │   ├── ForcePasswordChangeFilter.java           # Servlet filter
    │   └── ForcePasswordChangeUrlMatcher.java       # URL matching
    ├── lifecycle/
    │   └── ForcePasswordChangePostLoginAction.java  # Post-login hook
    └── util/
        └── PasswordExpirationUtil.java              # Password expiry check
```

## OSGi Components

| Class | Service | Property |
|-------|---------|----------|
| `ForcePasswordChangePostLoginAction` | `LifecycleAction` | `key=login.events.post` |
| `ForcePasswordChangeFilter` | `Filter` | `url-pattern=/*`, after `VEC Admin Network Policy Filter` |

Cả hai component dùng cùng `configurationPid`:
`vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter`
