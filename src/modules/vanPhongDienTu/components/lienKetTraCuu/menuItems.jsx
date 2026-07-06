import React from "react";
import {
  IconTraCuuVBDi,
  IconTraCuuVBDen,
  IconXeOTo,
  IconXacNhanDiVe,
  IconPhongHop,
  IconLichDonVi,
  IconHoSoCongViec,
  IconGiaoViec,
  IconBaoCaoTHCaNhan,
  IconBaoCaoCTCaNhan,
  IconBaoCaoTHDonVi,
  IconBaoCaoXLVB,
} from "./icons";

export const menuItems = [
  { key: "tra-cuu-vb-di", label: "Tra cứu văn bản đi", icon: <IconTraCuuVBDi /> },
  { key: "tra-cuu-vb-den", label: "Tra cứu văn bản đến", icon: <IconTraCuuVBDen /> },
  { key: "dang-ky-xe-oto", label: "Đăng ký xe ô tô", icon: <IconXeOTo /> },
  {
    key: "xac-nhan-di-ve",
    label: "Xác nhận đi về",
    subLabel: "(Xác nhận sau khi sử dụng xe ô tô)",
    icon: <IconXacNhanDiVe />,
  },
  { key: "dang-ky-phong-hop", label: "Đăng ký phòng họp", icon: <IconPhongHop /> },
  { key: "lap-lich-don-vi", label: "Lập lịch đơn vị", icon: <IconLichDonVi /> },
  { key: "ho-so-cong-viec", label: "Hồ sơ công việc", icon: <IconHoSoCongViec /> },
  { key: "qlcv-giao-viec", label: "Quản lý công việc – Giao việc", icon: <IconGiaoViec /> },
  {
    key: "qlcv-bcth-ca-nhan",
    label: <>Quản lý công việc<br />Báo cáo tổng hợp cá nhân</>,
    icon: <IconBaoCaoTHCaNhan />,
  },
  {
    key: "qlcv-bcct-ca-nhan",
    label: <>Quản lý công việc<br />Báo cáo chi tiết cá nhân</>,
    icon: <IconBaoCaoCTCaNhan />,
  },
  {
    key: "qlcv-bcth-don-vi",
    label: <>Quản lý công việc<br />Báo cáo tổng hợp đơn vị</>,
    icon: <IconBaoCaoTHDonVi />,
  },
  { key: "bao-cao-xl-vb", label: "Báo cáo xử lý văn bản", icon: <IconBaoCaoXLVB /> },
];
