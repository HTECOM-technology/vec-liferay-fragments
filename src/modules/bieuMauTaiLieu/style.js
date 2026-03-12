import styled from "styled-components";

export const PageWrap = styled.div`
  padding: 0;
`;

export const LayoutContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const MobileTabContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 12px;
  background: white;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

export const MobileTabItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid ${props => props.$active ? '#0090cf' : '#e5e7eb'};
  border-radius: 6px;
  background: ${props => props.$active ? '#fff' : '#fff'};
  color: ${props => props.$active ? '#0090cf' : '#374151'};
  
  /* Font styling */
  font-weight: 500;
  font-size: 11px;
  text-transform: uppercase;
  min-height: 48px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #0090cf;
    color: #0090cf;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: inherit;
    flex-shrink: 0;
  }
  
  span {
      line-height: 1.3;
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #E5E7EB;
  min-height: 400px;
  
  @media (max-width: 768px) {
    border: none;
    background: transparent;
  }
`;

export const Header = styled.div`
  padding: 12px 16px;
  background: #e6f7ff;
  border-bottom: 1px solid #0090CF33;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px 4px 0 0;

  h3 {
    margin: 0;
    color: #333;
    font-size: 16px;
    font-weight: 600;
  }
  
  svg {
    color: #0090cf;
    font-size: 18px;
  }
`;

export const TableContainer = styled.div`
  padding: 16px;
  
  @media (max-width: 768px) {
    padding: 0;
    background: #fff;
    margin-top: 17px;
  }

  .ant-table-wrapper .ant-table-container {
    border: 1px solid #0090CF33 !important;
  }

  .ant-table-thead > tr > th {
    background: #f8f9fa;
    font-weight: 600;
    border-bottom: 1px solid #0090CF33 !important;
    border-right: 1px solid #0090CF33 !important;
  }
  
  .ant-table-thead > tr > th:last-child {
    border-right: none !important;
  }
  
  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border-bottom: 1px solid #0090CF33 !important;
    border-right: none !important;
  }
`;

export const ActionButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  &.view-btn {
    color: #52c41a;
    background: rgba(82, 196, 26, 0.1);
    
    &:hover {
      background: rgba(82, 196, 26, 0.2);
    }
  }
  
  &.download-btn {
    color: #0090cf;
    background: rgba(0, 144, 207, 0.1);
    
    &:hover {
      background: rgba(0, 144, 207, 0.2);
    }
  }

  &.edit-btn {
    color: #fffc42;
    background: rgba(230, 252, 40, 0.1);
    
    &:hover {
      background: rgba(148, 136, 26, 0.2);
    }
  }
  
  &.delete-btn {
    color: #f74134;
    background: rgba(209, 52, 52, 0.1);
    
    &:hover {
      background: rgba(160, 38, 38, 0.2);
    }
  }

  svg {
    font-size: 16px;
  }
`;

export const ActionsCell = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;
