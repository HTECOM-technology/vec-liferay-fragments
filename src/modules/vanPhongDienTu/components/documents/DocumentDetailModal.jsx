import React from "react";
import { Descriptions } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { CButton, CModal, CTag } from "../../../../components/common";

function DocumentDetailModal({ visible, document, onClose }) {
  if (!document) return null;

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Thường": return "green";
      case "Khẩn": return "orange";
      case "Hỏa tốc": return "red";
      default: return "default";
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "Thường": return "green";
      case "Quan trọng": return "orange";
      default: return "default";
    }
  };

  return (
    <CModal
      title={document.trichYeu || "Chi tiết văn bản"}
      open={visible}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: "center" }}>
          <CButton
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => console.log("Xem chi tiết văn bản:", document)}
          >
            Chi tiết văn bản
          </CButton>
        </div>
      }
      width={1200}
      centered
    >
      <Descriptions
        title="Thông tin chung"
        bordered
        column={2}
        size="middle"
      >
        <Descriptions.Item label="Ngày tạo">
          {document.ngayTao || `${document.ngayBanHanh} - 09:49:04 AM bởi ${document.nguoiTao || "Ngọc Cao Minh"}`}
        </Descriptions.Item>
        <Descriptions.Item label="Số văn bản">
          {document.soVanBan || "Công văn Đảng đi 2025 - 2030"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Cập nhật">
          {document.capNhat || "–"}
        </Descriptions.Item>
        <Descriptions.Item label="Số đi theo số">
          {document.soDiTheoSo || `${document.soDon || "640"} /716`}
        </Descriptions.Item>
        
        <Descriptions.Item label="Độ khẩn">
          <CTag color={getUrgencyColor(document.doKhan || "Thường")}>
            {document.doKhan || "Thường"}
          </CTag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày hiệu lực">
          {document.ngayHieuLuc || `${document.ngayBanHanh} - 13/01/2027`}
        </Descriptions.Item>
        
        <Descriptions.Item label="Quan trọng">
          <CTag color={getImportanceColor(document.quanTrong || "Thường")}>
            {document.quanTrong || "Thường"}
          </CTag>
        </Descriptions.Item>
        <Descriptions.Item label="Người ký">
          {document.nguoiKy || "–"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Trạng thái">
          <CTag color="default">
            {document.trangThaiText || "Chờ xử lý"}
          </CTag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày ký">
          {document.ngayKy || "–"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Số hiệu">
          {document.soHieu || "640-CV/ĐU"}
        </Descriptions.Item>
        <Descriptions.Item label="Lưu trữ">
          {document.luuTru || "Văn thư cơ quan"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Loại văn bản">
          {document.loaiVanBan || "2.Công văn"}
        </Descriptions.Item>
        <Descriptions.Item label="Soạn thảo">
          {document.soanThao || "–"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Đơn vị ban hành">
          {document.donViBanHanh || "Văn phòng Đảng Đoàn"}
        </Descriptions.Item>
        <Descriptions.Item label="Đơn vị soạn thảo">
          {document.donViSoanThao || "Văn phòng Đảng Đoàn"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Ngày ban hành">
          {document.ngayBanHanh || "13/01/2026"}
        </Descriptions.Item>
        <Descriptions.Item label="Đơn vị theo dõi chính">
          {document.donViTheoDoiChinh || "Văn phòng Đảng Đoàn"}
        </Descriptions.Item>
        
        <Descriptions.Item label="" span={1}>
          {/* Empty for alignment */}
        </Descriptions.Item>
        <Descriptions.Item label="Người theo dõi">
          {document.nguoiTheoDoi || "Quỳnh Mai Đức"}
        </Descriptions.Item>
      </Descriptions>
    </CModal>
  );
}

export default DocumentDetailModal;
