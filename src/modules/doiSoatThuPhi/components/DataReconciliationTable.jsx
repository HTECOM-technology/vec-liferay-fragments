import React, { useMemo } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { CTable, CTag } from "../../../components/common";
import { TableWrap, ActionIconBtn } from "../style";
import { STATUS_MAP, mockDataReconciliation } from "./constants";

function DataReconciliationTable({ dataSource = mockDataReconciliation, onView }) {
  const columns = useMemo(
    () => [
      { title: "STT", dataIndex: "stt", key: "stt", width: 60, align: "center" },
      { title: "Loại giao dịch lệch", dataIndex: "loaiGDLech", key: "loaiGDLech", width: 120 },
      {
        title: "Etag",
        dataIndex: "etag",
        key: "etag",
        width: 140,
        render: (val) =>
          val === "-" ? val : val.split("\n").map((l, i) => <div key={i}>{l}</div>),
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
        render: (val) =>
          val === "-" ? val : val.split(" ").map((l, i) => <div key={i}>{l}</div>),
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
        fixed: "right",
        render: (_, record) => (
          <ActionIconBtn
            type="button"
            onClick={() => (onView ? onView(record) : console.log("View", record))}
            aria-label="Xem"
          >
            <EyeOutlined />
          </ActionIconBtn>
        ),
      },
    ],
    [onView]
  );

  return (
    <TableWrap>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1800, y: 480 }}
        pagination={false}
        size="small"
      />
    </TableWrap>
  );
}

export default DataReconciliationTable;
