import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  position: absolute;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 12px;
  min-width: 240px;
  max-width: 300px;
  z-index: 1000;
  pointer-events: none;
  transform: translate(-50%, -120%);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const Icon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    switch(props.severity) {
      case 'high': return '#fee';
      case 'medium': return '#fff4e6';
      case 'low': return '#e8f5e9';
      default: return '#f5f5f5';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e1e1e;
  flex: 1;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 4px;
`;

const ViewDetails = styled.div`
  font-size: 12px;
  color: #0090cf;
  font-weight: 600;
  margin-top: 8px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const IncidentInfoCard = ({ incident, position }) => {
  const getIcon = (severity) => {
    switch(severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '📍';
    }
  };

  return (
    <Card style={{ left: position.x, top: position.y }}>
      <CardHeader>
        <Icon severity={incident.severity}>
          {getIcon(incident.severity)}
        </Icon>
        <Title>{incident.title}</Title>
      </CardHeader>
      <Timestamp>⏱ {incident.timestamp}</Timestamp>
      <ViewDetails>Chi tiết →</ViewDetails>
    </Card>
  );
};

export default IncidentInfoCard;