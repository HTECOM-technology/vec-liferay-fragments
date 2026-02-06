import React, { useMemo } from "react";
import styled from "styled-components";

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 200px;
  height: 68px;
  padding: 12px 20px;
  background: #ffffff;
  border: 1px solid #0090cf33;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: #0090cf80;
  }

  .stat-icon {
    font-size: 32px;
    line-height: 1;
  }

  .stat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-label {
    font-size: 14px;
    color: #000000;
    line-height: 1.4;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 600;
    line-height: 1;
    color: #000000;
  }
`;

function WorkStatsCards({ primaryData, supportData, assignedData, followData }) {
  const stats = useMemo(() => {
    const allData = [
      ...(primaryData || []),
      ...(supportData || []),
      ...(assignedData || []),
      ...(followData || []),
    ];
    
    const total = allData.length;
    const processing = allData.filter(item => 
      ['processing', 'in-progress'].includes(item.trangThai)
    ).length;
    const completed = allData.filter(item => 
      item.trangThai === 'completed'
    ).length;
    const overdue = allData.filter(item => 
      item.trangThai === 'overdue'
    ).length;

    return { total, processing, completed, overdue };
  }, [primaryData, supportData, assignedData, followData]);

  return (
    <StatsRow>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Tổng số công việc</div>
          <div className="stat-value">
            {String(stats.total).padStart(2, '0')}
          </div>
        </div>
        <div className="stat-icon" style={{ color: "#9254de" }}>📋</div>
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Đang xử lý</div>
          <div className="stat-value">
            {String(stats.processing).padStart(2, '0')}
          </div>
        </div>
        <div className="stat-icon" style={{ color: "#1890ff" }}>⚙️</div>
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Đã hoàn thành</div>
          <div className="stat-value">
            {String(stats.completed).padStart(2, '0')}
          </div>
        </div>
        <div className="stat-icon" style={{ color: "#52c41a" }}>✅</div>
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Quá hạn</div>
          <div className="stat-value">
            {String(stats.overdue).padStart(2, '0')}
          </div>
        </div>
        <div className="stat-icon" style={{ color: "#ff4d4f" }}>⚠️</div>
      </StatCard>
    </StatsRow>
  );
}

export default WorkStatsCards;
