import React, { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Grid } from "antd";
import { CButton } from "../../../../components/common";
import styled from "styled-components";
import DocumentsFilter from "./DocumentsFilter";
import DocumentsTable from "./DocumentsTable";
import DocumentsPagination from "./DocumentsPagination";
import DocumentDetailModal from "./DocumentDetailModal";
import DocumentsStatsCards from "./DocumentsStatsCards";
import {
  HeaderRow,
  SectionTitle,
  TabRow,
  TabButtons,
  TabButton,
  MobileFilterButton,
} from "../../style";
import { DOCUMENT_TABS } from "./constants";
import MenuFilterIcon from "../../../../assets/icon/menu-filter-icon.svg";

const { useBreakpoint } = Grid;

const FILTER_ICON_STYLE = { width: 18, height: 18 };

const DocumentsMobileFilterButton = styled(MobileFilterButton)`
  width: 32px;
  height: 32px;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  box-shadow: none !important;

  img {
    width: 20px;
    height: 20px;
  }
`;

const DocumentsContent = styled.div`
  padding: 16px;
  background: #fff;
`;

function DocumentsTab({
  initialValues,
  onSearch,
  dataSource,
  pagination = {},
  activeSubTab,
  onSubTabChange,
  stats = { incoming: 5, outgoing: 12, pending: 2, approved: 0 },
}) {
  const { current = 1, pageSize = 12, total = 0, onChange } = pagination;
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedDocument(null);
  };

  return (
    <DocumentsContent>
      <DocumentsStatsCards stats={stats} />

      <HeaderRow>
        <SectionTitle>Quản lý văn bản</SectionTitle>
        {isMobile ? (
          <DocumentsFilter
            initialValues={initialValues}
            onSearch={onSearch}
            renderMobileButton={(props) => (
              <DocumentsMobileFilterButton
                icon={
                  <img
                    src={MenuFilterIcon}
                    alt="filter"
                    style={FILTER_ICON_STYLE}
                  />
                }
                {...props}
              />
            )}
            isMobileView={true}
          />
        ) : (
          <CButton type="primary" icon={<EyeOutlined />}>
            Xem đầy đủ văn bản
          </CButton>
        )}
      </HeaderRow>

      <TabRow>
        <TabButtons style={{ flexWrap: isMobile ? "wrap" : "nowrap" }}>
          {DOCUMENT_TABS.map((tab) => (
            <TabButton
              key={tab.key}
              $active={activeSubTab === tab.key}
              onClick={() => onSubTabChange(tab.key)}
              style={isMobile ? { marginBottom: 8 } : {}}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </TabButton>
          ))}
        </TabButtons>
      </TabRow>

      {!isMobile && (
        <DocumentsFilter initialValues={initialValues} onSearch={onSearch} />
      )}
      <DocumentsTable
        dataSource={dataSource}
        onDocumentClick={handleDocumentClick}
      />
      <DocumentsPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
      />
      <DocumentDetailModal
        visible={isModalVisible}
        document={selectedDocument}
        onClose={handleCloseModal}
      />
    </DocumentsContent>
  );
}

export default DocumentsTab;
