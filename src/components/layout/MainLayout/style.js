import { Layout } from "antd";
import styled from "styled-components";

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

export const StyledHeader = styled(Layout.Header)`
  padding: 7px 24px 7px 14px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;

`;

export const StyledContent = styled(Layout.Content)`
  margin: 12px;
  padding: 12px;
  min-height: 280px;
  background: #fff;
  border-radius: 8px;
`;

export const StyledLeftMenu = styled.div`
  height: 100%;
  border-right: 0;
  position: relative;
  background: linear-gradient(180deg, #e5f7ff 0%, #88cdeb 100%);
  padding: 7px;

  .logo {
    width: 64px;
    height: 100%;
    object-fit: contain;
  }

  .title-vn {
    font-family: "Roboto Condensed", sans-serif !important;
    font-weight: 700;
    font-style: Bold;
    font-size: 13px;
    line-height: 100%;
    letter-spacing: 0%;
    text-transform: uppercase;
    color: #e31c2a;
    margin-bottom: 4px;
  }
  .title-us {
    font-family: "Roboto Condensed", sans-serif !important;
    font-weight: 700;
    font-style: Bold;
    font-size: 10px;
    line-height: 100%;
    letter-spacing: 0%;
    text-transform: uppercase;
    color: #0090cf;
  }
`;

export const StyledBgMenu = styled.img`
  width: 100%;
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0.3;
`;

export const MenuWrap = styled.nav`
  padding: 7px;
  margin-top: 12px;
`;

export const SectionTitle = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0px;
  color: #6b7280;
  margin-bottom: 10px;
`;

export const ItemWrap = styled.div`
  position: relative;
  margin-bottom: 2px;
`;

export const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px 10px 12px;
  border: none;
  cursor: pointer;
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0px;

  background: ${(p) => (p.$active ? "#0090cf" : "transparent")};
  color: ${(p) => (p.$active ? "#fff" : "#333")};
  border-radius: 6px !important;
  transition: background 0.15s, color 0.15s;
  border-left: 3px solid transparent;
  border-color: ${(p) => (p.$active ? "#e31c2a" : "transparent")};

  &:hover {
    background: ${(p) => (p.$active ? "#0090cf" : "rgba(0, 144, 207, 0.12)")};
  }
`;

export const ActiveBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: #e31c2a;
  border-radius: 0 2px 2px 0;
`;

export const StyledTitle = styled.p`
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0px;
  margin-bottom: 0;
`;

export const AccountWrap = styled.div`
  display: flex;
  align-items: center;
`

export const StyledFooter = styled(Layout.Footer)`
  text-align: center;
  padding: 12px;
  background: #0090CF;
  line-height: 29px;
  color: #fff;
`;