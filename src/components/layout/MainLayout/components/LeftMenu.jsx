import React from "react";
import { Flex } from "antd";
import { StyledBgMenu, StyledLeftMenu } from "../style";
import bgMenu from "../../../../assets/layout/bg-menu.png";
import logo from "../../../../assets/layout/logo.png";
import Menu from "./Menu";

const LeftMenu = ({ collapsed }) => {
  return (
    <StyledLeftMenu>
      <Flex vertical={false}>
        <img src={logo} alt="logo" className="logo" />
        <div style={{ padding: 5, display: collapsed ? "none" : "block" }}>
          <p className="title-vn">TỔNG CÔNG TY ĐẦU TƯ PHÁT TRIỂN ĐƯỜNG CAO TỐC VIỆT NAM</p>
          <p className="title-us">Vietnam Expressway Corporation (VEC)</p>
        </div>
      </Flex>

      <Menu collapsed={collapsed} />

      <StyledBgMenu src={bgMenu} alt="" />
    </StyledLeftMenu>
  );
};

export default LeftMenu;
