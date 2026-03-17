import styled from "styled-components";

export const PageWrap = styled.div`
  padding: 0;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const LayoutContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const MobileTabContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 16px;
  background: #f8fafc;
  width: 100%;
  border-bottom: 1px solid #e2e8f0;
  
  @media (min-width: 993px) {
    display: none;
  }
`;

export const MobileTabItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid ${props => props.$active ? '#0090cf' : '#e2e8f0'};
  border-radius: 10px;
  background: ${props => props.$active ? '#fff' : '#fff'};
  color: ${props => props.$active ? '#0090cf' : '#64748b'};
  box-shadow: ${props => props.$active ? '0 4px 6px -1px rgba(0, 144, 207, 0.1)' : 'none'};
  
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  min-height: 52px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: scale(0.97);
  }
  
  svg {
    width: 22px;
    height: 22px;
    color: inherit;
    flex-shrink: 0;
  }
  
  span {
    line-height: 1.25;
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  overflow: hidden;
  width: 100%;
  
  @media (max-width: 992px) {
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
`;

export const Header = styled.div`
  padding: 16px 20px;
  background: linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;

  h3 {
    margin: 0;
    color: #1e293b;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  
  svg {
    color: #0090cf;
    font-size: 20px;
  }
`;

export const TableContainer = styled.div`
  padding: 24px;
  
  .table-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      padding: 0 16px;
      margin-top: 16px;
      
      button {
        width: 100%;
        height: 44px;
        border-radius: 8px;
        font-weight: 600;
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 0 0 24px 0;
  }

  /* Table Customization */
  .ant-table-wrapper {
    .ant-table {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #f1f5f9;
    }
    
    .ant-table-thead > tr > th {
      background: #f8fafc;
      color: #475569;
      font-weight: 600;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
      padding: 14px 16px;
      
      &::before {
        display: none !important;
      }
    }
    
    .ant-table-tbody > tr > td {
      padding: 14px 16px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      font-size: 14px;
    }

    .ant-table-tbody > tr:last-child > td {
      border-bottom: none;
    }

    .ant-table-tbody > tr:hover > td {
      background: #f0f9ff !important;
    }
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
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 36px;
  height: 36px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
  
  &.view-btn {
    color: #10b981;
    background: #ecfdf5;
    &:hover { background: #d1fae5; }
  }
  
  &.download-btn {
    color: #0090cf;
    background: #f0f9ff;
    &:hover { background: #e0f2fe; }
  }

  &.preview-btn {
    color: #f59e0b;
    background: #fffbeb;
    &:hover { background: #fef3c7; }
  }

  &.delete-btn {
    color: #ef4444;
    background: #fef2f2;
    &:hover { background: #fee2e2; }
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
    font-size: 18px;
  }
`;

export const ActionsCell = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;
