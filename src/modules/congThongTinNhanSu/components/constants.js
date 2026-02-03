import dayjs from "dayjs";

export const KPI_STATUS_OPTIONS = [
    { label: "Chưa đánh giá", value: "chua_danh_gia", color: "default" },
    { label: "Đã đánh giá", value: "da_danh_gia", color: "success" },
];

export const mockKPIData = Array.from({ length: 16 }).map((_, i) => ({
    id: i + 1,
    ky: "01/2026",
    maNV: `VEC${String(i + 1).padStart(4, "0")}`,
    hoTen: "Nguyễn Văn A",
    chucVu: i % 3 === 0 ? "Lái xe" : "Chuyên viên",
    phongBan: "Văn phòng",
    tuDanhGia: "-",
    banDanhGia: i === 0 || i === 3 ? "Văn phòng" : "-",
    xepLoai: "-",
    ngayDanhGia: "-",
    dienGiai: "-",
    trangThai: "chua_danh_gia",
    trangThaiLabel: "Chưa đánh giá",
}));

export const KY_DANH_GIA_OPTIONS = [
    { label: "Kỳ 1/2026", value: "01/2026" },
    { label: "Kỳ 2/2026", value: "02/2026" },
];

export const PHONG_BAN_OPTIONS = [
    { label: "Văn phòng", value: "van_phong" },
    { label: "Kế toán", value: "ke_toan" },
];

export const DON_VI_OPTIONS = [
    { label: "VEC", value: "vec" },
    { label: "VEC O&M", value: "vec_om" },
];
