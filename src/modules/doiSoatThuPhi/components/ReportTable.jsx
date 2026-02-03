import React from "react";
import { CTable } from "../../../components/common";
import { TableWrap } from "../style";
import { mockDataReport } from "./constants";

const columnsReport = [
  { title: "STT", dataIndex: "stt", key: "stt", width: 60, align: "center" },
  { title: "Ngày", dataIndex: "ngay", key: "ngay", width: 110 },
  { title: "Tuyến", dataIndex: "tuyen", key: "tuyen", width: 140 },
  { title: "Trạm", dataIndex: "tram", key: "tram", width: 80 },
  {
    title: "Giao dịch có ở GSTP, không có ở BC",
    dataIndex: "coGstpKhongBC",
    key: "coGstpKhongBC",
    width: 120,
    align: "center",
  },
  {
    title: "Giao dịch không có ở GSTP, có ở BC",
    dataIndex: "khongGstpCoBC",
    key: "khongGstpCoBC",
    width: 120,
    align: "center",
  },
  {
    title: "Loại xe",
    children: [
      { title: "Sai chặng", dataIndex: "saiChang", key: "saiChang", width: 90, align: "center" },
      { title: "Sai loại xe", dataIndex: "saiLoaiXe", key: "saiLoaiXe", width: 90, align: "center" },
      { title: "Sai mệnh giá", dataIndex: "saiMenhGia", key: "saiMenhGia", width: 100, align: "center" },
      { title: "Sai thời gian", dataIndex: "saiThoiGian", key: "saiThoiGian", width: 100, align: "center" },
      { title: "Sai biển số", dataIndex: "saiBienSo", key: "saiBienSo", width: 90, align: "center" },
      { title: "Sai Etag", dataIndex: "saiEtag", key: "saiEtag", width: 80, align: "center" },
    ],
  },
];

function ReportTable({ dataSource = mockDataReport }) {
  return (
    <TableWrap>
      <CTable
        columns={columnsReport}
        dataSource={dataSource}
        scroll={{ x: 1200 }}
        pagination={false}
        size="small"
      />
    </TableWrap>
  );
}

export default ReportTable;
