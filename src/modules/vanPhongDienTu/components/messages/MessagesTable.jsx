import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  FileWordOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  PaperClipOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Space, Tag, Grid } from "antd";
import { CTable } from "../../../../components/common";
import { TableContainer } from "../../style";
import { mockMessagesData } from "./constants";

const { useBreakpoint } = Grid;

function MessagesTable({ dataSource = mockMessagesData, onMessageClick }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const renderAttachment = (attachment) => {
    if (!attachment) return "-";

    const getIconColor = (type) => {
      switch (type) {
        case "word": return "#1890ff";
        case "pdf": return "#ff4d4f";
        case "excel": return "#52c41a";
        default: return "rgba(0, 0, 0, 0.45)";
      }
    };

    const getIcon = (type) => {
      const color = getIconColor(type);
      switch (type) {
        case "word": return <FileWordOutlined style={{ color }} />;
        case "pdf": return <FilePdfOutlined style={{ color }} />;
        case "excel": return <FileExcelOutlined style={{ color }} />;
        default: return <PaperClipOutlined style={{ color }} />;
      }
    };

    const tagColors = {
      word: { bg: "#e6f7ff", border: "#91d5ff" },
      pdf: { bg: "#fff1f0", border: "#ffa39e" },
      excel: { bg: "#f6ffed", border: "#b7eb8f" },
      default: { bg: "#f5f5f5", border: "#d9d9d9" },
    };
    const colors = tagColors[attachment.type] || tagColors.default;

    return (
      <Tag
        style={{
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          padding: "4px 12px",
        }}
      >
        <Space size={6}>
          {getIcon(attachment.type)}
          <span>{attachment.name}</span>
          <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>({attachment.size})</span>
        </Space>
      </Tag>
    );
  };

  const mobileColumns = useMemo(
    () => [
      {
        title: "Tiêu đề",
        dataIndex: "tieuDe",
        key: "tieuDe",
        align: "left",
        render: (text, record) => (
          <button
            onClick={() => onMessageClick && onMessageClick(record)}
            style={{ 
              color: "#1890ff", 
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              textDecoration: "none",
              textAlign: "left"
            }}
            type="button"
          >
            {text}
          </button>
        ),
      },
      {
        title: "Ngày",
        dataIndex: "ngay",
        key: "ngay",
        align: "center",
      },
    ],
    [onMessageClick]
  );

  const desktopColumns = useMemo(
    () => [
      {
        title: "Người gửi",
        dataIndex: "nguoiGui",
        key: "nguoiGui",
        width: 200,
        render: (text) => (
          <Space size={8}>
            <MailOutlined style={{ color: "#bfbfbf", fontSize: 16 }} />
            <span>{text}</span>
          </Space>
        ),
      },
      {
        title: "Tiêu đề",
        dataIndex: "tieuDe",
        key: "tieuDe",
        flex: 1,
        minWidth: 400,
        align: "center",
        render: (text, record) => (
          <button
            onClick={() => onMessageClick && onMessageClick(record)}
            style={{ 
              color: "#1890ff", 
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              textDecoration: "none"
            }}
            type="button"
          >
            {text}
          </button>
        ),
      },
      {
        title: "Tệp đính kèm",
        dataIndex: "tepDinhKem",
        key: "tepDinhKem",
        width: 240,
        align: "center",
        render: renderAttachment,
      },
      {
        title: "Ngày",
        dataIndex: "ngay",
        key: "ngay",
        width: 120,
        align: "center",
      },
    ],
    [onMessageClick]
  );

  const columns = isMobile ? mobileColumns : desktopColumns;

  return (
    <TableContainer>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={isMobile ? undefined : { x: 1200, y: 'calc(100vh - 440px)' }}
        pagination={false}
        size="small"
      />
    </TableContainer>
  );
}
MessagesTable.propTypes = {
  dataSource: PropTypes.array,
  onMessageClick: PropTypes.func,
};

MessagesTable.defaultProps = {
  dataSource: mockMessagesData,
  onMessageClick: null,
};


export default MessagesTable;
