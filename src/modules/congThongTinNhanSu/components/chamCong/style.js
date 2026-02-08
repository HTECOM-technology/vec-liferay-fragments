import styled from "styled-components";
import { Button, Form, Row } from "antd";

export const PageWrap = styled.div`
  padding: 0;

  .register-button {
    background-color: #e3f5ff !important;
    border-color: #0090cf !important;
    color: #0090cf !important;
    font-weight: 500;
    font-size: 14px;
    height: 36px;
    padding: 8px 24px;
    border-radius: 4px;

    &:hover {
      background-color: #d1efff !important;
      border-color: #0090cf !important;
      color: #0090cf !important;
    }

    .anticon {
      font-size: 20px;
    }
  }

  .approve-button {
    background-color: #0090cf !important;
    border-color: #0090cf !important;
    color: white !important;
    font-weight: 500;
    font-size: 14px;
    height: 36px;
    padding: 8px 24px;
    border-radius: 4px;

    &:hover {
      background-color: #007ab8 !important;
      border-color: #007ab8 !important;
    }

    .anticon {
      font-size: 20px;
    }
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #0090cf33;
  padding-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1e1e1e;
  }

  .heading-group {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .button-group {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .button-pair {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

export const CheckboxLabel = styled.div`
  .ant-checkbox-wrapper {
    font-size: 14px;
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

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TableWrap = styled.div`
  margin-top: 16px;
`;

export const FilterButton = styled(Button)`
  display: none;
  border: none !important;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  @media (max-width: 768px) {
    display: block;
  }
`;

export const FilterForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 9px;
  }
`;
