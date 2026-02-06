import { Table } from "antd";
import styled from "styled-components";

export const StyledTable = styled(Table)`
  .ant-table {
    font-size: 14px;
  }

  .ant-table table {
    border: 1px solid rgba(0, 144, 207, 0.2);
  }

  .ant-table-thead > tr > th {
    background: rgba(248, 249, 250, 1);
    font-weight: 600;
    color: #333;
    padding: 12px 16px;
    border-right: 1px solid rgba(0, 144, 207, 0.2);
    border-bottom: 1px solid rgba(0, 144, 207, 0.2);
    border-top: 1px solid rgba(0, 144, 207, 0.2);
  }

  .ant-table-thead > tr:first-child > th {
    border-top: none;
  }

  .ant-table-thead > tr > th:last-child {
    border-right: none;
  }

  .ant-table-tbody > tr:nth-child(2n + 1) {
    background: rgba(248, 249, 250, 1);
    border-bottom: 1px solid rgba(229, 231, 235, 1);
    border-top: 1px solid rgba(229, 231, 235, 1);
  }

  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-table-tbody > tr:hover > td {
    background: #fafafa;
  }

  .ant-table-body {
    table {
      border-top: none !important;
      border-radius: 0 !important;
    }
  }
`;
