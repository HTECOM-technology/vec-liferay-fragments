import React from "react";
import { SidebarItem } from "../../style";
import { WORK_SIDEBAR_ITEMS } from "./constants";

function WorkSidebar({ activeItem, onItemChange }) {
  return (
    <>
      {WORK_SIDEBAR_ITEMS.map((item) => (
        <SidebarItem
          key={item.key}
          $active={activeItem === item.key}
          onClick={() => onItemChange(item.key)}
        >
          {item.label}
        </SidebarItem>
      ))}
    </>
  );
}

export default WorkSidebar;
