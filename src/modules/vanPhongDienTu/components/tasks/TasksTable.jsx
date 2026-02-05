import React, { useMemo } from "react";
import { CTable, CTag } from "../../../../components/common";
import { TableWrap } from "../../style";
import { mockTasksData, TASK_STATUS_MAP } from "./constants";

function TasksTable({ dataSource = mockTasksData }) {
  const columns = useMemo(
    () => [
      {
        title: "Ngày",
        dataIndex: "ngay",
        key: "ngay",
        width: 110,
        align: "center",
      },
      {
        title: "Nhiệm vụ",
        dataIndex: "nhiemVu",
        key: "nhiemVu",
        width: 350,
        render: (text) => (
          <a href="#" style={{ color: "#1890ff" }}>
            {text}
          </a>
        ),
      },
      {
        title: "Giao việc",
        dataIndex: "giaoViec",
        key: "giaoViec",
        width: 150,
        render: (text) => (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: "Hạn xử lý",
        dataIndex: "hanXuLy",
        key: "hanXuLy",
        width: 180,
        align: "center",
      },
      {
        title: "Trạng thái",
        dataIndex: "trangThai",
        key: "trangThai",
        width: 140,
        align: "center",
        render: (status) => {
          const statusConfig = TASK_STATUS_MAP[status];
          return statusConfig ? (
            <CTag color={statusConfig.color}>{statusConfig.label}</CTag>
          ) : null;
        },
      },
      {
        title: "Xử lý chính",
        dataIndex: "xuLyChinh",
        key: "xuLyChinh",
        width: 180,
      },
      {
        title: "Xử lý chính",
        dataIndex: "xuLyChinh2",
        key: "xuLyChinh2",
        width: 250,
      },
    ],
    []
  );

  return (
    <TableWrap>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1500, y: 400 }}
        pagination={false}
        size="small"
      />
    </TableWrap>
  );
}

export default TasksTable;
