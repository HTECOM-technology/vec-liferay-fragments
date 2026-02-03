import React, { useState } from "react";
import dayjs from "dayjs";
import { CTabs } from "../../components/common";
import { PageWrap } from "./style";
import {
  DataReconciliationTab,
  ReportTab,
  mockDataReconciliation,
  mockDataReport,
} from "./components";

const defaultDateFrom = dayjs("2025-12-01");
const defaultDateTo = dayjs("2025-12-30");

function DoiSoatThuPhiPage() {
  const [activeTab, setActiveTab] = useState("data");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalData = 5709;

  const filterInitialValues = {
    tu: defaultDateFrom,
    den: defaultDateTo,
  };

  const handleSearchData = (values) => {
    console.log("Đối soát dữ liệu - filter:", values);
    setPage(1);
  };

  const handleSearchReport = (values) => {
    console.log("Báo cáo đối soát - filter:", values);
    setPage(1);
  };

  const paginationConfig = {
    current: page,
    pageSize,
    total: totalData,
    onChange: (p, size) => {
      setPage(p);
      setPageSize(size || 10);
    },
  };

  return (
    <PageWrap>
      <CTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "data",
            label: "ĐỐI SOÁT DỮ LIỆU",
            children: (
              <DataReconciliationTab
                initialValues={filterInitialValues}
                onSearch={handleSearchData}
                dataSource={mockDataReconciliation}
                onView={(record) => console.log("View", record)}
                pagination={paginationConfig}
              />
            ),
          },
          {
            key: "report",
            label: "BÁO CÁO ĐỐI SOÁT",
            children: (
              <ReportTab
                initialValues={filterInitialValues}
                onSearch={handleSearchReport}
                dataSource={mockDataReport}
                pagination={paginationConfig}
              />
            ),
          },
        ]}
      />
    </PageWrap>
  );
}

export default DoiSoatThuPhiPage;
