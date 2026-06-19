import styled from "styled-components";

export const Wrap = styled.div`
  padding: 24px;

  @media (max-width: 1199px) {
    padding: 12px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;

  @media (max-width: 991px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

export const Card = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 16px;
  border: 1px solid rgba(0, 144, 207, 0.2);
  border-radius: 8px;
  background: rgba(248, 249, 250, 1);
  cursor: pointer;
  text-decoration: none;
  min-width: 0;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #0090cf;
  }

  @media (max-width: 1199px) {
    padding: 16px 8px;
    gap: 8px;
    border-radius: 6px;

    svg {
      width: 28px;
      height: 28px;
    }
  }

  @media (max-width: 400px) {
    padding: 12px 6px;
    gap: 6px;
  }
`;

export const CardLabel = styled.div`
  font-size: 16px;
  color: rgba(107, 114, 128, 1);
  text-align: center;
  line-height: 1.5;
  font-weight: 500;
  white-space: pre-line;

  @media (max-width: 1199px) {
    font-size: 12px;
    line-height: 1.4;
  }

  @media (max-width: 400px) {
    font-size: 11px;
  }
`;

export const SubLabel = styled.div`
  font-size: 12px;
  color: rgba(107, 114, 128, 1);
  text-align: center;
  line-height: 1.4;
  margin-top: -8px;
  font-weight: 400;
  font-style: italic;
`;
