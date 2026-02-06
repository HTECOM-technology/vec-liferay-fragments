import React from "react";
import { Descriptions } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { CButton, CModal, CTag } from "../../../../components/common";
import { WORK_STATUS_MAP } from "./constants";

function WorkDetailModal({ visible, work, onClose }) {
  if (!work) return null;

  const statusConfig = WORK_STATUS_MAP[work.trangThai] || { label: "Chưa xác định", color: "default" };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Cao": return "red";
      case "Trung bình": return "orange";
      case "Thấp": return "blue";
      default: return "default";
    }
  };

  return (
    <CModal
      title={work.congViec || "Chi tiết công việc"}
      open={visible}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: "center" }}>
          <CButton
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => console.log("Xem chi tiết công việc:", work)}
          >
            Chi tiết công việc
          </CButton>
        </div>
      }
      width={700}
      centered
    >
      <Descriptions
        title="Thông tin chung"
        bordered
        column={1}
        size="middle"
      >
        <Descriptions.Item label="Nhóm">
          {work.nhom || "Báo cáo"}
        </Descriptions.Item>
        <Descriptions.Item label="Dự án">
          {work.duAn || "Tên dự án"}
        </Descriptions.Item>
        <Descriptions.Item label="Mức độ ưu tiên">
          <CTag color={getPriorityColor(work.mucDoUuTien || "Cao")}>
            {work.mucDoUuTien || "Cao"}
          </CTag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <CTag color={statusConfig.color}>{statusConfig.label}</CTag>
        </Descriptions.Item>
        <Descriptions.Item label="Hạn xử lý">
          {work.ngayBatDau || work.hanXuLy || "09/01/2026 - 12/01/2026"}
        </Descriptions.Item>
        <Descriptions.Item label="Người giao việc">
          {work.nguoiGiaoViec || work.nguoiXuLyChinh || "Nguyễn Văn A"}
        </Descriptions.Item>
        <Descriptions.Item label="Người xử lý chính">
          {work.nguoiXuLyChinh || work.nguoiGiaoViec || "Nguyễn Văn A"}
        </Descriptions.Item>
        <Descriptions.Item label="Phối hợp xử lý">
          {work.phoiHopXuLy || "Trần Xuân Trí, Mai Hồng Quang"}
        </Descriptions.Item>
      </Descriptions>
    </CModal>
  );
}

export default WorkDetailModal;
