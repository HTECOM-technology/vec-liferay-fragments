import styled from "styled-components";
import { Row } from "antd";

export const PageWrap = styled.div`
  padding: 0;
`;

export const PageContainer = styled.div`
  padding: 0;
  background: #fff;
  border: 1px solid rgba(0, 144, 207, 0.2);
  border-radius: 2px;
`;

export const TabsContainer = styled.div`
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  background: #fff;

  .ant-tabs-nav {
    margin-bottom: 0;
  }

  .ant-tabs-tab {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #666;

    &:hover {
      color: #0090cf;
    }
  }

  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #0090cf;
    font-weight: 600;
  }

  .ant-tabs-ink-bar {
    background: #0090cf;
    height: 3px;
  }
`;

export const ContentContainer = styled.div`
  padding: 16px 24px;

  @media (max-width: 767px) {
    padding: 12px 16px;
  }
`;

export const FilterTagsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const FilterTag = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$active ? "rgba(0, 144, 207, 1)" : "rgba(229, 231, 235, 1)")};
  background: ${(props) => (props.$active ? "rgba(0, 144, 207, 1)" : "rgba(248, 249, 250, 1)")};
  color: ${(props) => (props.$active ? "rgba(255, 255, 255, 1)" : "rgba(0, 144, 207, 1)")};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    border-color: #0090cf;
    color: ${(props) => (props.$active ? "#fff" : "#0090cf")};
  }

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 767px) {
    flex: 1;
    justify-content: center;
    padding: 5px 6px;
    font-size: 12px;
    gap: 4px;

    svg {
      width: 13px;
      height: 13px;
    }
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const PageTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1;
  justify-content: flex-end;

  @media (max-width: 767px) {
    justify-content: flex-start;
    gap: 8px;
  }
`;

export const SearchInput = styled.div`
  .ant-input {
    width: 180px;
    height: 22px;
    border-radius: 4px;
  }

  @media (max-width: 767px) {
    width: 100%;

    .ant-input-affix-wrapper {
      width: 100% !important;
    }

    .ant-input {
      width: 100%;
    }
  }
`;

export const FilterSelect = styled.div`
  .ant-select {
    min-width: 120px;
    width: 200px;
    border: 1px solid rgba(209, 213, 220, 1);
    color: rgba(107, 114, 128, 1);
  }

  .ant-select-selector {
    height: 32px !important;
    border-radius: 4px !important;
  }

  .ant-select-selection-item {
    line-height: 30px !important;
  }

  @media (max-width: 767px) {
    flex: 1 1 calc(50% - 4px);
    min-width: 0;

    .ant-select {
      width: 100% !important;
    }
  }
`;

export const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 32px;
  background: #0090cf;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #007bb5;
  }

  @media (max-width: 767px) {
    width: 100%;
    height: 36px;
  }
`;

export const TableContainer = styled.div`
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

  .employee-name {
    font-weight: 400;
    font-size: 14px;
  }

  .status-tag {
    display: inline-block;
    padding: 2px 8px;
    font-size: 14px;
    color: rgba(30, 30, 30, 1);
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 16px;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    padding: 12px 0;
  }
`;

export const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;

  .ant-select {
    width: 80px;
  }

  .ant-select-selector {
    height: 28px !important;
    border-radius: 4px !important;
  }

  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
    order: 1;
  }
`;

export const PaginationNav = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  .page-btn {
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    color: #333;
    transition: all 0.2s;
    border: none;
    outline: none;
    background: #fff;

    &:hover {
      border-color: #0090cf;
      color: #0090cf;
    }

    &.active {
      background: #fff;
      border-color: #fff;
      color: rgba(0, 144, 207, 1);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .page-ellipsis {
    padding: 0 8px;
    color: #999;
  }
`;

export const GoToPage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;

  .ant-input {
    width: 50px;
    height: 28px;
    text-align: center;
    border-radius: 4px;
  }

  @media (max-width: 600px) {
    display: none;
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
  }
`;

export const SubTabWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
`;

// Birthday Table Styles
export const BirthdayHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const BirthdayTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const BirthdayFilterSelect = styled.div`
  .ant-select {
    min-width: 120px;
  }

  .ant-select-selector {
    height: 32px !important;
    border-radius: 4px !important;
    border: 1px solid rgba(209, 213, 220, 1) !important;
  }

  .ant-select-selection-item {
    line-height: 30px !important;
  }
`;

export const BirthdayTableContainer = styled.div`
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
  }

  .ant-table-thead > tr > th:last-child {
    border-right: none;
  }

  .ant-table-tbody > tr:nth-child(2n + 1) {
    background: rgba(248, 249, 250, 1);
  }

  .ant-table-tbody > tr > td {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-table-tbody > tr:hover > td {
    background: #fafafa;
  }

  .employee-name {
    color: rgba(1, 99, 224, 1);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
