import React, { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { ContentWrap, LeftSidebar, MainContent } from "../../style";
import { CButton } from "../../../../components/common";
import WorkSidebar from "./WorkSidebar";
import WorkFilter from "./WorkFilter";
import WorkTables from "./WorkTables";
import WorkDetailModal from "./WorkDetailModal";
import WorkStatsCards from "./WorkStatsCards";
import { WorkHeaderRow, WorkSectionTitle } from "../../style";

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

  const handleWorkClick = (work) => {
    setSelectedWork(work);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedWork(null);
  };

  const handleViewAll = () => {
    console.log("Xem đầy đủ công việc");
  };

  return (
    <ContentWrap>
      <LeftSidebar>
        <WorkSidebar activeItem={activeItem} onItemChange={onItemChange} />
      </LeftSidebar>
      <MainContent>
        <WorkStatsCards
          primaryData={primaryData}
          supportData={supportData}
          assignedData={assignedData}
          followData={followData}
        />

        <WorkHeaderRow>
          <WorkSectionTitle>Tất cả công việc của tôi</WorkSectionTitle>
          <CButton type="primary" icon={<EyeOutlined />} onClick={handleViewAll}>
            Xem đầy đủ công việc
          </CButton>
        </WorkHeaderRow>

        <WorkFilter initialValues={initialValues} onSearch={onSearch} />
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
