import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Avatar, Badge, Button, Flex, Layout, Popover, theme, message } from "antd";
import { StyledLayout, StyledInnerLayout, StyledHeader, StyledContent, StyledTitle, AccountWrap, StyledFooter, StyledSider, StyledHeaderMobile, StyledDrawer, StyledBottomSheet, BottomSheetHandle, BottomSheetItem, BottomSheetLogout, WrapSubHeader, SearchOverlay, SearchBox } from "./style";
import LeftMenu from "./components/LeftMenu";
import HrmNotificationsModal from "./components/HrmNotificationsModal";
import { menuSections } from "../../../router/menuConfig";
import { CInput } from "../../common";
import { SearchOutlined } from "@ant-design/icons";
import logo from "../../../assets/layout/logo.png";
import styled from "styled-components";
import { TitleNotiWrapper, TitleNoti, QuantityNoti, TitlePopover } from "./notistyle";
import { ttnsService } from "../../../services/ttnsService";
import { getTtnsUserId, getUserInfo } from "../../../utils";

const HRM_NOTIFICATION_PAGE_SIZE = 10;
const HRM_GROUP_KEYS = new Set(["18", "31", "33", "97", "99", "97_99"]);

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


function isHrmNotification(item) {
  const groupCode = String(
    item?.group_code ??
    item?.notify_group_code ??
    item?.groupCode ??
    item?.notify?.group_code ??
    ""
  ).trim();

  if (!groupCode) {
    return true;
  }

  return HRM_GROUP_KEYS.has(groupCode);
}

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [notifyPopoverOpen, setNotifyPopoverOpen] = useState(false);
  const [mobileNotifyPopoverOpen, setMobileNotifyPopoverOpen] = useState(false);
  const [hrmNotificationCount, setHrmNotificationCount] = useState(0);
  const [hrmModalOpen, setHrmModalOpen] = useState(false);
  const [hrmNotifications, setHrmNotifications] = useState([]);
  const [hrmNotificationsTotal, setHrmNotificationsTotal] = useState(0);
  const [hrmNotificationsPage, setHrmNotificationsPage] = useState(1);
  const [hrmNotificationsLoading, setHrmNotificationsLoading] = useState(false);
  const [hrmNotificationsLoadingMore, setHrmNotificationsLoadingMore] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hrmTogglingCode, setHrmTogglingCode] = useState(null);

  useEffect(() => {
    if (!searchOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") setSearchOpen(false); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [searchOpen]);

  useEffect(() => {
    if (showDrawer) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [showDrawer]);

  const handleLogout = useCallback(() => {
    setPopoverOpen(false);
    window.location.href = "/c/portal/logout";
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const pathname = useLocation().pathname;
  const allItems = menuSections.flatMap((s) => s.items);

  const currentMenu = allItems.find((item) => item.key === pathname);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [currentUserId, setCurrentUserId] = useState(0);
  const [hrmUserId, setHrmUserId] = useState(null);
  const notifications = useMemo(() => ([
    { key: "general", title: "Thông báo mới", count: 0 },
    { key: "hrm", title: "Tổng hợp nhân sự", count: hrmNotificationCount },
    { key: "work", title: "Công việc", count: 0 },
  ]), [hrmNotificationCount]);
  const totalCount = notifications.reduce((sum, item) => sum + item.count, 0);

  const hasMoreHrmNotifications = hrmNotifications.length < hrmNotificationsTotal;

  const fetchHrmNotifications = useCallback(async ({ page, append }) => {
    if (!hrmUserId) {
      return;
    }

    if (append) {
      setHrmNotificationsLoadingMore(true);
    } else {
      setHrmNotificationsLoading(true);
    }

    try {
      const response = await ttnsService.getNotifications({
        userId: hrmUserId,
        page,
        pageSize: HRM_NOTIFICATION_PAGE_SIZE,
      });

      const nextItems = (response?.items || []).filter(isHrmNotification);

      setHrmNotifications((prev) => (append ? [...prev, ...nextItems] : nextItems));
      setHrmNotificationsTotal(Number(response?.total) || 0);
      setHrmNotificationsPage(Number(response?.page) || page);
    } catch (error) {
      message.error(ttnsService.getErrorMessage(error));
    } finally {
      if (append) {
        setHrmNotificationsLoadingMore(false);
      } else {
        setHrmNotificationsLoading(false);
      }
    }
  }, [hrmUserId]);

  const handleToggleHrmNotificationRead = useCallback(
  async (record) => {
    const code = record.code || record.notify_code;
    if (!hrmUserId || !code || hrmTogglingCode === code) return;

    const previousSent = record.sent;
    setHrmTogglingCode(code);

    setHrmNotifications((prev) =>
      prev.map((item) =>
        (item.code || item.notify_code) === code ? { ...item, sent: !previousSent } : item
      )
    );
    setHrmNotificationCount((prev) => {
      const wasUnread = Number(previousSent) === 0;
      return wasUnread ? Math.max(0, prev - 1) : prev + 1;
    });

    try {
      const result = await ttnsService.markNotificationRead({
        code,
        userId: hrmUserId,
      });

      if (typeof result?.sent === "boolean" && result.sent === previousSent) {
        setHrmNotifications((prev) =>
          prev.map((item) =>
            (item.code || item.notify_code) === code ? { ...item, sent: result.sent } : item
          )
        );
      }
    } catch (error) {
      setHrmNotifications((prev) =>
        prev.map((item) =>
          (item.code || item.notify_code) === code ? { ...item, sent: previousSent } : item
        )
      );
      setHrmNotificationCount((prev) => {
        const wasUnread = Number(previousSent) === 0;
        return wasUnread ? prev + 1 : Math.max(0, prev - 1);
      });
      message.error(ttnsService.getErrorMessage(error));
    } finally {
      setHrmTogglingCode(null);
    }
  },
  [hrmUserId, hrmTogglingCode]
);

  const handleOpenHrmModal = useCallback(() => {
    setNotifyPopoverOpen(false);
    setHrmModalOpen(true);
    fetchHrmNotifications({ page: 1, append: false });
  }, [fetchHrmNotifications]);

  const handleCloseHrmModal = useCallback(() => {
    setHrmModalOpen(false);
  }, []);

  const handleLoadMoreHrmNotifications = useCallback(() => {
    if (!hasMoreHrmNotifications || hrmNotificationsLoadingMore) {
      return;
    }

    fetchHrmNotifications({ page: hrmNotificationsPage + 1, append: true });
  }, [fetchHrmNotifications, hasMoreHrmNotifications, hrmNotificationsLoadingMore, hrmNotificationsPage]);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const user = await getUserInfo();

      if (!isMounted || !user) {
        return;
      }

      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const email = user.emailAddress || "";
      const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
      const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";

      const fullName = `${lastName} ${firstName}`.trim();
      const shortName = `${lastInitial}${firstInitial}`;

      setCurrentUserId(getTtnsUserId(user));

      if (fullName) {
        setUserName(fullName);
      }

      if (email) {
        setUserEmail(email);
      }

      if (shortName) {
        setUserInitials(shortName);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const resolveHrmUserId = async () => {
      if (!userEmail) return;

      try {
        const items = await ttnsService.getAllEmployees();

        const matched = items.find(
          (item) => (item.email_cty || "").trim().toLowerCase() === userEmail.trim().toLowerCase()
        );

        if (!isMounted) return;

        if (matched && matched.user_id) {
          setHrmUserId(matched.user_id);
        } else {
          setHrmUserId(null);
          message.warning("Không tìm thấy thông tin nhân sự tương ứng với email của bạn. Một số thông báo có thể không hiển thị.");
        }
      } catch (error) {
        if (isMounted) {
          message.error(ttnsService.getErrorMessage(error));
        }
      }
    };

    resolveHrmUserId();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  useEffect(() => {
    let isMounted = true;

    const loadHrmCounter = async () => {
      if (!hrmUserId) {
        return;
      }

      try {
        const response = await ttnsService.getUnreadCount({ userId: hrmUserId });

        if (!isMounted) {
          return;
        }

        setHrmNotificationCount(Number(response?.unread_count) || 0);
      } catch (error) {
        if (isMounted) {
          setHrmNotificationCount(0);
        }
      }
    };

    loadHrmCounter();

    return () => {
      isMounted = false;
    };
  }, [hrmUserId]);

  return (

    <StyledLayout>
      <StyledSider trigger={null} collapsible collapsed={collapsed} width={300}>
        <div className="demo-logo-vertical" />
        <LeftMenu collapsed={collapsed} />
      </StyledSider>
      <StyledInnerLayout>
        <StyledHeaderMobile>
          <img src={logo} alt="logo" className="logo" />

          <Flex vertical={false} align="center" justify="center">
            <Badge count={totalCount}>
              <Popover
                open={mobileNotifyPopoverOpen}
                onOpenChange={setMobileNotifyPopoverOpen}
                trigger="click"
                placement="bottomRight"
                content={<>
                  <TitlePopover>Thông báo</TitlePopover>
                  <hr style={{ marginBottom: "10px" }} />
                  {notifications.map((item, index) => (
                    <TitleNotiWrapper key={index} onClick={item.key === "hrm" ? handleOpenHrmModal : undefined}>
                      <TitleNoti>{item.title}</TitleNoti>
                      <div className="count-number">
                        <QuantityNoti>{item.count}</QuantityNoti>
                      </div>
                    </TitleNotiWrapper>
                  ))}
                </>}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }}>
                  <path d="M8.55663 17.5C8.70291 17.7533 8.91331 17.9637 9.16666 18.11C9.42002 18.2563 9.70741 18.3333 9.99996 18.3333C10.2925 18.3333 10.5799 18.2563 10.8333 18.11C11.0866 17.9637 11.297 17.7533 11.4433 17.5" stroke="#6B7280" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    d="M2.71833 12.7716C2.60947 12.8909 2.53763 13.0393 2.51155 13.1987C2.48547 13.3581 2.50627 13.5217 2.57142 13.6695C2.63658 13.8173 2.74328 13.9429 2.87855 14.0312C3.01381 14.1195 3.17182 14.1665 3.33333 14.1666H16.6667C16.8282 14.1667 16.9862 14.1198 17.1216 14.0317C17.2569 13.9436 17.3637 13.8181 17.4291 13.6704C17.4944 13.5227 17.5154 13.3592 17.4895 13.1998C17.4637 13.0404 17.392 12.8919 17.2833 12.7725C16.175 11.63 15 10.4158 15 6.66663C15 5.34054 14.4732 4.06877 13.5355 3.13109C12.5979 2.19341 11.3261 1.66663 10 1.66663C8.67392 1.66663 7.40215 2.19341 6.46447 3.13109C5.52679 4.06877 5 5.34054 5 6.66663C5 10.4158 3.82417 11.63 2.71833 12.7716Z"
                    stroke="#6B7280"
                    strokeWidth="1.16667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Popover>
            </Badge>
            <Button
              className="menu-toggle-btn-mobile"
              style={{ marginLeft: 24 }}
              icon={
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.75 4.25H11.25M0.75 0.75H11.25M0.75 7.75H11.25" stroke="#0090CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                    <path d="M11.0833 1.75H2.91667C2.27233 1.75 1.75 2.27233 1.75 2.91667V11.0833C1.75 11.7277 2.27233 12.25 2.91667 12.25H11.0833C11.7277 12.25 12.25 11.7277 12.25 11.0833V2.91667C12.25 2.27233 11.7277 1.75 11.0833 1.75Z" stroke="#0090CF" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.25 1.75V12.25" stroke="#0090CF" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
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
            <Button
              type="text"
              className="search-icon-btn"
              onClick={() => setSearchOpen(true)}
              icon={<SearchOutlined style={{ fontSize: 16, color: "#0090CF" }} />}
              style={{ width: 34, height: 34, background: "#0090CF26", borderRadius: 8 }}
            />
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
              <Badge count={totalCount}>
                <Popover
                  open={notifyPopoverOpen}
                  onOpenChange={setNotifyPopoverOpen}
                  trigger="click"
                  placement="bottomRight"
                  content={<>
                    <TitlePopover>Thông báo</TitlePopover>
                    <hr style={{ marginBottom: "10px" }} />
                    {notifications.map((item, index) => (
                      <TitleNotiWrapper key={index} onClick={item.key === "hrm" ? handleOpenHrmModal : undefined}>
                        <TitleNoti>{item.title}</TitleNoti>
                        <div className="count-number">
                          <QuantityNoti>{item.count}</QuantityNoti>
                        </div>
                      </TitleNotiWrapper>
                    ))}
                  </>}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: "pointer" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8.55663 17.5C8.70291 17.7533 8.91331 17.9637 9.16666 18.11C9.42002 18.2563 9.70741 18.3333 9.99996 18.3333C10.2925 18.3333 10.5799 18.2563 10.8333 18.11C11.0866 17.9637 11.297 17.7533 11.4433 17.5" stroke="#6B7280" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" /> <path d="M2.71833 12.7716C2.60947 12.8909 2.53763 13.0393 2.51155 13.1987C2.48547 13.3581 2.50627 13.5217 2.57142 13.6695C2.63658 13.8173 2.74328 13.9429 2.87855 14.0312C3.01381 14.1195 3.17182 14.1665 3.33333 14.1666H16.6667C16.8282 14.1667 16.9862 14.1198 17.1216 14.0317C17.2569 13.9436 17.3637 13.8181 17.4291 13.6704C17.4944 13.5227 17.5154 13.3592 17.4895 13.1998C17.4637 13.0404 17.392 12.8919 17.2833 12.7725C16.175 11.63 15 10.4158 15 6.66663C15 5.34054 14.4732 4.06877 13.5355 3.13109C12.5979 2.19341 11.3261 1.66663 10 1.66663C8.67392 1.66663 7.40215 2.19341 6.46447 3.13109C5.52679 4.06877 5 5.34054 5 6.66663C5 10.4158 3.82417 11.63 2.71833 12.7716Z" stroke="#6B7280" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" /> </svg>
                  </svg>
                </Popover>
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
      </StyledInnerLayout>
      <StyledDrawer width={300} placement="left" open={showDrawer} onClose={() => setShowDrawer(false)}>
        <LeftMenu
          collapsed={false}
          setShowDrawer={setShowDrawer}
          isMobile={true}
          showDrawer={showDrawer}
          userName={userName}
          userEmail={userEmail}
          userInitials={userInitials}
          onAccountClick={() => setBottomSheetOpen(true)}
        />
      </StyledDrawer>

      <StyledBottomSheet
        placement="bottom"
        open={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        height="auto"
      >
        <BottomSheetHandle />
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid #f0f0f0", marginBottom: 8 }}>
          <Avatar style={{ background: "#0090CF" }} size={44}>
            {userInitials || "JD"}
          </Avatar>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{userName || "VEC Account"}</div>
            <div style={{ color: "#888", fontSize: 13 }}>{userEmail || "vec.account@gmail.com"}</div>
          </div>
        </div>
        <BottomSheetItem onClick={() => { setBottomSheetOpen(false); window.location.href = "/web/guest/trangchu"; }}>
          Quản trị hệ thống
        </BottomSheetItem>
        <BottomSheetLogout onClick={() => { setBottomSheetOpen(false); handleLogout(); }}>
          Đăng xuất
        </BottomSheetLogout>
      </StyledBottomSheet>
      <HrmNotificationsModal
        open={hrmModalOpen}
        notifications={hrmNotifications}
        loading={hrmNotificationsLoading}
        loadingMore={hrmNotificationsLoadingMore}
        hasMore={hasMoreHrmNotifications}
        onLoadMore={handleLoadMoreHrmNotifications}
        onClose={handleCloseHrmModal}
        onToggleRead={handleToggleHrmNotificationRead}
        togglingCode={hrmTogglingCode}
      />

      {searchOpen && (
        <SearchOverlay onClick={() => setSearchOpen(false)}>
          <SearchBox onClick={(e) => e.stopPropagation()}>
            <CInput
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm..."
              allowClear
              autoFocus
              style={{ width: "100%" }}
            />
          </SearchBox>
        </SearchOverlay>
      )}
    </StyledLayout>
  );
}

export default MainLayout;
