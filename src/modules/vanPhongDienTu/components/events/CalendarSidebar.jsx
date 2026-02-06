import React from "react";
import { SidebarItem } from "../../style";
import { CALENDAR_GROUPS } from "./constants";

function CalendarSidebar({ activeGroup, onGroupChange }) {
  return (
    <>
      {CALENDAR_GROUPS.map((item) => (
        <SidebarItem
          key={item.key}
          $active={activeGroup === item.key}
          onClick={() => onGroupChange(item.key)}
        >
          {item.label}
        </SidebarItem>
      ))}
    </>
  );
}

export default CalendarSidebar;
