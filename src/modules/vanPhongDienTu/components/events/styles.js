import styled from "styled-components";

export const EventsHeaderTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  padding: 0;
  margin: 0;
  
  @media (max-width: 767px) {
    font-size: 14px;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const EventsHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  
  @media (max-width: 767px) {
    width: 100%;
  }
`;

export const EventsCheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 767px) {
    .ant-checkbox-wrapper {
      font-size: 13px;
    }
  }
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
  
  @media (max-width: 767px) {
    .ant-btn {
      min-width: 40px;
      padding: 4px 8px;
      
      &.add-event-button,
      &.ant-btn-primary {
        span:not(.anticon) {
          display: none;
        }
      }
    }
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
  
  @media (max-width: 767px) {
    margin-top: 12px;
    justify-content: flex-start;
  }
`;

export const EventsFilterCol = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

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

export const DateCell = styled.div`
  line-height: 1.5;
  font-weight: 500;
  
  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

export const SessionCell = styled.div`
  font-weight: 500;
  
  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

export const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  
  @media (max-width: 767px) {
    gap: 4px;
  }
`;

export const EventTitle = styled.div`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  
  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

export const EventLink = styled.a`
  color: #1890ff;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 767px) {
    font-size: 11px;
  }
`;