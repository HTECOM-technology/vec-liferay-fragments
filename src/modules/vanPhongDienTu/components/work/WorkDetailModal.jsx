import React from "react";
import { CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { CButton, CTag } from "../../../../components/common";
import { WORK_STATUS_MAP } from "./constants";
import {
  StyledDetailModal,
  InfoSection,
  DetailModalTitle,
  DetailModalFooter,
} from "../common/DetailModalStyles";

function WorkDetailModal({ visible, work, onClose }) {
  if (!work) return null;

  const statusConfig = WORK_STATUS_MAP[work.trangThai] || {
    label: "Chưa xác định",
    color: "default",
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Cao":
        return "red";
      case "Trung bình":
        return "orange";
      case "Thấp":
        return "blue";
      default:
        return "default";
    }
  };

  return (
    <StyledDetailModal
      title={
        <DetailModalTitle>
          <CheckCircleOutlined />
          <span>{work.congViec || "Chi tiết công việc"}</span>
        </DetailModalTitle>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <DetailModalFooter>
          <CButton
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => console.log("Xem chi tiết công việc:", work)}
          >
            Chi tiết công việc
          </CButton>
        </DetailModalFooter>
      }
      width="90%"
    >
      <InfoSection>
        <div className="info-title">Thông tin công việc</div>
        <div className="info-row">
          <span className="info-label">Nhóm</span>
          <span className="info-value">{work.nhom || "Báo cáo"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Dự án</span>
          <span className="info-value">{work.duAn || "Tên dự án"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Mức độ ưu tiên</span>
          <span className="info-value">
            <CTag color={getPriorityColor(work.mucDoUuTien || "Cao")}>
              {work.mucDoUuTien || "Cao"}
            </CTag>
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Trạng thái</span>
          <span className="info-value">
            <CTag color={statusConfig.color}>{statusConfig.label}</CTag>
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Hạn xử lý</span>
          <span className="info-value">
            {work.ngayBatDau || work.hanXuLy || "09/01/2026 - 12/01/2026"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Người giao việc</span>
          <span className="info-value">
            {work.nguoiGiaoViec || work.nguoiXuLyChinh || "Nguyễn Văn A"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Người xử lý chính</span>
          <span className="info-value">
            {work.nguoiXuLyChinh || work.nguoiGiaoViec || "Nguyễn Văn A"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Phối hợp xử lý</span>
          <span className="info-value">
            {work.phoiHopXuLy || "Trần Xuân Trí, Mai Hồng Quang"}
          </span>
        </div>
      </InfoSection>
    </StyledDetailModal>
  );
}

export default WorkDetailModal;
