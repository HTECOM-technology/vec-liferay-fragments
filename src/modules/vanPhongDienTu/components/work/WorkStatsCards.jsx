import React, { useMemo } from "react";
import { StatsRow, StatCard } from "../../style";
import { ReactComponent as ValidationIcon } from "../../../../assets/icon/validation.svg";
import { ReactComponent as AlertIcon } from "../../../../assets/icon/alert-02.svg";
import { ReactComponent as HourglassIcon } from "../../../../assets/icon/hourglass.svg";
import { ReactComponent as FileShredderIcon } from "../../../../assets/icon/file-shredder.svg";

function WorkStatsCards({
  primaryData,
  supportData,
  assignedData,
  followData,
}) {
  const stats = useMemo(() => {
    const allData = [
      ...(primaryData || []),
      ...(supportData || []),
      ...(assignedData || []),
      ...(followData || []),
    ];

    const total = allData.length;
    const processing = allData.filter((item) =>
      ["processing", "in-progress"].includes(item.trangThai),
    ).length;
    const completed = allData.filter(
      (item) => item.trangThai === "completed",
    ).length;
    const overdue = allData.filter(
      (item) => item.trangThai === "overdue",
    ).length;

    return { total, processing, completed, overdue };
  }, [primaryData, supportData, assignedData, followData]);

  return (
    <StatsRow>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Tổng số công việc</div>
          <div className="stat-value">
            {String(stats.total).padStart(2, "0")}
          </div>
        </div>
        <FileShredderIcon className="stat-icon" />
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Đang xử lý</div>
          <div className="stat-value">
            {String(stats.processing).padStart(2, "0")}
          </div>
        </div>
        <HourglassIcon className="stat-icon" />
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Đã hoàn thành</div>
          <div className="stat-value">
            {String(stats.completed).padStart(2, "0")}
          </div>
        </div>
        <ValidationIcon className="stat-icon" />
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Quá hạn</div>
          <div className="stat-value">
            {String(stats.overdue).padStart(2, "0")}
          </div>
        </div>
        <AlertIcon className="stat-icon" />
      </StatCard>
    </StatsRow>
  );
}

export default WorkStatsCards;
