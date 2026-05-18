import React, { useMemo } from "react";
import { CTable, CTag } from "../../../components/common";
import { TableWrap } from "../style";
import { STATUS_MAP, mockDataReconciliation } from "./constants";

function DataReconciliationTable({ dataSource = mockDataReconciliation, onView }) {
  const columns = useMemo(
    () => [
      { title: "STT", dataIndex: "stt", key: "stt", width: 60, align: "center" },
      { title: "Loại giao dịch lệch", dataIndex: "loaiGDLech", key: "loaiGDLech", width: 80 },
      {
        title: "Etag",
        dataIndex: "etag",
        key: "etag",
        width: 100,
        render: (val) => (val === "-" ? val : val.split("\n").map((l, i) => <div key={i}>{l}</div>)),
      },
      { title: "BKSND", dataIndex: "bksnd", key: "bksnd", width: 90 },
      { title: "BKSDK", dataIndex: "bksdk", key: "bksdk", width: 90 },
      { title: "Mã GD BE", dataIndex: "maGDBE", key: "maGDBE", width: 90 },
      { title: "Loại xe", dataIndex: "loaiXe", key: "loaiXe", width: 80, align: "center" },
      { title: "Loại GD", dataIndex: "loaiGD", key: "loaiGD", width: 80 },
      { title: "Mệnh giá", dataIndex: "menhGia", key: "menhGia", width: 80, align: "center" },
      { title: "TG vào", dataIndex: "tgVao", key: "tgVao", width: 100 },
      { title: "Trạm vào", dataIndex: "tramVao", key: "tramVao", width: 90 },
      { title: "Làn vào", dataIndex: "lanVao", key: "lanVao", width: 80, align: "center" },
      {
        title: "TG ra",
        dataIndex: "tgRa",
        key: "tgRa",
        width: 120,
        render: (val) => (val === "-" ? val : val.split(" ").map((l, i) => <div key={i}>{l}</div>)),
      },
      { title: "Trạm ra", dataIndex: "tramRa", key: "tramRa", width: 90 },
      { title: "Làn ra", dataIndex: "lanRa", key: "lanRa", width: 70, align: "center" },
      {
        title: "Trạng thái giải trình",
        dataIndex: "trangThaiGiaiTrinh",
        key: "trangThaiGiaiTrinh",
        width: 140,
        render: (key) => {
          const s = STATUS_MAP[key];
          return s ? <CTag color={s.color}>{s.label}</CTag> : key;
        },
      },
      {
        title: "Trạng thái ghi nhận",
        dataIndex: "trangThaiGhiNhan",
        key: "trangThaiGhiNhan",
        width: 130,
        render: (val) => (val !== "-" ? <CTag color="green">{val}</CTag> : val),
      },
      { title: "Giải trình nhanh", dataIndex: "giaiTrinhNhanh", key: "giaiTrinhNhanh", width: 140 },
      {
        title: "Thao tác",
        key: "action",
        width: 80,
        align: "center",
        render: (_, record) => (
          <svg style={{ cursor: "pointer" }} onClick={() => (onView ? onView(record) : console.log("View", record))} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.12533 10.0002C8.12533 8.96463 8.96479 8.12516 10.0003 8.12516C11.0359 8.12516 11.8753 8.96463 11.8753 10.0002C11.8753 11.0357 11.0359 11.8752 10.0003 11.8752C8.96479 11.8752 8.12533 11.0357 8.12533 10.0002Z" fill="#0090CF" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.66699 10.0002C1.66699 11.3663 2.02113 11.8264 2.7294 12.7466C4.14363 14.5839 6.51542 16.6668 10.0003 16.6668C13.4852 16.6668 15.857 14.5839 17.2712 12.7466C17.9795 11.8264 18.3337 11.3663 18.3337 10.0002C18.3337 8.63402 17.9795 8.17393 17.2712 7.25377C15.857 5.41646 13.4852 3.3335 10.0003 3.3335C6.51542 3.3335 4.14363 5.41646 2.7294 7.25377C2.02113 8.17394 1.66699 8.63402 1.66699 10.0002ZM10.0003 6.87516C8.27444 6.87516 6.87533 8.27427 6.87533 10.0002C6.87533 11.7261 8.27444 13.1252 10.0003 13.1252C11.7262 13.1252 13.1253 11.7261 13.1253 10.0002C13.1253 8.27427 11.7262 6.87516 10.0003 6.87516Z"
              fill="#0090CF"
            />
          </svg>
        ),
      },
    ],
    [onView],
  );

  return (
    <TableWrap>
      <CTable columns={columns} dataSource={dataSource} scroll={{ x: 1500, y: 470 }} pagination={false} size="small" />
    </TableWrap>
  );
}

export default DataReconciliationTable;
