export const CALENDAR_GROUPS = [
  { key: "ban-lanh-dao", label: "Ban lãnh đạo" },
  { key: "dang-uy-vec", label: "Đảng ủy VEC" },
  { key: "ban-kiem-soat", label: "Ban Kiểm soát" },
  { key: "tong-hop-cac-phong", label: "Tổng hợp các phòng" },
  { key: "trung-tam-cntt", label: "Trung tâm CNTT" },
  { key: "tt-gsktvh", label: "TT GSKTVH đường cao tốc Việt Nam" },
  { key: "tt-vhkt-danang", label: "TT VHKT Đà Nẵng - Quảng Ngãi" },
  { key: "ban-qlda-bac", label: "Ban QLDA các đường cao tốc phía Bắc" },
  { key: "ban-qlda-nam", label: "Ban QLDA các đường cao tốc phía Nam" },
  { key: "ban-qlda-danang", label: "Ban QLDA Đà Nẵng - Quảng Ngãi" },
];

export const EVENT_FILTER_OPTIONS = [
  { value: "all", label: "Tất cả lãnh đạo" },
];

export const PARTICIPANT_FILTER_OPTIONS = [
  { value: "all", label: "Tất cả người tham gia" },
];

export const MONTHS = [
  { value: 1, label: "Tháng 1" },
  { value: 2, label: "Tháng 2" },
  { value: 3, label: "Tháng 3" },
  { value: 4, label: "Tháng 4" },
  { value: 5, label: "Tháng 5" },
  { value: 6, label: "Tháng 6" },
  { value: 7, label: "Tháng 7" },
  { value: 8, label: "Tháng 8" },
  { value: 9, label: "Tháng 9" },
  { value: 10, label: "Tháng 10" },
  { value: 11, label: "Tháng 11" },
  { value: 12, label: "Tháng 12" },
];

export const YEARS = [
  { value: 2024, label: "2024" },
  { value: 2025, label: "2025" },
  { value: 2026, label: "2026" },
  { value: 2027, label: "2027" },
];

export const HOST_OPTIONS = [
  { value: "ct-hdtv", label: "Chủ tịch HĐTV" },
  { value: "tgd", label: "TGĐ" },
  { value: "ptgd-nam", label: "PTGĐ - Đảng Hoài Nam" },
  { value: "ptgd-hung", label: "PTGĐ - Kiều Hưng" },
  { value: "ct-cd", label: "CT CĐ" },
];

export const NOTIFICATION_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "leader", label: "Ban lãnh đạo" },
  { value: "department", label: "Các phòng ban" },
];

export const mockEventsData = [
  // Hôm nay 06/01 - Sáng (2 events)
  {
    key: 1,
    ngay: "Hôm nay\n06/01",
    buoi: "Sáng",
    noiDungCongViec: "Chủ tịch HĐTV - Trương Việt Dũng",
    time: "08:00 AM",
    detail: "Dự Hội nghị Người lao động VEC",
    chuanBi: "-",
    thanhPhanThamGia: "CT HĐTV và TGĐ",
    diaDiem: "Hội trường T5",
    chuTri: "TGĐ, CT CĐ",
  },
  {
    key: 2,
    ngay: "",
    buoi: "",
    noiDungCongViec: "PTGĐ - Đảng Hoài Nam",
    time: "08:00 AM",
    detail: "Làm việc với Vụ KHTC và Cục KT QLXD Bộ XD",
    chuanBi: "Ban TCKT, Ban TD",
    thanhPhanThamGia: "Ban TCKT, TD, Ban DNGN",
    diaDiem: "Bộ XD",
    chuTri: "-",
  },
  
  // Hôm nay 06/01 - Chiều (3 events)
  {
    key: 3,
    ngay: "",
    buoi: "Chiều",
    noiDungCongViec: "Chủ tịch HĐTV - Trương Việt Dũng",
    time: "01:00 PM",
    detail: "Họp BTV ĐUVEC",
    chuanBi: "TCNS, VP Đảng Đoàn",
    thanhPhanThamGia: "Kinh mời các d/c UV BTV",
    diaDiem: "Phòng họp trục tuyến tầng 2 - Trụ sở VEC",
    chuTri: "Đ/c Trương Việt Dũng\nBí thư Đảng ủy VEC",
  },
  {
    key: 4,
    ngay: "",
    buoi: "",
    noiDungCongViec: "TGĐ - Phạm Hồng Quang",
    time: "01:00 PM",
    detail: "Họp BTV ĐUVEC",
    chuanBi: "TCNS, VP Đảng Đoàn",
    thanhPhanThamGia: "Kinh mời các d/c UV BTV",
    diaDiem: "Phòng họp trục tuyến tầng 2 - Trụ sở VEC",
    chuTri: "Đ/c Trương Việt Dũng\nBí thư Đảng ủy VEC",
  },
  {
    key: 5,
    ngay: "",
    buoi: "",
    noiDungCongViec: "TGĐ - Phạm Hồng Quang",
    time: "02:00 AM",
    detail: "Dự Hội nghị tổng kết công tác 2025, nhiệm vụ 2026 VEC",
    chuanBi: "-",
    thanhPhanThamGia: "Theo GM",
    diaDiem: "Hội trường T5",
    chuTri: "CT HĐTV, TGĐ",
  },
  
  // Thứ 2 05/01 - Sáng (3 events)
  {
    key: 6,
    ngay: "Thứ 2\n05/01",
    buoi: "Sáng",
    noiDungCongViec: "Chủ tịch HĐTV - Trương Việt Dũng",
    time: "08:00 AM",
    detail: "Dự Hội nghị Người lao động VEC",
    chuanBi: "-",
    thanhPhanThamGia: "CT HĐTV và TGĐ",
    diaDiem: "Phòng làm việc của CT HĐTV",
    chuTri: "Đ/c Trương Việt Dũng\nChủ tịch HĐTV",
  },
  {
    key: 7,
    ngay: "",
    buoi: "",
    noiDungCongViec: "PTGĐ - Đảng Hoài Nam",
    time: "08:00 AM",
    detail: "Làm việc với Vụ KHTC và Cục KT QLXD Bộ XD",
    chuanBi: "Ban TCKT, Ban TD",
    thanhPhanThamGia: "Ban TCKT, TD, Đt, PC, Tổ 20E4, tư vấn",
    diaDiem: "Bộ XD",
    chuTri: "-",
  },
  {
    key: 8,
    ngay: "",
    buoi: "",
    noiDungCongViec: "TGĐ - Phạm Hồng Quang",
    time: "08:00 AM",
    detail: "Họp Tổ 20-E4",
    chuanBi: "Ban TCKT",
    thanhPhanThamGia: "Ban TCKT, TD, Đt, PC, Tổ 20E4, tư vấn",
    diaDiem: "Phòng họp trực tuyến tầng 2",
    chuTri: "PTGĐ Kiều Hưng",
  },
  
  // Thứ 2 05/01 - Chiều (2 events)
  {
    key: 9,
    ngay: "",
    buoi: "Chiều",
    noiDungCongViec: "PTGĐ - Kiều Hưng",
    time: "08:00 AM",
    detail: "Dự hội nghị BCH Đảng bộ VEC",
    chuanBi: "Ban TCKT",
    thanhPhanThamGia: "Ban TCKT, TD, Đt, PC, Tổ 20E4, tư vấn",
    diaDiem: "Phòng họp trực tuyến tầng 2",
    chuTri: "PTGĐ Kiều Hưng",
  },
  {
    key: 10,
    ngay: "",
    buoi: "",
    noiDungCongViec: "Chủ tịch HĐTV - Trương Việt Dũng",
    time: "01:00 PM",
    detail: "Họp BTV ĐUVEC",
    chuanBi: "TCNS, VP Đảng Đoàn",
    thanhPhanThamGia: "Kinh mời các d/c UV BTV",
    diaDiem: "Phòng họp trực tuyến tầng 2 - Trụ sở VEC",
    chuTri: "Đ/c Trương Việt Dũng\nBí thư Đảng ủy VEC",
  },
  {
    key: 11,
    ngay: "",
    buoi: "",
    noiDungCongViec: "TGĐ - Phạm Hồng Quang",
    time: "01:00 PM",
    detail: "Họp BTV ĐUVEC",
    chuanBi: "TCNS, VP Đảng Đoàn",
    thanhPhanThamGia: "Kinh mời các d/c UV BTV",
    diaDiem: "Phòng họp trực tuyến tầng 2 - Trụ sở VEC",
    chuTri: "Đ/c Trương Việt Dũng\nBí thư Đảng ủy VEC",
  },
  {
    key: 12,
    ngay: "",
    buoi: "",
    noiDungCongViec: "TGĐ - Phạm Hồng Quang",
    time: "02:00 AM",
    detail: "Dự Hội nghị tổng kết công tác 2025, nhiệm vụ 2026 VEC",
    chuanBi: "-",
    thanhPhanThamGia: "Theo GM",
    diaDiem: "Hội trường T5",
    chuTri: "CT HĐTV, TGĐ",
  },
];
