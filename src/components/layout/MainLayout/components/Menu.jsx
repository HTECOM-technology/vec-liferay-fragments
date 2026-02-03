import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { menuSections } from "../../../../router/menuConfig";
import { getMenuIcon } from "./MenuIcons";
import { MenuWrap, SectionTitle, ItemWrap, MenuItem } from "../style";
import { Tooltip } from "antd";

const Menu = ({ collapsed }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (item) => {
    if (item.key === "logout") {
      // TODO: gọi API/logic đăng xuất, sau đó redirect
      window.location.href = "/";
      return;
    }
    navigate(item.key);
  };

  const isActive = (key) => {
    if (key === "logout") return false;
    const path = pathname.replace(/\/$/, "") || "/";
    const itemPath = key.replace(/\/$/, "") || "/";
    return path === itemPath;
  };

  return (
    <MenuWrap>
      {menuSections.map((section) => (
        <div key={section.title} style={{ marginBottom: collapsed ? 0 : 14 }}>
          {!collapsed && <SectionTitle>{section.title}</SectionTitle>}
          {section.items.map((item) => {
            const active = isActive(item.key);
            return (
              <ItemWrap key={item.key}>
                <Tooltip title={collapsed ? item.label : ""} placement="right">
                  <MenuItem $active={active} type="button" onClick={() => handleClick(item)}>
                    <span style={{ flexShrink: 0, display: "flex" }}>{getMenuIcon(item.icon, active)}</span>
                    {!collapsed && item.label}
                  </MenuItem>
                </Tooltip>
              </ItemWrap>
            );
          })}
        </div>
      ))}
    </MenuWrap>
  );
};

export default Menu;
