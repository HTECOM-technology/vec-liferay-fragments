import React from "react";
import { ContentWrap, LeftSidebar, MainContent } from "../../style";
import WorkSidebar from "./WorkSidebar";
import WorkFilter from "./WorkFilter";
import WorkTables from "./WorkTables";

function WorkTab({
  activeItem,
  onItemChange,
  initialValues,
  onSearch,
  primaryData,
  supportData,
  assignedData,
  followData,
}) {
  return (
    <ContentWrap>
      <LeftSidebar>
        <WorkSidebar activeItem={activeItem} onItemChange={onItemChange} />
      </LeftSidebar>
      <MainContent>
        <WorkFilter initialValues={initialValues} onSearch={onSearch} />
        <WorkTables
          primaryData={primaryData}
          supportData={supportData}
          assignedData={assignedData}
          followData={followData}
        />
      </MainContent>
    </ContentWrap>
  );
}

export default WorkTab;
