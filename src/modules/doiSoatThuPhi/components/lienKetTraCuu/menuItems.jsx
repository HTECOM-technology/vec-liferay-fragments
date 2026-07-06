import React from "react";
import {
  IconDashboard,
  IconGiamSatGiaoDich,
  IconDoiSoatThuPhi,
  IconHoTroGiaiTrinh,
  IconYeuCauXuLyLoi,
  IconKPIHeThong,
  IconKPIVanHanh,
  IconBaoCaoThongKe,
} from "./icons";

export const menuItems = [
  { key: "dashboard-tong-hop", label: "Dashboard tổng hợp", icon: <IconDashboard /> },
  { key: "giam-sat-giao-dich", label: "Giám sát giao dịch", icon: <IconGiamSatGiaoDich /> },
  { key: "doi-soat-thu-phi", label: "Đối soát thu phí", icon: <IconDoiSoatThuPhi /> },
  { key: "ho-tro-giai-trinh", label: "Hỗ trợ giải trình", icon: <IconHoTroGiaiTrinh /> },
  { key: "yeu-cau-xu-ly-loi", label: "Yêu cầu xử lý lỗi", icon: <IconYeuCauXuLyLoi /> },
  { key: "kpi-he-thong", label: "KPI hệ thống thu phí", icon: <IconKPIHeThong /> },
  { key: "kpi-van-hanh", label: "KPI vận hành thu phí", icon: <IconKPIVanHanh /> },
  { key: "bao-cao-thong-ke", label: "Báo cáo thống kê", icon: <IconBaoCaoThongKe /> },
];
