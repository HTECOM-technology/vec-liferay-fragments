# vec-expired-password-force-change

OSGi module cho Liferay CE 7.4 — bắt buộc user đi vào flow đổi/quên mật khẩu khi mật khẩu đã hết hạn.

Đã đối chiếu với source Liferay Community Edition Portal `7.4.3.132 CE GA132`:
- URL redirect hiện dùng trang `forgot_password` của LoginPortlet
- Với `graceLimit = 0`, module chặn ngay tại action login khi Liferay ném `PasswordExpiredException`
- Với `graceLimit >= 1`, module tiếp tục dùng post-login hook + filter để khóa điều hướng sau grace login cuối

## Yêu cầu bắt buộc về Password Policy

| Cài đặt | Giá trị yêu cầu | Ghi chú |
|---------|-----------------|---------|
| Changeable | **ON** | User phải được phép tự đổi mật khẩu |
| Enable Expiration | **ON** | Mật khẩu mới có hạn sử dụng |
| Maximum Age | Tùy cấu hình (vd: 2 Weeks) | |
| **Grace Limit** | `0` hoặc `>= 1` | Xem chi tiết flow bên dưới |

### Lưu ý quan trọng: Grace Limit

- Nếu `Grace Limit = 0`: Liferay chặn login ngay khi mật khẩu hết hạn. `login.events.post` không chạy, nên module dùng custom `MVCActionCommand` để bắt `PasswordExpiredException` và redirect thẳng sang trang `forgot_password`.
- Nếu `Grace Limit >= 1`: Liferay cho phép grace login, tăng `graceLoginCount`. Post-login hook chạy, detect khi `remainingGraceLogins <= 0`, set session flag, filter redirect sang trang `forgot_password`.
- Nếu muốn đổi ngay sau lần đăng nhập grace cuối, `Grace Limit = 1` vẫn là cấu hình dễ kiểm soát nhất.

## Flow hoạt động

```
Case A — Grace Limit = 0
User nhập mật khẩu đã hết hạn
    └─> Liferay ném PasswordExpiredException trong action /login/login
        └─> ForcePasswordChangeLoginMVCActionCommand bắt exception này
            └─> Ghi log INFO vào catalina.out
                └─> set sẵn login vào PortletSession của forgot password
                    └─> redirect sang trang forgot password

Case B — Grace Limit >= 1
User nhập mật khẩu đã hết hạn
    └─> Liferay authenticate thành công (grace login, graceLoginCount tăng)
        └─> login.events.post → ForcePasswordChangePostLoginAction
            └─> Phát hiện remainingGraceLogins <= 0 → set session["VEC_FORCE_PASSWORD_CHANGE"] = true
                └─> Liferay redirect về trang chủ (hoặc referer)
                    └─> ForcePasswordChangeFilter intercept
                        └─> Kiểm tra session flag → redirect sang trang forgot password
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

Trong repo đã có sẵn file mẫu để copy:
`custom-bundles/vec-expired-password-force-change/osgi/configs/vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter.config`

Lưu ý: file trong repo chỉ là **mẫu cấu hình**. Liferay chỉ đọc file khi nó nằm ở thư mục thực tế trên server:
`$LIFERAY_HOME/osgi/configs/vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter.config`

```properties
enabled=B"true"
changePasswordURL="/trangchu?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=0&p_p_state=maximized&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=%2Flogin%2Fforgot_password"
includeOmniAdmin=B"false"
checkOnEveryRequest=B"true"
logDeniedNavigation=B"true"
excludedPathPatterns=["/combo","/c/portal/extend_session","/c/portal/extend_session_confirm","/c/portal/login","/c/portal/logout","/documents/*","/image/*","*.css","*.js","*.map","*.png","*.jpg","*.jpeg","*.gif","*.svg","*.ico","*.woff","*.woff2","*.ttf","*.eot","*.otf"]
```

**Cách B — Qua Liferay System Settings**:

Control Panel → System → System Settings → tìm PID `vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter`.

*(Lưu ý: không có UI generated vì module dùng POJO config, không @Meta.OCD. Dùng file `.config` là cách đơn giản hơn.)*

## Tham số cấu hình

| Tham số | Mặc định | Mô tả |
|---------|----------|-------|
| `enabled` | `false` | Bật/tắt toàn bộ feature |
| `changePasswordURL` | URL `forgot_password` của LoginPortlet | URL redirect khi đã dùng hết grace login |
| `includeOmniAdmin` | `false` | Áp dụng flow cho omniadmin không. Mặc định **không** áp dụng — tránh khóa admin khỏi hệ thống |
| `checkOnEveryRequest` | `true` | Re-check `graceLoginCount` mỗi request khi cần, để bắt auto-login session hoặc clear cờ sau khi user đổi mật khẩu |
| `logDeniedNavigation` | `true` | Log INFO khi chặn navigation |
| `excludedPathPatterns` | Xem mặc định | Các URL/pattern không bị filter. Luôn bao gồm `changePasswordURL` |

## Excluded URL mặc định

Ngoài danh sách `excludedPathPatterns`, filter **luôn tự động** loại trừ `changePasswordURL` (dù không có trong list) để tránh redirect loop.

Mặc định loại trừ:
- `/combo` — combo servlet của Liferay cho CSS/JS gộp
- `/c/portal/extend_session` và `/c/portal/extend_session_confirm` — request native để giữ/confirm session của portal
- `/c/portal/login` — trang login
- `/c/portal/logout` — logout
- `/documents/*` — document/media/asset được portal hoặc theme gọi khi render trang
- `/image/*` — ảnh portal như logo, avatar, image servlet
- Các extension tĩnh: `.css`, `.js`, `.map`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.ico`, `.woff`, `.woff2`, `.ttf`, `.eot`, `.otf`

## Test thủ công

### Chuẩn bị
1. Vào Password Policy: Control Panel → Security → Password Policy
2. Đặt Enable Expiration = ON, Maximum Age = 1 Minute (để test nhanh), Grace Limit = `0` hoặc `1`
3. Enable module bằng file `.config`
4. Vì anh đã tắt SPA của Liferay, mỗi lần điều hướng sẽ là full page request; filter sẽ bắt request ổn định và log redirect sẽ xuất hiện rõ trong `catalina.out`

### Test case 1 — User bình thường (mật khẩu chưa hết hạn)
- Login bình thường → vào trang chủ → không bị redirect

### Test case 2 — User có mật khẩu hết hạn (Grace Limit = 0)
- Đợi 1 phút (theo Maximum Age test)
- Login → không vào được session, nhưng module sẽ bắt `PasswordExpiredException`
- Bị redirect ngay sang trang forgot password
- Trong `catalina.out` phải có log `VEC Force Password Change intercepted PasswordExpiredException`

### Test case 3 — User có mật khẩu hết hạn (Grace Limit = 1)
- Đợi 1 phút (theo Maximum Age test)
- Login → thành công (grace login)
- Ngay sau login ở lần grace cuối → tự động redirect sang trang forgot password
- URL redirect sẽ mang theo `login=<tai-khoan>` để form forgot password có thể tự điền

### Test case 4 — Static resources
- Khi đang bị force change, mở DevTools
- Kiểm tra CSS/JS của trang đổi mật khẩu load bình thường (không bị redirect)

### Test case 5 — Feature disabled
- Đặt `enabled=B"false"` trong config → restart module
- Kể cả user có mật khẩu expired → vào được mọi trang bình thường

### Test case 6 — Omniadmin
- `includeOmniAdmin=B"false"` (default): omniadmin không bị chặn dù mật khẩu expired
- `includeOmniAdmin=B"true"`: omniadmin cũng bị force change

## Logging

Module ghi log ở các thời điểm sau:

| Level | Khi nào |
|-------|---------|
| `INFO` | Login action: bắt được `PasswordExpiredException` và redirect sang trang forgot password |
| `INFO` | Forgot password render: chuẩn bị sẵn giá trị `login` để form native của Liferay tự điền |
| `INFO` | Post-login: phát hiện đã dùng hết grace login còn lại, set session flag |
| `INFO` | Filter: chặn navigation, redirect về change password |
| `INFO` | Filter: log rõ user nào đang bị redirect sang trang forgot password để theo dõi trong `catalina.out` |
| `INFO` | Filter: phát hiện auto-login session đã dùng hết grace login còn lại |
| `WARN` | Grace Limit = 0 xuất hiện trong post-login hook (trạng thái bất thường, dùng để chẩn đoán) |
| `ERROR` | Redirect safety limit exceeded (config sai changePasswordURL) |
| `ERROR` | Lỗi không xác định trong post-login hook |

Không có log nào chứa mật khẩu hoặc dữ liệu nhạy cảm.

Ví dụ log anh có thể grep trong `catalina.out`:

```text
VEC Force Password Change intercepted PasswordExpiredException: login=btv, targetURL=/trangchu?...forgot_password..., remoteAddr=10.130.1.20, userId=..., screenName=btv, companyId=..., graceLoginCount=0
VEC Force Password Change prepared forgot-password form: login=btv
VEC Force Password Change redirecting user to change password: userId=..., screenName=..., companyId=..., requestURI=..., targetURI=/trangchu?...forgot_password..., remoteAddr=..., sessionId=..., graceLoginCount=1, remainingGraceLogins=0
```

## Vì sao bản cũ có thể chưa đạt

1. Với `graceLimit = 0`, Liferay throw `PasswordExpiredException` ngay trong login action nên `login.events.post` hoàn toàn không được gọi.
2. Filter cũ chưa whitelist các đường native như `/combo` và `/image/*`, nên trang đích có thể tải thiếu CSS/JS/ảnh hoặc nhìn như bị redirect sai.
3. Module mặc định `enabled=false`, nên nếu chỉ deploy JAR mà chưa có file `.config` thì hành vi sẽ giống như chưa bật feature.

## Hạn chế đã biết

1. **Custom change-password page**: hiện tại module redirect về trang `forgot_password` mà anh đã chỉ định. Đây là flow lấy lại/đặt lại mật khẩu của LoginPortlet, không phải màn native `/c/portal/update_password`.

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
    ├── portlet/action/
    │   ├── ForcePasswordChangeLoginMVCActionCommand.java
    │   │                                         # Bắt PasswordExpiredException tại action /login/login
    │   └── ForcePasswordChangeForgotPasswordMVCRenderCommand.java
    │                                             # Prefill form forgot password
    └── util/
        └── PasswordExpirationUtil.java              # Grace login / policy helper
```

## OSGi Components

| Class | Service | Property |
|-------|---------|----------|
| `ForcePasswordChangeLoginMVCActionCommand` | `MVCActionCommand` | `javax.portlet.name=com_liferay_login_web_portlet_LoginPortlet`, `mvc.command.name=/login/login` |
| `ForcePasswordChangeForgotPasswordMVCRenderCommand` | `MVCRenderCommand` | `javax.portlet.name=com_liferay_login_web_portlet_LoginPortlet`, `mvc.command.name=/login/forgot_password` |
| `ForcePasswordChangePostLoginAction` | `LifecycleAction` | `key=login.events.post` |
| `ForcePasswordChangeFilter` | `Filter` | `url-pattern=/*`, after `Auto Login Filter` |

Các component dùng cùng `configurationPid`:
`vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter`
