import styled from "styled-components";

export const PageWrap = styled.div`
  padding: 0;
`;

export const DashboardContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
`;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RightSection = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CardsRow = styled.div`
  display: flex;
  gap: 16px;
`;

// Widget Card Styles
export const WidgetCard = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0, 144, 207, 0.2);
  overflow: hidden;
`;

export const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${(props) => props.$bgColor || "#f8f9fa"};
  border-bottom: 1px solid rgba(0, 144, 207, 0.2);

  .header-icon {
    width: 28px;
    height: 28px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.$iconBg || "#0090cf"};
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
  }

  .header-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
`;

export const WidgetBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 7px;
  padding: 7px;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid rgba(0, 144, 207, 0.2);

  .stat-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 16px;
    background: rgba(248, 249, 250, 1);
  }

  .stat-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
    text-align: start;
    line-height: 1.3;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #333;
  }

  .stat-unit {
    font-size: 12px;
    color: #666;
    font-weight: 400;
    margin-left: 2px;
  }
`;

export const TextWrapper = styled.div`

`;

// Traffic Widget specific styles
export const TrafficWidgetBody = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
`;

export const TrafficStatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-right: ${(props) => (props.$noBorderRight ? "none" : "1px solid #f0f0f0")};

  .stat-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 16px;
    

    &.blue {
      background: rgba(0, 144, 207, 0.1);
      color: #0090cf;
    }
    &.orange {
      background: rgba(255, 152, 0, 0.1);
      color: #ff9800;
    }
    &.green {
      background: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }
    &.red {
      background: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }
  }

  .stat-label {
    font-size: 11px;
    color: #666;
    margin-bottom: 4px;
    text-align: center;
    line-height: 1.3;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }

  .stat-unit {
    font-size: 11px;
    color: #666;
    font-weight: 400;
    margin-left: 2px;
  }
`;

// Right Side Quick Links
export const QuickLinkCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0px 16px 0px 0px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0, 144, 207, 0.2);
  cursor: pointer;
  transition: all 0.2s;
  background-color: rgba(229, 247, 255, 1);

  &:hover {
    border-color: ${(props) => props.$hoverColor || "rgba(0, 144, 207, 0.2)"};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .link-icon {
    height: 42px;
  }

  .link-title {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 144, 207, 1);
  }
`;

export const DragBtnWrap = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 1199px) {
    display: none;
  }
`;

export const BtnChangeDragOverlay = styled.button`
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  border: none;
  outline: none;
  background: #0090CF;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: rgba(0, 144, 207, 0.8);
  }
`;
