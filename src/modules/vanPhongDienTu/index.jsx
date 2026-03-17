import React, { useState } from "react";
import dayjs from "dayjs";
import { CTabs } from "../../components/common";
import { PageWrap } from "./style";
import {
  TabLabel,
  MessagesTab,
  mockMessagesData,
  EventsTab,
  mockEventsData,
  TasksTab,
  mockTasksData,
  WorkTab,
  mockWorkPrimaryData,
  mockWorkSupportData,
  DocumentsTab,
  mockDocumentsData,
} from "./components";
import { MAILBOX_ITEMS } from "./components/messages/constants";

const defaultDateFrom = dayjs("2025-12-01");
const defaultDateTo = dayjs("2025-12-30");

function VanPhongDienTuPage() {
  const [activeTab, setActiveTab] = useState("messages");
  const [activeMailbox, setActiveMailbox] = useState("inbox");
  const [activeEventsGroup, setActiveEventsGroup] = useState("ban-lanh-dao");
  const [activeTaskSubTab, setActiveTaskSubTab] = useState("all");
  const [activeWorkItem, setActiveWorkItem] = useState("all");
  const [activeDocumentSubTab, setActiveDocumentSubTab] = useState("incoming");
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);

  const filterInitialValues = {
    dateFrom: defaultDateFrom,
    dateTo: defaultDateTo,
  };

  const handleSearchMessages = (values) => {
    setPage(1);
  };

  const handleMailboxChange = (mailbox) => {
    setActiveMailbox(mailbox);
    setPage(1);
  };

  const handleSearchEvents = (values) => {
    setPage(1);
  };

  const handleEventsGroupChange = (group) => {
    setActiveEventsGroup(group);
    setPage(1);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setPage(1);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setPage(1);
  };

  const handleSearchTasks = (values) => {
    setPage(1);
  };

  const handleSearchWork = (values) => {
    setPage(1);
  };

  const handleWorkItemChange = (item) => {
    setActiveWorkItem(item);
    setPage(1);
  };

  const handleSearchDocuments = (values) => {
    setPage(1);
  };

  const messageCount = MAILBOX_ITEMS.find(item => item.key === activeMailbox)?.count || 0;

  return (
    <PageWrap>
      <CTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "messages",
            label: <TabLabel label="TIN NHẮN" count={messageCount} />,
            children: (
              <MessagesTab
                activeMailbox={activeMailbox}
                onMailboxChange={handleMailboxChange}
                initialValues={filterInitialValues}
                onSearch={handleSearchMessages}
                dataSource={mockMessagesData}
                pagination={{
                  current: page,
                  pageSize: pageSize,
                  total: 500,
                  onChange: (p) => setPage(p)
                }}
              />
            ),
          },
          {
            key: "events",
            label: <TabLabel label="LỊCH CƠ QUAN" />,
            children: (
              <EventsTab
                activeGroup={activeEventsGroup}
                onGroupChange={handleEventsGroupChange}
                initialValues={filterInitialValues}
                onSearch={handleSearchEvents}
                dataSource={mockEventsData}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
              />
            ),
          },
          {
            key: "work",
            label: "CÔNG VIỆC",
            children: (
              <WorkTab
                activeItem={activeWorkItem}
                onItemChange={handleWorkItemChange}
                initialValues={filterInitialValues}
                onSearch={handleSearchWork}
                primaryData={mockWorkPrimaryData}
                supportData={mockWorkSupportData}
                assignedData={[]}
                followData={[]}
              />
            ),
          },
          {
            key: "connect",
            label: "LIÊN KẾT TRA CỨU",
            children: (
              <WorkTab
                // activeItem={activeWorkItem}
                // onItemChange={handleWorkItemChange}
                // initialValues={filterInitialValues}
                // onSearch={handleSearchWork}
                // primaryData={mockWorkPrimaryData}
                // supportData={mockWorkSupportData}
                // assignedData={[]}
                // followData={[]}
              />
            ),
          },
          {
            key: "fastconnect",
            label: "TRUY CẬP NHANH  ",
            children: (
              <WorkTab
                // activeItem={activeWorkItem}
                // onItemChange={handleWorkItemChange}
                // initialValues={filterInitialValues}
                // onSearch={handleSearchWork}
                // primaryData={mockWorkPrimaryData}
                // supportData={mockWorkSupportData}
                // assignedData={[]}
                // followData={[]}
              />
            ),
          },
          // {
          //   key: "tasks",
          //   label: <TabLabel label="NHIỆM VỤ" />,
          //   children: (
          //     <TasksTab
          //       initialValues={filterInitialValues}
          //       onSearch={handleSearchTasks}
          //       dataSource={mockTasksData}
          //       pagination={{
          //         current: page,
          //         pageSize: 12,
          //         total: 550,
          //         onChange: (p, size) => {
          //           setPage(p);
          //           setPageSize(size || 12);
          //         },
          //       }}
          //       activeSubTab={activeTaskSubTab}
          //       onSubTabChange={setActiveTaskSubTab}
          //       stats={{ total: 8, processing: 2, completed: 4, overdue: 0 }}
          //     />
          //   ),
          // },
          // {
          //   key: "documents",
          //   label: <TabLabel label="VĂN BẢN"/>,
          //   children: (
          //     <DocumentsTab
          //       initialValues={filterInitialValues}
          //       onSearch={handleSearchDocuments}
          //       dataSource={mockDocumentsData}
          //       pagination={{
          //         current: page,
          //         pageSize: pageSize,
          //         total: 500,
          //         onChange: (p, size) => {
          //           setPage(p);
          //           setPageSize(size || 12);
          //         },
          //       }}
          //       activeSubTab={activeDocumentSubTab}
          //       onSubTabChange={setActiveDocumentSubTab}
          //       stats={{ incoming: 5, outgoing: 12, pending: 2, approved: 0 }}
          //     />
          //   ),
          // },
        ]}
      />
    </PageWrap>
  );
}

export default VanPhongDienTuPage;

