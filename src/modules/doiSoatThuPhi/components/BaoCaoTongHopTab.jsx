import React, { useEffect, useState } from "react";
import { Alert, Spin, Table } from "antd";
import { fetchTollReconciliationDashboard } from "../../../services/tollReconciliationService";
import BieuDoCard from "./baoCaoTongHop/BieuDoCard";
import { suCoColumns, suKienColumns, loiColumns, commonTableProps } from "./baoCaoTongHop/tables";
import { Wrap, ChartsRow, TableSection, TableSectionTitle } from "./baoCaoTongHop/styled";

const EMPTY_DASHBOARD = {
  traffic: [],
  revenue: [],
  incidents: [],
  events: [],
  errors: [],
};

function BaoCaoTongHopTab() {
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await fetchTollReconciliationDashboard({
          signal: controller.signal,
        });

        setDashboard(data);
      } catch (error) {
        if (error?.name !== "AbortError") {
          setDashboard(EMPTY_DASHBOARD);
          setErrorMessage(error?.message || "Không thể tải dữ liệu đối soát thu phí.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, []);

  return (
    <Spin spinning={loading} tip="Đang tải dữ liệu...">
      <Wrap>
        {errorMessage && (
          <Alert type="error" showIcon message={errorMessage} />
        )}

        <ChartsRow>
          <BieuDoCard
            title="Biểu đồ lưu lượng xe"
            rawData={dashboard.traffic}
            color="rgba(0, 144, 207, 1)"
            yUnit="N"
          />
          <BieuDoCard
            title="Biểu đồ doanh thu"
            rawData={dashboard.revenue}
            color="rgba(0, 166, 62, 1)"
            yUnit="tỷ"
          />
        </ChartsRow>

        <TableSection>
          <TableSectionTitle>Thông báo sự cố</TableSectionTitle>
          <Table
            {...commonTableProps}
            loading={loading}
            columns={suCoColumns}
            dataSource={dashboard.incidents}
          />
        </TableSection>

        <TableSection>
          <TableSectionTitle>Thông tin sự kiện</TableSectionTitle>
          <Table
            {...commonTableProps}
            loading={loading}
            columns={suKienColumns}
            dataSource={dashboard.events}
          />
        </TableSection>

        <TableSection>
          <TableSectionTitle>Thông tin lỗi</TableSectionTitle>
          <Table
            {...commonTableProps}
            loading={loading}
            columns={loiColumns}
            dataSource={dashboard.errors}
          />
        </TableSection>
      </Wrap>
    </Spin>
  );
}

export default BaoCaoTongHopTab;
