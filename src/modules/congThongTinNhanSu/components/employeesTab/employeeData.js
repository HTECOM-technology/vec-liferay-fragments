import dayjs from "dayjs";

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim()
    .toLowerCase();
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const parsedDate = dayjs(value);

  if (!parsedDate.isValid()) {
    return String(value);
  }

  return parsedDate.format("DD/MM/YYYY");
}

function getBirthMonth(value) {
  if (!value) {
    return null;
  }

  const parsedDate = dayjs(value);

  if (!parsedDate.isValid()) {
    return null;
  }

  return parsedDate.month() + 1;
}

function getBirthDay(value) {
  if (!value) {
    return null;
  }

  const parsedDate = dayjs(value);

  if (!parsedDate.isValid()) {
    return null;
  }

  return parsedDate.date();
}

function formatGenderLabel(value) {
  const normalized = String(value || "").trim();

  if (normalized === "1") {
    return "Nam";
  }

  if (normalized === "2") {
    return "Nữ";
  }

  return value || "-";
}

function formatStatusLabel(value) {
  const normalized = String(value || "").trim().toUpperCase();

  const statusMap = {
    LV: "Đang làm việc",
    NV: "Đã nghỉ việc",
    CTV: "Cộng tác viên",
    NH: "Nghỉ hưu",
    TV: "Thử việc",
    TS: "Thai sản",
  };

  return statusMap[normalized] || value || "-";
}

export function mapEmployeeRecord(item = {}) {
  const fullName = [item.ho_nv, item.ten_nv].filter(Boolean).join(" ").trim();
  const departmentName = item.department?.ten_bp || "-";
  const positionName = item.position?.ten_vtr || "-";
  const unitCode = item.ma_dvcs || "-";
  const genderLabel = formatGenderLabel(item.gioi_tinh);
  const statusLabel = formatStatusLabel(item.tinh_trang_nv);

  return {
    id: item.stt_rec || item.ma_nv || `${item.ho_nv || ""}-${item.ten_nv || ""}`,
    stt: item.stt ?? null,
    maNV: item.ma_nv || "-",
    hoTen: fullName || "-",
    gioiTinh: genderLabel,
    gioiTinhValue: String(item.gioi_tinh || ""),
    chucVu: positionName,
    chucVuValue: item.position?.ma_vtr || normalizeText(positionName),
    phongBan: departmentName,
    phongBanValue: item.department?.ma_bp || item.bp_ref || normalizeText(departmentName),
    donVi: unitCode,
    donViValue: normalizeText(unitCode),
    ngaySinh: formatDate(item.ngay_sinh),
    ngaySinhMonth: getBirthMonth(item.ngay_sinh),
    ngaySinhDay: getBirthDay(item.ngay_sinh),
    dienThoai: item.dien_thoai_dd || "-",
    tinhTrang: statusLabel,
    tinhTrangValue: String(item.tinh_trang_nv || "").trim().toUpperCase(),
    raw: item,
  };
}

export function buildSelectOptions(items = [], valueKey, labelKey, placeholderLabel) {
  const optionsMap = new Map();

  items.forEach((item) => {
    const value = item?.[valueKey];
    const label = item?.[labelKey];

    if (!value || !label) {
      return;
    }

    optionsMap.set(String(value), {
      value: String(value),
      label: String(label),
    });
  });

  return [
    { value: "", label: placeholderLabel },
    ...Array.from(optionsMap.values()).sort((a, b) => a.label.localeCompare(b.label, "vi")),
  ];
}

export function buildSelectOptionsFromEmployees(items = [], valueKey, labelKey, placeholderLabel) {
  const optionsMap = new Map();

  items.forEach((item) => {
    const value = item?.[valueKey];
    const label = item?.[labelKey];

    if (!value || !label || label === "-") {
      return;
    }

    optionsMap.set(String(value), {
      value: String(value),
      label: String(label),
    });
  });

  return [
    { value: "", label: placeholderLabel },
    ...Array.from(optionsMap.values()).sort((a, b) => a.label.localeCompare(b.label, "vi")),
  ];
}

export function matchesEmployeeFilters(employee, filters) {
  if (filters.chucVu && employee.chucVuValue !== filters.chucVu) {
    return false;
  }

  if (filters.phongBan && employee.phongBanValue !== filters.phongBan) {
    return false;
  }

  if (filters.donVi && employee.donViValue !== normalizeText(filters.donVi)) {
    return false;
  }

  if (filters.gioiTinh && employee.gioiTinhValue !== String(filters.gioiTinh)) {
    return false;
  }

  if (filters.tinhTrang && employee.tinhTrangValue !== String(filters.tinhTrang).trim().toUpperCase()) {
    return false;
  }

  return true;
}
