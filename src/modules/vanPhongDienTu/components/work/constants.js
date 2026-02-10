export const WORK_SIDEBAR_ITEMS = [
  { key: "all", label: "Tất cả công việc" },
  { key: "primary", label: "Công việc xử lý chính" },
  { key: "support", label: "Công việc phối hợp" },
  { key: "assigned", label: "Công việc tôi giao" },
  { key: "follow", label: "Công việc theo dõi" },
  { key: "document", label: "Công việc xử lý VB" },
];

export const PROJECT_OPTIONS = [
  { value: "all", label: "Dự án" },
];

export const WORK_GROUP_OPTIONS = [
  { value: "all", label: "Nhóm công việc" },
];

export const WORK_ASSIGNOR_OPTIONS = [
  { value: "all", label: "Người giao việc" },
  { value: "nguyen-van-a", label: "Nguyễn Văn A" },
];

export const WORK_STATUS_OPTIONS = [
  { value: "all", label: "Trạng thái" },
  { value: "processing", label: "Chờ xử lý" },
  { value: "in-progress", label: "Đang thực hiện" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "pending", label: "Đang tạm dừng" },
  { value: "rejected", label: "Đã hủy bỏ" },
  { value: "overdue", label: "Quá hạn" },
];

export const WORK_STATUS_MAP = {
  "processing": { label: "Chưa bắt đầu", color: "default" },
  "in-progress": { label: "Đang thực hiện", color: "blue" },
  "completed": { label: "Đã hoàn thành", color: "green" },
  "pending": { label: "Đang tạm dừng", color: "orange" },
  "rejected": { label: "Đã hủy bỏ", color: "red" },
  "overdue": { label: "Quá hạn", color: "red" },
};

export const mockWorkPrimaryData = [
  {
    key: 1,
    stt: 1,
    nguoiGiaoViec: "Nguyễn Văn A",
    congViec: "vv Thay đổi thời gian dừa phần mềm VPĐT một vào hoạt động chính thức.",
    trangThai: "processing",
    ngayBatDau: "09/01/2026 - 12/01/2026",
    nhom: "Báo cáo",
    duAn: "Tên dự án",
    mucDoUuTien: "Cao",
    hanXuLy: "09/01/2026 - 12/01/2026",
    nguoiXuLyChinh: "Nguyễn Văn A",
    phoiHopXuLy: "Trần Xuân Trí, Mai Hồng Quang",
  },
  {
    key: 2,
    stt: 2,
    nguoiGiaoViec: "Nguyễn Văn A",
    congViec: "Re: vv Họp triển khai nhiệm vụ năm 2026",
    trangThai: "in-progress",
    ngayBatDau: "09/01/2026 - 12/01/2026",
    nhom: "Dự án",
    duAn: "Họp triển khai",
    mucDoUuTien: "Trung bình",
    hanXuLy: "09/01/2026 - 12/01/2026",
    nguoiXuLyChinh: "Nguyễn Văn B",
    phoiHopXuLy: "Trần Xuân Trí",
  },
  {
    key: 3,
    stt: 3,
    nguoiGiaoViec: "Nguyễn Văn A",
    congViec: "Chúc mừng sinh nhật CBCNV sinh ngày 09+10/1",
    trangThai: "completed",
    ngayBatDau: "09/01/2026 - 12/01/2026",
    nhom: "Sự kiện",
    duAn: "Sinh nhật",
    mucDoUuTien: "Thấp",
    hanXuLy: "09/01/2026 - 12/01/2026",
    nguoiXuLyChinh: "Nguyễn Văn C",
    phoiHopXuLy: "Mai Hồng Quang",
  },
];

export const mockWorkSupportData = [
  {
    key: 1,
    stt: 1,
    nguoiXuLyChinh: "Nguyễn Văn A",
    congViec: "vv Thay đổi thời gian dừa phần mềm VPĐT một vào hoạt động chính thức.",
    trangThai: "rejected",
    ngayBatDau: "09/01/2026 - 12/01/2026",
    nhom: "Báo cáo",
    duAn: "Phần mềm VPĐT",
    mucDoUuTien: "Cao",
    hanXuLy: "09/01/2026 - 12/01/2026",
    nguoiGiaoViec: "Trần Văn D",
    phoiHopXuLy: "Trần Xuân Trí, Mai Hồng Quang",
  },
  {
    key: 2,
    stt: 2,
    nguoiXuLyChinh: "Nguyễn Văn A",
    congViec: "Re: vv Họp triển khai nhiệm vụ năm 2026",
    trangThai: "pending",
    ngayBatDau: "09/01/2026 - 12/01/2026",
    nhom: "Dự án",
    duAn: "Nhiệm vụ 2026",
    mucDoUuTien: "Trung bình",
    hanXuLy: "09/01/2026 - 12/01/2026",
    nguoiGiaoViec: "Lê Văn E",
    phoiHopXuLy: "Mai Hồng Quang",
  },
  {
    key: 3,
    stt: 3,
    nguoiXuLyChinh: "Nguyễn Văn A",
    congViec: "Chúc mừng sinh nhật CBCNV sinh ngày 09+10/1",
    trangThai: "overdue",
    ngayBatDau: "09/01/2026 - 12/01/2026",
    nhom: "Sự kiện",
    duAn: "Sinh nhật tháng 1",
    mucDoUuTien: "Thấp",
    hanXuLy: "09/01/2026 - 12/01/2026",
    nguoiGiaoViec: "Phạm Văn F",
    phoiHopXuLy: "Trần Xuân Trí",
  },
];
