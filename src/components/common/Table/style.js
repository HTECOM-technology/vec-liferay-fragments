import { Table } from "antd";
import styled from "styled-components";

export const StyledTable = styled(Table)`
  font-size: 13px;
  line-height: 20px;

  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
    font-size: 13px;
  }

  .ant-table-tbody > tr > td {
    font-size: 13px;
  }

  .ant-table-tbody > tr:hover > td {
    background: #fafafa;
  }
`;
