
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

/** Giá trị phòng ban thuộc khối văn phòng (dùng cho nút Đánh giá KPI → handleEvaluateVP) */
export const PHONG_BAN_KHOI_VAN_PHONG = ["van_phong", "ke_toan"];

/** Giá trị phòng ban thuộc QLDA (dùng cho nút Đánh giá KPI → handleEvaluateQL) */
export const PHONG_BAN_QLDA = ["qlda", "ban_qlda_bac", "ban_qlda_nam", "ban_qlda_danang"];

/**
 * Phân loại phòng ban của user đang thao tác để chọn handler đánh giá KPI.
 * @param {string} phongBanValue - value phòng ban (vd: "van_phong", "qlda")
 * @returns {"vp" | "qlda" | null} "vp" = khối văn phòng, "qlda" = QLDA, null = không xác định
 */
export const getPhongBanGroup = (phongBanValue) => {
    if (!phongBanValue) return null;
    const v = String(phongBanValue).toLowerCase().trim();
    if (PHONG_BAN_KHOI_VAN_PHONG.some((p) => p === v)) return "vp";
    if (PHONG_BAN_QLDA.some((p) => p === v)) return "qlda";
    return null;
};

/**
 * Lấy phòng ban của user đang đăng nhập (để phân loại VP/QLDA).
 * TODO: Thay bằng AuthService.getCurrentUser()?.phongBan khi backend/Liferay trả về.
 * Hiện có thể set REACT_APP_USER_PHONG_BAN (vd: van_phong, qlda) để test.
 */
export const getCurrentUserPhongBan = () => {
    if (typeof process !== "undefined" && process.env?.REACT_APP_USER_PHONG_BAN) {
        return process.env.REACT_APP_USER_PHONG_BAN;
    }
    return null;
};
