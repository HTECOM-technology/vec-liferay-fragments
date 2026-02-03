import styled from "styled-components";
import { Row } from "antd";

export const PageWrap = styled.div`
  padding: 0;
`;

export const FilterSection = styled.div`
  margin-bottom: 16px;

  .ant-form-inline {
    .ant-form-item {
      margin-right: 12px;
      margin-bottom: 12px;
    }
    .ant-form-item-label > label {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
`;

export const FilterRow = styled(Row)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: ${(p) => (p.$last ? 0 : "12px")};
`;

export const TableWrap = styled.div`
  margin-top: 16px;
`;

export const PaginationWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

export const ActionIconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #0090cf26;
  color: #0090cf;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #0090cf;
    color: #fff;
  }
`;
