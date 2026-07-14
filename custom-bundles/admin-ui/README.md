# admin-ui — Module OSGi `vn.vec.custom.admin.ui`

Module OSGi chính của dự án VEC, chứa toàn bộ phần mở rộng quản trị cho Liferay CE 7.4: REST API, portlet trong Control Panel, servlet filter, model listener, service wrapper, scheduler và các giao diện quản trị dạng mini-SPA. Module được build thành một file JAR duy nhất rồi deploy vào `$LIFERAY_HOME/osgi/modules/`.

Thông tin bundle (khai báo trong [bnd.bnd](bnd.bnd)):

| Thuộc tính | Giá trị |
| --- | --- |
| Bundle-Name | VEC Custom Admin UI |
| Bundle-SymbolicName | `vn.vec.custom.admin.ui` |
| Web-ContextPath | `/vec-custom-admin-ui` — mọi tài nguyên tĩnh trong `src/main/resources/META-INF/resources/` được phục vụ tại `/o/vec-custom-admin-ui/...` |
| Vendor | Vietnam Expressway Corporation (VEC) |

## Cấu trúc thư mục

```
admin-ui/
├── bnd.bnd                 # Metadata OSGi: tên bundle, Web-ContextPath, Import-Package
├── build.gradle            # Build bằng Liferay Gradle plugin; dependency lấy từ jar có sẵn trong LIFERAY_HOME
├── settings.gradle         # rootProject.name = "vn.vec.custom.admin.ui"
├── db_structure.sql        # Dump cấu trúc toàn bộ database MySQL (tham khảo, không phải migration)
├── nginx.conf              # Cấu hình nginx tham khảo: load balancing 2 node Liferay (ip_hash sticky session)
├── docs/
│   └── prompt-workflow-tasks.md   # Ghi chú bối cảnh/yêu cầu của tính năng workflow-review
├── sql/                    # Các file SQL migration cho từng tính năng (chạy thủ công khi deploy)
└── src/
    ├── main/
    │   ├── java/vn/vec/custom/admin/   # Mã nguồn Java, chia theo tính năng (xem bảng bên dưới)
    │   └── resources/
    │       ├── content/Language.properties          # Chuỗi ngôn ngữ
    │       └── META-INF/resources/                  # Tài nguyên tĩnh, phục vụ tại /o/vec-custom-admin-ui/
    └── test/java/          # Self-test cho ADDistinguishedNameUtil và IPv4NetworkUtil
```

## Build và deploy

- Build bằng Liferay Gradle plugin (`com.liferay.plugin`). Hầu hết dependency ở dạng `compileOnly`, được resolve trực tiếp từ các JAR trong Liferay bundle tại `LIFERAY_HOME` (mặc định `/root/vec/bundles`) — vì vậy **build phải chạy trên server có Liferay bundle**, không build ở máy local.
- Deploy bằng script [../deploy-admin-ui.sh](../deploy-admin-ui.sh) (xem chi tiết ở [README của custom-bundles](../README.md)): rsync mã nguồn lên server, build, copy JAR vào `$LIFERAY_HOME/osgi/modules/`.
- Task `buildCSS`/`copyCSS` bị tắt — CSS được viết tay, không qua SASS.

## Các nhóm chức năng Java (`src/main/java/vn/vec/custom/admin/`)

### Bảng tra cứu nhanh: REST API và bảng dữ liệu

Nhiều package không tự định nghĩa JAX-RS Application riêng mà đăng ký resource vào app dùng chung `VecAuditLog` (base `/o/vec-admin`).

| Package | JAX-RS app | Base URL | `@Path` chính | Bảng custom |
| --- | --- | --- | --- | --- |
| `audit` | VecAuditLog (chủ app) | `/o/vec-admin` | `/audit-logs` | `VEC_AUDIT_LOG` |
| `modulemanager` | → VecAuditLog | `/o/vec-admin` | `/system-modules` | — (đọc OSGi runtime) |
| `networkpolicy` | → VecAuditLog | `/o/vec-admin` | `/admin-network-policies` | `VEC_AdminNetworkPolicy` |
| `webcontent/advancedsearch` | → VecAuditLog | `/o/vec-admin` | `/web-content-advanced-search` | — (query bảng core Journal*) |
| `workflow` | → VecAuditLog | `/o/vec-admin` | `/workflow-review` | `VEC_WorkflowReviewHistory` |
| `webcontent/statistics` | VecAdminApp | `/o/vec-admin/v1.0` | `/webcontent-statistics` | — (bảng core JournalArticle) |
| `backup` | VecBackupAdminApp | `/o/vec-backup-admin` | `/` | — (file + tiến trình OS) |
| `camera` | VecCameraShowStateApp | `/o/vec-setting-camera-show-state` | `/` | `VEC_CameraVisibility` |
| `dashboard/layout` | VecDashboardLayoutApp | `/o/vec-dashboard-layout` | `/layout` | `VEC_DashboardLayout` |
| `support` | VecSupportHandlerSettingApp | `/o/vec-support-handler-settings` | `/configurations`, `/requests`, ... | `VEC_SupportRequest*`, `VEC_SupportHandlerConfig*` |
| `survey` | VecSurveyApp | `/o/vec-survey` | `/surveys` | `VEC_InternalSurvey*` |
| `webhook` | VecWebhookApp | `/o/vec-webhook` | `/tinytalk`, `/conversations` | `VEC_WebhookLog` |
| `webcontent/publicarticle` | VecPublicWebContentApp (cho phép guest) | `/o/vec-public-webcontent` | `/journal-articles/basic-info` | — (bảng core JournalArticle) |
| `ui` | — | — | DynamicInclude (top_head) | — |
| `ckeditor` | — | — | EditorConfigContributor | — |
| `ldap/organization` | — | — | Scheduler + MessageListener | — (dùng service core Organization) |

### Chi tiết từng package

#### `ui` — Chèn JS/CSS custom vào mọi trang portal
`TopHeadDynamicInclude` đăng ký vào extension point `/html/common/themes/top_head.jsp#pre`, chạy trong `<head>` của mọi trang. Luôn chèn `custom_admin.css` + `custom_admin.js`; ngoài ra chèn có điều kiện theo URL hiện tại:
- Trang Users Admin → SheetJS (CDN) + `user_admin.js` (xuất Excel danh sách user).
- Trang Journal (Web Content) → `fix-create-new-webcontent.js` + `workflow-fix.js`.
- URL có `JournalPortlet_isCreateHotNew=1` → `create-hot-new/index.css` + `index.js`.
- User đăng nhập có screenName `admin` → `backup_admin.js`.

#### `audit` — Nhật ký audit (thay đổi dữ liệu + lỗi HTTP)
Hệ thống nhiều lớp ghi lại ai-thay-đổi-gì (kèm snapshot trước/sau và diff JSON) vào bảng `VEC_AUDIT_LOG`:
- **`wrapper/`** — các `ServiceWrapper` bọc service core của Liferay (JournalArticle, JournalFolder, FragmentEntry, FragmentEntryLink, Layout, Portal/PortletPreferences) để chụp snapshot trước/sau và bắt lỗi kèm stack trace.
- **`listener/`** — các `ModelListener` dự phòng cho các thay đổi không đi qua wrapper (JournalArticle, Layout, FragmentEntryLink, settings của Company/Group/Layout/LayoutSet, ResourcePermission). Wrapper và listener phối hợp qua `util/AuditThreadLocal` (`markHandled`/`consumeHandled`) để tránh ghi trùng một thao tác.
- **`config/`** — `ConfigurationModelListener` bắt mọi thay đổi cấu hình OSGi Config Admin (`CONFIG_UPDATE`).
- **`filter/HttpErrorAuditFilter`** — servlet filter trên `/*`, ghi audit khi response là lỗi 5xx hoặc 401/403/429 (giúp admin thấy lỗi ứng dụng mà không cần tail log).
- **`service/`** — `AuditLogService` (façade: startPending → completeSuccess/Failure), `AuditContextService` (ngữ cảnh user/request), `AuditSnapshotService` (serialize entity thành JSON đã lọc dữ liệu nhạy cảm), `AuditDiffService` (tính diff).
- **`resource/AuditLogResource`** — REST tra cứu log, chỉ dành cho admin: `GET /audit-logs` (lọc, phân trang), `GET /{id}`, `POST /client-event`, `GET /test-error`.
- **`persistence/AuditLogRepository`** — JDBC thuần trên `VEC_AUDIT_LOG`, id lấy từ Counter service.

#### `backup` — Console sao lưu / phục hồi
REST admin điều khiển shell script backup trên server (tạo/khôi phục/xóa backup bundle + MySQL, cài/gỡ cron tự động, xem log job, tải file backup qua token dùng một lần, hết hạn 5 phút). Job chạy tuần tự trong executor 1 luồng, trạng thái giữ trong bộ nhớ. Chỉ user `admin` truy cập được. Frontend tương ứng: `backup-restore/` + `backup_admin.js`.

#### `camera` — Trạng thái hiển thị camera
Lưu cờ hiển thị (internet/intranet) cho từng camera theo tuyến cao tốc, bảng `VEC_CameraVisibility`. `GET` công khai, `PUT` yêu cầu admin.

#### `ckeditor` — Tùy biến CKEditor
`CustomCKEditorConfigContributor` (service.ranking=200) tùy biến CKEditor toàn portal: toolbar, autogrow, contentsCss riêng, chặn nội dung nguy hiểm (`script`, thuộc tính `on*`), và đăng ký plugin ngoài `multiimage` (nút Insert2Images/Insert3Images — chèn cụm 2/3 ảnh) phục vụ từ `META-INF/resources/ckeditor/`.

#### `dashboard/layout` — Bố cục dashboard theo user
Lưu thứ tự và danh sách card bị ẩn trên trang chủ dashboard của từng user (bảng `VEC_DashboardLayout`); có thứ tự mặc định khi user chưa tùy biến. `GET/PUT/DELETE /layout`, mọi user đăng nhập.

#### `ldap/organization` — Đồng bộ AD OU → Organization
Scheduler chạy theo cron (mặc định 5 phút/lần, cấu hình qua `ADOUOrganizationSyncConfiguration`: enabled, cronExpression, batchSize, dryRun). Đọc Distinguished Name (AD) của từng user, parse cây OU và đảm bảo user thuộc đúng cây Organization tương ứng trong Liferay.

#### `modulemanager` — Quản lý module OSGi
Portlet + PanelApp trong Control Panel › Security (chỉ admin), redirect sang trang `/web/guest/module-manager` nhúng giao diện `module-manager/`. REST `GET/PUT /o/vec-admin/system-modules` liệt kê và start/stop/update bundle OSGi qua `BundleContext`.

#### `networkpolicy` — Chặn truy cập admin theo IP
- `filter/AdminNetworkPolicyFilter` — servlet filter trên `/*`: với các URL được bảo vệ, resolve IP thật của client (hỗ trợ trusted-proxy CIDR) và đối chiếu danh sách policy (CIDR hoặc IP đơn, bảng `VEC_AdminNetworkPolicy`, cache in-memory).
- Portlet + PanelApp trong Control Panel › Security, nhúng iframe giao diện `admin-network-policy/`.
- REST CRUD `/o/vec-admin/admin-network-policies`. `AdminNetworkPolicyPermission` là hàm kiểm tra quyền admin dùng chung (modulemanager cũng dùng).

#### `support` — Hệ thống yêu cầu hỗ trợ CNTT
Hai resource dưới `/o/vec-support-handler-settings`:
- `SupportHandlerSettingResource` (admin): cấu hình người xử lý theo từng loại yêu cầu/phòng ban; khi lưu sẽ gán lại các yêu cầu đang chờ.
- `SupportRequestResource` (người dùng + người xử lý): tạo/tra cứu/cập nhật yêu cầu, bình luận, đính kèm (Base64), theo dõi, lịch sử trạng thái; gửi email thông báo qua Mail service.
Dữ liệu trên 8 bảng `VEC_SupportRequest*` / `VEC_SupportHandlerConfig*`.

#### `survey` — Khảo sát nội bộ
CRUD khảo sát + bình chọn tại `/o/vec-survey/surveys`: phạm vi người tham gia (tất cả / theo user / theo tổ chức), thời gian hiệu lực, thông báo email. Bảng `VEC_InternalSurvey`, `...Participant`, `...Option`, `...Vote`.

#### `webcontent/` — Tiện ích cho Web Content
- **`advancedsearch`** — tìm kiếm nâng cao JournalArticle (từ khóa, site, thư mục, trạng thái, structure, người tạo, khoảng ngày) query trực tiếp bảng core `JournalArticle` + `JournalArticleLocalization`; giao diện tại `webcontent-advanced-search/`.
- **`publicarticle`** — endpoint công khai (guest truy cập được) trả thông tin cơ bản của một bài viết theo `articleId`.
- **`statistics`** — xuất báo cáo thống kê Web Content ra file Excel (`GET /export.xlsx`), chỉ admin.

#### `webhook` — Webhook chat TinyTalk
`POST /o/vec-webhook/tinytalk` nhận webhook từ TinyTalk (hỗ trợ xác thực chữ ký HMAC-SHA256 và idempotency key), lưu tin nhắn vào bảng `VEC_WebhookLog`. `GET /o/vec-webhook/conversations` liệt kê hội thoại cho user đăng nhập. Xem thêm `chat-history.html`.

#### `workflow` — Hỗ trợ workflow duyệt Web Content
- `JournalArticleAutoResubmitModelListener` — khi tác giả sửa lại bài đang ở trạng thái PENDING (bị trả về trong workflow), tự động complete task "update" với transition resubmit để tác giả không phải submit lại thủ công.
- `WorkflowReviewResource` + `WorkflowReviewService` — REST `/o/vec-admin/workflow-review` liệt kê và duyệt/từ chối task workflow (bọc `WorkflowTaskManagerUtil`); lịch sử duyệt ghi vào `VEC_WorkflowReviewHistory` (bảng tự tạo nếu chưa có). Giao diện tại `workflow-review/`. Bối cảnh yêu cầu: [docs/prompt-workflow-tasks.md](docs/prompt-workflow-tasks.md).

## Tài nguyên frontend (`src/main/resources/META-INF/resources/`)

Tất cả phục vụ tại `/o/vec-custom-admin-ui/<đường dẫn>`. Gồm hai nhóm:

**1. Script/CSS chèn vào trang portal** (qua `TopHeadDynamicInclude`, xem package `ui` ở trên):

| File | Vai trò |
| --- | --- |
| `custom_admin.js` / `custom_admin.css` | Chỉnh sửa DOM/giao diện quản trị chung, chèn vào mọi trang |
| `user_admin.js` | Xuất Excel trên trang quản lý user (dùng SheetJS) |
| `backup_admin.js` | Gắn lối vào console backup cho user `admin` |
| `workflow-fix.js`, `fix-create-new-webcontent.js` | Vá hành vi trang Journal (Web Content) |
| `create-hot-new/` | Giao diện tạo nhanh "tin nóng" trong Journal |
| `js/ckeditor_override.js`, `css/ckeditor-custom.css` | Override CKEditor phía client |
| `ckeditor/` | Plugin `multiimage` + icon cho CKEditor |

**2. Mini-SPA quản trị** — mỗi thư mục là một trang độc lập (`index.html` + `index.js` + `index.css`) gọi REST API tương ứng, thường được nhúng qua portlet/iframe hoặc mở trực tiếp:

| Thư mục | Gọi API | Chức năng |
| --- | --- | --- |
| `admin-network-policy/` | `/o/vec-admin/admin-network-policies` | Quản lý policy IP (có README riêng) |
| `audit-log/` | `/o/vec-admin/audit-logs` | Tra cứu nhật ký audit (có README riêng) |
| `backup-restore/` | `/o/vec-backup-admin` | Console backup/restore |
| `module-manager/` | `/o/vec-admin/system-modules` | Quản lý bundle OSGi |
| `webcontent-advanced-search/` | `/o/vec-admin/web-content-advanced-search` | Tìm kiếm Web Content nâng cao |
| `workflow-review/` | `/o/vec-admin/workflow-review` | Duyệt/từ chối Web Content |

Các file lẻ `backup-restore.html`, `chat-history.html`, `test.html` là trang standalone/thử nghiệm.

## SQL (`sql/`) và database

Module dùng JDBC thuần (không dùng Service Builder), vì vậy **bảng phải được tạo thủ công** bằng các file migration trong `sql/` trước khi tính năng tương ứng hoạt động:

| File | Tính năng | Bảng |
| --- | --- | --- |
| `audit-log.sql` | audit | `VEC_AUDIT_LOG` |
| `admin-network-policy.sql` | networkpolicy | `VEC_AdminNetworkPolicy` |
| `camera-show-state.sql` | camera | `VEC_CameraVisibility` |
| `dashboard-layout.sql` | dashboard | `VEC_DashboardLayout` |
| `internal-survey.sql` | survey | `VEC_InternalSurvey*` |
| `support-handler-settings.sql` | support | `VEC_SupportRequest*`, `VEC_SupportHandlerConfig*` |
| `support-handler-multi-org-migration.sql` | support | Migration hỗ trợ nhiều tổ chức cho người xử lý |
| `workflow-review-history.sql` | workflow | `VEC_WorkflowReviewHistory` |

`db_structure.sql` ở gốc module là dump cấu trúc toàn bộ database (tham khảo khi cần tra cứu schema, không phải migration để chạy).

## Ghi chú vận hành

- Nhiều REST resource giới hạn quyền theo omniadmin / screenName `admin` / role `Administrator`; riêng `publicarticle` cho phép guest và `camera` cho phép đọc công khai.
- Các wrapper/listener/filter chạy trong luồng core của Liferay — code phải phòng thủ (null-safe, nuốt lỗi phụ) để không làm hỏng thao tác chính của portal.
- `nginx.conf` là cấu hình reverse proxy tham khảo cho môi trường 2 node Liferay (sticky session bằng `ip_hash`), không nằm trong JAR.
- Kiểm tra sau deploy: bundle `vn.vec.custom.admin.ui` trạng thái ACTIVE, log không có lỗi activate; nếu đổi schema thì chạy migration trong `sql/` trước.
