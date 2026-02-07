import styled from "styled-components";
import { CModal } from "../../../../components/common";

// Shared styled modal for detail modals
export const StyledDetailModal = styled(CModal)`
  &.ant-modal {
    max-width: ${props => props.maxWidth || '800px'};
  }

  .ant-modal-title {
    width: 95%;
    overflow: hidden;
  }

  .ant-modal-body {
    margin: 16px 0;
    padding: 16px 0;
    border: 1px solid #0090cf33;
    border-radius: 8px;
  }

  .ant-modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
  }
`;

// Shared info section styling
export const InfoSection = styled.div`
  .info-title {
    font-weight: 600;
    font-size: 15px;
    color: #1e1e1e;
    padding: 0 16px 12px;
    border-bottom: 1px solid #0090cf33;
    margin-bottom: 8px;
  }

  .info-row {
    display: flex;
    padding: 12px 16px;
    gap: clamp(16px, 4vw, 40px);
  }

  .info-label {
    font-weight: 600;
    color: #1e1e1e;
    width: ${props => props.labelWidth || 'clamp(120px, 25%, 200px)'};
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .info-value {
    color: #333;
    flex: 1;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }
`;

// Two column grid layout for document details
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .info-row {
    display: flex;
    padding: 12px 16px;
    gap: 16px;
  }

  .info-label {
    font-weight: 600;
    color: #1e1e1e;
    min-width: ${props => props.labelWidth || '120px'};
    flex-shrink: 0;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .info-value {
    color: #333;
    flex: 1;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }
`;

// Shared modal title styling
export const DetailModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  min-width: 0;

  .anticon {
    color: #0090cf;
    flex-shrink: 0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
`;

// Shared modal footer styling
export const DetailModalFooter = styled.div`
  text-align: center;
`;
