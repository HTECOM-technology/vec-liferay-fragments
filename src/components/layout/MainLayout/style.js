import { Button, Drawer, Layout } from "antd";
import styled from "styled-components";
const { Sider } = Layout;

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

export const StyledInnerLayout = styled(Layout)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const StyledHeader = styled(Layout.Header)`
  padding: 7px 24px 7px 14px !important;
  height: 70px;

  @media (max-width: 768px) {
    padding: 17px 20px !important;
    .menu-toggle-btn {
      display: none;
    }

    .search-input {
      width: 210px !important;
      max-width: 60%;
      display: flex !important;
    }
  }

  @media (max-width: 1270px) {
    height: fit-content;

    .ant-flex .search-input {
      display: none;
    }
  }
`;

export const StyledContent = styled(Layout.Content)`
  margin: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #0090cf33;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
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
    font-family: "Inter", sans-serif !important;
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
    font-family: "Inter", sans-serif !important;
    font-weight: 700;
    font-style: Bold;
    font-size: 10px;
    line-height: 100%;
    letter-spacing: 0%;
    text-transform: uppercase;
    color: #0090cf;
  }

  @media (max-width: 768px) {
    padding: 26px 14px;
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
  z-index: 1;
  position: relative;
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
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0px;
  font-family: "Inter", sans-serif !important;

  background: ${(p) => (p.$active ? "#0090cf" : "transparent")};
  color: ${(p) => (p.$active ? "#fff" : "#333")};
  border-radius: 6px !important;
  transition:
    background 0.15s,
    color 0.15s;
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
  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledFooter = styled(Layout.Footer)`
  text-align: center;
  padding: 12px;
  background: #0090cf;
  line-height: 29px;
  color: #fff;
  flex-shrink: 0;
`;

export const StyledSider = styled(Sider)`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledHeaderMobile = styled.div`
  display: none;
  padding: 7px 20px;
  background: linear-gradient(180deg, #e5f7ff 0%, #88cdeb 258.57%);
  .menu-toggle-btn-mobile {
    height: 28px;
    width: 28px;
    background: #0090cf26 !important;
    border: none !important;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    display: none;
  }
  .ant-drawer-body {
    padding: 0;
  }
  .ant-drawer-content-wrapper {
    width: 300px !important;
  }
  .ant-drawer-content {
    background: linear-gradient(180deg, #e5f7ff 0%, #88cdeb 258.57%);
  }
`;

export const StyledBtnVEC = styled(Button)`
  width: 184px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 6px;
  background-color: #e31c2a !important;
  color: #ffffff !important;
  position: absolute;
  bottom: 102px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  border: none !important;
`;

export const WrapSubHeader = styled.div`
  display: none;
  @media (max-width: 1270px) {
    display: block;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;
