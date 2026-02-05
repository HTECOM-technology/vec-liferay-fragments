import React from "react";
import { Descriptions } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { CButton, CModal } from "../../../../components/common";

function EventDetailModal({ visible, event, onClose }) {
  if (!event) return null;

  return (
    <CModal
      title={event.detail || "Chi tiết sự kiện"}
      open={visible}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: "center" }}>
          <CButton
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => console.log("Xem chi tiết sự kiện:", event)}
          >
            Chi tiết sự kiện
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
        <Descriptions.Item label="Nhóm lịch">
          {event.nhomLich || "3. PTGĐ - Đảng Hoài Nam"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày thực hiện">
          {event.ngayThucHien || `Thứ ba, 30/12/2025 vào lúc ${event.time || "08:00 AM"}`}
        </Descriptions.Item>
        <Descriptions.Item label="Địa điểm">
          {event.diaDiem || "–"}
        </Descriptions.Item>
        <Descriptions.Item label="Chủ trì">
          {event.chuTri || "–"}
        </Descriptions.Item>
        <Descriptions.Item label="Thành phần tham gia">
          {event.thanhPhanThamGia || "–"}
        </Descriptions.Item>
        <Descriptions.Item label="Chuẩn bị">
          {event.chuanBi || "–"}
        </Descriptions.Item>
        <Descriptions.Item label="Tài nguyên">
          {event.taiNguyen || "–"}
        </Descriptions.Item>
        <Descriptions.Item label="Nội dung sự kiện">
          {event.noiDungSuKien || "–"}
        </Descriptions.Item>
        <Descriptions.Item label="Tài liệu kèm">
          {event.taiLieuKem || "–"}
        </Descriptions.Item>
        <Descriptions.Item label="Danh sách thông báo">
          {event.danhSachThongBao || "–"}
        </Descriptions.Item>
      </Descriptions>
    </CModal>
  );
}

export default EventDetailModal;
