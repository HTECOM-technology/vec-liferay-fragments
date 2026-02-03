export const STATUS_MAP = {
  approved: { label: "Đã duyệt", color: "green" },
  notExplained: { label: "Chưa giải trình", color: "orange" },
  confirmed: { label: "Đã xác nhận", color: "purple" },
  explained: { label: "Đã giải trình", color: "blue" },
};

export const LOAI_GD_LECH_OPTIONS = [
  { value: "L01", label: "L01 - Có ở GSTP, không có ở BC" },
  { value: "L02", label: "L02 - Không có ở GSTP, có ở BC" },
];

export const mockDataReconciliation = Array.from({ length: 10 }, (_, i) => ({
  key: i + 1,
  stt: i + 1,
  loaiGDLech: "L01",
  etag:
    i % 3 === 0
      ? "341021468957\n100084167125"
      : i % 3 === 1
        ? "3416214B88EA\nF90004291513"
        : "-",
  bksnd: i % 2 === 0 ? "18D11406" : "-",
  bksdk: i === 0 ? "18D11406" : "-",
  maGDBE: "-",
  loaiXe: i % 2 === 0 ? "1" : "-",
  loaiGD: "MTC",
  menhGia: "0",
  tgVao: "-",
  tramVao: "-",
  lanVao: "-",
  tgRa: "30/12/2025 23:16:25",
  tramRa: ["Phố Lu", "IC13", "IC9"][i % 3],
  lanRa: ["7", "4", "2"][i % 3],
  trangThaiGiaiTrinh: ["approved", "notExplained", "confirmed", "explained", "approved"][i % 5],
  trangThaiGhiNhan: i % 4 === 3 || i % 4 === 1 ? "Ghi nhận 1" : "-",
  giaiTrinhNhanh: i === 4 ? "Xe tang lễ BKS 24H03323V" : "-",
}));

export const mockDataReport = Array.from({ length: 10 }, (_, i) => ({
  key: i + 1,
  stt: i + 1,
  ngay: "28/12/2025",
  tuyen: "Nội bài - Lào Cai",
  tram: "Km6",
  coGstpKhongBC: 0,
  khongGstpCoBC: 0,
  saiChang: 0,
  saiLoaiXe: i === 0 ? 1 : 0,
  saiMenhGia: 0,
  saiThoiGian: 0,
  saiBienSo: 0,
  saiEtag: 0,
}));
