import styled from "styled-components";
import { Row } from "antd";

export const PageWrap = styled.div`
  padding: 0;
`;

export const ContentWrap = styled.div`
  display: flex;
  gap: 0;
  height: 100%;
`;

export const LeftSidebar = styled.div`
  width: 180px;
  flex-shrink: 0;
  border-right: 1px solid #f0f0f0;
  padding: 16px 8px;
  background: #fff;
`;

export const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  padding: 16px;
  background: #fff;
`;

export const FilterSection = styled.div`
  margin-bottom: 16px;

  .ant-form-inline {
    .ant-form-item {
      margin-right: 12px;
      margin-bottom: 12px;
    }
    .ant-form-item-label > label {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.65);
    }
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
  margin-top: 16px;
`;

export const MailboxItem = styled.div`
  padding: 8px 12px;
  margin-bottom: 2px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.$active ? "#e6f7ff" : "transparent")};
  color: ${(props) => (props.$active ? "#1890ff" : "rgba(0, 0, 0, 0.85)")};
  font-size: 14px;
  border-radius: 4px;

  &:hover {
    background: ${(props) => (props.$active ? "#e6f7ff" : "#f5f5f5")};
  }

  .count {
    float: right;
    color: ${(props) => (props.$active ? "#1890ff" : "rgba(0, 0, 0, 0.45)")};
  }
`;

export const ActionIconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #0090cf26;
  color: #0090cf;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #0090cf;
    color: #fff;
  }
`;

export const AttachmentTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${(props) => {
    if (props.$type === "word") return "#e6f7ff";
    if (props.$type === "pdf") return "#fff1f0";
    if (props.$type === "excel") return "#f0f5ff";
    return "#f5f5f5";
  }};
  border-radius: 2px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
`;
