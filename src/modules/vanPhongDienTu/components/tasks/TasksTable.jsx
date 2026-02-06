import React, { useMemo } from "react";
import { Space } from "antd";
import { CTable, CTag } from "../../../../components/common";
import { mockTasksData, TASK_STATUS_MAP } from "./constants";

function TasksTable({ dataSource = mockTasksData, onTaskClick }) {
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
        render: (text, record) => (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onTaskClick?.(record);
            }}
            style={{ color: "#1890ff", textDecoration: "none" }}
          >
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
          <Space size={6}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span>{text}</span>
          </Space>
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
    [onTaskClick]
  );

  return (
    <div style={{ marginTop: 16 }}>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1500, y: 400 }}
        pagination={false}
        size="small"
      />
    </div>
  );
}

export default TasksTable;
