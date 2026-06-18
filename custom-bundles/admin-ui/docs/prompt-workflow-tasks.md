Bạn đang làm việc trong repo:
`/Users/vietdau33/works/HTECom/vec-liferay-fragments`

Ngôn ngữ trao đổi và ghi chú kỹ thuật: tiếng Việt.

Bối cảnh:
- Dự án dùng Liferay Community Edition Portal 7.4.3.132 CE GA132.
- Phạm vi sửa chỉ nằm trong `custom-bundles`.
- Có thể tham khảo source gốc tại `/Users/vietdau33/works/HTECom/default-liferay-portal`, chỉ đọc tham khảo, không sửa.
- Workflow hiện tại nằm tại `custom-bundles/workflow/single-approver.xml`.
- Module custom chính là `custom-bundles/admin-ui`, symbolic name `vn.vec.custom.admin.ui`.
- Build/deploy custom bundle qua `custom-bundles/deploy-admin-ui.sh`.

Vấn đề:
Màn hình gốc `My Workflow Tasks` của Liferay chỉ nhóm task theo `Pending/Completed`, trong đó `Completed` là task đã hoàn thành, không phân biệt rõ asset đã được duyệt hay bị từ chối. Cần viết màn hình quản lý riêng trong `custom-bundles/admin-ui` để quản lý duyệt/từ chối Web Content và Comment rõ ràng hơn.

Kết luận đã thống nhất:
- Không override/sửa màn hình gốc của Liferay.
- Viết màn hình riêng trong `custom-bundles/admin-ui`.
- Không cần đạt 100% parity với màn hình gốc.
- Chia làm phase 1 và phase 2.
- Phase 1 ưu tiên đủ dùng cho nghiệp vụ duyệt/từ chối.
- Phase 2 bổ sung các chức năng parity nâng cao nếu cần.

Yêu cầu màn hình riêng:
1. Có 2 tab:
   - `Tất cả`: hiển thị các workflow item Web Content / Comment mà người dùng có quyền xử lý hoặc theo quyền quản trị.
   - `Tôi xử lý`: hiển thị các item/task liên quan đến người đang đăng nhập, bao gồm đang assign cho tôi hoặc tôi đã xử lý.

2. Một bảng duy nhất có pagination, hiển thị được các trạng thái:
   - `Chưa duyệt`
   - `Đã duyệt`
   - `Đã từ chối`
   - `Đã hết hạn duyệt`
   Có filter để lọc riêng từng trạng thái.

3. Bảng cần có tối thiểu các cột:
   - Tiêu đề / nội dung rút gọn
   - Loại: Web Content hoặc Comment
   - Tác giả/người gửi
   - Thuộc về ai / đang assign cho ai
   - Ai đã xử lý
   - Trạng thái duyệt
   - Task hiện tại / transition cuối
   - Ngày tạo/gửi
   - Ngày hoạt động cuối
   - Hạn duyệt/due date
   - Thao tác

4. Cần bao gồm cả task đã hết hạn duyệt:
   - Nếu task chưa hoàn thành và `dueDate < now` thì hiển thị trạng thái `Đã hết hạn duyệt`.
   - Vẫn cho phép filter riêng các task hết hạn.
   - Cân nhắc sort mặc định ưu tiên item đang chờ và hết hạn.

5. Search/filter/order đầy đủ:
   - Search theo tiêu đề, nội dung comment, tên tác giả, tên người xử lý nếu khả thi.
   - Filter theo trạng thái.
   - Filter theo loại nội dung: Web Content / Comment.
   - Filter theo user.
   - Filter theo ngày tạo, ngày xử lý, due date nếu hợp lý.
   - Order theo ngày tạo, ngày hoạt động cuối, due date, trạng thái.
   - Filter by user cần có list user; list user nên được cache tương tự pattern Audit Log hiện có.

6. Thao tác:
   - Có thể duyệt/từ chối ngay ở danh sách `Tất cả`.
   - Nếu task chưa assign cho user đang thao tác, trước khi duyệt/từ chối phải assign task về người đang thao tác, sau đó mới complete task với transition tương ứng.
   - Không update status trực tiếp nếu có workflow task; ưu tiên API workflow chuẩn của Liferay:
     `WorkflowTaskManager.completeWorkflowTask`,
     `WorkflowTaskManager.assignWorkflowTaskToUser`,
     `WorkflowTaskManager.updateDueDate` nếu cần.
   - Khi từ chối cần có comment/lý do.
   - Khi duyệt có thể có comment tùy chọn.
   - Cần check permission/user context kỹ, không cho user không có quyền duyệt/từ chối.

7. Nên xem code gốc Liferay để đối chiếu:
   - `portal-workflow-task-web`
   - `WorkflowTaskDisplayContext`
   - `WorkflowTaskSearch`
   - `WorkflowTaskResultRowSplitter`
   - `CompleteTaskMVCActionCommand`
   - `AssignTaskMVCResourceCommand`
   - `UpdateTaskMVCResourceCommand`
   - `portal-workflow-kaleo-*`
   - `journal-service` workflow handler
   - `message-boards/comment` workflow handler cho Comment

8. Dữ liệu cần hỗ trợ:
   - Web Content: `JournalArticle`.
   - Comment: thường qua `MBMessage` / `WorkflowableComment` / discussion comment.
   - Cần đọc Kaleo workflow/task/log để xác định task hiện tại, completed, completion user, transition cuối, và lịch sử approve/reject.
   - Cần ánh xạ trạng thái hiển thị rõ ràng:
     - `Chưa duyệt`: workflow task chưa completed và chưa hết hạn.
     - `Đã hết hạn duyệt`: workflow task chưa completed và dueDate đã qua.
     - `Đã duyệt`: asset status approved hoặc transition cuối approve.
     - `Đã từ chối`: asset status denied hoặc transition cuối reject/deny.
   - Nếu workflow hiện tại chưa có terminal `denied`, đánh giá và đề xuất sửa `custom-bundles/workflow/single-approver.xml` theo hướng tách `request_update` và `reject -> denied terminal`.

9. UI:
   - Giao diện admin, rõ ràng, dễ scan, tiếng Việt.
   - Không làm landing page.
   - Ưu tiên bảng dữ liệu dày, filter bar, tabs, badge trạng thái.
   - Có loading/error/empty state.
   - Có modal xác nhận duyệt/từ chối với ô nhập lý do.
   - Nếu thêm portlet/panel app, đặt tên tiếng Việt kiểu `Quản lý duyệt nội dung`.

10. Kiến trúc trong `custom-bundles/admin-ui`:
   - Tận dụng pattern sẵn có trong các module:
     - `webcontent/advancedsearch`
     - `audit`
     - `modulemanager`
     - các JAX-RS resource hiện có
     - các HTML/CSS/JS static resource dưới `META-INF/resources`
   - Tạo package mới phù hợp, ví dụ:
     `vn.vec.custom.admin.workflow`
     hoặc `vn.vec.custom.admin.workflowreview`.
   - Có REST resource cho list/search/filter/order/pagination, action approve/reject/assign.
   - Có portlet/panel app hoặc static admin page tương tự các màn hình custom hiện có.
   - Cẩn thận với dependency trong `build.gradle`; nếu cần thêm compileOnly jar Liferay thì chỉnh tối thiểu.
   - Không sửa ngoài `custom-bundles`.

11. Kiểm tra:
   - Chạy `git diff --check`.
   - Nếu build được custom bundle local thì chạy build; nếu thiếu Liferay libs/Blade/Gradle thì nói rõ chưa build được và nêu lệnh deploy/build server:
     `custom-bundles/deploy-admin-ui.sh --server`.
   - Không chạy lệnh phá hủy hoặc sửa source tham khảo `/Users/vietdau33/works/HTECom/default-liferay-portal`.

Nhiệm vụ ở lượt sau:
1. Đọc lại code hiện có trong `custom-bundles/admin-ui` và workflow XML.
2. Đối chiếu source gốc Liferay trong `/Users/vietdau33/works/HTECom/default-liferay-portal`.
3. Đề xuất kế hoạch phase 1/phase 2 ngắn gọn.
4. Sau đó triển khai phase 1 trong `custom-bundles/admin-ui`.
5. Nếu cần sửa workflow để hỗ trợ trạng thái từ chối rõ ràng, đề xuất hoặc chỉnh luôn trong `custom-bundles/workflow/single-approver.xml` theo hướng an toàn.
