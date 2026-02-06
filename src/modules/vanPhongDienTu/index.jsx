import React, { useState } from "react";
import dayjs from "dayjs";
import { CTabs } from "../../components/common";
import { PageWrap } from "./style";
import { MessagesTab, mockMessagesData } from "./components/messages";
import { EventsTab, mockEventsData } from "./components/events";
import { TasksTab, mockTasksData } from "./components/tasks";
import { WorkTab, mockWorkPrimaryData, mockWorkSupportData } from "./components/work";
import { DocumentsTab, mockDocumentsData } from "./components/documents";

const defaultDateFrom = dayjs("2025-12-01");
const defaultDateTo = dayjs("2025-12-30");

function VanPhongDienTuPage() {
  const [activeTab, setActiveTab] = useState("messages");
  const [activeMailbox, setActiveMailbox] = useState("inbox-urgent");
  const [activeEventsGroup, setActiveEventsGroup] = useState("ban-lanh-dao");
  const [activeTaskSubTab, setActiveTaskSubTab] = useState("all");
  const [activeWorkItem, setActiveWorkItem] = useState("all");
  const [activeDocumentSubTab, setActiveDocumentSubTab] = useState("incoming");
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const totalMessages = 5709;
  const totalEvents = 432;
  const totalTasks = 28;
  const totalDocuments = 266;

  const filterInitialValues = {
    dateFrom: defaultDateFrom,
    dateTo: defaultDateTo,
  };

  const handleSearchMessages = (values) => {
    console.log("Tìm kiếm tin nhắn - filter:", values);
    setPage(1);
  };

  const handleMailboxChange = (mailbox) => {
    setActiveMailbox(mailbox);
    setPage(1);
  };

  const handleSearchEvents = (values) => {
    console.log("Tìm kiếm lịch - filter:", values);
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
    console.log("Tìm kiếm nhiệm vụ - filter:", values);
    setPage(1);
  };

  const handleSearchWork = (values) => {
    console.log("Tìm kiếm công việc - filter:", values);
    setPage(1);
  };

  const handleWorkItemChange = (item) => {
    setActiveWorkItem(item);
    setPage(1);
  };

  const handleSearchDocuments = (values) => {
    console.log("Tìm kiếm văn bản - filter:", values);
    setPage(1);
  };

  const paginationConfig = {
    current: page,
    pageSize,
    total: totalMessages,
    onChange: (p, size) => {
      setPage(p);
      setPageSize(size || 16);
    },
  };

  return (
    <PageWrap>
      <CTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "messages",
            label: "TIN NHẮN",
            children: (
              <MessagesTab
                activeMailbox={activeMailbox}
                onMailboxChange={handleMailboxChange}
                initialValues={filterInitialValues}
                onSearch={handleSearchMessages}
                dataSource={mockMessagesData}
                pagination={paginationConfig}
              />
            ),
          },
          {
            key: "events",
            label: "LỊCH CƠ QUAN",
            children: (
              <EventsTab
                activeGroup={activeEventsGroup}
                onGroupChange={handleEventsGroupChange}
                initialValues={filterInitialValues}
                onSearch={handleSearchEvents}
                dataSource={mockEventsData}
                pagination={{
                  current: page,
                  pageSize,
                  total: totalEvents,
                  onChange: (p, size) => {
                    setPage(p);
                    setPageSize(size || 16);
                  },
                }}
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
            key: "tasks",
            label: "NHIỆM VỤ",
            children: (
              <TasksTab
                initialValues={filterInitialValues}
                onSearch={handleSearchTasks}
                dataSource={mockTasksData}
                pagination={{
                  current: page,
                  pageSize: 12,
                  total: totalTasks,
                  onChange: (p, size) => {
                    setPage(p);
                    setPageSize(size || 12);
                  },
                }}
                activeSubTab={activeTaskSubTab}
                onSubTabChange={setActiveTaskSubTab}
                stats={{ total: 8, processing: 2, completed: 4, overdue: 0 }}
              />
            ),
          },
          {
            key: "documents",
            label: "VĂN BẢN",
            children: (
              <DocumentsTab
                initialValues={filterInitialValues}
                onSearch={handleSearchDocuments}
                dataSource={mockDocumentsData}
                pagination={{
                  current: page,
                  pageSize: 12,
                  total: totalDocuments,
                  onChange: (p, size) => {
                    setPage(p);
                    setPageSize(size || 12);
                  },
                }}
                activeSubTab={activeDocumentSubTab}
                onSubTabChange={setActiveDocumentSubTab}
                stats={{ incoming: 5, outgoing: 12, pending: 2, approved: 0 }}
              />
            ),
          },
        ]}
      />
    </PageWrap>
  );
}

export default VanPhongDienTuPage;

