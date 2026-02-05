import { Tabs } from "antd";
import styled from "styled-components";

export const StyledTabs = styled(Tabs)`
  font-size: 13px;
  line-height: 20px;

  .ant-tabs-nav {
    margin-bottom: 16px;
    border-bottom: 1px solid #0090cf33 !important;
    margin-left: -12px;
    margin-right: -12px;
    padding-left: 12px;
    padding-right: 12px;

    &::before {
      display: none !important;
    }

    .ant-tabs-nav-wrap {
      .ant-tabs-nav-list {
        .ant-tabs-ink-bar {
          bottom: -1px !important;
        }
      }
    }
  }

  .ant-tabs-tab {
    font-weight: 600;
    font-size: 14px;
    padding-top: 0;
  }

  .ant-tabs-ink-bar {
    background: #0090cf;
    height: 3px !important;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #0090cf;
  }

  .ant-tabs-tab:hover {
    color: #0090cf;
  }
`;
