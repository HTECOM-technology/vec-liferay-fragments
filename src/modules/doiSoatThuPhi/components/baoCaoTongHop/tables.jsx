import React from "react";
import { Table } from "antd";
import { StatusBadge } from "./styled";

const renderStatus = (trangThai) => (
  <StatusBadge $type={trangThai}>
    {trangThai === "done" ? "Đã xử lý" : "Đang xử lý"}
  </StatusBadge>
);

const renderMultiLine = (text) => (
  <span style={{ whiteSpace: "pre-line", fontSize: 13 }}>{text}</span>
);

/* ---- Thông báo sự cố ---- */
export const suCoColumns = [
  { title: "STT", dataIndex: "key", key: "key", width: 60, align: "center" },
  { title: "Loại sự cố", dataIndex: "loai", key: "loai", align: "center" },
  { title: "Tuyến", dataIndex: "tuyen", key: "tuyen", align: "center" },
  { title: "Trạm", dataIndex: "tram", key: "tram", align: "center" },
  { title: "Thời gian", dataIndex: "thoiGian", key: "thoiGian", align: "center" },
  {
    title: "Trạng thái",
    dataIndex: "trangThai",
    key: "trangThai",
    align: "center",
    render: renderStatus,
  },
];

/* ---- Thông tin sự kiện ---- */
export const suKienColumns = [
  { title: "STT", dataIndex: "key", key: "key", width: 60, align: "center" },
  { title: "Tên sự kiện", dataIndex: "tenSuKien", key: "tenSuKien" },
  { title: "Loại sự kiện", dataIndex: "loai", key: "loai", align: "center" },
  { title: "Tuyến", dataIndex: "tuyen", key: "tuyen", align: "center" },
  { title: "Trạm", dataIndex: "tram", key: "tram", align: "center" },
  { title: "Người tạo", dataIndex: "nguoiTao", key: "nguoiTao", align: "center" },
  {
    title: "Ngày tạo",
    dataIndex: "ngayTao",
    key: "ngayTao",
    align: "center",
    render: renderMultiLine,
  },
  {
    title: "Ngày cập nhật",
    dataIndex: "ngayCapNhat",
    key: "ngayCapNhat",
    align: "center",
    render: renderMultiLine,
  },
  {
    title: "Trạng thái",
    dataIndex: "trangThai",
    key: "trangThai",
    align: "center",
    render: renderStatus,
  },
];

/* ---- Thông tin lỗi ---- */
export const loiColumns = [
  { title: "STT", dataIndex: "key", key: "key", width: 60, align: "center" },
  { title: "Tên yêu cầu", dataIndex: "tenYeuCau", key: "tenYeuCau" },
  { title: "Loại lỗi", dataIndex: "loaiLoi", key: "loaiLoi", align: "center" },
  { title: "Tuyến", dataIndex: "tuyen", key: "tuyen", align: "center" },
  { title: "Trạm", dataIndex: "tram", key: "tram", align: "center" },
  { title: "Người tạo", dataIndex: "nguoiTao", key: "nguoiTao", align: "center" },
  {
    title: "Ngày tạo",
    dataIndex: "ngayTao",
    key: "ngayTao",
    align: "center",
    render: renderMultiLine,
  },
  {
    title: "Ngày cập nhật",
    dataIndex: "ngayCapNhat",
    key: "ngayCapNhat",
    align: "center",
    render: renderMultiLine,
  },
  {
    title: "Trạng thái",
    dataIndex: "trangThai",
    key: "trangThai",
    align: "center",
    render: renderStatus,
  },
];

export const commonTableProps = {
  pagination: false,
  bordered: true,
  size: "small",
};
