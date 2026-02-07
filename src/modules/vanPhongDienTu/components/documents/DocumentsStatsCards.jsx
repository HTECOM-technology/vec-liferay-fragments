import React from "react";
import { StatsRow, StatCard } from "../../style";
import FileImportIcon from "../../../../assets/icon/file-import.svg";
import FileExportIcon from "../../../../assets/icon/file-export.svg";
import FileSecurityIcon from "../../../../assets/icon/file-security.svg";
import AlertIcon from "../../../../assets/icon/alert-02.svg";

function DocumentsStatsCards({
  stats = { incoming: 0, outgoing: 0, pending: 0, approved: 0 },
}) {
  return (
    <StatsRow>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Số văn bản đến mới</div>
          <div className="stat-value">
            {String(stats.incoming).padStart(2, "0")}
          </div>
        </div>
        <img src={FileImportIcon} alt="incoming" className="stat-icon" />
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Số văn bản đi mới</div>
          <div className="stat-value">
            {String(stats.outgoing).padStart(2, "0")}
          </div>
        </div>
        <img src={FileExportIcon} alt="outgoing" className="stat-icon" />
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Số văn bản chờ xử lý</div>
          <div className="stat-value">
            {String(stats.pending).padStart(2, "0")}
          </div>
        </div>
        <img src={FileSecurityIcon} alt="pending" className="stat-icon" />
      </StatCard>
      <StatCard>
        <div className="stat-content">
          <div className="stat-label">Số văn bản chờ duyệt</div>
          <div className="stat-value">
            {String(stats.approved).padStart(2, "0")}
          </div>
        </div>
        <img src={AlertIcon} alt="approved" className="stat-icon" />
      </StatCard>
      {/* Example for future use or if needed:
      <StatCard>
         ...
         <img src={FolderSecurityIcon} ... />
      </StatCard>
      */}
    </StatsRow>
  );
}

export default DocumentsStatsCards;
