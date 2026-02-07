import FileImportIcon from "../../../../assets/icon/file-import.svg";
import FileExportIcon from "../../../../assets/icon/file-export.svg";
import FileVerifiedIcon from "../../../../assets/icon/file-verified.svg";
import FileSecurityIcon from "../../../../assets/icon/file-security.svg";
import FolderSecurityIcon from "../../../../assets/icon/folder-security.svg";
import CatalogueIcon from "../../../../assets/icon/catalogue.svg";

const ICON_STYLE = { width: 16, height: 16 };

export const DOCUMENT_TABS = [
  {
    key: "incoming",
    label: "Văn bản đến",
    icon: <img src={FileImportIcon} alt="" style={ICON_STYLE} />,
  },
  {
    key: "outgoing",
    label: "Văn bản đi",
    icon: <img src={FileExportIcon} alt="" style={ICON_STYLE} />,
  },
  {
    key: "approved",
    label: "VB đã phê",
    icon: <img src={FileVerifiedIcon} alt="" style={ICON_STYLE} />,
  },
  {
    key: "draft",
    label: "Dự thảo",
    icon: <img src={FileSecurityIcon} alt="" style={ICON_STYLE} />,
  },
  {
    key: "internal",
    label: "VB nội bộ",
    icon: <img src={FolderSecurityIcon} alt="" style={ICON_STYLE} />,
  },
  {
    key: "internal-dept",
    label: "VB nội bộ phòng",
    icon: <img src={CatalogueIcon} alt="" style={ICON_STYLE} />,
  },
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
    soHieu: "640-CV/ĐU",
    soDon: 640,
    trichYeu: "Phổ biến, quán triệt, triển khai thực hiện các VB của cấp ủy cấp trên Số: 640-CV/ĐU",
    nguoiTao: "Nguyễn Văn A",
    donViBanHanh: "Văn phòng Đảng Đoàn",
    trangThai: "pending",
    trangThaiText: "Chờ xử lý",
    ngayTao: "13/01/2026 - 09:49:04 AM bởi Ngọc Cao Minh",
    soVanBan: "Công văn Đảng đi 2025 - 2030",
    capNhat: "–",
    soDiTheoSo: "640 /716",
    doKhan: "Thường",
    ngayHieuLuc: "13/01/2026 - 13/01/2027",
    quanTrong: "Thường",
    nguoiKy: "–",
    ngayKy: "–",
    luuTru: "Văn thư cơ quan",
    loaiVanBan: "2.Công văn",
    soanThao: "–",
    donViSoanThao: "Văn phòng Đảng Đoàn",
    donViTheoDoiChinh: "Văn phòng Đảng Đoàn",
    nguoiTheoDoi: "Quỳnh Mai Đức",
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
    trangThaiText: "Chờ xử lý",
    doKhan: "Khẩn",
    quanTrong: "Quan trọng",
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
    trangThaiText: "Chờ xử lý",
    doKhan: "Thường",
    quanTrong: "Thường",
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
    trangThaiText: "Chờ xử lý",
    doKhan: "Thường",
    quanTrong: "Thường",
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
    trangThaiText: "Chờ xử lý",
    doKhan: "Thường",
    quanTrong: "Thường",
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
    trangThaiText: "Chờ xử lý",
    doKhan: "Thường",
    quanTrong: "Thường",
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
