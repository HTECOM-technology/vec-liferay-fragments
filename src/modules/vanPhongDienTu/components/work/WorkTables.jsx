import React, { useMemo } from "react";
import styled from "styled-components";
import { CTable, CTag } from "../../../../components/common";
import { WORK_STATUS_MAP } from "./constants";

const SectionWrap = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
`;

function WorkTables({ primaryData, supportData, assignedData, followData }) {
  const primaryColumns = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "stt",
        key: "stt",
        width: 60,
        align: "center",
      },
      {
        title: "Người giao việc",
        dataIndex: "nguoiGiaoViec",
        key: "nguoiGiaoViec",
        width: 150,
        render: (text) => (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: "Công việc",
        dataIndex: "congViec",
        key: "congViec",
        render: (text) => (
          <a href="#" style={{ color: "#1890ff" }}>
            {text}
          </a>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "trangThai",
        key: "trangThai",
        width: 140,
        align: "center",
        render: (status) => {
          const statusConfig = WORK_STATUS_MAP[status];
          return statusConfig ? (
            <CTag color={statusConfig.color}>{statusConfig.label}</CTag>
          ) : null;
        },
      },
      {
        title: "Ngày bắt đầu - Hạn HT",
        dataIndex: "ngayBatDau",
        key: "ngayBatDau",
        width: 200,
        align: "center",
      },
    ],
    []
  );

  const supportColumns = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "stt",
        key: "stt",
        width: 60,
        align: "center",
      },
      {
        title: "Người xử lý chính",
        dataIndex: "nguoiXuLyChinh",
        key: "nguoiXuLyChinh",
        width: 150,
        render: (text) => (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: "Công việc",
        dataIndex: "congViec",
        key: "congViec",
        render: (text) => (
          <a href="#" style={{ color: "#1890ff" }}>
            {text}
          </a>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "trangThai",
        key: "trangThai",
        width: 140,
        align: "center",
        render: (status) => {
          const statusConfig = WORK_STATUS_MAP[status];
          return statusConfig ? (
            <CTag color={statusConfig.color}>{statusConfig.label}</CTag>
          ) : null;
        },
      },
      {
        title: "Ngày bắt đầu - Hạn HT",
        dataIndex: "ngayBatDau",
        key: "ngayBatDau",
        width: 200,
        align: "center",
      },
    ],
    []
  );

  return (
    <>
      {primaryData && primaryData.length > 0 && (
        <SectionWrap>
          <SectionTitle>Công việc tôi xử lý chính ({primaryData.length})</SectionTitle>
          <CTable
            columns={primaryColumns}
            dataSource={primaryData}
            pagination={false}
            size="small"
          />
        </SectionWrap>
      )}

      {supportData && supportData.length > 0 && (
        <SectionWrap>
          <SectionTitle>Công việc tôi phối hợp thực hiện ({supportData.length})</SectionTitle>
          <CTable
            columns={supportColumns}
            dataSource={supportData}
            pagination={false}
            size="small"
          />
        </SectionWrap>
      )}

      {(!assignedData || assignedData.length === 0) && (
        <SectionWrap>
          <SectionTitle>Công việc tôi giao và quản lý (0)</SectionTitle>
          <CTable
            columns={primaryColumns}
            dataSource={[]}
            pagination={false}
            size="small"
          />
        </SectionWrap>
      )}

      {(!followData || followData.length === 0) && (
        <SectionWrap>
          <SectionTitle>Công việc tôi theo dõi (0)</SectionTitle>
          <CTable
            columns={primaryColumns}
            dataSource={[]}
            pagination={false}
            size="small"
          />
        </SectionWrap>
      )}
    </>
  );
}

export default WorkTables;
