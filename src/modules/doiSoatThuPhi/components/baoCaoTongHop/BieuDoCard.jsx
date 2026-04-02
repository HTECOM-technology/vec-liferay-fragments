import React, { useState, useCallback } from "react";
import { Select, Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
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
import { processChartData } from "./chartUtils";
import { ChartCard, ChartCardTitle, ChartFilterRow, ChartWrap } from "./styled";

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

function BieuDoCard({ title, rawData, color, yUnit }) {
  const defaultTu = dayjs("2026-01-01");
  const defaultDen = dayjs("2026-01-08");

  const [loaiBieuDo, setLoaiBieuDo] = useState("cot");
  const [thoiGian, setThoiGian] = useState("ngay");
  const [tuNgay, setTuNgay] = useState(defaultTu);
  const [denNgay, setDenNgay] = useState(defaultDen);
  const [chartData, setChartData] = useState(() =>
    processChartData(rawData, defaultTu, defaultDen, "ngay")
  );

  const handleXemBieuDo = useCallback(() => {
    const data = processChartData(rawData, tuNgay, denNgay, thoiGian);
    setChartData(data);
  }, [rawData, tuNgay, denNgay, thoiGian]);

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
        <Select
          value={loaiBieuDo}
          onChange={setLoaiBieuDo}
          options={LOAI_BIEU_DO_OPTIONS}
          style={{ width: 165, height: 38 }}
        />
        <Select
          value={thoiGian}
          onChange={setThoiGian}
          options={THOI_GIAN_OPTIONS}
          style={{ width: 100, height: 38 }}
        />
        <CDatePicker
          value={tuNgay}
          onChange={setTuNgay}
          format="DD/MM/YYYY"
          suffixIcon={<CalendarOutlined />}
          style={{ width: 120, height: 38 }}
        />
        <span style={{ color: "rgba(0,0,0,0.45)", fontSize: 13 }}>Đến</span>
        <CDatePicker
          value={denNgay}
          onChange={setDenNgay}
          format="DD/MM/YYYY"
          suffixIcon={<CalendarOutlined />}
          style={{ width: 120, height: 38 }}
        />
        <Button
          type="primary"
          onClick={handleXemBieuDo}
          style={{ background: "#0090cf", borderColor: "#0090cf", height: 38 }}
        >
          Xem biểu đồ
        </Button>
      </ChartFilterRow>

      <ChartWrap>
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
      </ChartWrap>
    </ChartCard>
  );
}

export default BieuDoCard;
