import React from "react";
import { MailboxItem } from "./styles";
import { MAILBOX_ITEMS } from "./constants";

function MailboxSidebar({ activeMailbox, onMailboxChange }) {
  return (
    <>
      {MAILBOX_ITEMS.map((item) => (
        <MailboxItem
          key={item.key}
          $active={activeMailbox === item.key}
          onClick={() => onMailboxChange(item.key)}
        >
          <span>{item.label}</span>
          {item.count !== null && <span className="count">({item.count})</span>}
        </MailboxItem>
      ))}
    </>
  );
}

export default MailboxSidebar;
