import React, { useEffect, useState } from "react";
import { Alert, Spin, Table } from "antd";
import { fetchTollReconciliationDashboard } from "../../../services/tollReconciliationService";
import BieuDoCard from "./baoCaoTongHop/BieuDoCard";
import { getCurrentWeekRange } from "./baoCaoTongHop/chartUtils";
import { suCoColumns, suKienColumns, loiColumns, commonTableProps } from "./baoCaoTongHop/tables";
import {
  Wrap,
  ChartsRow,
  TableSection,
  TableSectionHeader,
  TableSectionTitle,
  TableSectionLink,
} from "./baoCaoTongHop/styled";

const EMPTY_DASHBOARD = {
  traffic: [],
  revenue: [],
  incidents: [],
  events: [],
  errors: [],
};

const REFRESH_INTERVAL_MS = 60 * 60 * 1000;

const DSTP_MONITORING_BASE_URL = "https://dstp.tctvec.vn/monitoring";

const DSTP_LINKS = {
  incidents: `${DSTP_MONITORING_BASE_URL}/su-co`,
  events: `${DSTP_MONITORING_BASE_URL}/su-kien`,
  errors: `${DSTP_MONITORING_BASE_URL}/yeu-cau-xu-ly-loi`,
};

const VIEW_ALL_LABEL = "Xem tất cả tại phần mềm Đối soát thu phí »";

function BaoCaoTongHopTab() {
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let controller = null;

    async function loadDashboard({ silent = false } = {}) {
      controller?.abort();
      controller = new AbortController();

      const { signal } = controller;

      try {
        if (!silent) {
          setLoading(true);
          setErrorMessage("");
        }

        const range = getCurrentWeekRange();
        const data = await fetchTollReconciliationDashboard({
          signal,
          fromDate: range.from.format("YYYY-MM-DD"),
          toDate: range.to.format("YYYY-MM-DD"),
        });

        setDashboard(data);
      } catch (error) {
        // Refresh nền lỗi thì giữ nguyên dữ liệu cũ, không làm trống màn hình
        if (error?.name !== "AbortError" && !silent) {
          setDashboard(EMPTY_DASHBOARD);
          setErrorMessage(error?.message || "Không thể tải dữ liệu đối soát thu phí.");
        }
      } finally {
        if (!signal.aborted && !silent) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    const intervalId = setInterval(
      () => loadDashboard({ silent: true }),
      REFRESH_INTERVAL_MS
    );

    return () => {
      clearInterval(intervalId);
      controller?.abort();
    };
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
            dataKey="traffic"
            rawData={dashboard.traffic}
            color="rgba(0, 144, 207, 1)"
            yUnit="N"
          />
          <BieuDoCard
            title="Biểu đồ doanh thu"
            dataKey="revenue"
            rawData={dashboard.revenue}
            color="rgba(0, 166, 62, 1)"
            yUnit="tỷ"
          />
        </ChartsRow>

        <TableSection>
          <TableSectionHeader>
            <TableSectionTitle>Thông báo sự cố</TableSectionTitle>
            <TableSectionLink
              href={DSTP_LINKS.incidents}
              target="_blank"
              rel="noopener noreferrer"
            >
              {VIEW_ALL_LABEL}
            </TableSectionLink>
          </TableSectionHeader>
          <Table
            {...commonTableProps}
            loading={loading}
            columns={suCoColumns}
            dataSource={dashboard.incidents}
          />
        </TableSection>

        <TableSection>
          <TableSectionHeader>
            <TableSectionTitle>Thông tin sự kiện</TableSectionTitle>
            <TableSectionLink
              href={DSTP_LINKS.events}
              target="_blank"
              rel="noopener noreferrer"
            >
              {VIEW_ALL_LABEL}
            </TableSectionLink>
          </TableSectionHeader>
          <Table
            {...commonTableProps}
            loading={loading}
            columns={suKienColumns}
            dataSource={dashboard.events}
          />
        </TableSection>

        <TableSection>
          <TableSectionHeader>
            <TableSectionTitle>Thông tin lỗi</TableSectionTitle>
            <TableSectionLink
              href={DSTP_LINKS.errors}
              target="_blank"
              rel="noopener noreferrer"
            >
              {VIEW_ALL_LABEL}
            </TableSectionLink>
          </TableSectionHeader>
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
