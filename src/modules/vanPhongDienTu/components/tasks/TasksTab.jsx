import React, { useState } from "react";
import { Grid } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { CButton } from "../../../../components/common";
import styled from "styled-components";
import TasksFilter from "./TasksFilter";
import TasksTable from "./TasksTable";
import TasksPagination from "./TasksPagination";
import TaskDetailModal from "./TaskDetailModal";
import TasksStatsCards from "./TasksStatsCards";
import {
  HeaderRow,
  SectionTitle,
  TabRow,
  TabButtons,
  TabButton,
} from "../../style";
import { TASK_TABS } from "./constants";

const { useBreakpoint } = Grid;

const TasksContent = styled.div`
  padding: 16px;
  background: #fff;
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
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  return (
    <TasksContent>
      <TasksStatsCards stats={stats} />

      <HeaderRow>
        <SectionTitle>Nhiệm vụ thực hiện</SectionTitle>
        {isMobile ? (
          <TasksFilter initialValues={initialValues} onSearch={onSearch} />
        ) : (
          <CButton type="primary" icon={<EyeOutlined />}>
            Xem đầy đủ nhiệm vụ
          </CButton>
        )}
      </HeaderRow>

      <TabRow>
        <TabButtons style={{ flexWrap: isMobile ? "wrap" : "nowrap" }}>
          {TASK_TABS.map((tab) => (
            <TabButton
              key={tab.key}
              $active={activeSubTab === tab.key}
              onClick={() => onSubTabChange(tab.key)}
              style={isMobile ? { marginBottom: 8 } : {}}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabButtons>
      </TabRow>

      {!isMobile && (
        <TasksFilter initialValues={initialValues} onSearch={onSearch} />
      )}
      <TasksTable dataSource={dataSource} onTaskClick={handleTaskClick} />
      <TasksPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
      />
      <TaskDetailModal
        visible={isModalVisible}
        task={selectedTask}
        onClose={handleCloseModal}
      />
    </TasksContent>
  );
}

export default TasksTab;
