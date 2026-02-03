import { Pagination, Select, Input } from "antd";
import styled from "styled-components";

export const PaginationWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  gap: 16px;
  font-size: 13px;
  margin-top: 18px;
  line-height: 20px;
  border-radius: 6px;

  .pagination-label {
    white-space: nowrap;
    color: #4A5565;
  }

  .pagination-total {
    margin-left: 2px;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

export const CenterSection = styled.div`
  display: flex;
  align-items: center;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledPagination = styled(Pagination)`
  font-size: 13px;
  line-height: 20px;

  .ant-pagination-item {
    min-width: 32px;
    height: 32px;
    line-height: 30px;
    font-size: 13px;
    background: transparent !important;
    border-color: rgba(255, 255, 255, 0.2);
    a {
    }
  }


  
  .ant-pagination-item {
    border: none !important;
    &:hover {
      color: #0090cf;
    }
  }

  .ant-pagination-item-ellipsis{
    color: #1E1E1E !important;
    letter-spacing: 0px !important;
    font-size: 8px !important;
    top: 2px !important;
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    min-width: 32px;
    height: 32px;
    line-height: 30px;
    color: #1E1E1E;
    .ant-pagination-item-link {
      background: transparent !important;
      border-color: rgba(255, 255, 255, 0.2);
      color: #1E1E1E;
    }
  }

  .ant-pagination-prev:hover .ant-pagination-item-link,
  .ant-pagination-next:hover .ant-pagination-item-link {
    color: #0090cf;
  }

  .ant-pagination-disabled .ant-pagination-item-link {
    color: #6b7280 !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }

  .ant-pagination-ellipsis {
    color: #9ca3af;
  }
`;

export const StyledSelect = styled(Select)`
  font-size: 13px;

  .ant-select-selector {
    height: 32px !important;
    padding: 0 11px !important;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    background: transparent !important;
    color: #e5e7eb;
  }

  .ant-select-selection-item,
  .ant-select-selection-placeholder {
    line-height: 30px !important;
    color: #e5e7eb;
  }

  .ant-select-arrow {
    color: #9ca3af;
  }
`;

export const StyledInput = styled(Input)`
  height: 32px !important;
  font-size: 13px;
  border-top: 1px solid #E5E7EB;
  background: transparent !important;
  color: #0A0A0A;
  text-align: center;
  border-radius: 4px;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    border-color: #0090cf !important;
    box-shadow: 0 0 0 1px rgba(0, 144, 207, 0.2);
  }
`;
