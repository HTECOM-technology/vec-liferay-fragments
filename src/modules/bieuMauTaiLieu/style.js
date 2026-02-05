import styled from "styled-components";

export const PageWrap = styled.div`
  padding: 0;
`;

export const LayoutContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

export const ContentArea = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #E5E7EB;
  min-height: 400px;
`;

export const Header = styled.div`
  padding: 12px 16px;
  background: #e6f7ff;
  border-bottom: 1px solid #0090CF33;
  display: flex;
  align-items: center;
  gap: 8px;

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
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  
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

  svg {
    font-size: 16px;
  }
`;

export const ActionsCell = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;
