import React, { useMemo } from "react";
import { CTable, CTag } from "../../../../components/common";
import { TableWrap } from "../../style";
import { mockDocumentsData, DOCUMENT_STATUS_MAP } from "./constants";

function DocumentsTable({ dataSource = mockDocumentsData }) {
  const columns = useMemo(
    () => [
      {
        title: "Ngày ban hành",
        dataIndex: "ngayBanHanh",
        key: "ngayBanHanh",
        width: 120,
        align: "center",
      },
      {
        title: "Số hiệu",
        dataIndex: "soHieu",
        key: "soHieu",
        width: 150,
      },
      {
        title: "Số đơn",
        dataIndex: "soDon",
        key: "soDon",
        width: 80,
        align: "center",
      },
      {
        title: "Trích yếu",
        dataIndex: "trichYeu",
        key: "trichYeu",
        render: (text) => (
          <a href="#" style={{ color: "#1890ff" }}>
            {text}
          </a>
        ),
      },
      {
        title: "Người tạo",
        dataIndex: "nguoiTao",
        key: "nguoiTao",
        width: 150,
        render: (text) => (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: "Đơn vị ban hành",
        dataIndex: "donViBanHanh",
        key: "donViBanHanh",
        width: 180,
      },
      {
        title: "Trạng thái",
        dataIndex: "trangThai",
        key: "trangThai",
        width: 120,
        align: "center",
        render: (status) => {
          const statusConfig = DOCUMENT_STATUS_MAP[status];
          return statusConfig ? (
            <CTag color={statusConfig.color}>{statusConfig.label}</CTag>
          ) : null;
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

export default DocumentsTable;
