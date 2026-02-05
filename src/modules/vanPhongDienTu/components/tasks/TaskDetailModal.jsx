import React from "react";
import { Descriptions } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { CButton, CModal, CTag } from "../../../../components/common";
import { TASK_STATUS_MAP } from "./constants";

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
    <CModal
      title={task.nhiemVu || "Chi tiết nhiệm vụ"}
      open={visible}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: "center" }}>
          <CButton
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => console.log("Xem chi tiết nhiệm vụ:", task)}
          >
            Chi tiết nhiệm vụ
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
          {task.nhom || "Báo cáo"}
        </Descriptions.Item>
        <Descriptions.Item label="Mức độ ưu tiên">
          <CTag color={getPriorityColor(task.mucDoUuTien || "Bình thường")}>
            {task.mucDoUuTien || "Bình thường"}
          </CTag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <CTag color={statusConfig.color}>{statusConfig.label}</CTag>
          {task.ngayHoanThanh && (
            <span style={{ marginLeft: 8, color: "rgba(0, 0, 0, 0.45)" }}>
              ({task.ngayHoanThanh})
            </span>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Hạn xử lý">
          {task.hanXuLy || "04/01/2026 - 09/01/2026"}
        </Descriptions.Item>
        <Descriptions.Item label="Người giao việc">
          {task.giaoViec || "Nguyễn Văn A"}
        </Descriptions.Item>
        <Descriptions.Item label="Đơn vị xử lý chính">
          {task.xuLyChinh || "Ban CNTT"}
        </Descriptions.Item>
        <Descriptions.Item label="Người xử lý chính">
          {task.giaoViec || "Nguyễn Văn A"}
        </Descriptions.Item>
        <Descriptions.Item label="Phối hợp xử lý">
          {task.xuLyChinh2 || "Trần Xuân Trí, Mai Hồng Quang"}
        </Descriptions.Item>
      </Descriptions>
    </CModal>
  );
}

export default TaskDetailModal;
