# AI Memory - vec-liferay-fragments

Tài liệu này là bộ nhớ làm việc cho các AI agent khi hỗ trợ dự án `vec-liferay-fragments`.
Ngôn ngữ viết tài liệu, ghi chú kỹ thuật và trao đổi mặc định trong dự án là **tiếng Việt**.

## Tổng Quan Dự Án

- `vec-liferay-fragments` là dự án ReactJS dùng để build fragment cho màn hình intranet của VEC trên Liferay.
- Sản phẩm build chính của phần React fragment là file `liferay-fragments.zip` ở thư mục gốc.
- Script build fragment chính là `build.sh`.
- `custom-bundles` là khu vực chứa custom module OSGi để build và deploy lên Liferay server dạng module.
- Có hai đường build custom module:
  - `build-custom-bundles.sh` (thư mục gốc): build **ở local bằng Docker** ra JAR trong `custom-bundles/dist/`. Không cần JDK/Gradle/Liferay bundle trên máy.
  - `custom-bundles/deploy-admin-ui.sh`: upload code lên server rồi build và deploy trực tiếp trên server.
- Liferay đang chạy là **7.4.3.132 CE GA132** (18/02/2025), JDK 17.
- `internet-fragment` là nơi backup code của các fragment trên giao diện chỉnh sửa của internet. Đây là bản lưu thủ công từ Liferay UI, không phải luồng build React chính.

## Cấu Trúc Quan Trọng

- `src/`: mã nguồn React intranet.
- `src/modules/`: các màn hình nghiệp vụ của intranet như trang chủ, văn phòng điện tử, đối soát thu phí, giám sát giao thông, tin tức, biểu mẫu, khảo sát, quy trình hỗ trợ.
- `src/router/menuConfig.js`: cấu hình path, menu item và nhóm menu sidebar. Khi thêm màn hình mới, ưu tiên khai báo path/menu ở đây.
- `src/services/`: service gọi API và xử lý dữ liệu từ Liferay hoặc backend liên quan.
- `src/assets/`: ảnh, icon, font và tài nguyên giao diện.
- `build/`: output tạm sau khi chạy build React.
- `liferay-build/`: project Liferay Fragments dùng để nén thành zip import vào Liferay.
- `sync-to-liferay.js`: đồng bộ output trong `build/` sang `liferay-build/src/intranet-fragment/fragments/intranet-fragment`.
- `custom-bundles/admin-ui/`: custom OSGi module `vn.vec.custom.admin.ui`.
- `custom-bundles/admin-ui/src/main/java/`: Java code cho REST resource, filter, listener, service wrapper, portlet và các service admin.
- `custom-bundles/admin-ui/src/main/resources/META-INF/resources/`: tài nguyên web tĩnh của admin UI.
- `custom-bundles/admin-ui/sql/`: script SQL cho các chức năng custom admin.
- `custom-bundles/admin-ui/db_structure.sql`: dump schema MySQL thật của dự án. Tra cột ở đây trước khi viết SQL, đừng đoán tên cột.
- `custom-bundles/frontend-ui/`: CSS/JS custom cho frontend UI.
- `custom-bundles/vec-expired-password-force-change/`: module custom riêng cho yêu cầu đổi mật khẩu hết hạn.
- `custom-bundles/comment-management/`: module OSGi `comment.management`, portlet quản lý bình luận.
- `custom-bundles/dist/`: JAR output của build Docker. Thư mục này **được commit vào git** (chỉ `.gradle-docker/` và `.gradle/` bị gitignore), nên JAR đã build được lưu kèm source.
- `Dockerfile.custom-bundles`, `build-custom-bundles.sh` (thư mục gốc): image và script build custom bundle bằng Docker.
- `public/`: tài nguyên public và template HTML của React app.
- `auto-backup/`: script và service hỗ trợ backup/restore/status server.
- `sync-ldap/`: script Groovy hỗ trợ đồng bộ LDAP.
- `test-facebook/`: script thử nghiệm tích hợp Facebook.
- `test-performance/`: kịch bản kiểm thử tải, hiện dùng `k6`.
- `.agent/skills/`: bộ skill hướng dẫn agent về composition pattern, React best practices và web design.

## Tech Stack

- React `19.x`, React DOM `19.x`.
- React Router DOM `7.x`.
- Ant Design `6.x`.
- Styled-components `6.x`.
- Build frontend bằng Craco `7.x` trên nền React Scripts `5.x`.
- Dayjs dùng locale tiếng Việt.
- Test frontend bằng Jest và React Testing Library.
- Custom bundle dùng Java, Gradle/Liferay plugin, OSGi Declarative Services và các API Liferay.
- Liferay fragment được đóng gói bằng `generator-liferay-fragments` trong `liferay-build`.

## Build React Fragment Intranet

Lệnh build chuẩn:

```bash
./build.sh
```

Luồng build trong `build.sh`:

1. Chạy `yarn build`.
2. Chạy `node sync-to-liferay.js`.
3. Vào `liferay-build` và chạy `npm run compress`.
4. Copy `liferay-build/build/liferay-fragments.zip` ra thư mục gốc.

Có thể chạy từng bước khi cần debug:

```bash
yarn build
node sync-to-liferay.js
cd liferay-build
npm run compress
```

Lưu ý:

- `craco.config.js` đặt `webpackConfig.output.publicPath = "/o/liferay-react-fragment/"` khi production build. Không đổi public path nếu không kiểm tra lại cách Liferay phục vụ resource.
- `sync-to-liferay.js` tạo collection `vec-intranet`, fragment `intranet-fragment`, copy `build/static` vào `resources`, rồi sinh `index.html`, `index.js`, `index.css`, `fragment.json`.
- App React expose `window.ReactHelloWorldApp.render(element)` trong `src/index.js` để Liferay fragment gọi khi mount.

## Build Custom Bundle Bằng Docker (build local)

Chạy từ thư mục gốc. Không cần cài JDK, Gradle hay Liferay bundle trên máy:

```bash
bash build-custom-bundles.sh all        # build cả 3 module
bash build-custom-bundles.sh 3          # chỉ comment-management
bash build-custom-bundles.sh 1 3        # nhiều module
bash build-custom-bundles.sh --clean all
bash build-custom-bundles.sh --shell    # mở bash trong container để debug
```

Module: `1` = admin-ui, `2` = expired-password, `3` = comment-management (đánh số giống `deploy-admin-ui.sh`). JAR ra ở `custom-bundles/dist/`. Script này **chỉ build, không deploy**.

Cách hoạt động:

- Container **không** set `LIFERAY_HOME`, nên các `build.gradle` tự đi nhánh fallback Maven `com.liferay.portal:release.portal.api:7.4.3.132`. Artifact này chứa đủ `portal-kernel`, `javax.portlet`, các app API (journal, message-boards, application-list) và OSGi annotations. Trên server có `LIFERAY_HOME` thì vẫn ưu tiên JAR thật — build trên server không đổi hành vi.
- Logic build nằm trong `build-custom-bundles.sh` và được mount cùng repo, nên sửa script **không** cần rebuild image. Chỉ rebuild khi sửa Dockerfile: `--rebuild-image`.
- Cache Gradle ở `.gradle-docker/` trong repo (gitignore) để build lại nhanh (~1-3 giây/module) và file sinh ra thuộc đúng user, không bị root-owned.

### BẮT BUỘC: pin version trong bnd.bnd

Mọi module OSGi trong `custom-bundles/` phải có dòng này trong `bnd.bnd`:

```
Import-Package: \
    com.liferay.*;version="0.0.0",\
    ...,\
    *
```

Không pin thì JAR build ở local **không start được** trên server, bundle kẹt ở trạng thái `Installed`:

```
BundleException: Could not resolve module: comment.management
  Unresolved requirement: Import-Package:
  com.liferay.message.boards.service; version="11.1.0"
```

Nguyên nhân: build trên server dùng JAR thật trong `LIFERAY_HOME` (không khai báo Export-Package version) → Import-Package không kèm version. Build Docker dùng artifact Maven; `com.liferay.application.list.api` và `com.liferay.message.boards.api` trên Maven **có** khai báo version → bnd tự sinh version range không khớp server. `release.portal.api` thì không khai báo, nên chỉ các app API kéo riêng từ Maven mới gây lỗi.

Trong OSGi, `Import-Package: foo` không có version tương đương `version="0.0.0"`, nên pin này an toàn cho cả hai đường build.

Kèm theo: pin version Maven fallback về đúng version production thay vì `latest.release`, để build reproducible và compile đúng API prod đang chạy (hiện tại `message.boards.api` 27.0.1, `application.list.api` 13.1.2).

### Giữ Gradle 7.x

Liferay Gradle plugin dùng API đã bị bỏ ở Gradle 8 (build cảnh báo "incompatible with Gradle 8.0"). Version pin qua `ARG GRADLE_VERSION` trong `Dockerfile.custom-bundles`. Đừng nâng lên 8.x.

## Build Và Deploy Custom Bundle Trên Server

Lệnh deploy từ local:

```bash
bash custom-bundles/deploy-admin-ui.sh 1    # admin-ui
bash custom-bundles/deploy-admin-ui.sh 2    # expired-password
bash custom-bundles/deploy-admin-ui.sh 3    # comment-management
```

Script local sẽ:

1. Đọc cấu hình từ `custom-bundles/.env` (`SERVER_USER`, `SERVER_IP`, `SSH_KEY_PATH`).
2. Upload toàn bộ `custom-bundles` lên server bằng `rsync --delete`.
3. SSH vào server và chạy `deploy-admin-ui.sh --server <module>`.

Script server sẽ build module, copy JAR vào `$LIFERAY_HOME/osgi/modules`, và copy `.config` nếu module có `osgi/configs`. Nếu phát hiện còn JAR cũ cùng bundle nhưng khác tên file, script sẽ **cảnh báo** (không tự xoá).

Lưu ý:

- `build.gradle` và `deploy-admin-ui.sh` mặc định `LIFERAY_HOME=/root/vec/bundles`, nhưng **server thật dùng `/home/vecadmin/vec/bundles`**. Đừng suy ra đường dẫn server từ default trong script.
- Symbolic name và version hiện tại: `vn.vec.custom.admin.ui` 1.0.1, `vn.vec.custom.admin.password` 1.0.0, `comment.management` 1.0.1.
- Manifest của từng module nằm ở `<module>/bnd.bnd`.
- Khi gặp lỗi classloader hoặc `ClassNotFoundException` trong OSGi, cần clean build và redeploy JAR đúng version; tránh để Liferay giữ artifact cũ trong `osgi/modules`.
- **Hai JAR cùng `Bundle-SymbolicName` khác version sẽ cùng được install** và portal có thể vẫn chạy code cũ. Khi bump version, phải xoá file JAR version cũ trong `osgi/modules` rồi restart.

### Kiểm tra bundle trên server

Gogo shell: `telnet localhost 11311`

```
lb -s | grep -i <tên bundle>     # Installed = chưa resolve, Active = OK
diag <bundleId>                  # in requirement chưa thoả, chẩn đoán chính xác nhất
update <bundleId>                # nạp lại sau khi ghi đè file JAR
start <bundleId>
```

Log: `$LIFERAY_HOME/tomcat/logs/catalina.out`. Các API jar của Liferay nằm ở `$LIFERAY_HOME/osgi/portal/`, không phải `osgi/modules/`.

## Custom Bundle Admin UI

Các nhóm chức năng lớn trong `custom-bundles/admin-ui`:

- `audit`: nhật ký kiểm tra thay đổi hệ thống, gồm REST API, model, repository, service, listener và service wrapper cho Layout/Journal/Fragment/Permission/Preferences.
- `networkpolicy`: quản lý chính sách truy cập admin theo mạng/IP, gồm filter, portlet, REST resource, repository và cache.
- `modulemanager`: portlet và REST resource quản lý/truy vấn module hệ thống.
- `webcontent/advancedsearch`: tìm kiếm nâng cao web content.
- `webcontent/statistics`: thống kê và export Excel web content.
- `backup`: API/tài nguyên admin backup restore.
- `camera`: trạng thái hiển thị camera.
- `survey`: API khảo sát nội bộ.
- `support`: API cấu hình người xử lý và lưu/truy xuất yêu cầu hỗ trợ theo
  `companyId`; script schema là `sql/support-handler-settings.sql`. Chỉ người
  xử lý được chỉ định hoặc user `admin` được đổi trạng thái. Khi lưu cấu hình,
  người xử lý của các yêu cầu `cho-xu-ly` được đồng bộ theo cấu hình mới. Người
  xử lý có thể thuộc phòng ban được chọn hoặc bất kỳ phòng ban cấp dưới nào.
  Khi tạo yêu cầu, hệ thống gửi mail cho các người xử lý và CC người tạo; lỗi
  gửi mail chỉ được ghi log, không rollback yêu cầu đã tạo.
- `ckeditor`: custom cấu hình CKEditor.
- `dashboard/layout`: API layout dashboard.
- `webhook`: webhook và conversation resource.
- `HookTollReconciliation`: endpoint nhận hook Đối soát thu phí tại
  `/o/toll-reconciliation/hook`, xác thực API key/HMAC raw body/timestamp/nonce,
  validate và upsert 5 loại dữ liệu. Credential cùng tham số vận hành tập trung
  tại `vn.vec.custom.admin.HookTollReconciliation.HookConstants`; migration là
  `custom-bundles/admin-ui/sql/toll_reconciliation_hook.sql` và phải chạy trên
  DB master trước khi deploy.
- `ui`: dynamic include cho phần head/top admin.

Khi sửa Java trong custom bundle:

- Ưu tiên giữ package hiện tại `vn.vec.custom.admin...`.
- Cẩn thận với service wrapper và model listener vì chúng chạy trong luồng core của Liferay.
- Audit code phải không được làm hỏng thao tác chính của Liferay. Nếu audit lỗi, nên log và fail mềm khi phù hợp.
- Với `ServiceContext`, `HttpServletRequest` có thể null trong một số flow nội bộ/background của Liferay. Luôn guard null trước khi đọc request, session, user agent, remote address.
- Khi thêm endpoint REST, kiểm tra permission, companyId, groupId và user context.
- Khi thay đổi schema SQL trong `custom-bundles/admin-ui/sql/`, cập nhật repository/model tương ứng.

## Custom Bundle Comment Management

`custom-bundles/comment-management/` (bundle `comment.management`) là portlet quản lý bình luận, hiện ở panel Site Administration → Content.

- Module này được tạo bằng cách **decompile `custom-bundles/comment.management.jar`** (bằng CFR) thành source build lại được, giữ nguyên `Bundle-SymbolicName` và portlet name `comment_management_CommentManagementPortlet` để thay thế trực tiếp JAR cũ.
- Toàn bộ query là SQL thô qua `DataAccess`, không dùng service layer để đọc. `view.jsp` chỉ hiển thị, không chứa logic nghiệp vụ.
- Mọi query đều lọc `companyId` + `groupId` (lấy từ `ThemeDisplay`), gồm: danh sách, đếm/phân trang, dropdown tài khoản (chỉ `companyId`), xem chi tiết thread, và guard xoá/trả lời comment.
- **Dùng `ThemeDisplay` để lấy scope, không dùng `PortalUtil.getScopeGroupId()`** — hàm đó khai báo `throws PortalException` mà `render()`/`serveResource()` không propagate được, sẽ lỗi compile.

**Việc còn mở:** danh sách đang hiện 0 dòng dù có dữ liệu. Nghi vấn là filter `msg.groupId = scopeGroupId`, vì `MBMessage.groupId` của comment là scope group của *trang post comment*, không chắc bằng `ja.groupId` của bài viết (xem section dưới). Ba hướng đang chờ số liệu để chọn: giữ nguyên, đổi sang `ja.groupId`, hoặc thêm dropdown chọn site trên UI.

Hai việc cố ý chưa sửa: 15 category hardcode tiếng Việt trong `view.jsp`; portlet chỉ dựa vào panel category `site_administration.content` chứ chưa check permission riêng.

## Data Model Comment Liferay Và Bẫy SQL

Các điểm đã verify từ source Liferay thật, cần biết trước khi sửa query liên quan comment:

- Comment trên bài viết = `MBMessage` thuộc `MBDiscussion`/`MBThread`, không có bảng riêng.
- **Độ sâu treePath**: root message của discussion có `treePath` = `/rootId/` (2 dấu `/`); comment cấp 1 có `/rootId/msgId/` (**3 dấu `/`**). Query lọc comment dùng `(LENGTH(treePath) - LENGTH(REPLACE(treePath,'/',''))) = 3`. Reply lồng sâu hơn có 4+ dấu `/` nên không nằm trong danh sách cấp 1.
- **`MBMessage.groupId` của comment KHÔNG chắc bằng `JournalArticle.groupId`.** `MBCommentManagerImpl.addComment(userId, groupId, ...)` nhận `groupId` từ caller, với comment trên trang thì đó là `scopeGroupId` của trang đang hiển thị bài. Bài ở site Global mà comment post trên trang site khác thì hai groupId lệch nhau.
- **`deleteMessage` KHÔNG cascade — nó re-parent con lên ông nội** (`childMessage.setParentMessageId(message.getParentMessageId())`). Muốn xoá thật cả cây phải tự duyệt **post-order** (lá trước, gốc sau) qua `getChildMessages(parentMessageId, WorkflowConstants.STATUS_ANY)` rồi gọi `deleteDiscussionMessage(id)` từng cái.
- `deleteDiscussionMessage(long)` là hàm đúng cho comment. Nó dọn AssetEntry, Expando rows, Ratings stats, workflow instance links, social activities, search index (`@Indexable`) và `MBThread.lastPostDate`. Raw `DELETE FROM MBMessage` bỏ sót hết những thứ này.

Bẫy schema 7.4.3.132 — tra `custom-bundles/admin-ui/db_structure.sql` trước khi viết SQL:

- `User_` dùng cột **`type_`**, KHÔNG có `defaultUser`.
- `MBThread` **không còn** cột `messageCount`.
- Hầu hết bảng có `ctCollectionId` (Publications/change tracking), PK là `(id, ctCollectionId)`. **Phải lọc `ctCollectionId = 0`** để lấy dữ liệu production, không lọc sẽ ra bản ghi trùng.
- `ClassName_` là ngoại lệ: **không có** `ctCollectionId`.
- `JournalArticleLocalization` không có cờ default-language; dùng `JournalArticle.defaultLanguageId` để chọn tiêu đề. Không hardcode `languageId = 'vi_VN'` vì bài chỉ có locale khác sẽ bị loại khỏi kết quả.
- Nhiều version của 1 bài: lấy bản mới nhất bằng `ja.id_ = (SELECT MAX(ja2.id_) FROM JournalArticle ja2 WHERE ja2.resourcePrimKey = d.classPK AND ja2.ctCollectionId = 0)`.
- SQL trong các module này bọc `catch (Exception)` và trả list rỗng, nên **lỗi SQL biểu hiện thành "không có dữ liệu" trên UI**, không phải stack trace. Validate SQL trước khi kết luận là hết dữ liệu.

## Verify Ở Local Không Cần Server

Ba cách kiểm chứng đã dùng hiệu quả, nên làm trước khi khẳng định hoặc nhờ user chạy trên server:

**1. Compile-check với API jar thật.** Repo không có Liferay bundle ở local, nhưng tải được:

```
https://repository-cdn.liferay.com/nexus/content/groups/public/com/liferay/portal/release.portal.api/7.4.3.132/release.portal.api-7.4.3.132.jar
```

Jar này (~64MB) chứa cả `javax.portlet` và `org.osgi.service.component.annotations`, nên chỉ cần nó là `javac -cp` compile được module OSGi. Dùng `javap -cp` để tra signature thật thay vì đoán — cách này đã bắt được lỗi checked exception `PortalException` mà suy luận bỏ sót.

**2. Đọc source Liferay.** User có checkout tại `/Users/vietdau33/works/HTECom/default-liferay-portal`. Đọc implementation khi cần biết service thực sự làm gì, ví dụ `modules/apps/message-boards/message-boards-service/src/main/java/com/liferay/message/boards/service/impl/MBMessageLocalServiceImpl.java`.

**3. MySQL Docker với schema production thật** — quan trọng vì các module dùng nhiều SQL thô:

```bash
docker run -d --name lrcheck -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=lr \
  -p 13306:3306 mysql:8.0
docker exec lrcheck mysqladmin -uroot -proot --wait=120 --silent ping   # PHẢI chờ, nếu không sẽ "Lost connection"
```

Trích DDL bảng cần dùng từ `db_structure.sql` (dump MySQL thật, load trực tiếp được):

```bash
t=MBMessage
awk "/^CREATE TABLE \`$t\` /,/^\) ENGINE/" custom-bundles/admin-ui/db_structure.sql
```

Nhớ `docker rm -f lrcheck` khi xong.

## Internet Fragment Backup

- `internet-fragment/` chứa bản backup code fragment được lấy từ giao diện chỉnh sửa internet của Liferay.
- Các fragment hiện có gồm `cac-doi-tac-cua-vec`, `gioi-thieu-chung`, `home-page-information`, `live-camera` và file `workflow-default.xml`.
- Không coi thư mục này là output build tự động của React intranet.
- Khi sửa file trong `internet-fragment`, cần hiểu đây là code fragment độc lập để đồng bộ lại thủ công lên giao diện internet nếu cần.

## Quy Ước Code Frontend

- Viết component React dạng functional component và Hooks.
- Dùng strict equality `===`.
- Ưu tiên `async/await`.
- Khi làm frontend, tham khảo các skill nội bộ trong `.agent/skills/` nếu cần định hướng pattern hoặc UI.
- Hạn chế inline style; dùng styled-components hoặc CSS file theo pattern đang có.
- Với UI intranet, giữ phong cách rõ ràng, dễ dùng, ưu tiên tiếng Việt và trạng thái lỗi/tải dữ liệu dễ hiểu.
- Ant Design theme chính đang đặt `colorPrimary: "#0090CF"` và font `Inter` trong `src/App.js`.
- Khi thêm route/menu, cập nhật `src/router/menuConfig.js` và kiểm tra điều hướng trong `src/router`.
- Khi gọi API, ưu tiên tái sử dụng helper/service trong `src/services/` hoặc `src/common/`.

## Quy Ước Tài Liệu Và Giao Tiếp

- Tài liệu dự án viết bằng tiếng Việt.
- Nếu cần ghi chú kỹ thuật vào markdown trong repo, dùng tiếng Việt trước, chỉ giữ thuật ngữ tiếng Anh khi đó là tên framework/API/lệnh.
- `AGENTS.md` là nguồn memory chính cho AI agent. Khi phát hiện quy trình mới hoặc thay đổi build/deploy quan trọng, cập nhật file này.
- Không xóa hoặc thay đổi backup/script deploy nếu không hiểu rõ luồng vận hành server.

## Kiểm Tra Trước Khi Kết Thúc Task

- Với frontend React: ưu tiên chạy `yarn build` hoặc `npm run build` nếu thay đổi có rủi ro.
- Với fragment package: chạy `./build.sh` khi cần xác nhận zip import vào Liferay.
- Với custom bundle: **build ở local bằng `bash build-custom-bundles.sh <module>`** để xác nhận compile được. Chỉ cần Docker, không cần Gradle/Blade/Liferay libs trên máy.
- Sau khi build custom bundle, kiểm tra `Import-Package` trong `META-INF/MANIFEST.MF` của JAR không còn `com.liferay...;version="` nào khác `"0.0.0"` (nhớ unwrap dòng continuation bắt đầu bằng 1 space). Nếu còn, bundle sẽ không resolve trên server.
- Nếu sửa SQL thô, validate trên MySQL Docker với schema thật trước khi giao cho user chạy trên production. SQL lỗi bị `catch(Exception)` nuốt thành list rỗng nên rất khó phát hiện qua UI.
- Deploy lên server vẫn phải qua `custom-bundles/deploy-admin-ui.sh` hoặc copy JAR thủ công; local không deploy được.
- Luôn kiểm tra `git diff --check` với file đã sửa để tránh lỗi whitespace.

## Cách Làm Việc Với User

- Trao đổi bằng **tiếng Việt**. Giữ nguyên thuật ngữ tiếng Anh cho tên framework/API/lệnh (bundle, portlet, groupId, placeholder...).
- User tự vận hành server production: chạy được shell, Gogo shell, đọc log, query DB. Khi cần dữ kiện từ server, **liệt kê thành khối lệnh copy-paste được** kèm giải thích ngắn từng lệnh, rồi chờ output — đừng đoán.
- User ưu tiên kết luận có kiểm chứng. Verify bằng nguồn thật (compile, source Liferay, SQL trên DB test) trước khi khẳng định.
- Không tự ý đổi những thứ mang tính quyết định nghiệp vụ (ví dụ đổi ngữ nghĩa filter). Trình bày phương án kèm dữ liệu để user chọn.
- Không tự xoá file trên server production; nêu lệnh và để user quyết định.
