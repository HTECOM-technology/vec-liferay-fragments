import styled from "styled-components";
import { Form } from "antd";

export const WorkHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #0090cf33;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
`;

export const WorkSectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
`;

export const WorkFilterWrap = styled.div`
  padding: 12px 0;
  margin-bottom: 12px;
`;

export const WorkFilterForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 0;
    margin-right: 8px;
  }

  .ant-input,
  .ant-select {
    min-width: 140px;
  }
`;

export const WorkTableSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .ant-table-wrapper {
    margin-top: 12px;
  }

  &.work-table-section .ant-table-thead > tr > th {
    text-align: center;
  }

  &.work-table-section .ant-table-tbody > tr > td {
    text-align: left;
  }

  &.work-table-section .ant-table-tbody > tr > td:last-child {
    text-align: center;
  }

  &.work-table-section .ant-table-tbody > tr > td button,
  &.work-table-section .ant-table-tbody > tr > td a {
    text-align: left;
    display: block;
    width: auto;
  }

  ${WorkSectionTitle} {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 8px;
  }
`;