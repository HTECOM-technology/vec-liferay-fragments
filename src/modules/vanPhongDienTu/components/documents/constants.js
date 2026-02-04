export const DOCUMENT_TABS = [
  { key: "incoming", label: "Văn bản đến", icon: "📄" },
  { key: "outgoing", label: "Văn bản đi", icon: "📤" },
  { key: "approved", label: "VB đã phê", icon: "✓" },
  { key: "draft", label: "Dự thảo", icon: "✎" },
  { key: "internal", label: "VB nội bộ", icon: "📋" },
  { key: "internal-dept", label: "VB nội bộ phòng", icon: "📋" },
];

export const UNIT_OPTIONS = [
  { value: "all", label: "Chọn đơn vị" },
];

export const DOCUMENT_TYPE_OPTIONS = [
  { value: "all", label: "Loại văn bản" },
];

export const GROUP_NUMBER_OPTIONS = [
  { value: "all", label: "Nhóm số" },
];

export const ISSUING_UNIT_OPTIONS = [
  { value: "all", label: "Đơn vị ban hành" },
];

export const DOCUMENT_STATUS_OPTIONS = [
  { value: "all", label: "Trạng thái" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "processing", label: "Đang xử lý" },
];

export const DOCUMENT_STATUS_MAP = {
  "pending": { label: "Chờ xử lý", color: "orange" },
  "processing": { label: "Đang xử lý", color: "blue" },
};

export const mockDocumentsData = [
  {
    key: 1,
    ngayBanHanh: "13/01/2026",
    soHieu: "640-CVĐU",
    soDon: 640,
    trichYeu: "Phổ biến, quán triệt, triển khai thực hiện các VB của cấp ủy cấp trên Số: 640-CVĐU",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn phòng Đảng Đoàn",
    trangThai: "pending",
  },
  {
    key: 2,
    ngayBanHanh: "12/01/2026",
    soHieu: "86/VEC-QLKT",
    soDon: 45,
    trichYeu: "Xử lý các nội dung TASCO kiến nghị liên quan đến ảnh hưởng công tác thu phí tại các trạm thu phí đầu mối Công ty Luyến LC",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Ban Quản lý khai thác",
    trangThai: "pending",
  },
  {
    key: 3,
    ngayBanHanh: "09/01/2026",
    soHieu: "96/VEC-QLKT",
    soDon: 71,
    trichYeu: "Cung cấp thông tin, bài viết xây dựng cổng thông tin điện tử VEC",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn Phòng",
    trangThai: "pending",
  },
  {
    key: 4,
    ngayBanHanh: "09/01/2026",
    soHieu: "93/VEC-QLKT",
    soDon: 11,
    trichYeu: "V/v Phổ biến, quán triệt, triển khai thực hiện các văn bản của cấp ủy cấp trên",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn phòng Đảng Đoàn",
    trangThai: "pending",
  },
  {
    key: 5,
    ngayBanHanh: "09/01/2026",
    soHieu: "90/VEC-QLKT",
    soDon: 78,
    trichYeu: "Nghiên cứu giải pháp lưu trữ, đôi soát dữ liệu thu phí không dùng ETC tập trung theo đúng quy định",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn phòng Đảng Đoàn",
    trangThai: "pending",
  },
  {
    key: 6,
    ngayBanHanh: "09/01/2026",
    soHieu: "95/VEC-QLKT",
    soDon: 34,
    trichYeu: "Nghiên cứu giải pháp số hóa quy trình quản lý việc thanh toán dự án",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn phòng Đảng Đoàn",
    trangThai: "pending",
  },
  {
    key: 7,
    ngayBanHanh: "09/01/2026",
    soHieu: "88/VEC-QLKT",
    soDon: 80,
    trichYeu: "Nghiên cứu phương án nâng cấp trang bị hệ thống máy tính văn phòng Tổng công ty",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "VEC",
    trangThai: "pending",
  },
  {
    key: 8,
    ngayBanHanh: "09/01/2026",
    soHieu: "91/VEC-QLKT",
    soDon: 35,
    trichYeu: "Tăng cường công tác tuyên truyền nội dung Đề án chuyển đổi số của Tổng công ty",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn phòng Đảng Đoàn",
    trangThai: "pending",
  },
  {
    key: 9,
    ngayBanHanh: "09/01/2026",
    soHieu: "87/VEC-QLKT",
    soDon: 23,
    trichYeu: "Phối hợp Ban Tài chính-Kế toán cập nhật các dự án đầu tư Chuyển đổi số vào phương án tài chính của Tổng công ty",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn Phòng",
    trangThai: "pending",
  },
  {
    key: 10,
    ngayBanHanh: "09/01/2026",
    soHieu: "88/VEC-QLKT",
    soDon: 58,
    trichYeu: "Phối hợp Ban Kế hoạch kinh doanh bổ sung các dự án đầu tư Chuyển đổi số vào kế hoạch sản xuất kinh doanh năm 2023",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn Phòng",
    trangThai: "pending",
  },
  {
    key: 11,
    ngayBanHanh: "09/01/2026",
    soHieu: "94/VEC-QLKT",
    soDon: 22,
    trichYeu: "Thẩm mưu Trưởng Ban Chỉ đạo thực hiện kiện toán nhân sự Ban Chỉ đạo chuyển đổi số",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn phòng Đảng Đoàn",
    trangThai: "pending",
  },
  {
    key: 12,
    ngayBanHanh: "09/01/2026",
    soHieu: "97/VEC-QLKT",
    soDon: 44,
    trichYeu: "Nghiên cứu giải pháp quản lý tiến độ các dự án của Tổng công ty",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn phòng Đảng Đoàn",
    trangThai: "pending",
  },
];
