import React, { useMemo } from "react";
import { Space, Grid } from "antd";
import { CTable, CTag } from "../../../../components/common";
import { mockTasksData, TASK_STATUS_MAP } from "./constants";

const { useBreakpoint } = Grid;

function TasksTable({ dataSource = mockTasksData, onTaskClick }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: "Nhiệm vụ",
        dataIndex: "nhiemVu",
        key: "nhiemVu",
        width: isMobile ? undefined : 350,
        render: (text, record) => (
          <div>
            <button
              type="button"
              onClick={() => {
                onTaskClick?.(record);
              }}
              style={{
                color: "#1890ff",
                textDecoration: "none",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {text}
            </button>
            {isMobile && record.trangThai && (
              <div style={{ marginTop: 4 }}>
                <CTag color={TASK_STATUS_MAP[record.trangThai]?.color}>
                  {TASK_STATUS_MAP[record.trangThai]?.label}
                </CTag>
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Hạn xử lý",
        dataIndex: "hanXuLy",
        key: "hanXuLy",
        width: isMobile ? 100 : 180,
        align: "center",
      },
    ];

    if (isMobile) {
      return baseColumns;
    }

    return [
      {
        title: "Ngày",
        dataIndex: "ngay",
        key: "ngay",
        width: 110,
        align: "center",
      },
      baseColumns[0],
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
      baseColumns[1],
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
    ];
  }, [onTaskClick, isMobile]);

  return (
    <div style={{ marginTop: 16 }}>
      <CTable
        columns={columns}
        dataSource={dataSource}
        scroll={isMobile ? undefined : { x: 1500, y: 400 }}
        pagination={false}
        size="small"
      />
    </div>
  );
}

export default TasksTable;
