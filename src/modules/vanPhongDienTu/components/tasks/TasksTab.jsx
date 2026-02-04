import React from "react";
import { Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import styled from "styled-components";
import TasksFilter from "./TasksFilter";
import TasksTable from "./TasksTable";
import TasksPagination from "./TasksPagination";
import { TASK_TABS } from "./constants";

const TasksContent = styled.div`
  padding: 16px;
  background: #fff;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .stat-label {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }

  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: ${props => props.$color || "#1890ff"};
  }
`;

const TabRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const TabButton = styled(Button)`
  ${props => props.$active && `
    background: #1890ff;
    color: #fff;
    border-color: #1890ff;
  `}
`;

function TasksTab({
  initialValues,
  onSearch,
  dataSource,
  pagination = {},
  activeSubTab,
  onSubTabChange,
  stats = { total: 8, processing: 2, completed: 4, overdue: 0 },
}) {
  const { current = 1, pageSize = 12, total = 0, onChange } = pagination;

  return (
    <TasksContent>
      <StatsRow>
        <StatItem>
          <span className="stat-label">Tổng số nhiệm vụ</span>
          <span className="stat-value">{String(stats.total).padStart(2, '0')}</span>
        </StatItem>
        <StatItem $color="#9254de">
          <span className="stat-label">Đang xử lý</span>
          <span className="stat-value">{String(stats.processing).padStart(2, '0')}</span>
        </StatItem>
        <StatItem $color="#52c41a">
          <span className="stat-label">Đã hoàn thành</span>
          <span className="stat-value">{String(stats.completed).padStart(2, '0')}</span>
        </StatItem>
        <StatItem $color="#ff4d4f">
          <span className="stat-label">Quá hạn</span>
          <span className="stat-value">{String(stats.overdue).padStart(2, '0')}</span>
        </StatItem>
      </StatsRow>

      <TabRow>
        <TabButtons>
          {TASK_TABS.map(tab => (
            <TabButton
              key={tab.key}
              $active={activeSubTab === tab.key}
              onClick={() => onSubTabChange(tab.key)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabButtons>
        <Button type="primary" icon={<EyeOutlined />}>
          Xem đầy đủ nhiệm vụ
        </Button>
      </TabRow>

      <TasksFilter initialValues={initialValues} onSearch={onSearch} />
      <TasksTable dataSource={dataSource} />
      <TasksPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
      />
    </TasksContent>
  );
}

export default TasksTab;
