import React from "react";
import { ContentWrap, LeftSidebar, MainContent } from "../../style";
import CalendarSidebar from "./CalendarSidebar";
import EventsFilter from "./EventsFilter";
import EventsTable from "./EventsTable";
import EventsPagination from "./EventsPagination";

function EventsTab({
  activeGroup,
  onGroupChange,
  initialValues,
  onSearch,
  dataSource,
  pagination = {},
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) {
  const { current = 1, pageSize = 16, total = 0, onChange } = pagination;

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
          initialValues={initialValues}
          onSearch={onSearch}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
        />
        <EventsTable dataSource={dataSource} />
        <EventsPagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={onChange}
        />
      </MainContent>
    </ContentWrap>
  );
}

export default EventsTab;
