import styled from "styled-components";

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
  
  @media (max-width: 1199px) {
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

export const MessageContentHeader = styled.div`
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 16px;
`;