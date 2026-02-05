import styled from "styled-components";
import { Form } from "antd";

// === LAYOUT COMPONENTS === //
export const PageWrap = styled.div`
  padding: 0;
`;

export const ContentWrap = styled.div`
  display: flex;
  gap: 0;
  height: 100%;
  overflow: hidden;
  max-width: 100%;
`;

export const LeftSidebar = styled.div`
  width: 200px;
  flex-shrink: 0;
  padding: 12px;
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
`;

// === HEADER SECTION === //
export const HeaderSection = styled.div`
  border-bottom: 1px solid #0090cf33;
  padding-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FilterSection = styled.div`
  .ant-form-item {
    with: 100%;
    margin: 0;
  }
`;

export const TableContainer = styled.div`
  margin-top: 16px;
  
  .ant-table-tbody > tr {
    cursor: pointer;
  }

  .ant-table-thead > tr:last-child > th {
    display: none;
  }
`;

export const EventsHeaderTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  padding: 0;
  margin: 0;
`;

export const EventsHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

export const EventsCheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const EventsActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  .add-event-button {
    background: #E4F7FF;
    color: #0090CF;
    border: 1px solid #0090CF33;
  }
`;

export const EventsFilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 14px;
  
  .ant-form-item {
    margin-bottom: 0;
  }
`;

export const EventsFilterCol = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

// === SIDEBAR COMPONENTS === //
export const MailboxItem = styled.div`
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
`;

export const SidebarItem = styled(MailboxItem)``;

// === CALENDAR SIDEBAR === //
export const CalendarSidebarWrap = styled.div`
  .month-picker {
    margin-bottom: 16px;
  }

  .year-select {
    width: 100%;
    margin-bottom: 16px;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
`;

export const MonthButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$active ? "#0090cf" : "#d9d9d9")};
  background: ${(props) => (props.$active ? "#d9f2ff" : "#fff")};
  color: ${(props) => (props.$active ? "#0090cf" : "rgba(0, 0, 0, 0.85)")};
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$active ? "#d9f2ff" : "#f5f5f5")};
    border-color: #0090cf;
  }
`;

// === Message  === //
export const MessageContentHeader = styled.div`
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 16px;
`;

// === Events Table === //
export const DateCell = styled.div`
  line-height: 1.5;
  font-weight: 500;
`;

export const SessionCell = styled.div`
  font-weight: 500;
`;

export const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const EventTitle = styled.div`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
`;

export const EventLink = styled.a`
  color: #1890ff;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
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

// === WORK TAB COMPONENTS === //
export const WorkHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const WorkSectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
`;

export const WorkFilterWrap = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #0090cf33;
  margin-bottom: 16px;
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

  ${WorkSectionTitle} {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 8px;
  }
`;
