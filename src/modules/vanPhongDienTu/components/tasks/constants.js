export const TASK_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "today", label: "Hôm nay" },
  { key: "week", label: "Tuần này" },
  { key: "month", label: "Tháng này" },
];

export const ASSIGNOR_OPTIONS = [
  { value: "all", label: "Người giao việc" },
  { value: "nguyen-van-a", label: "Nguyễn Văn A" },
];

export const PROCESSOR_OPTIONS = [
  { value: "all", label: "Xử lý chính" },
];

export const COOPERATOR_OPTIONS = [
  { value: "all", label: "Phối hợp" },
];

export const TASK_STATUS_OPTIONS = [
  { value: "all", label: "Trạng thái" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "in-progress", label: "Đang thực hiện" },
  { value: "not-started", label: "Chưa bắt đầu" },
  { value: "overdue", label: "Quá hạn" },
];

export const TASK_STATUS_MAP = {
  "completed": { label: "Đã hoàn thành", color: "green" },
  "in-progress": { label: "Đang thực hiện", color: "blue" },
  "not-started": { label: "Chưa bắt đầu", color: "default" },
  "overdue": { label: "Quá hạn", color: "red" },
};

export const mockTasksData = [
  {
    key: 1,
    ngay: "09/01/2026",
    nhiemVu: "Theo dõi triển khai bổ sung 7 làn ETC",
    giaoViec: "Nguyễn Văn A",
    hanXuLy: "04/01/2026 - 09/01/2026",
    trangThai: "completed",
    xuLyChinh: "Ban CNTT",
    xuLyChinh2: "Trần Xuân Trí, Mai Hồng Quang",
  },
  {
    key: 2,
    ngay: "09/01/2026",
    nhiemVu: "Phê duyệt dự toán năm 2025",
    giaoViec: "Nguyễn Văn A",
    hanXuLy: "04/01/2026 - 09/01/2026",
    trangThai: "in-progress",
    xuLyChinh: "Ban Quản lý khai thác",
    xuLyChinh2: "Trần Xuân Trí, Mai Hồng Quang",
  },
  {
    key: 3,
    ngay: "09/01/2026",
    nhiemVu: "Rà soát các quy trình xử lý công việc nội bộ giữa các Ban của VEC để khái báo và cho phục vụ yêu cầu của Quy trình VACV Tổng công ty",
    giaoViec: "Nguyễn Văn A",
    hanXuLy: "04/01/2026 - 09/01/2026",
    trangThai: "not-started",
    xuLyChinh: "Ban CNTT",
    xuLyChinh2: "-",
  },
  {
    key: 4,
    ngay: "09/01/2026",
    nhiemVu: "Nghiên cứu giải pháp lưu trữ, đôi soát dữ liệu thu phí không dùng ETC tập trung theo đúng quy định",
    giaoViec: "Nguyễn Văn A",
    hanXuLy: "04/01/2026 - 09/01/2026",
    trangThai: "in-progress",
    xuLyChinh: "Ban CNTT",
    xuLyChinh2: "Trần Xuân Trí, Bùi Đình Tuấn, Lưu Đức Thành, Đạm Thị Lục",
  },
  {
    key: 5,
    ngay: "09/01/2026",
    nhiemVu: "Nghiên cứu giải pháp số hóa quy trình quản lý việc thanh toán dự án",
    giaoViec: "Nguyễn Văn A",
    hanXuLy: "04/01/2026 - 09/01/2026",
    trangThai: "in-progress",
    xuLyChinh: "Ban CNTT",
    xuLyChinh2: "Trần Xuân Trí, Hàn Mai Nga, Nguyễn Ngọc Đức",
  },
  {
    key: 6,
    ngay: "09/01/2026",
    nhiemVu: "Nghiên cứu phương án nâng cấp trang bị hệ thống máy tính văn phòng Tổng công ty",
    giaoViec: "Nguyễn Văn A",
    hanXuLy: "04/01/2026 - 09/01/2026",
    trangThai: "in-progress",
    xuLyChinh: "Ban CNTT",
    xuLyChinh2: "Trần Xuân Trí, Nguyễn Công Hùng",
  },
  {
    key: 7,
    ngay: "09/01/2026",
    nhiemVu: "Tăng cường công tác tuyên truyền nội dung Đề án chuyển đổi số của Tổng công ty",
    giaoViec: "Nguyễn Văn A",
    hanXuLy: "04/01/2026 - 09/01/2026",
    trangThai: "overdue",
    xuLyChinh: "Ban CNTT",
    xuLyChinh2: "Trần Xuân Trí, Mai Hồng Quang",
  },
  {
    key: 8,
    ngay: "09/01/2026",
    nhiemVu: "Phối hợp Ban Tài chính-Kế toán cập nhật các dự án đầu tư Chuyển đổi số vào phương án tài chính của Tổng công ty",
    giaoViec: "Nguyễn Văn A",
    hanXuLy: "04/01/2026 - 09/01/2026",
    trangThai: "not-started",
    xuLyChinh: "Ban CNTT",
    xuLyChinh2: "Trần Xuân Trí, Mai Hồng Quang",
  },
];
