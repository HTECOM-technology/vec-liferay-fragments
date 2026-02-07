import React from "react";
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import { CButton } from "../../../../components/common";
import {
  StyledDetailModal,
  InfoSection,
  DetailModalTitle,
  DetailModalFooter,
} from "../common/DetailModalStyles";

function EventDetailModal({ visible, event, onClose }) {
  if (!event) return null;

  return (
    <StyledDetailModal
      title={
        <DetailModalTitle>
          <CalendarOutlined />
          <span>{event.detail || "Chi tiết sự kiện"}</span>
        </DetailModalTitle>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <DetailModalFooter>
          <CButton
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => console.log("Xem chi tiết sự kiện:", event)}
          >
            Chi tiết sự kiện
          </CButton>
        </DetailModalFooter>
      }
      width="90%"
    >
      <InfoSection>
        <div className="info-title">Thông tin sự kiện</div>
        <div className="info-row">
          <span className="info-label">Nhóm lịch</span>
          <span className="info-value">{event.nhomLich || "3. PTGĐ - Đảng Hoài Nam"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Ngày thực hiện</span>
          <span className="info-value">
            {event.ngayThucHien || `Thứ ba, 30/12/2025 vào lúc ${event.time || "08:00 AM"}`}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Địa điểm</span>
          <span className="info-value">{event.diaDiem || "–"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Chủ trì</span>
          <span className="info-value">{event.chuTri || "–"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Thành phần tham gia</span>
          <span className="info-value">{event.thanhPhanThamGia || "–"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Chuẩn bị</span>
          <span className="info-value">{event.chuanBi || "–"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Tài nguyên</span>
          <span className="info-value">{event.taiNguyen || "–"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Nội dung sự kiện</span>
          <span className="info-value">{event.noiDungSuKien || "–"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Tài liệu kèm</span>
          <span className="info-value">{event.taiLieuKem || "–"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Danh sách thông báo</span>
          <span className="info-value">{event.danhSachThongBao || "–"}</span>
        </div>
      </InfoSection>
    </StyledDetailModal>
  );
}

export default EventDetailModal;
