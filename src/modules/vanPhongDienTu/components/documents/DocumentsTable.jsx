import React, { useMemo } from "react";
import { Space } from "antd";
import { CTable, CTag } from "../../../../components/common";
import { mockDocumentsData, DOCUMENT_STATUS_MAP } from "./constants";

function DocumentsTable({ dataSource = mockDocumentsData, onDocumentClick }) {
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
        render: (text, record) => (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onDocumentClick?.(record);
            }}
            style={{ color: "#1890ff", textDecoration: "none" }}
          >
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
          <Space size={6}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span>{text}</span>
          </Space>
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
    [onDocumentClick]
  );

  return (
    <div style={{ marginTop: 16 }}>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1400, y: 400 }}
        pagination={false}
        size="small"
      />
    </div>
  );
}

export default DocumentsTable;
