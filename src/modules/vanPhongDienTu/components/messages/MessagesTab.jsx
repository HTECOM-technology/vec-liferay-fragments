import React from "react";
import { ContentWrap, LeftSidebar, MainContent } from "../../style";
import MailboxSidebar from "./MailboxSidebar";
import MessagesFilter from "./MessagesFilter";
import MessagesTable from "./MessagesTable";
import MessagesPagination from "./MessagesPagination";

function MessagesTab({
  activeMailbox,
  onMailboxChange,
  initialValues,
  onSearch,
  dataSource,
  pagination = {},
}) {
  const { current = 1, pageSize = 10, total = 0, onChange } = pagination;

  return (
    <ContentWrap>
      <LeftSidebar>
        <MailboxSidebar
          activeMailbox={activeMailbox}
          onMailboxChange={onMailboxChange}
        />
      </LeftSidebar>
      <MainContent>
        <MessagesFilter initialValues={initialValues} onSearch={onSearch} />
        <MessagesTable dataSource={dataSource} />
        <MessagesPagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={onChange}
        />
      </MainContent>
    </ContentWrap>
  );
}

export default MessagesTab;
