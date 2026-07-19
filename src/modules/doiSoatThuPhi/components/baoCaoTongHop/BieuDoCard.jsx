import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Alert, Select, Button, Empty, Spin } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CDatePicker } from "../../../../components/common";
import { fetchTollReconciliationDashboard } from "../../../../services/tollReconciliationService";
import { processChartData, getCurrentWeekRange } from "./chartUtils";
import {
  ChartCard,
  ChartCardTitle,
  ChartEmpty,
  ChartFilterRow,
  FilterItem,
  ChartWrap,
} from "./styled";

const LOAI_BIEU_DO_OPTIONS = [
  { value: "cot", label: "Biểu đồ cột" },
  { value: "duong", label: "Biểu đồ đường" },
];

const THOI_GIAN_OPTIONS = [
  { value: "ngay", label: "Ngày" },
  { value: "tuan", label: "Tuần" },
  { value: "thang", label: "Tháng" },
];

function formatYAxis(value, yUnit) {
  if (yUnit === "tỷ") {
    const ty = value / 1_000_000_000;
    return ty === 0 ? "0" : `${ty} tỷ`;
  }
  if (value >= 1000) return `${value / 1000}N`;
  return value === 0 ? "0" : value;
}

function BieuDoCard({ title, dataKey, rawData, color, yUnit }) {
  const [loaiBieuDo, setLoaiBieuDo] = useState("cot");
  const [thoiGian, setThoiGian] = useState("ngay");
  const [tuNgay, setTuNgay] = useState(() => getCurrentWeekRange().from);
  const [denNgay, setDenNgay] = useState(() => getCurrentWeekRange().to);

  // customSeries = null: hiển thị dữ liệu tuần hiện tại từ dashboard (cập nhật
  // theo chu kỳ 60 phút). Khác null: người dùng đã "Xem biểu đồ" theo khoảng
  // ngày tự chọn, giữ nguyên khi dashboard tự refresh.
  const [customSeries, setCustomSeries] = useState(null);
  const [applied, setApplied] = useState(() => ({
    ...getCurrentWeekRange(),
    thoiGian: "ngay",
  }));
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (customSeries !== null) return;

    setApplied((prev) => ({ ...prev, ...getCurrentWeekRange() }));
  }, [rawData, customSeries]);

  const chartData = useMemo(
    () =>
      processChartData(
        customSeries ?? rawData,
        applied.from,
        applied.to,
        applied.thoiGian
      ),
    [customSeries, rawData, applied]
  );

  const handleXemBieuDo = useCallback(async () => {
    if (!tuNgay || !denNgay) {
      setFetchError("Vui lòng chọn Từ ngày và Đến ngày.");
      return;
    }

    if (tuNgay.isAfter(denNgay, "day")) {
      setFetchError("Từ ngày không được sau Đến ngày.");
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const { signal } = abortRef.current;

    try {
      setFetching(true);
      setFetchError("");

      const data = await fetchTollReconciliationDashboard({
        signal,
        fromDate: tuNgay.format("YYYY-MM-DD"),
        toDate: denNgay.format("YYYY-MM-DD"),
      });

      setCustomSeries(data?.[dataKey] || []);
      setApplied({ from: tuNgay, to: denNgay, thoiGian });
    } catch (error) {
      if (error?.name !== "AbortError") {
        setFetchError(error?.message || "Không thể tải dữ liệu biểu đồ.");
      }
    } finally {
      if (!signal.aborted) {
        setFetching(false);
      }
    }
  }, [tuNgay, denNgay, thoiGian, dataKey]);

  const tooltipFormatter = (value) =>
    yUnit === "tỷ"
      ? `${(value / 1_000_000_000).toFixed(1)} tỷ`
      : value.toLocaleString();

  const axisProps = {
    xAxis: (
      <XAxis
        dataKey="label"
        tick={{ fontSize: 12, fill: "rgba(0,0,0,0.55)" }}
        axisLine={false}
        tickLine={false}
      />
    ),
    yAxis: (
      <YAxis
        tickFormatter={(v) => formatYAxis(v, yUnit)}
        tick={{ fontSize: 12, fill: "rgba(0,0,0,0.55)" }}
        axisLine={false}
        tickLine={false}
        width={50}
      />
    ),
  };

  return (
    <ChartCard>
      <ChartCardTitle>{title}</ChartCardTitle>

      <ChartFilterRow>
        <FilterItem>
          <Select
            value={thoiGian}
            onChange={setThoiGian}
            options={THOI_GIAN_OPTIONS}
            style={{ width: 100, height: 38 }}
          />
        </FilterItem>
        <FilterItem>
          <Select
            value={loaiBieuDo}
            onChange={setLoaiBieuDo}
            options={LOAI_BIEU_DO_OPTIONS}
            style={{ width: 165, height: 38 }}
          />
        </FilterItem>
        <FilterItem>
          <CDatePicker
            value={tuNgay}
            onChange={setTuNgay}
            format="DD/MM/YYYY"
            placeholder="Từ ngày"
            suffixIcon={<CalendarOutlined />}
            style={{ width: 120, height: 38 }}
          />
        </FilterItem>
        <FilterItem>
          <CDatePicker
            value={denNgay}
            onChange={setDenNgay}
            format="DD/MM/YYYY"
            placeholder="Đến ngày"
            suffixIcon={<CalendarOutlined />}
            style={{ width: 120, height: 38 }}
          />
        </FilterItem>
        <Button
          type="primary"
          onClick={handleXemBieuDo}
          loading={fetching}
          style={{ background: "#0090cf", borderColor: "#0090cf", height: 38 }}
        >
          Xem biểu đồ
        </Button>
      </ChartFilterRow>

      {fetchError && (
        <Alert
          type="error"
          showIcon
          message={fetchError}
          style={{ marginBottom: 8 }}
        />
      )}

      <Spin spinning={fetching}>
        <ChartWrap>
          {chartData.length === 0 ? (
            <ChartEmpty>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có dữ liệu trong khoảng đã chọn"
              />
            </ChartEmpty>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {loaiBieuDo === "cot" ? (
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: 16, bottom: 0 }}
                  barCategoryGap="35%"
                >
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  {axisProps.xAxis}
                  {axisProps.yAxis}
                  <Tooltip cursor={false} formatter={tooltipFormatter} />
                  <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} barSize={30} />
                </BarChart>
              ) : (
                <LineChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: 16, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  {axisProps.xAxis}
                  {axisProps.yAxis}
                  <Tooltip formatter={tooltipFormatter} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 3, fill: color }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </ChartWrap>
      </Spin>
    </ChartCard>
  );
}

export default BieuDoCard;
