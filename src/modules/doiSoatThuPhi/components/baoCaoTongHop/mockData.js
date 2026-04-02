import dayjs from "dayjs";

// Generate daily data from 2026-01-01 to 2026-03-31
function generateDailyData(startDate, endDate, minVal, maxVal) {
  const result = [];
  let current = dayjs(startDate);
  const end = dayjs(endDate);
  while (current.isBefore(end) || current.isSame(end, "day")) {
    const value = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    result.push({ date: current.format("YYYY-MM-DD"), value });
    current = current.add(1, "day");
  }
  return result;
}

export const rawLuuLuongData = generateDailyData("2026-01-01", "2026-03-31", 150000, 320000);
export const rawDoanhThuData = generateDailyData("2026-01-01", "2026-03-31", 8_000_000_000, 18_000_000_000);

export const mockSuCo = [
  { key: 1, loai: "Sự cố tại trạm", tuyen: "Đà Nẵng – Quảng Ngãi", tram: "Quảng Ngãi", thoiGian: "04/01/2026 - 08:13:00", trangThai: "done" },
  { key: 2, loai: "Đóng/ mở làn", tuyen: "Cầu Giẽ – Ninh Bình", tram: "Vực Vòng", thoiGian: "04/01/2026 - 08:13:00", trangThai: "done" },
  { key: 3, loai: "Đóng/ mở làn", tuyen: "Cầu Giẽ – Ninh Bình", tram: "Cao Bồ", thoiGian: "04/01/2026 - 08:13:00", trangThai: "done" },
  { key: 4, loai: "Sự cố tại trạm", tuyen: "Nội Bài – Lào Cai", tram: "Km237", thoiGian: "04/01/2026 - 08:13:00", trangThai: "processing" },
  { key: 5, loai: "Sự cố tại trạm", tuyen: "Đà Nẵng – Quảng Ngãi", tram: "Tam Kỳ", thoiGian: "04/01/2026 - 08:13:00", trangThai: "processing" },
  { key: 6, loai: "Sự cố tại trạm", tuyen: "Đà Nẵng – Quảng Ngãi", tram: "Km237", thoiGian: "04/01/2026 - 08:13:00", trangThai: "processing" },
];

export const mockSuKien = [
  {
    key: 1,
    tenSuKien: "Giải trình, làm rõ nguyên nhân lỗi dữ liệu thu phí ngày 12/12/2025",
    loai: "Sự kiện khác",
    tuyen: "Đà Nẵng – Quảng Ngãi",
    tram: "Quảng Ngãi",
    nguoiTao: "Tuyencv",
    ngayTao: "04/01/2026\n08:13:00",
    ngayCapNhat: "04/01/2026\n08:13:00",
    trangThai: "done",
  },
  {
    key: 2,
    tenSuKien: "Giải trình, làm rõ nguyên nhân lỗi dữ liệu thu phí ngày 12/12/2025",
    loai: "Sự kiện khác",
    tuyen: "Cầu Giẽ – Ninh Bình",
    tram: "Vực Vòng",
    nguoiTao: "Tuyencv",
    ngayTao: "04/01/2026\n08:13:00",
    ngayCapNhat: "04/01/2026\n08:13:00",
    trangThai: "done",
  },
];

export const mockLoi = [
  {
    key: 1,
    tenYeuCau: "TTP Liêm Tuyền: xe vào làn 2 không nhận",
    loaiLoi: "Máy tính thu phí sự cố",
    tuyen: "Đà Nẵng – Quảng Ngãi",
    tram: "Quảng Ngãi",
    nguoiTao: "Tuyencv",
    ngayTao: "04/01/2026\n08:13:00",
    ngayCapNhat: "04/01/2026\n08:13:00",
    trangThai: "done",
  },
  {
    key: 2,
    tenYeuCau: "TPP Dầu Giây: Down máy tính",
    loaiLoi: "Sự cố điện",
    tuyen: "Cầu Giẽ – Ninh Bình",
    tram: "Vực Vòng",
    nguoiTao: "Tuyencv",
    ngayTao: "04/01/2026\n08:13:00",
    ngayCapNhat: "04/01/2026\n08:13:00",
    trangThai: "done",
  },
  {
    key: 3,
    tenYeuCau: "TTP Liêm Tuyền: xe vào làn 2 không nhận",
    loaiLoi: "Máy tính thu phí sự cố",
    tuyen: "Đà Nẵng – Quảng Ngãi",
    tram: "Quảng Ngãi",
    nguoiTao: "Tuyencv",
    ngayTao: "04/01/2026\n08:13:00",
    ngayCapNhat: "04/01/2026\n08:13:00",
    trangThai: "done",
  },
  {
    key: 4,
    tenYeuCau: "TPP Dầu Giây: Down máy tính",
    loaiLoi: "Sự cố điện",
    tuyen: "Cầu Giẽ – Ninh Bình",
    tram: "Vực Vòng",
    nguoiTao: "Tuyencv",
    ngayTao: "04/01/2026\n08:13:00",
    ngayCapNhat: "04/01/2026\n08:13:00",
    trangThai: "done",
  },
  {
    key: 5,
    tenYeuCau: "TPP Dầu Giây: Down máy tính",
    loaiLoi: "Sự cố điện",
    tuyen: "Cầu Giẽ – Ninh Bình",
    tram: "Vực Vòng",
    nguoiTao: "Tuyencv",
    ngayTao: "04/01/2026\n08:13:00",
    ngayCapNhat: "04/01/2026\n08:13:00",
    trangThai: "done",
  },
];
