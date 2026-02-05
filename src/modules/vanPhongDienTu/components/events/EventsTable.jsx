import React, { useMemo } from "react";
import { CTable } from "../../../../components/common";
import { TableWrap } from "../../style";
import { mockEventsData } from "./constants";

function EventsTable({ dataSource = mockEventsData }) {
  const columns = useMemo(
    () => [
      {
        title: "Ngày tháng",
        dataIndex: "ngayThang",
        key: "ngayThang",
        width: 100,
        align: "center",
        render: (text) => {
          if (!text) return null;
          return text.split("\n").map((line, i) => <div key={i}>{line}</div>);
        },
      },
      {
        title: "Nội dung công việc",
        key: "noiDungCongViec",
        width: 300,
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              {record.noiDungCongViec} | {record.time}
            </div>
            <a href="#" style={{ color: "#1890ff" }}>
              {record.detail}
            </a>
          </div>
        ),
      },
      {
        title: "Chuẩn bị",
        dataIndex: "chuanBi",
        key: "chuanBi",
        width: 150,
      },
      {
        title: "Thành phần tham gia",
        dataIndex: "thanhPhanThamGia",
        key: "thanhPhanThamGia",
        width: 180,
      },
      {
        title: "Địa điểm",
        dataIndex: "diaDiem",
        key: "diaDiem",
        width: 200,
      },
      {
        title: "Chủ trì",
        dataIndex: "chuTri",
        key: "chuTri",
        width: 180,
        render: (text) => {
          if (text === "-") return text;
          return text.split("\n").map((line, i) => <div key={i}>{line}</div>);
        },
      },
    ],
    []
  );

  return (
    <TableWrap>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1400, y: 400 }}
        pagination={false}
        size="small"
      />
    </TableWrap>
  );
}

export default EventsTable;
