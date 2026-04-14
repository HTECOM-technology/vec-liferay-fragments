/**
 * Cấu hình path và menu cho MainLayout
 */
// export const paths = {
//   dangNhap: "login",
//   trangChu: "",
//   vanPhongDienTu: "van-phong-dien-tu",
//   doiSoatThuPhi: "doi-soat-thu-phi",
//   congThongTinNhanSu: "cong-thong-tin-nhan-su",
//   giamSatGiaoThong: "giam-sat-giao-thong",
//   tinTucSuKien: "tin-tuc-su-kien",
//   bieuMauTaiLieu: "bieu-mau-tai-lieu",
//   soTayNhanVien: "so-tay-nhan-vien",
//   khaoSatBieuQuyet: "khao-sat-va-bieu-quyet-noi-bo",
//   quyTrinhHoTro: "quy-trinh-yeu-cau-ho-tro",
// };

export const paths = {
  dangNhap: "/login",
  trangChu: "/",              // thay "" thành "/"
  vanPhongDienTu: "/van-phong-dien-tu",
  doiSoatThuPhi: "/doi-soat-thu-phi",
  congThongTinNhanSu: "/cong-thong-tin-nhan-su",
  giamSatGiaoThong: "/giam-sat-giao-thong",
  tinTucSuKien: "/tin-tuc-su-kien",
  bieuMauTaiLieu: "/bieu-mau-tai-lieu",
  soTayNhanVien: "/so-tay-nhan-vien",
  khaoSatBieuQuyet: "/khao-sat-va-bieu-quyet-noi-bo",
  quyTrinhHoTro: "/quy-trinh-yeu-cau-ho-tro",
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
      { key: paths.congThongTinNhanSu, label: "Thông tin nhân sự", icon: "team" },
      { key: paths.doiSoatThuPhi, label: "Đối soát thu phí", icon: "file-text" },
      { key: paths.giamSatGiaoThong, label: "Giám sát giao thông", icon: "traffic" },
    ],
  },
  {
    title: "Thông tin khác",
    items: [
      { key: paths.tinTucSuKien, label: "Tin tức - Sự kiện", icon: "calendar" },
      { key: paths.bieuMauTaiLieu, label: "Biểu mẫu tài liệu", icon: "books" },
      { key: paths.soTayNhanVien, label: "Sổ tay nhân viên", icon: "document" },
      { key: paths.khaoSatBieuQuyet, label: "Khảo sát nội bộ", icon: "rank" },
      { key: paths.quyTrinhHoTro, label: "Yêu cầu hỗ trợ", icon: "letter" },
      { key: "logout", label: "Đăng xuất", icon: "logout" },
    ],
  },
];
