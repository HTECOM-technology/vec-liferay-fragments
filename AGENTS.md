# AI Memory - vec-liferay-fragments

Tài liệu này là bộ nhớ làm việc cho các AI agent khi hỗ trợ dự án `vec-liferay-fragments`.
Ngôn ngữ viết tài liệu, ghi chú kỹ thuật và trao đổi mặc định trong dự án là **tiếng Việt**.

## Tổng Quan Dự Án

- `vec-liferay-fragments` là dự án ReactJS dùng để build fragment cho màn hình intranet của VEC trên Liferay.
- Sản phẩm build chính của phần React fragment là file `liferay-fragments.zip` ở thư mục gốc.
- Script build fragment chính là `build.sh`.
- `custom-bundles` là khu vực chứa custom module OSGi để build và deploy lên Liferay server dạng module.
- Script build/deploy custom module chính là `custom-bundles/deploy-admin-ui.sh`.
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
- `custom-bundles/frontend-ui/`: CSS/JS custom cho frontend UI.
- `custom-bundles/vec-expired-password-force-change/`: module custom riêng cho yêu cầu đổi mật khẩu hết hạn.
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

## Build Và Deploy Custom Bundle

Lệnh deploy custom admin UI từ local:

```bash
custom-bundles/deploy-admin-ui.sh
```

Script local sẽ:

1. Đọc cấu hình từ `custom-bundles/.env`.
2. Upload toàn bộ `custom-bundles` lên server bằng `rsync`.
3. SSH vào server và chạy `/root/vec/custom-bundles/deploy-admin-ui.sh --server`.

Lệnh build trên server:

```bash
custom-bundles/deploy-admin-ui.sh --server
```

Script server sẽ:

1. Build module `custom-bundles/admin-ui`.
2. Ưu tiên dùng `blade gw jar`; nếu không có Blade thì tìm `gradlew`.
3. Copy JAR trong `admin-ui/build/libs` vào `/root/vec/bundles/osgi/modules`.

Lưu ý:

- `custom-bundles/admin-ui/build.gradle` mặc định `LIFERAY_HOME=/root/vec/bundles` nếu không có biến môi trường.
- Module `admin-ui` có symbolic name `vn.vec.custom.admin.ui`, version hiện tại `1.0.1`.
- Manifest nằm ở `custom-bundles/admin-ui/bnd.bnd`.
- Khi gặp lỗi classloader hoặc `ClassNotFoundException` trong OSGi, cần clean build và redeploy JAR đúng version; tránh để Liferay giữ artifact cũ trong `osgi/modules`.

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
- `ckeditor`: custom cấu hình CKEditor.
- `dashboard/layout`: API layout dashboard.
- `webhook`: webhook và conversation resource.
- `ui`: dynamic include cho phần head/top admin.

Khi sửa Java trong custom bundle:

- Ưu tiên giữ package hiện tại `vn.vec.custom.admin...`.
- Cẩn thận với service wrapper và model listener vì chúng chạy trong luồng core của Liferay.
- Audit code phải không được làm hỏng thao tác chính của Liferay. Nếu audit lỗi, nên log và fail mềm khi phù hợp.
- Với `ServiceContext`, `HttpServletRequest` có thể null trong một số flow nội bộ/background của Liferay. Luôn guard null trước khi đọc request, session, user agent, remote address.
- Khi thêm endpoint REST, kiểm tra permission, companyId, groupId và user context.
- Khi thay đổi schema SQL trong `custom-bundles/admin-ui/sql/`, cập nhật repository/model tương ứng.

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
- Với custom bundle: chạy/deploy qua `custom-bundles/deploy-admin-ui.sh` trong môi trường có server và tool build phù hợp.
- Nếu môi trường local thiếu Gradle/Blade/Liferay libs, ghi rõ chưa build được và nêu lệnh cần chạy trên server.
- Luôn kiểm tra `git diff --check` với file đã sửa để tránh lỗi whitespace.
