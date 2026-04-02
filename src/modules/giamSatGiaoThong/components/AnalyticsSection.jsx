import React from 'react';
import styled from 'styled-components';
import iconPtvp from '../../../assets/icon/icon-ptvp.svg';
import iconTocdo from '../../../assets/icon/icon-tdlt.svg';
import iconGiasuc from '../../../assets/icon/icon-slgs.svg';
import iconCameraLoi from '../../../assets/icon/icon-cameraloi.svg';

const AnalyticsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 16px 20px;
  background: #FFF;
  border-bottom: 1px solid #e4e4e4;
  border-radius: 8px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e4e4e4;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 400;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1e1e1e;
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #F8F9FA;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 16px;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const AnalyticsSection = ({ routeId }) => {
  // Mock data - Replace with API call later
  const analyticsData = [
    {
      label: 'Số lượt phương tiện vi phạm',
      value: 24,
      icon: (<img src={iconPtvp} alt=""></img>),
    },
    {
      label: 'Tốc độ lưu thông trung bình (km/h)',
      value: 120,
      icon: (<img src={iconTocdo} alt=""></img>),
    },
    {
      label: 'Số lượng gia súc đi vào cao tốc',
      value: 0,
      icon: (<img src={iconGiasuc} alt=""></img>),
    },
    {
      label: 'Số lượng camera bị lỗi',
      value: 0,
      icon: (<img src={iconCameraLoi} alt=""></img>),
    },
  ];

  return (
    <AnalyticsContainer>
      {analyticsData.map((stat, index) => (
        <StatCard key={index}>
          <StatInfo>
            <StatLabel>{stat.label}</StatLabel>
            <StatValue>{stat.value}</StatValue>
          </StatInfo>
          <StatIcon bgColor={stat.bgColor}>
            {stat.icon}
          </StatIcon>
        </StatCard>
      ))}
    </AnalyticsContainer>
  );
};

export default AnalyticsSection;