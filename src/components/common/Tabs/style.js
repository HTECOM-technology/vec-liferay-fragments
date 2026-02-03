import { Tabs } from "antd";
import styled from "styled-components";

export const StyledTabs = styled(Tabs)`
  font-size: 13px;
  line-height: 20px;

  .ant-tabs-nav {
    margin-bottom: 16px;
  }

  .ant-tabs-tab {
    font-weight: 600;
    font-size: 14px;
  }

  .ant-tabs-ink-bar {
    background: #0090cf;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #0090cf;
  }

  .ant-tabs-tab:hover {
    color: #0090cf;
  }
`;
