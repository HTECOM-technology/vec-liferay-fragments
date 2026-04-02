import styled from "styled-components";

export const Wrap = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

/* ---- Charts ---- */
export const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fff;
  padding: 16px;
`;

export const ChartCardTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
`;

export const ChartFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

export const ChartWrap = styled.div`
  width: 100%;
  height: 220px;
`;

/* ---- Tables ---- */
export const TableSection = styled.div``;

export const TableSectionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  background: ${({ $type }) =>
    $type === "done" ? "rgba(82, 196, 26, 0.12)" : "rgba(0, 144, 207, 0.12)"};
  color: ${({ $type }) =>
    $type === "done" ? "rgba(82, 196, 26, 1)" : "rgba(0, 144, 207, 1)"};
`;
