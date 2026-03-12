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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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

const ViolationImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
`;

const ViolationInfo = styled.div`
  padding: 24px;
`;

const ViolationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const TypeBadge = styled.span`
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

const ViolationTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e1e1e;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e4e4e4;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1e1e1e;
`;

const ViolationModal = ({ violation, onClose }) => {
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

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>

        <ViolationImage src={violation.image} alt={violation.title} />

        <ViolationInfo>
          <ViolationHeader>
            <TypeBadge severity={violation.severity}>
              {violation.type}
            </TypeBadge>
            <Timestamp>⏱ {violation.timestamp}</Timestamp>
          </ViolationHeader>

          <ViolationTitle>{violation.title}</ViolationTitle>

          <div>
            <DetailRow>
              <DetailLabel>Vị trí:</DetailLabel>
              <DetailValue>{violation.location}</DetailValue>
            </DetailRow>
            
            {violation.speed && (
              <DetailRow>
                <DetailLabel>Tốc độ:</DetailLabel>
                <DetailValue>{violation.speed} km/h (Tối đa: {violation.maxSpeed} km/h)</DetailValue>
              </DetailRow>
            )}
            
            <DetailRow>
              <DetailLabel>Thời gian:</DetailLabel>
              <DetailValue>{violation.timestamp}</DetailValue>
            </DetailRow>
          </div>
        </ViolationInfo>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ViolationModal;