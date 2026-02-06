import React from "react";
import { MailboxItem } from "../../style";
import { WORK_SIDEBAR_ITEMS } from "./constants";

function WorkSidebar({ activeItem, onItemChange }) {
  return (
    <div>
      {WORK_SIDEBAR_ITEMS.map((item) => (
        <MailboxItem
          key={item.key}
          $active={activeItem === item.key}
          onClick={() => onItemChange(item.key)}
        >
          {item.label}
        </MailboxItem>
      ))}
    </div>
  );
}

export default WorkSidebar;
