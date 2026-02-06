import { useState } from "react";
import {
  ContentWrap,
  HeaderSection,
  LeftSidebar,
  MainContent,
} from "../../style";
import MailboxSidebar from "./MailboxSidebar";
import MessageDetailModal from "./MessageDetailModal";
import MessagesFilter from "./MessagesFilter";
import MessagesPagination from "./MessagesPagination";
import MessagesTable from "./MessagesTable";
import { MAILBOX_ITEMS } from "./constants";

function MessagesTab({
  activeMailbox,
  onMailboxChange,
  initialValues,
  onSearch,
  dataSource,
  pagination = {},
}) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { current = 1, pageSize = 10, total = 0, onChange } = pagination;

  const activeItem = MAILBOX_ITEMS.find((item) => item.key === activeMailbox);

  const actualCount = activeItem.count || 0;
  const contentTitle = activeItem
    ? `${activeItem.label} (${actualCount})`
    : `Hộp thư đến (${actualCount})`;

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMessage(null);
  };

  const handleReply = (message) => {
    console.log("Reply to message:", message);
  };

  return (
    <ContentWrap>
      <LeftSidebar>
        <MailboxSidebar
          activeMailbox={activeMailbox}
          onMailboxChange={onMailboxChange}
        />
      </LeftSidebar>
      <MainContent>
        <HeaderSection>
          <h2 className="content-title">{contentTitle}</h2>
          <MessagesFilter initialValues={initialValues} onSearch={onSearch} />
        </HeaderSection>
        <MessagesTable
          dataSource={dataSource}
          onMessageClick={handleMessageClick}
        />
        <MessagesPagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={onChange}
        />
      </MainContent>
      <MessageDetailModal
        visible={isModalVisible}
        message={selectedMessage}
        onClose={handleCloseModal}
        onReply={handleReply}
      />
    </ContentWrap>
  );
}

export default MessagesTab;
