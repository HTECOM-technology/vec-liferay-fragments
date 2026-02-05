import React, { useMemo } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Space } from "antd";
import styled from "styled-components";
import { CTable, CTag } from "../../../../components/common";
import { WorkTableSection, WorkSectionTitle } from "../../style";
import { WORK_STATUS_MAP } from "./constants";

const LinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: #1890ff;
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
  font-size: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

function WorkTables({ primaryData, supportData, assignedData, followData, onWorkClick }) {
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
          <Space size={6}>
            <UserOutlined />
            <span>{text}</span>
          </Space>
        ),
      },
      {
        title: "Công việc",
        dataIndex: "congViec",
        key: "congViec",
        render: (text, record) => (
          <LinkButton
            type="button"
            onClick={() => onWorkClick?.(record)}
          >
            {text}
          </LinkButton>
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
    [onWorkClick]
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
          <Space size={6}>
            <UserOutlined />
            <span>{text}</span>
          </Space>
        ),
      },
      {
        title: "Công việc",
        dataIndex: "congViec",
        key: "congViec",
        render: (text, record) => (
          <LinkButton
            type="button"
            onClick={() => onWorkClick?.(record)}
          >
            {text}
          </LinkButton>
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
    [onWorkClick]
  );

  return (
    <>
      {primaryData && primaryData.length > 0 && (
        <WorkTableSection>
          <WorkSectionTitle>Công việc tôi xử lý chính ({primaryData.length})</WorkSectionTitle>
          <CTable
            columns={primaryColumns}
            dataSource={primaryData}
            pagination={false}
          />
        </WorkTableSection>
      )}

      {supportData && supportData.length > 0 && (
        <WorkTableSection>
          <WorkSectionTitle>Công việc tôi phối hợp thực hiện ({supportData.length})</WorkSectionTitle>
          <CTable
            columns={supportColumns}
            dataSource={supportData}
            pagination={false}
          />
        </WorkTableSection>
      )}

      {(!assignedData || assignedData.length === 0) && (
        <WorkTableSection>
          <WorkSectionTitle>Công việc tôi giao và quản lý (0)</WorkSectionTitle>
          <CTable
            columns={primaryColumns}
            dataSource={[]}
            pagination={false}
          />
        </WorkTableSection>
      )}

      {(!followData || followData.length === 0) && (
        <WorkTableSection>
          <WorkSectionTitle>Công việc tôi theo dõi (0)</WorkSectionTitle>
          <CTable
            columns={primaryColumns}
            dataSource={[]}
            pagination={false}
          />
        </WorkTableSection>
      )}
    </>
  );
}

export default WorkTables;
