import React, { useState } from "react";
import { Grid } from "antd";
import { ContentWrap, LeftSidebar, MainContent, MobileMenuWrap } from "../../style";
import WorkSidebar from "./WorkSidebar";
import WorkFilter from "./WorkFilter";
import WorkTables from "./WorkTables";
import WorkDetailModal from "./WorkDetailModal";
import WorkStatsCards from "./WorkStatsCards";
import { WorkHeaderRow, WorkSectionTitle } from "./styles";

const { useBreakpoint } = Grid;

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
  const [selectedWork, setSelectedWork] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const handleWorkClick = (work) => {
    setSelectedWork(work);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedWork(null);
  };

  return (
    <ContentWrap>
      {!isMobile && (
        <LeftSidebar>
          <WorkSidebar activeItem={activeItem} onItemChange={onItemChange} />
        </LeftSidebar>
      )}
      <MainContent>
        <WorkStatsCards
          primaryData={primaryData}
          supportData={supportData}
          assignedData={assignedData}
          followData={followData}
        />

        {isMobile && (
          <MobileMenuWrap style={{ marginBottom: 12 }}>
            <WorkSidebar activeItem={activeItem} onItemChange={onItemChange} />
          </MobileMenuWrap>
        )}

        <WorkHeaderRow>
          <WorkSectionTitle>Tất cả công việc của tôi</WorkSectionTitle>
          {isMobile && (
            <WorkFilter initialValues={initialValues} onSearch={onSearch} isIconOnly />
          )}
        </WorkHeaderRow>

        {!isMobile && <WorkFilter initialValues={initialValues} onSearch={onSearch} />}
        <WorkTables
          primaryData={primaryData}
          supportData={supportData}
          assignedData={assignedData}
          followData={followData}
          onWorkClick={handleWorkClick}
        />
      </MainContent>
      <WorkDetailModal
        visible={isModalVisible}
        work={selectedWork}
        onClose={handleCloseModal}
      />
    </ContentWrap>
  );
}

export default WorkTab;
