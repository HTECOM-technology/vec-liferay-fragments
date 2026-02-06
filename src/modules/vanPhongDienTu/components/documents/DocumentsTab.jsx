import React from "react";
import { Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import styled from "styled-components";
import DocumentsFilter from "./DocumentsFilter";
import DocumentsTable from "./DocumentsTable";
import DocumentsPagination from "./DocumentsPagination";
import { DOCUMENT_TABS } from "./constants";

const DocumentsContent = styled.div`
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

function DocumentsTab({
  initialValues,
  onSearch,
  dataSource,
  pagination = {},
  activeSubTab,
  onSubTabChange,
  stats = { incoming: 5, outgoing: 12, pending: 2, approved: 0 },
}) {
  const { current = 1, pageSize = 12, total = 0, onChange } = pagination;

  return (
    <DocumentsContent>
      <StatsRow>
        <StatItem $color="#1890ff">
          <span className="stat-label">Số văn bản đến mới</span>
          <span className="stat-value">{String(stats.incoming).padStart(2, '0')}</span>
        </StatItem>
        <StatItem $color="#52c41a">
          <span className="stat-label">Số văn bản đi mới</span>
          <span className="stat-value">{String(stats.outgoing).padStart(2, '0')}</span>
        </StatItem>
        <StatItem $color="#faad14">
          <span className="stat-label">Số văn bản chờ xử lý</span>
          <span className="stat-value">{String(stats.pending).padStart(2, '0')}</span>
        </StatItem>
        <StatItem $color="#ff4d4f">
          <span className="stat-label">Số văn bản chờ duyệt</span>
          <span className="stat-value">{String(stats.approved).padStart(2, '0')}</span>
        </StatItem>
      </StatsRow>

      <TabRow>
        <TabButtons>
          {DOCUMENT_TABS.map(tab => (
            <TabButton
              key={tab.key}
              $active={activeSubTab === tab.key}
              onClick={() => onSubTabChange(tab.key)}
            >
              {tab.icon && <span style={{ marginRight: 4 }}>{tab.icon}</span>}
              {tab.label}
            </TabButton>
          ))}
        </TabButtons>
        <Button type="primary" icon={<EyeOutlined />}>
          Xem đầy đủ văn bản
        </Button>
      </TabRow>

      <DocumentsFilter initialValues={initialValues} onSearch={onSearch} />
      <DocumentsTable dataSource={dataSource} />
      <DocumentsPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
      />
    </DocumentsContent>
  );
}

export default DocumentsTab;
