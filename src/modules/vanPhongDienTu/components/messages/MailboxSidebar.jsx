import React from "react";
import { MailboxItem } from "../../style";
import { MAILBOX_ITEMS } from "./constants";

function MailboxSidebar({ activeMailbox, onMailboxChange }) {
  return (
    <div>
      {MAILBOX_ITEMS.map((item) => (
        <MailboxItem
          key={item.key}
          $active={activeMailbox === item.key}
          onClick={() => onMailboxChange(item.key)}
        >
          {item.label}
          {item.count !== null && <span className="count">({item.count})</span>}
        </MailboxItem>
      ))}
    </div>
  );
}

export default MailboxSidebar;
