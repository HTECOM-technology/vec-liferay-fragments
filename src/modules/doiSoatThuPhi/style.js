import styled from "styled-components";
import { Col, Row } from "antd";

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
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: #0090cf;
    color: #fff;
  }
`;

export const PanelsContainer = styled.div`
  display: flex;
`;

export const Panel = styled.div`
  border: 1px solid rgba(0, 144, 207, 0.1);
  border-radius: 6px;
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  padding: 12px 16px;
  background: rgba(248, 249, 250, 1);
  border-bottom: 1px solid rgba(0, 144, 207, 0.1);
  font-weight: 700;
  font-style: Bold;
  font-size: 16px;
  line-height: 17.5px;
  letter-spacing: 0px;

  color: rgba(30, 30, 30, 1);
`;

export const PanelContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoRow = styled.div`
  display: flex;
  gap: 4px;

  .label {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 500;
  }

  .value {
    font-size: 14px;
    color: rgba(30, 30, 30, 1);
    font-weight: 400;
  }
`;

export const StatusBadge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(82, 196, 26, 0.1);
  color: rgba(82, 196, 26, 1);
`;

export const DetailButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  background: rgba(0, 144, 207, 1);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.2s;
  outline: none;
  width: 100%;

  &:hover {
    background: #007bb5;
  }
`;

export const ColumnButton = styled(Col)`
  text-align: right;
  @media (max-width: 480px) {
    text-align: center;
    margin: 20px 0;
  }
`;
