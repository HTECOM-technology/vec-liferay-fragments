import React from "react";
import { MailboxItem } from "../../style";
import { CALENDAR_GROUPS } from "./constants";

function CalendarSidebar({ activeGroup, onGroupChange }) {
  return (
    <div>
      {CALENDAR_GROUPS.map((item) => (
        <MailboxItem
          key={item.key}
          $active={activeGroup === item.key}
          onClick={() => onGroupChange(item.key)}
        >
          {item.label}
        </MailboxItem>
      ))}
    </div>
  );
}

export default CalendarSidebar;
