import styled from "styled-components";

export const Wrap = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 767px) {
    padding: 0px;
    gap: 20px;
  }
`;

/* ---- Charts ---- */
export const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const ChartCard = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fff;
  padding: 16px;

  @media (max-width: 767px) {
    padding: 12px;
  }
`;

export const ChartCardTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;

  @media (max-width: 767px) {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

export const ChartFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;

  @media (max-width: 767px) {
    gap: 6px;
    margin-bottom: 12px;

    .ant-btn {
      flex: 1 1 100%;
    }
  }
`;

export const FilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 767px) {
    flex: 1 1 calc(50% - 3px);
    min-width: 0;

    .ant-select,
    .ant-picker {
      width: 100% !important;
      min-width: 0 !important;
      flex: 1;
    }
  }
`;

export const ChartWrap = styled.div`
  width: 100%;
  height: 220px;

  @media (max-width: 767px) {
    height: 180px;
  }
`;

/* ---- Tables ---- */
export const TableSection = styled.div`
  .ant-table-thead > tr > th {
    white-space: nowrap;
  }

  @media (max-width: 767px) {
    .ant-table {
      font-size: 12px;
    }

    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 6px 8px !important;
      font-size: 12px;
    }
  }
`;

export const TableSectionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;

  @media (max-width: 767px) {
    font-size: 13px;
    margin-bottom: 8px;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  background: ${({ $type }) =>
    $type === "done" ? "rgba(82, 196, 26, 0.12)" : "rgba(0, 144, 207, 0.12)"};
  color: ${({ $type }) =>
    $type === "done" ? "rgba(82, 196, 26, 1)" : "rgba(0, 144, 207, 1)"};

  @media (max-width: 767px) {
    font-size: 11px;
    padding: 2px 6px;
  }
`;
