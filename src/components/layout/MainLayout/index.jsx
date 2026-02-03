import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Avatar, Badge, Button, Layout, theme } from "antd";
import { StyledLayout, StyledHeader, StyledContent, StyledTitle, AccountWrap, StyledFooter } from "./style";
import LeftMenu from "./components/LeftMenu";
import { menuSections } from "../../../router/menuConfig";
import { CInput } from "../../common";
import { SearchOutlined } from "@ant-design/icons";

const { Sider } = Layout;

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const pathname = useLocation().pathname;
  const listFlatMenu = menuSections.flatMap((section) => section.items);
  const currentMenu = listFlatMenu.find((item) => item.key === pathname);

  return (
    <StyledLayout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={300}>
        <div className="demo-logo-vertical" />
        <LeftMenu collapsed={collapsed} />
      </Sider>
      <Layout>
        <StyledHeader style={{ background: colorBgContainer, padding: 0 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.0833 1.75H2.91667C2.27233 1.75 1.75 2.27233 1.75 2.91667V11.0833C1.75 11.7277 2.27233 12.25 2.91667 12.25H11.0833C11.7277 12.25 12.25 11.7277 12.25 11.0833V2.91667C12.25 2.27233 11.7277 1.75 11.0833 1.75Z" stroke="#0090CF" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.25 1.75V12.25" stroke="#0090CF" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 28,
                height: 28,
                marginRight: 14,
                background: '#0090CF26',
              }}
            />
            <StyledTitle>{currentMenu?.label}</StyledTitle>
          </div>

          <CInput prefix={<SearchOutlined />} style={{ width: 600 }} placeholder="Tìm kiếm" />
          <AccountWrap>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: '7px 8px', border: '1px solid #0090CF33', borderRadius: 6, marginRight: 21 }}>
              <Avatar style={{ background: '#0090CF' }} size={40}>JD</Avatar>
              <div style={{ lineHeight: '16px' }}>
                <b>VEC Account</b> <br />
                vec.account@gmail.com
              </div>
            </div>
            <Badge count={1}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.55663 17.5C8.70291 17.7533 8.91331 17.9637 9.16666 18.11C9.42002 18.2563 9.70741 18.3333 9.99996 18.3333C10.2925 18.3333 10.5799 18.2563 10.8333 18.11C11.0866 17.9637 11.297 17.7533 11.4433 17.5" stroke="#6B7280" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.71833 12.7716C2.60947 12.8909 2.53763 13.0393 2.51155 13.1987C2.48547 13.3581 2.50627 13.5217 2.57142 13.6695C2.63658 13.8173 2.74328 13.9429 2.87855 14.0312C3.01381 14.1195 3.17182 14.1665 3.33333 14.1666H16.6667C16.8282 14.1667 16.9862 14.1198 17.1216 14.0317C17.2569 13.9436 17.3637 13.8181 17.4291 13.6704C17.4944 13.5227 17.5154 13.3592 17.4895 13.1998C17.4637 13.0404 17.392 12.8919 17.2833 12.7725C16.175 11.63 15 10.4158 15 6.66663C15 5.34054 14.4732 4.06877 13.5355 3.13109C12.5979 2.19341 11.3261 1.66663 10 1.66663C8.67392 1.66663 7.40215 2.19341 6.46447 3.13109C5.52679 4.06877 5 5.34054 5 6.66663C5 10.4158 3.82417 11.63 2.71833 12.7716Z" stroke="#6B7280" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </Badge>
          </AccountWrap>

        </StyledHeader>
        <StyledContent>
          <Outlet />
        </StyledContent>
        <StyledFooter>
          © 2026. Bản quyền thuộc về VEC
        </StyledFooter>
      </Layout>
    </StyledLayout>
  );
}

export default MainLayout;
