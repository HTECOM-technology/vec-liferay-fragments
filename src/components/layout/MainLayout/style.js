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

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
`;

export const StyledHeader = styled(Layout.Header)`
  padding: 7px 24px 7px 14px !important;
  height: 70px;

  .search-icon-btn {
    display: none;
  }

  @media (max-width: 1270px) {
    height: fit-content;

    .ant-flex .search-input {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 17px 20px !important;

    .menu-toggle-btn {
      display: none;
    }

    .search-input {
      display: none !important;
    }

    .search-icon-btn {
      display: flex !important;
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

  @media (max-width: 768px) {
    overflow-y: visible;
    min-height: auto;
  }
`;

export const StyledLeftMenu = styled.div`
  height: 100%;
  border-right: 0;
  position: relative;
  background: linear-gradient(180deg, #e5f7ff 0%, #88cdeb 100%);
  padding: 7px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

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
    padding: 0;
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
  flex: 1;
  min-height: 0;
  overflow-y: auto;
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
    position: sticky;
    top: 0;
    z-index: 100;
  }
`;

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    display: none;
  }
  .ant-drawer-body {
    padding: 0;
  }
  .ant-drawer-content {
    background: linear-gradient(180deg, #e5f7ff 0%, #88cdeb 258.57%);
  }
`;

export const DrawerHeader = styled.div`
  position: relative;
  background: rgba(0, 144, 207, 0.12);
  border-bottom: 1px solid rgba(0, 144, 207, 0.2);
  padding: 14px 48px 14px 14px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 144, 207, 0.18);
  }
`;

export const DrawerCloseBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.08);
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

export const StyledBottomSheet = styled(Drawer)`
  .ant-drawer-content {
    border-radius: 16px 16px 0 0;
  }
  .ant-drawer-header {
    display: none;
  }
  .ant-drawer-body {
    padding: 20px 16px 32px;
  }
`;

export const BottomSheetHandle = styled.div`
  width: 36px;
  height: 4px;
  background: #d9d9d9;
  border-radius: 2px;
  margin: 0 auto 16px;
`;

export const BottomSheetItem = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 4px;
  font-size: 15px;
  font-weight: 500;
  color: #222;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

export const BottomSheetLogout = styled(BottomSheetItem)`
  color: #e31c2a;
  border-top: 1px solid #f0f0f0;
  margin-top: 4px;
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
  flex-shrink: 0;
  align-self: center;
  margin: 8px auto 12px;
  z-index: 1;
  border: none !important;
`;

export const SearchOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1050;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
`;

export const SearchBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  width: 560px;
  max-width: 90vw;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);

  .ant-input-affix-wrapper {
    width: 100% !important;
    height: 44px;
    font-size: 16px;
    border-radius: 8px;
  }

  .ant-input {
    font-size: 16px;
  }
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
