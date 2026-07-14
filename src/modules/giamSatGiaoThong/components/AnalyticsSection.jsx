import React from 'react';
import styled from 'styled-components';
// import iconPtvp from '../../../assets/icon/icon-ptvp.svg';
// import iconTocdo from '../../../assets/icon/icon-tdlt.svg';
// import iconGiasuc from '../../../assets/icon/icon-slgs.svg';
// import iconCameraLoi from '../../../assets/icon/icon-cameraloi.svg';

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN || '';

const iconPtvp =  `${API_DOMAIN}/documents/20117/1203544/icon-ptvp.png/44a34f4f-540d-56f4-da8d-7ead3df67fc1?version=1.0&t=1784077768938&imagePreview=1`;
const iconTocdo =  `${API_DOMAIN}/documents/20117/1203544/icon-tdlt.svg/59c3432f-43b3-832f-9247-e2c774bfcd0b?version=1.0&t=1784077782426&imagePreview=1`;
const iconGiasuc =  `${API_DOMAIN}/documents/20117/1203544/icon-slgs.svg/0c12c288-cc60-48df-338a-5755dfcaeb81?version=1.0&t=1784077804013&imagePreview=1`;
const iconCameraLoi =  `${API_DOMAIN}/documents/20117/1203544/icon-cameraloi.svg/eb6d839d-9851-71da-14d3-5724ed720be4?version=1.0&t=1784077815690&imagePreview=1`;

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

  @media (max-width: 1199px) {
    gap: 8px;
    padding: 12px;
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

  @media (max-width: 1199px) {
    padding: 12px;
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

  @media (max-width: 1199px) {
    font-size: 11px;
    margin-bottom: 4px;
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1e1e1e;

  @media (max-width: 1199px) {
    font-size: 22px;
  }
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

  @media (max-width: 1199px) {
    width: 40px;
    height: 40px;
    margin-left: 8px;
  }
`;

const AnalyticsSection = ({ analytics }) => {
  const analyticsData = [
    {
      label: 'Số lượt phương tiện vi phạm',
      value: analytics?.violations ?? 0,
      icon: (<img src={iconPtvp} alt=""></img>),
    },
    {
      label: 'Tốc độ lưu thông trung bình (km/h)',
      value: analytics?.avgSpeed ?? 0,
      icon: (<img src={iconTocdo} alt=""></img>),
    },
    {
      label: 'Số lượng gia súc đi vào cao tốc',
      value: analytics?.animals ?? 0,
      icon: (<img src={iconGiasuc} alt=""></img>),
    },
    {
      label: 'Số lượng camera bị lỗi',
      value: analytics?.brokenCameras ?? 0,
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
