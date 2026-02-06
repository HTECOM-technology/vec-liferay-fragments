import React, { useState } from "react";
import { ContentWrap, LeftSidebar, MainContent } from "../../style";
import CalendarSidebar from "./CalendarSidebar";
import EventsFilter from "./EventsFilter";
import EventsTable from "./EventsTable";
import EventDetailModal from "./EventDetailModal";
import AddEventModal from "./AddEventModal";
import { CALENDAR_GROUPS } from "./constants";

function EventsTab({
  activeGroup,
  onGroupChange,
  initialValues,
  onSearch,
  dataSource,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  
  const activeGroupLabel = CALENDAR_GROUPS.find(g => g.key === activeGroup)?.label || "Ban lãnh đạo";

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedEvent(null);
  };

  const handleAddEvent = () => {
    setIsAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
  };

  const handleSubmitEvent = (values) => {
    console.log("New event:", values);
  };

  return (
    <ContentWrap>
      <LeftSidebar>
        <CalendarSidebar
          activeGroup={activeGroup}
          onGroupChange={onGroupChange}
        />
      </LeftSidebar>
      <MainContent>
        <EventsFilter
          contentTitle={`Lịch ${activeGroupLabel}`}
          initialValues={initialValues}
          onSearch={onSearch}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
          onAddEvent={handleAddEvent}
        />
        <EventsTable dataSource={dataSource} onEventClick={handleEventClick} />
      </MainContent>
      <EventDetailModal
        visible={isDetailModalVisible}
        event={selectedEvent}
        onClose={handleCloseDetailModal}
      />
      <AddEventModal
        visible={isAddModalVisible}
        onClose={handleCloseAddModal}
        onSubmit={handleSubmitEvent}
      />
    </ContentWrap>
  );
}

export default EventsTab;
