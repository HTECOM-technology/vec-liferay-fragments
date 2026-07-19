import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

/** Khoảng mặc định của biểu đồ: từ đầu tuần hiện tại (thứ 2) đến hôm nay. */
export function getCurrentWeekRange() {
  const today = dayjs();

  return { from: today.startOf("isoWeek"), to: today };
}

/**
 * Filter raw data by date range, then group by thoiGian unit (ngay/tuan/thang)
 * rawData: [{ date: "YYYY-MM-DD", value: number }]
 */
export function processChartData(rawData, tuNgay, denNgay, thoiGian) {
  if (!tuNgay || !denNgay) return [];

  // 1. Filter by date range
  const filtered = rawData.filter((item) => {
    const d = dayjs(item.date);
    return (
      (d.isAfter(tuNgay, "day") || d.isSame(tuNgay, "day")) &&
      (d.isBefore(denNgay, "day") || d.isSame(denNgay, "day"))
    );
  });

  // 2. Group by unit
  const grouped = {};

  filtered.forEach((item) => {
    const d = dayjs(item.date);
    let key = "";
    let label = "";

    if (thoiGian === "ngay") {
      key = d.format("YYYY-MM-DD");
      label = d.format("DD/MM");
    } else if (thoiGian === "tuan") {
      const week = d.isoWeek();
      const year = d.isoWeekYear();
      key = `${year}-W${week}`;
      label = `T${week}/${d.format("MM")}`;
    } else if (thoiGian === "thang") {
      key = d.format("YYYY-MM");
      label = d.format("MM/YYYY");
    }

    if (!grouped[key]) {
      grouped[key] = { label, value: 0, count: 0 };
    }
    grouped[key].value += item.value;
    grouped[key].count += 1;
  });

  return Object.values(grouped).map(({ label, value }) => ({ label, value }));
}
