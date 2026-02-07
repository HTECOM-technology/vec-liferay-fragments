import React from "react";
import { FileTextOutlined, EyeOutlined } from "@ant-design/icons";
import { CButton, CTag } from "../../../../components/common";
import {
  StyledDetailModal,
  InfoSection,
  InfoGrid,
  DetailModalTitle,
  DetailModalFooter,
} from "../common/DetailModalStyles";

function DocumentDetailModal({ visible, document, onClose }) {
  if (!document) return null;

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Thường":
        return "green";
      case "Khẩn":
        return "orange";
      case "Hỏa tốc":
        return "red";
      default:
        return "default";
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "Thường":
        return "green";
      case "Quan trọng":
        return "orange";
      default:
        return "default";
    }
  };

  return (
    <StyledDetailModal
      maxWidth="1000px"
      title={
        <DetailModalTitle>
          <FileTextOutlined />
          <span>{document.trichYeu || "Chi tiết văn bản"}</span>
        </DetailModalTitle>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <DetailModalFooter>
          <CButton
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => console.log("Xem chi tiết văn bản:", document)}
          >
            Chi tiết văn bản
          </CButton>
        </DetailModalFooter>
      }
      width="90%"
    >
      <InfoSection>
        <div className="info-title">Thông tin chung</div>
      </InfoSection>
      <InfoGrid labelWidth="150px">
        <div className="info-row">
          <span className="info-label">Ngày tạo</span>
          <span className="info-value">
            {document.ngayTao ||
              `${document.ngayBanHanh || "13/01/2026"} - 09:49:04 AM bởi ${document.nguoiTao || "Ngọc Cao Minh"}`}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Số văn bản</span>
          <span className="info-value">
            {document.soVanBan || "Công văn Đảng đi 2025 - 2030"}
          </span>
        </div>
        
        <div className="info-row">
          <span className="info-label">Cập nhật</span>
          <span className="info-value">{document.capNhat || "–"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Số đi theo số</span>
          <span className="info-value">
            {document.soDiTheoSo || `${document.soDon || "640"} /716`}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Độ khẩn</span>
          <span className="info-value">
            <CTag color={getUrgencyColor(document.doKhan || "Thường")}>
              {document.doKhan || "Thường"}
            </CTag>
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Ngày hiệu lực</span>
          <span className="info-value">
            {document.ngayHieuLuc || `${document.ngayBanHanh || "13/01/2026"} - 13/01/2027`}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Quan trọng</span>
          <span className="info-value">
            <CTag color={getImportanceColor(document.quanTrong || "Thường")}>
              {document.quanTrong || "Thường"}
            </CTag>
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Người ký</span>
          <span className="info-value">{document.nguoiKy || "–"}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Trạng thái</span>
          <span className="info-value">
            <CTag color="default">{document.trangThaiText || "Chờ xử lý"}</CTag>
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Ngày ký</span>
          <span className="info-value">{document.ngayKy || "–"}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Số hiệu</span>
          <span className="info-value">{document.soHieu || "640-CV/ĐU"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Lưu trữ</span>
          <span className="info-value">{document.luuTru || "Văn thư cơ quan"}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Loại văn bản</span>
          <span className="info-value">{document.loaiVanBan || "2.Công văn"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Soạn thảo</span>
          <span className="info-value">{document.soanThao || "–"}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Đơn vị ban hành</span>
          <span className="info-value">
            {document.donViBanHanh || "Văn phòng Đảng Đoàn"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Đơn vị soạn thảo</span>
          <span className="info-value">
            {document.donViSoanThao || "Văn phòng Đảng Đoàn"}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Ngày ban hành</span>
          <span className="info-value">{document.ngayBanHanh || "13/01/2026"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Đơn vị theo dõi chính</span>
          <span className="info-value">
            {document.donViTheoDoiChinh || "Văn phòng Đảng Đoàn"}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label"></span>
          <span className="info-value"></span>
        </div>
        <div className="info-row">
          <span className="info-label">Người theo dõi</span>
          <span className="info-value">{document.nguoiTheoDoi || "Quỳnh Mai Đức"}</span>
        </div>
      </InfoGrid>
    </StyledDetailModal>
  );
}

export default DocumentDetailModal;
