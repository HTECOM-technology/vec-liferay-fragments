import styled from "styled-components";

export const Wrap = styled.div`
  padding: 0 24px 24px;

  @media (max-width: 767px) {
    padding: 0 8px 16px;
  }
`;

export const Section = styled.div`
  margin-bottom: 24px;

  @media (max-width: 767px) {
    margin-bottom: 16px;
  }

  .ant-table-container {
    border-color: rgba(132, 131, 128, 0.2) !important;
  }

  .ant-table-measure-row {
    display: none !important;
  }

  .ant-table-container table {
    border-radius: 6px;
  }

  .ant-table-bordered > .ant-table-container {
    border-inline-start: 1px solid rgba(132, 131, 128, 0.2) !important;
    border-top: 1px solid rgba(132, 131, 128, 0.2) !important;
  }

  .ant-table-thead > tr > th {
    text-align: center;
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    border-color: rgba(132, 131, 128, 0.2) !important;
  }

  .ant-table-tbody > tr > td:first-child {
    border-right: 1px solid #fff !important;
    border-top: 1px solid #fff !important;
  }

  .ant-table-tbody > tr > td:last-child {
    border-color: #fff !important;
    border-bottom: 1px solid rgba(132, 131, 128, 0.2) !important;
    border-right: 1px solid rgba(132, 131, 128, 0.2) !important;
  }

  @media (max-width: 767px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px !important;
      font-size: 12px;
    }
  }

  @media (max-width: 575px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 6px !important;
    }
  }
`;

export const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;

  @media (max-width: 767px) {
    font-size: 13px;
  }
`;

export const SenderCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;

  @media (max-width: 767px) {
    font-size: 12px;
    gap: 4px;
    flex-direction: column;
  }

  .anticon {
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
  }
`;

export const NotificationTitle = styled.a`
  color: #0090cf;
  font-size: 14px;
  display: block;
  line-height: 1.5;

  @media (max-width: 767px) {
    font-size: 13px;
  }

  &:hover {
    text-decoration: underline;
    color: #0078b0;
  }
`;

export const NotificationDesc = styled.div`
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
  line-height: 1.5;

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;
