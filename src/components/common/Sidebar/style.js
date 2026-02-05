import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  font-weight: 500;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: #666;
  }

  &:hover {
    color: #0090cf;
    border-color: #0090cf;
    
    svg {
      color: #0090cf;
    }
  }

  ${(props) =>
    props.$active &&
    `
    background: #e6f7ff;
    color: #0090cf;
    border-color: #0090cf;
    font-weight: 600;
    
    svg {
      color: #0090cf;
    }
  `}
`;

export const SidebarLabel = styled.span`
  font-size: 14px;
`;
