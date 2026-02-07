import React from "react";
import { CheckSquareOutlined, EyeOutlined } from "@ant-design/icons";
import { CButton, CTag } from "../../../../components/common";
import { TASK_STATUS_MAP } from "./constants";
import {
  StyledDetailModal,
  InfoSection,
  DetailModalTitle,
  DetailModalFooter,
} from "../common/DetailModalStyles";

function TaskDetailModal({ visible, task, onClose }) {
  if (!task) return null;

  const statusConfig = TASK_STATUS_MAP[task.trangThai] || { label: "Chưa xác định", color: "default" };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Cao": return "red";
      case "Bình thường":
      case "Trung bình": return "orange";
      case "Thấp": return "blue";
      default: return "default";
    }
  };

  return (
    <StyledDetailModal
      title={
        <DetailModalTitle>
          <CheckSquareOutlined />
          <span>{task.nhiemVu || "Chi tiết nhiệm vụ"}</span>
        </DetailModalTitle>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <DetailModalFooter>
          <CButton
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => console.log("Xem chi tiết nhiệm vụ:", task)}
          >
            Chi tiết nhiệm vụ
          </CButton>
        </DetailModalFooter>
      }
      width="90%"
    >
      <InfoSection>
        <div className="info-title">Thông tin nhiệm vụ</div>
        <div className="info-row">
          <span className="info-label">Nhóm</span>
          <span className="info-value">{task.nhom || "Báo cáo"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Mức độ ưu tiên</span>
          <span className="info-value">
            <CTag color={getPriorityColor(task.mucDoUuTien || "Bình thường")}>
              {task.mucDoUuTien || "Bình thường"}
            </CTag>
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Trạng thái</span>
          <span className="info-value">
            <CTag color={statusConfig.color}>{statusConfig.label}</CTag>
            {task.ngayHoanThanh && (
              <span style={{ marginLeft: 8, color: "rgba(0, 0, 0, 0.45)" }}>
                ({task.ngayHoanThanh})
              </span>
            )}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Hạn xử lý</span>
          <span className="info-value">
            {task.hanXuLy || "04/01/2026 - 09/01/2026"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Người giao việc</span>
          <span className="info-value">{task.giaoViec || "Nguyễn Văn A"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Đơn vị xử lý chính</span>
          <span className="info-value">{task.xuLyChinh || "Ban CNTT"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Người xử lý chính</span>
          <span className="info-value">{task.giaoViec || "Nguyễn Văn A"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Phối hợp xử lý</span>
          <span className="info-value">
            {task.xuLyChinh2 || "Trần Xuân Trí, Mai Hồng Quang"}
          </span>
        </div>
      </InfoSection>
    </StyledDetailModal>
  );
}

export default TaskDetailModal;
