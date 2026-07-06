import React, { useMemo } from "react";
import { Space, Grid } from "antd";
import { CTable, CTag } from "../../../../components/common";
import { mockDocumentsData, DOCUMENT_STATUS_MAP } from "./constants";

const { useBreakpoint } = Grid;

function DocumentsTable({ dataSource = mockDocumentsData, onDocumentClick }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: "Trích yếu",
        dataIndex: "trichYeu",
        key: "trichYeu",
        render: (text, record) => (
          <div style={{ wordBreak: "break-word" }}>
            <button
              type="button"
              onClick={() => {
                onDocumentClick?.(record);
              }}
              style={{
                color: "#1890ff",
                textDecoration: "none",
                fontSize: isMobile ? 13 : 14,
                display: "block",
                marginBottom: 4,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {text}
            </button>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {isMobile && record.soHieu && (
                <span style={{ fontSize: 12, color: "#666" }}>
                  {record.soHieu}
                </span>
              )}
              {isMobile && record.trangThai && (
                <CTag
                  color={DOCUMENT_STATUS_MAP[record.trangThai]?.color}
                  style={{ marginRight: 0 }}
                >
                  {DOCUMENT_STATUS_MAP[record.trangThai]?.label}
                </CTag>
              )}
            </div>
          </div>
        ),
      },
      {
        title: "Đơn vị ban hành",
        dataIndex: "donViBanHanh",
        key: "donViBanHanh",
        width: isMobile ? 120 : 180,
        render: (text) => (
          <span style={{ fontSize: isMobile ? 12 : 14 }}>{text}</span>
        ),
      },
    ];

    if (isMobile) {
      return baseColumns;
    }

    return [
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
      ...baseColumns,
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
    ];
  }, [onDocumentClick, isMobile]);

  return (
    <div style={{ marginTop: 16 }}>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: isMobile ? undefined : 1400, y: 400 }}
        pagination={false}
        size="small"
      />
    </div>
  );
}

export default DocumentsTable;
