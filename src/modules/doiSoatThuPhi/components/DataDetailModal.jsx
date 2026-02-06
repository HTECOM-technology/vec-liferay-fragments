import React from "react";
import PropTypes from "prop-types";
import { EyeOutlined, CloseOutlined } from "@ant-design/icons";
import { CButton, CTable } from "../../../components/common";
import { CModal } from "../../../components/common/Modal";
import { Col, Flex, Row } from "antd";
import { Panel, PanelHeader, PanelContent, InfoRow, StatusBadge, ColumnButton } from "../style";
export const IconView = () => {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="6" fill="#0090CF" />
      <path d="M12.1248 14.0002C12.1248 12.9646 12.9643 12.1252 13.9998 12.1252C15.0354 12.1252 15.8748 12.9646 15.8748 14.0002C15.8748 15.0357 15.0354 15.8752 13.9998 15.8752C12.9643 15.8752 12.1248 15.0357 12.1248 14.0002Z" fill="white" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.6665 14.0002C5.6665 15.3663 6.02064 15.8264 6.72891 16.7466C8.14314 18.5839 10.5149 20.6668 13.9998 20.6668C17.4847 20.6668 19.8565 18.5839 21.2708 16.7466C21.979 15.8264 22.3332 15.3663 22.3332 14.0002C22.3332 12.634 21.979 12.1739 21.2708 11.2538C19.8565 9.41646 17.4847 7.3335 13.9998 7.3335C10.5149 7.3335 8.14314 9.41646 6.72891 11.2538C6.02064 12.1739 5.6665 12.634 5.6665 14.0002ZM13.9998 10.8752C12.2739 10.8752 10.8748 12.2743 10.8748 14.0002C10.8748 15.7261 12.2739 17.1252 13.9998 17.1252C15.7257 17.1252 17.1248 15.7261 17.1248 14.0002C17.1248 12.2743 15.7257 10.8752 13.9998 10.8752Z"
        fill="white"
      />
    </svg>
  );
};

function DataDetailModal({ visible, record, onClose }) {
  if (!record) return null;

  // Prepare comparison table data
  const comparisonColumns = [
    {
      title: "Nguồn",
      dataIndex: "source",
      key: "source",
      width: 180,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Etag",
      dataIndex: "etag",
      key: "etag",
      width: 140,
      render: (val) => (val === "-" ? val : val.split("\n").map((l, i) => <div key={i}>{l}</div>)),
    },
    { title: "TG vào", dataIndex: "tgVao", key: "tgVao", width: 120 },
    { title: "Trạm vào", dataIndex: "tramVao", key: "tramVao", width: 100 },
    { title: "Làn vào", dataIndex: "lanVao", key: "lanVao", width: 80, align: "center" },
    {
      title: "TG ra",
      dataIndex: "tgRa",
      key: "tgRa",
      width: 140,
      render: (val) => (val === "-" ? val : val.split(" ").map((l, i) => <div key={i}>{l}</div>)),
    },
    { title: "Trạm ra", dataIndex: "tramRa", key: "tramRa", width: 100 },
    { title: "Làn ra", dataIndex: "lanRa", key: "lanRa", width: 80, align: "center" },
    { title: "BKSND", dataIndex: "bksnd", key: "bksnd", width: 90 },
    { title: "Loại xe", dataIndex: "loaiXe", key: "loaiXe", width: 80, align: "center" },
    { title: "BKSDK", dataIndex: "bksdk", key: "bksdk", width: 90 },
    { title: "Mệnh giá", dataIndex: "menhGia", key: "menhGia", width: 90, align: "center" },
    { title: "Thời gian vào sick", dataIndex: "tgVaoSick", key: "tgVaoSick", width: 140 },
    { title: "Thời gian ra sick", dataIndex: "tgRaSick", key: "tgRaSick", width: 140 },
    { title: "Thời gian vào loop", dataIndex: "tgVaoLoop", key: "tgVaoLoop", width: 140 },
    { title: "Thời gian ra loop", dataIndex: "tgRaLoop", key: "tgRaLoop", width: 140 },
  ];

  const comparisonData = [
    {
      key: "bc",
      source: "BC của ĐV thu phí",
      etag: "-",
      tgVao: "-",
      tramVao: "-",
      lanVao: "-",
      tgRa: "-",
      tramRa: "-",
      lanRa: "-",
      bksnd: "-",
      loaiXe: "-",
      bksdk: "-",
      menhGia: "-",
      tgVaoSick: "-",
      tgRaSick: "-",
      tgVaoLoop: "-",
      tgRaLoop: "-",
    },
    {
      key: "gstp",
      source: "Hệ thống GSTP",
      etag: record.etag || "-",
      tgVao: record.tgVao || "-",
      tramVao: record.tramVao || "-",
      lanVao: record.lanVao || "-",
      tgRa: record.tgRa || "-",
      tramRa: record.tramRa || "-",
      lanRa: record.lanRa || "-",
      bksnd: record.bksnd || "-",
      loaiXe: record.loaiXe || "-",
      bksdk: record.bksdk || "-",
      menhGia: record.menhGia || "-",
      tgVaoSick: "-",
      tgRaSick: "-",
      tgVaoLoop: "-",
      tgRaLoop: "-",
    },
  ];

  // Mock explanation data (you can replace with actual data from record)
  const explanationData = {
    nguoiGiaiTrinh: "Nguyễn Văn A",
    noiDungGiaiTrinhNhanh: record.giaiTrinhNhanh || "Xe tang lễ BKS 24H03323V",
    thoiGianGiaiTrinh: "09/01/2026 • 10:19:07",
  };

  // Mock result data (you can replace with actual data from record)
  const resultData = {
    trangThai: "Đã duyệt",
    yKienLanhDao: "Hoàng Thanh Ngọc",
    thoiGianYKien: "31/12/2025 • 16:39:53 • Đồng ý",
  };

  return (
    <CModal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={
        <Flex vertical={false} align="center" justify="center" gap={12}>
          <IconView />
          <span className="header-title">Dữ liệu</span>
        </Flex>
      }
      width={1400}
      closable={false}
      centered
      closeIcon={<CloseOutlined />}
    >
      <CTable columns={comparisonColumns} dataSource={comparisonData} pagination={false} style={{ margin: "10px 0" }} size="small" scroll={{ x: 1600, y: 200 }} rowKey="key" showHeader={true} />

      <Row gutter={[16, 16]} align="bottom">
        <Col xl={10} md={12} sm={24} xs={24}>
          <Panel>
            <PanelHeader>Giải trình</PanelHeader>
            <PanelContent>
              <InfoRow>
                <span className="label">Người giải trình</span>
                <span className="value">{explanationData.nguoiGiaiTrinh}</span>
              </InfoRow>
              <InfoRow>
                <span className="label">Nội dung giải trình nhanh</span>
                <span className="value">{explanationData.noiDungGiaiTrinhNhanh}</span>
              </InfoRow>
              <InfoRow>
                <span className="label">Thời gian giải trình</span>
                <span className="value">{explanationData.thoiGianGiaiTrinh}</span>
              </InfoRow>
            </PanelContent>
          </Panel>
        </Col>
        <Col xl={10} md={12} sm={24} xs={24}>
          <Panel>
            <PanelHeader>Kết quả giải trình</PanelHeader>
            <Row style={{ padding: "18px 12px" }}>
              <Col span={12}>
                <p className="label" style={{ marginBottom: "20px" }}>
                  <b>Trạng thái</b>
                </p>
                <p className="label">
                  <b>Ý kiến lãnh đạo đơn vị thu phí</b>
                </p>
              </Col>
              <Col span={12}>
                <StatusBadge style={{ marginBottom: "14px" }}>{resultData.trangThai}</StatusBadge>

                <div className="value">{resultData.yKienLanhDao}</div>
                <div className="value" style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.45)" }}>
                  {resultData.thoiGianYKien}
                </div>
              </Col>
            </Row>
          </Panel>
        </Col>

        <ColumnButton xl={4} md={24} sm={24} xs={24} className="column-button">
          <CButton type="primary" onClick={() => {}}>
            <EyeOutlined />
            Chi tiết giao dịch
          </CButton>
        </ColumnButton>
      </Row>
    </CModal>
  );
}

DataDetailModal.propTypes = {
  visible: PropTypes.bool,
  record: PropTypes.object,
  onClose: PropTypes.func,
};

DataDetailModal.defaultProps = {
  visible: false,
  record: null,
  onClose: () => {},
};

export default DataDetailModal;
