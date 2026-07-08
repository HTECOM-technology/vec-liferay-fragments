import React from "react";
import { Avatar, Flex } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { StyledBgMenu, StyledBtnVEC, StyledLeftMenu, DrawerHeader, DrawerCloseBtn } from "../style";
import bgMenu from "../../../../assets/layout/bg-menu.png";
import logo from "../../../../assets/layout/logo.png";
import Menu from "./Menu";

const LeftMenu = ({ collapsed, isMobile, showDrawer, setShowDrawer, userName, userEmail, userInitials, onAccountClick }) => {
  return (
    <StyledLeftMenu>
      {isMobile ? (
        <DrawerHeader onClick={onAccountClick}>
          <DrawerCloseBtn
            onClick={(e) => { e.stopPropagation(); setShowDrawer(false); }}
            aria-label="Đóng menu"
          >
            <CloseOutlined style={{ fontSize: 13 }} />
          </DrawerCloseBtn>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar style={{ background: "#0090CF" }} size={44}>
              {userInitials || "JD"}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0, lineHeight: "20px" }}>
              <b style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#1a1a1a" }}>
                {userName || "VEC Account"}
              </b>
              <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                {userEmail || "vec.account@gmail.com"}
              </span>
            </div>
          </div>
        </DrawerHeader>
      ) : (
        <Flex vertical={false}>
          <img src={logo} alt="logo" className="logo" />
          <div style={{ padding: 5, display: collapsed ? "none" : "block" }}>
            <p className="title-vn">TỔNG CÔNG TY ĐẦU TƯ PHÁT TRIỂN ĐƯỜNG CAO TỐC VIỆT NAM</p>
            <p className="title-us">Vietnam Expressway Corporation (VEC)</p>
          </div>
        </Flex>
      )}

      <Menu collapsed={collapsed} setShowDrawer={setShowDrawer} />

      {(!collapsed || isMobile) && (
        <a
        href="https://portal.tctvec.vn/web/guest/trangchu"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        >
        <StyledBtnVEC>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6668 5.41634V12.083H3.3335V5.41634C3.3335 3.84499 3.3335 3.05932 3.82165 2.57116C4.30981 2.08301 5.09548 2.08301 6.66683 2.08301H13.3335C14.9048 2.08301 15.6905 2.08301 16.1787 2.57116C16.6668 3.05932 16.6668 3.84499 16.6668 5.41634Z" fill="white" fillOpacity="0.2" />
            <path d="M2.91501 12.9292L3.34993 12.083H16.6268L17.0856 12.9292C18.288 15.1471 18.5875 16.2561 18.1304 17.0862C17.6734 17.9163 16.4617 17.9163 14.0381 17.9163L5.96251 17.9163C3.53901 17.9163 2.32725 17.9163 1.87022 17.0862C1.41318 16.2561 1.71261 15.1471 2.91501 12.9292Z" fill="#E31C2A" />
            <path d="M16.6668 12.083V5.41634C16.6668 3.84499 16.6668 3.05932 16.1787 2.57116C15.6905 2.08301 14.9048 2.08301 13.3335 2.08301H6.66683C5.09548 2.08301 4.30981 2.08301 3.82165 2.57116C3.3335 3.05932 3.3335 3.84499 3.3335 5.41634V12.083" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M6.66699 6.99461H6.80182C7.47795 6.99461 7.81602 6.99461 8.07412 7.13976C8.33223 7.28492 8.44826 7.5403 8.68033 8.05107L8.96072 8.66821C9.11323 9.00386 9.18948 9.17169 9.31251 9.16647C9.43554 9.16125 9.48943 8.98791 9.59719 8.64122L10.5613 5.53943C10.6722 5.18272 10.7277 5.00436 10.8519 5C10.9762 4.99564 11.0507 5.16943 11.1998 5.51702L11.3687 5.91067C11.5932 6.43415 11.7055 6.69589 11.966 6.84525C12.2266 6.99461 12.5708 6.99461 13.2593 6.99461H13.3337"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M2.91501 12.9292L3.34993 12.083H16.6268L17.0856 12.9292C18.288 15.1471 18.5875 16.2561 18.1304 17.0862C17.6734 17.9163 16.4617 17.9163 14.0381 17.9163L5.96251 17.9163C3.53901 17.9163 2.32725 17.9163 1.87022 17.0862C1.41318 16.2561 1.71261 15.1471 2.91501 12.9292Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Cổng thông tin VEC
        </StyledBtnVEC>
        </a>
      )}

      <StyledBgMenu src={bgMenu} alt="" />
    </StyledLeftMenu>
  );
};

export default LeftMenu;
