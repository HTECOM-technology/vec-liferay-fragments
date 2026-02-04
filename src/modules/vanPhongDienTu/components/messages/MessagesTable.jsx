import React, { useMemo } from "react";
import {
  FileWordOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { CTable } from "../../../../components/common";
import { TableWrap, AttachmentTag } from "../../style";
import { mockMessagesData } from "./constants";

function MessagesTable({ dataSource = mockMessagesData }) {
  const renderAttachment = (attachment) => {
    if (!attachment) return "-";

    const getIcon = (type) => {
      switch (type) {
        case "word":
          return <FileWordOutlined style={{ color: "#1890ff", fontSize: 16 }} />;
        case "pdf":
          return <FilePdfOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />;
        case "excel":
          return <FileExcelOutlined style={{ color: "#52c41a", fontSize: 16 }} />;
        default:
          return <PaperClipOutlined style={{ fontSize: 16 }} />;
      }
    };

    return (
      <AttachmentTag $type={attachment.type}>
        {getIcon(attachment.type)}
        <span>{attachment.name} ({attachment.size})</span>
      </AttachmentTag>
    );
  };

  const columns = useMemo(
    () => [
      {
        title: "",
        dataIndex: "icon",
        key: "icon",
        width: 50,
        align: "center",
        render: () => <PaperClipOutlined style={{ color: "#bfbfbf", fontSize: 16 }} />,
      },
      {
        title: "Người gửi",
        dataIndex: "nguoiGui",
        key: "nguoiGui",
        width: 150,
      },
      {
        title: "Tiêu đề",
        dataIndex: "tieuDe",
        key: "tieuDe",
        render: (text) => (
          <a style={{ color: "#1890ff" }} href="#">
            {text}
          </a>
        ),
      },
      {
        title: "Tệp đính kèm",
        dataIndex: "tepDinhKem",
        key: "tepDinhKem",
        width: 250,
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
    []
  );

  return (
    <TableWrap>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1200, y: 400 }}
        pagination={false}
        size="small"
      />
    </TableWrap>
  );
}

export default MessagesTable;
