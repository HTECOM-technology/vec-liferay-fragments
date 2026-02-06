import styled from "styled-components";
import { Row } from "antd";

export const PageWrap = styled.div`
  padding: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #0090cf33;
  padding-bottom: 8px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1e1e1e;
  }
`;

export const FilterSection = styled.div`
  margin-bottom: 16px;

  .ant-form-inline {
    .ant-form-item {
      margin-right: 12px;
      margin-bottom: 12px;
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
