import styled, { createGlobalStyle } from "styled-components";
import { Row } from "antd";

export const MobileDateRangeGlobalStyle = createGlobalStyle`
  .mobile-range-picker-dropdown {
    left: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    display: flex;
    justify-content: center;
    
    .ant-picker-panel-container {
      width: 100% !important;
      max-width: 350px !important;
      overflow: hidden;
      margin: 0 auto;
      box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
      border-radius: 8px;
    }

    .ant-picker-panels {
      display: flex;
      justify-content: center;
    }
    
    /* Hide the second panel to show only one calendar at a time on mobile */
    .ant-picker-panel:nth-child(2) {
        display: none;
    }
    
    /* Ensure header and content fit */
    .ant-picker-header {
        padding: 0 8px;
    }
    .ant-picker-content {
        width: 100% !important;
    }
    
    /* Make the single panel full width */
    .ant-picker-panel {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .ant-picker-date-panel {
        width: 100%;
    }
    
    .ant-picker-body {
        width: 100%;
        padding: 8px 16px;
    }
    
    .ant-picker-content {
        width: 100%;
        table-layout: fixed;
    }
  }
`;

export const PageWrap = styled.div`
  padding: 0;

  @media (max-width: 1199px) {
    .ant-tabs-nav {
      .ant-tabs-nav-wrap {
        overflow-x: auto;
        overflow-y: hidden;
        &::-webkit-scrollbar { display: none; }
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
    .ant-tabs-content-holder { overflow-x: hidden; }
  }
`;

export const FilterSection = styled.div`
  margin-bottom: 24px;
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
  border-bottom: 1px solid #0090CF33;
  padding-bottom: 8px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
`;