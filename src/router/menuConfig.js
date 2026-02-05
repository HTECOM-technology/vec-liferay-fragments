/**
 * Cấu hình path và menu cho MainLayout
 */
export const paths = {
  dangNhap: "/web/intranet/login",
  trangChu: "/web/intranet/",
  vanPhongDienTu: "/web/intranet/van-phong-dien-tu",
  doiSoatThuPhi: "/web/intranet/doi-soat-thu-phi",
  congThongTinNhanSu: "/web/intranet/cong-thong-tin-nhan-su",
  giamSatGiaoThong: "/web/intranet/giam-sat-giao-thong",
  tinTucSuKien: "/web/intranet/tin-tuc-su-kien",
  bieuMauTaiLieu: "/web/intranet/bieu-mau-tai-lieu",
  soTayNhanVien: "/web/intranet/so-tay-nhan-vien",
  khaoSatBieuQuyet: "/web/intranet/khao-sat-va-bieu-quyet-noi-bo",
  quyTrinhHoTro: "/web/intranet/quy-trinh-yeu-cau-ho-tro",
};

/**
 * Menu items theo path (dùng cho highlight active)
 */
export const menuItems = [
  { key: paths.trangChu, label: "Trang chủ" },
  { key: paths.vanPhongDienTu, label: "Văn phòng điện tử" },
  { key: paths.doiSoatThuPhi, label: "Đối soát thu phí" },
  { key: paths.congThongTinNhanSu, label: "Cổng thông tin nhân sự" },
  { key: paths.quyTrinhHoTro, label: "Quy trình - Yêu cầu hỗ trợ" },
  { key: paths.khaoSatBieuQuyet, label: "Khảo sát & biểu quyết nội bộ" },
];

/**
 * Cấu hình menu sidebar theo nhóm (key = path hoặc 'logout')
 */
export const menuSections = [
  {
    title: "Tổng quan",
    items: [{ key: paths.trangChu, label: "Trang chủ", icon: "home" }],
  },
  {
    title: "Quản lý liên kết",
    items: [
      { key: paths.vanPhongDienTu, label: "Văn phòng điện tử", icon: "desktop" },
      { key: paths.doiSoatThuPhi, label: "Đối soát thu phí", icon: "file-text" },
      { key: paths.congThongTinNhanSu, label: "Cổng thông tin nhân sự", icon: "team" },
      { key: paths.giamSatGiaoThong, label: "Giám sát giao thông", icon: "traffic" },
    ],
  },
  {
    title: "Thông tin khác",
    items: [
      { key: paths.tinTucSuKien, label: "Tin tức - Sự kiện", icon: "calendar" },
      { key: paths.bieuMauTaiLieu, label: "Biểu mẫu tài liệu", icon: "books" },
      { key: paths.soTayNhanVien, label: "Sổ tay nhân viên", icon: "document" },
      { key: "logout", label: "Đăng xuất", icon: "logout" },
    ],
  },
];
