import React, { useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  color: #666;
  border: none;
  cursor: pointer;
  font-size: 24px;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    transform: scale(1.1);
  }
`;

const IncidentImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
`;

const IncidentInfo = styled.div`
  padding: 24px;
`;

const IncidentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SeverityBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch(props.severity) {
      case 'high': return '#fee';
      case 'medium': return '#fff4e6';
      case 'low': return '#e8f5e9';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch(props.severity) {
      case 'high': return '#d32f2f';
      case 'medium': return '#f57c00';
      case 'low': return '#388e3c';
      default: return '#666';
    }
  }};
`;

const Timestamp = styled.span`
  font-size: 14px;
  color: #666;
`;

const IncidentTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e1e1e;
  line-height: 1.3;
`;

const IncidentDescription = styled.p`
  margin: 0 0 16px 0;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
`;

const Source = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e4e4e4;
  font-size: 14px;
  color: #666;

  strong {
    color: #1e1e1e;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  margin-top: 16px;
  background: #0090cf;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #007ab8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 144, 207, 0.3);
  }
`;

const IncidentModal = ({ incident, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSeverityText = (severity) => {
    switch(severity) {
      case 'high': return 'Nghiêm trọng';
      case 'medium': return 'Trung bình';
      case 'low': return 'Nhẹ';
      default: return 'Không xác định';
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>

        <IncidentImage src={incident.image} alt={incident.title} />

        <IncidentInfo>
          <IncidentHeader>
            <SeverityBadge severity={incident.severity}>
              {getSeverityText(incident.severity)}
            </SeverityBadge>
            <Timestamp>⏱ {incident.timestamp}</Timestamp>
          </IncidentHeader>

          <IncidentTitle>{incident.title}</IncidentTitle>

          <IncidentDescription>{incident.description}</IncidentDescription>

          <Source>
            <strong>Nguồn:</strong> {incident.source}
          </Source>

          <ActionButton onClick={onClose}>
            Xem chi tiết →
          </ActionButton>
        </IncidentInfo>
      </ModalContent>
    </ModalOverlay>
  );
};

export default IncidentModal;