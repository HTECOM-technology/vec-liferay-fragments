import React from "react";
import { StatsRow, StatCard } from "../../style";
import ValidationIcon from "../../../../assets/icon/validation.svg";
import AlertIcon from "../../../../assets/icon/alert-02.svg";
import HourglassIcon from "../../../../assets/icon/hourglass.svg";
import FileShredderIcon from "../../../../assets/icon/file-shredder.svg";

function TasksStatsCards({
  stats = { total: 0, processing: 0, completed: 0, overdue: 0 },
}) {
  return (
    <StatsRow>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Tổng số nhiệm vụ</div>
          <div className="stat-value">
            {String(stats.total).padStart(2, "0")}
          </div>
        </div>
        <img src={FileShredderIcon} alt="total" className="stat-icon" />
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Đang xử lý</div>
          <div className="stat-value">
            {String(stats.processing).padStart(2, "0")}
          </div>
        </div>
        <img src={HourglassIcon} alt="processing" className="stat-icon" />
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Đã hoàn thành</div>
          <div className="stat-value">
            {String(stats.completed).padStart(2, "0")}
          </div>
        </div>
        <img src={ValidationIcon} alt="completed" className="stat-icon" />
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Quá hạn</div>
          <div className="stat-value">
            {String(stats.overdue).padStart(2, "0")}
          </div>
        </div>
        <img src={AlertIcon} alt="overdue" className="stat-icon" />
      </StatCard>
    </StatsRow>
  );
}

export default TasksStatsCards;
