import React, { useState, useCallback, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Flex, Layout, Popover, theme } from "antd";
import { StyledLayout, StyledHeader, StyledContent, StyledTitle, AccountWrap, StyledFooter, StyledSider, StyledHeaderMobile, StyledDrawer, WrapSubHeader } from "./style";
import LeftMenu from "./components/LeftMenu";
import { menuItems, paths } from "../../../router/menuConfig";
import { CInput } from "../../common";
import { SearchOutlined } from "@ant-design/icons";
import logo from "../../../assets/layout/logo.png";
import styled from "styled-components";

const LogoutItem = styled.div`
  cursor: pointer;
  padding: 8px 22px;
  color: #353535;
  font-weight: 500;
  min-width: 200px;
  border-radius: 6px;

  &:hover {
    color: #e31c2a;
    background: #fff1f0;
  }
`;

const LinkItem = styled.div`
  cursor: pointer;
  padding: 8px 22px;
  font-weight: 500;
  min-width: 200px;
  border-radius: 6px;
  color: #353535;
  &:hover {
    color: rgb(0, 144, 207);
    background: rgba(0, 144, 207, 0.1);
  }

  a{
    color: rgb(0, 144, 207);
  }
`;

const UserItem = styled.div`
  cursor: pointer;
  padding: 4px 8px;
  font-weight: 500;
  min-width: 200px;
  border-radius: 6px;
  color: rgb(0, 144, 207);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  &:hover {
    background: rgba(0, 144, 207, 0.1);
  }

  svg{
    width: 16px;
    height: 16px;
    color: rgb(0, 144, 207);
    fill: rgb(0, 144, 207);
  }
`;

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setPopoverOpen(false);
    window.location.href = "/c/portal/logout";
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const pathname = useLocation().pathname;
  const currentMenu = menuItems.find((item) => item.key === pathname);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    if (window.Liferay) {
      window.Liferay.Service(
        "/user/get-user-by-id",
        { userId: window.Liferay.ThemeDisplay.getUserId() },
        (user) => {
          if (user) {
            const firstName = user.firstName || "";
            const lastName = user.lastName || "";
            const email = user.emailAddress || "";
            const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
            const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";

            const fullName = `${lastName} ${firstName}`.trim();
            const shortName = `${lastInitial}${firstInitial}`;

            if (fullName) {
              setUserName(fullName);
            }

            if (email) {
              setUserEmail(email);
            }

            if (shortName) {
              setUserInitials(shortName);
            }
          }
        }
      );
    }
  }, []);

  return (

    <StyledLayout>
      <StyledSider trigger={null} collapsible collapsed={collapsed} width={300}>
        <div className="demo-logo-vertical" />
        <LeftMenu collapsed={collapsed} />
      </StyledSider>
      <Layout>
        <StyledHeaderMobile>
          <img src={logo} alt="logo" className="logo" />

          <Flex vertical={false} align="center" justify="center">
            <Badge count={1}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.55663 17.5C8.70291 17.7533 8.91331 17.9637 9.16666 18.11C9.42002 18.2563 9.70741 18.3333 9.99996 18.3333C10.2925 18.3333 10.5799 18.2563 10.8333 18.11C11.0866 17.9637 11.297 17.7533 11.4433 17.5" stroke="#6B7280" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M2.71833 12.7716C2.60947 12.8909 2.53763 13.0393 2.51155 13.1987C2.48547 13.3581 2.50627 13.5217 2.57142 13.6695C2.63658 13.8173 2.74328 13.9429 2.87855 14.0312C3.01381 14.1195 3.17182 14.1665 3.33333 14.1666H16.6667C16.8282 14.1667 16.9862 14.1198 17.1216 14.0317C17.2569 13.9436 17.3637 13.8181 17.4291 13.6704C17.4944 13.5227 17.5154 13.3592 17.4895 13.1998C17.4637 13.0404 17.392 12.8919 17.2833 12.7725C16.175 11.63 15 10.4158 15 6.66663C15 5.34054 14.4732 4.06877 13.5355 3.13109C12.5979 2.19341 11.3261 1.66663 10 1.66663C8.67392 1.66663 7.40215 2.19341 6.46447 3.13109C5.52679 4.06877 5 5.34054 5 6.66663C5 10.4158 3.82417 11.63 2.71833 12.7716Z"
                  stroke="#6B7280"
                  stroke-width="1.16667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Badge>
            <Button
              className="menu-toggle-btn-mobile"
              style={{ marginLeft: 24 }}
              icon={
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.75 4.25H11.25M0.75 0.75H11.25M0.75 7.75H11.25" stroke="#0090CF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              }
              onClick={() => setShowDrawer(true)}
            />
          </Flex>
        </StyledHeaderMobile>

        <StyledHeader style={{ background: colorBgContainer, padding: 0 }}>
          <Flex vertical={false} align="center" justify="space-between">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="text"
                className="menu-toggle-btn"
                icon={
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.0833 1.75H2.91667C2.27233 1.75 1.75 2.27233 1.75 2.91667V11.0833C1.75 11.7277 2.27233 12.25 2.91667 12.25H11.0833C11.7277 12.25 12.25 11.7277 12.25 11.0833V2.91667C12.25 2.27233 11.7277 1.75 11.0833 1.75Z" stroke="#0090CF" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.25 1.75V12.25" stroke="#0090CF" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                }
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  width: 28,
                  height: 28,
                  marginRight: 14,
                  background: "#0090CF26",
                }}
              />
              <StyledTitle>{currentMenu?.label}</StyledTitle>
            </div>

            <CInput prefix={<SearchOutlined />} style={{ width: 600, maxWidth: "30vw" }} placeholder="Tìm kiếm" className="search-input" />
            <AccountWrap>
              <Popover
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
                trigger="click"
                placement="bottomRight"
                content={
                  userName ? (
                    <div>
                      {/* <UserItem>
                        <svg
                          className="lexicon-icon lexicon-icon-user"
                          role="presentation"
                        >
                          <use href="http://45.77.240.85:8080/o/classic-theme/images/clay/icons.svg#user" />
                        </svg>
                        {userName}
                      </UserItem> */}

                      <LinkItem onClick={() => window.location.href = "/web/guest/trangchu"}>
                        Quản trị hệ thống
                      </LinkItem>

                      <LogoutItem onClick={handleLogout}>
                        Đăng xuất
                      </LogoutItem>
                    </div>
                  ) : null
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", border: "1px solid #0090CF33", borderRadius: 6, marginRight: 21, cursor: "pointer" }}>
                  <Avatar style={{ background: "#0090CF" }} size={40}>
                    {userInitials ? userInitials : 'JD'}
                  </Avatar>
                  <div style={{ lineHeight: "16px" }}>
                    <b>{userName ? userName : 'VEC Account'}</b> <br />
                    {userEmail ? userEmail : 'vec.account@gmail.com'}
                  </div>
                </div>
              </Popover>
              <Badge count={1}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.55663 17.5C8.70291 17.7533 8.91331 17.9637 9.16666 18.11C9.42002 18.2563 9.70741 18.3333 9.99996 18.3333C10.2925 18.3333 10.5799 18.2563 10.8333 18.11C11.0866 17.9637 11.297 17.7533 11.4433 17.5" stroke="#6B7280" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="M2.71833 12.7716C2.60947 12.8909 2.53763 13.0393 2.51155 13.1987C2.48547 13.3581 2.50627 13.5217 2.57142 13.6695C2.63658 13.8173 2.74328 13.9429 2.87855 14.0312C3.01381 14.1195 3.17182 14.1665 3.33333 14.1666H16.6667C16.8282 14.1667 16.9862 14.1198 17.1216 14.0317C17.2569 13.9436 17.3637 13.8181 17.4291 13.6704C17.4944 13.5227 17.5154 13.3592 17.4895 13.1998C17.4637 13.0404 17.392 12.8919 17.2833 12.7725C16.175 11.63 15 10.4158 15 6.66663C15 5.34054 14.4732 4.06877 13.5355 3.13109C12.5979 2.19341 11.3261 1.66663 10 1.66663C8.67392 1.66663 7.40215 2.19341 6.46447 3.13109C5.52679 4.06877 5 5.34054 5 6.66663C5 10.4158 3.82417 11.63 2.71833 12.7716Z"
                    stroke="#6B7280"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Badge>
            </AccountWrap>
          </Flex>
          <WrapSubHeader>
            <CInput prefix={<SearchOutlined />} placeholder="Tìm kiếm" className="search-input" />
          </WrapSubHeader>
        </StyledHeader>

        <StyledContent>
          <Outlet />
        </StyledContent>
        <StyledFooter>© 2026. Bản quyền thuộc về VEC</StyledFooter>
      </Layout>
      <StyledDrawer width={"90vw"} placement="left" open={showDrawer} onClose={() => setShowDrawer(false)}>
        <LeftMenu collapsed={false} setShowDrawer={setShowDrawer} isMobile={true} showDrawer={showDrawer} />
      </StyledDrawer>
    </StyledLayout>
  );
}

export default MainLayout;
