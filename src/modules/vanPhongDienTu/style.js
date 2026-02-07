import styled from "styled-components";
import { Button } from "antd";
import { CButton } from "../../components/common";
export const PageWrap = styled.div`
  padding: 0;

  @media (max-width: 767px) {
    .ant-tabs-nav {
      .ant-tabs-nav-wrap {
        overflow-x: auto;
        overflow-y: hidden;

        &::-webkit-scrollbar {
          display: none;
        }

        -ms-overflow-style: none;
        scrollbar-width: none;

        .ant-tabs-nav-list {
          flex-wrap: nowrap;
          padding-right: 20px;

          .ant-tabs-tab {
            flex-shrink: 0;
            white-space: nowrap;
            padding: 8px 12px;
            font-size: 12px;
            min-width: fit-content;
          }
        }
      }
    }

    .ant-tabs-content-holder {
      overflow-x: hidden;
    }
  }
`;

export const ContentWrap = styled.div`
  display: flex;
  gap: 0;
  height: 100%;
  overflow: hidden;
  max-width: 100%;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

export const LeftSidebar = styled.div`
  width: 200px;
  flex-shrink: 0;
  padding: 12px;

  @media (max-width: 767px) {
    width: 100%;
    padding: 12px 12px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  padding: 20px 24px;
  background: #fff;
  overflow-x: auto;
  display: flex;
  flex-direction: column;

  .content-title {
    margin: 0;
    font-weight: 600;
    font-style: Semi Bold;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0px;
    vertical-align: middle;
  }

  @media (max-width: 767px) {
    padding: 0 12px 12px;

    .content-title {
      font-size: 14px;
    }
  }
`;

export const HeaderSection = styled.div`
  border-bottom: 1px solid #0090cf33;
  padding-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1550px) {
    flex-wrap: wrap;
    gap: 12px;
    
    .content-title {
      width: 100%;
    }
  }

  @media (max-width: 767px) {
    flex-wrap: nowrap;
    gap: 8px;
    padding-bottom: 8px;
    margin-bottom: 0;
    border: none;
  }
`;

export const FilterSection = styled.div`
  .ant-form-item {
    width: 100%;
    margin: 0;
  }
`;

export const MobileFilterButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 0;

  &:hover {
    background: transparent !important;
    border: none !important;
  }

  &:focus {
    background: transparent !important;
    border: none !important;
  }
`;

export const TableContainer = styled.div`
  margin-top: 16px;

  .ant-table-tbody > tr {
    cursor: pointer;
  }

  .ant-table-thead > tr > th {
    border-color: #0090cf33 !important;
  }

  .ant-table-tbody > tr > td {
    border-color: #0090cf33 !important;
  }

  .ant-table {
    border-color: #0090cf33 !important;
  }

  .ant-table-container {
    border-color: #0090cf33 !important;
  }

  .ant-table-bordered > .ant-table-container {
    border-color: #0090cf33 !important;
  }

  .ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > thead
    > tr
    > th,
  .ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > tbody
    > tr
    > td {
    border-color: #0090cf33 !important;
  }

  @media (max-width: 767px) {
    margin-top: 0;

    .ant-table {
      font-size: 12px;
    }

    .ant-table-thead > tr > th {
      padding: 8px 6px;
      font-size: 12px;
      white-space: normal;
      word-wrap: break-word;
    }

    .ant-table-tbody > tr > td {
      padding: 8px 6px;
      font-size: 12px;
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }
`;

export const SidebarItem = styled.div`
  width: 180px;
  height: 40px;
  padding: 0 12px;
  margin-bottom: 2px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.$active ? "#E5F7FF" : "#fff")};
  color: ${(props) => (props.$active ? "#0090CF" : "#6A7282")};
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.$active ? "#0090CF33" : "#e5e7eb")};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: ${(props) => (props.$active ? "#d9f2ff" : "#f5f5f5")};
    border-color: ${(props) => (props.$active ? "#0090cf" : "#0090cf80")};
  }

  .count {
    color: ${(props) => (props.$active ? "#0090cf" : "rgba(0, 0, 0, 0.45)")};
    font-size: 14px;
  }

  @media (max-width: 767px) {
    width: calc(50% - 4px);
    flex: 0 0 calc(50% - 4px);
    height: 36px;
    padding: 0 12px;
    margin-bottom: 0;
    font-size: 13px;
    justify-content: space-between;

    .count {
      font-size: 13px;
      margin-left: 4px;
    }
  }
`;

export const TableText = styled.div`
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.5;
`;

export const CenterText = styled.div`
  text-align: center;
`;

export const MultiLineText = styled.div`
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.5;
`;

export const MobileMenuWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const StatCard = styled.div`
  flex: 1;
  min-width: 200px;
  height: 68px;
  padding: 12px 20px;
  background: #ffffff;
  border: 1px solid #0090cf33;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: #0090cf80;
  }

  .stat-icon {
    width: 32px;
    height: 32px;
  }

  .stat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-label {
    font-size: 14px;
    color: #000000;
    line-height: 1.4;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 600;
    line-height: 1;
    color: #000000;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #0090cf33;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
`;

export const TabRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 767px) {
    border-bottom: none;
    padding-bottom: 8px;
  }
`;

export const TabButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const TabButton = styled(CButton)`
  && {
    height: 28px;
    padding: 0 12px;
    background: #f8f9fa;
    border: 1px solid #e5e7eb;
    box-shadow: none;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    border-radius: 4px;
    transition: all 0.2s;

    ${(props) =>
      props.$active &&
      `
      background: #0090cf;
      color: #fff;
      border-color: #0090cf;
    `}

    &:hover {
      background: ${(props) => (props.$active ? "#0090cf" : "#e9ecef")};
      color: ${(props) => (props.$active ? "#fff" : "rgba(0, 0, 0, 0.85)")};
      border-color: ${(props) => (props.$active ? "#0090cf" : "#e5e7eb")};
    }
  }
`;

export const PaginationWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
