import React from "react";
import {
  IconDangKyNghi,
  IconXacNhanCong,
  IconLamThemGio,
  IconKPIThang,
  IconDaoTao,
  IconChamCong,
  IconPhepNam,
  IconThongTinCaNhan,
  IconPhieuLuong,
  IconDanhSachNV,
  IconTuyenDung,
  IconBaoCaoNhanSu,
} from "./icons";

export const menuItems = [
  { key: "dang-ky-nghi", label: "Đăng ký nghỉ, vắng mặt, công tác", icon: <IconDangKyNghi /> },
  { key: "xac-nhan-cong", label: "Đăng ký xác nhận công", icon: <IconXacNhanCong /> },
  { key: "lam-them-gio", label: "Đăng ký làm thêm giờ", icon: <IconLamThemGio /> },
  { key: "kpi-thang", label: "Đánh giá KPI tháng", icon: <IconKPIThang /> },
  { key: "dang-ky-dao-tao", label: "Đăng ký đào tạo", icon: <IconDaoTao /> },
  { key: "cham-cong", label: "Xem bảng chấm công", icon: <IconChamCong /> },
  { key: "phep-nam", label: "Theo dõi phép năm", icon: <IconPhepNam /> },
  { key: "thong-tin-ca-nhan", label: "Cập nhật/ khai báo thông tin cá nhân", icon: <IconThongTinCaNhan /> },
  { key: "phieu-luong", label: "Xem phiếu lương", icon: <IconPhieuLuong /> },
  { key: "danh-sach-nv", label: "Xem danh sách nhân viên", icon: <IconDanhSachNV /> },
  { key: "tuyen-dung", label: "Yêu cầu tuyển dụng", icon: <IconTuyenDung /> },
  { key: "bao-cao-ns", label: "Các báo cáo nhân sự", icon: <IconBaoCaoNhanSu /> },
];
