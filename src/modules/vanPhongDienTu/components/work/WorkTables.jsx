import React, { useMemo } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Space, Grid } from "antd";
import styled from "styled-components";
import { CTable, CTag } from "../../../../components/common";
import { WorkTableSection, WorkSectionTitle } from "./styles";
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
  text-align: left;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

const { useBreakpoint } = Grid;

function WorkTables({ primaryData, supportData, assignedData, followData, onWorkClick }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const primaryColumns = useMemo(
    () => [
      ...(isMobile
        ? []
        : [
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
        ]),
      {
        title: "Công việc",
        dataIndex: "congViec",
        key: "congViec",
        align: "left",
        render: (text, record) => {
          const statusConfig = WORK_STATUS_MAP[record.trangThai];
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
              <LinkButton
                type="button"
                onClick={() => onWorkClick?.(record)}
              >
                {text}
              </LinkButton>
              {isMobile && statusConfig && (
                <CTag color={statusConfig.color}>{statusConfig.label}</CTag>
              )}
            </div>
          );
        },
      },
      ...(isMobile
        ? []
        : [
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
        ]),
      {
        title: "Ngày bắt đầu - Hạn HT",
        dataIndex: "ngayBatDau",
        key: "ngayBatDau",
        width: isMobile ? 130 : 200,
        align: "center",
      },
    ],
    [isMobile, onWorkClick]
  );

  const supportColumns = useMemo(
    () => [
      ...(isMobile
        ? []
        : [
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
        ]),
      {
        title: "Công việc",
        dataIndex: "congViec",
        key: "congViec",
        align: "left",
        render: (text, record) => {
          const statusConfig = WORK_STATUS_MAP[record.trangThai];
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
              <LinkButton
                type="button"
                onClick={() => onWorkClick?.(record)}
              >
                {text}
              </LinkButton>
              {isMobile && statusConfig && (
                <CTag color={statusConfig.color}>{statusConfig.label}</CTag>
              )}
            </div>
          );
        },
      },
      ...(isMobile
        ? []
        : [
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
        ]),
      {
        title: "Ngày bắt đầu - Hạn HT",
        dataIndex: "ngayBatDau",
        key: "ngayBatDau",
        width: isMobile ? 130 : 200,
        align: "center",
      },
    ],
    [isMobile, onWorkClick]
  );

  return (
    <>
      {primaryData && primaryData.length > 0 && (
        <WorkTableSection className="work-table-section">
          <WorkSectionTitle>Công việc tôi xử lý chính ({primaryData.length})</WorkSectionTitle>
          <CTable
            columns={primaryColumns}
            dataSource={primaryData}
            pagination={false}
          />
        </WorkTableSection>
      )}

      {supportData && supportData.length > 0 && (
        <WorkTableSection className="work-table-section">
          <WorkSectionTitle>Công việc tôi phối hợp thực hiện ({supportData.length})</WorkSectionTitle>
          <CTable
            columns={supportColumns}
            dataSource={supportData}
            pagination={false}
          />
        </WorkTableSection>
      )}

      {(!assignedData || assignedData.length === 0) && (
        <WorkTableSection className="work-table-section">
          <WorkSectionTitle>Công việc tôi giao và quản lý (0)</WorkSectionTitle>
          <CTable
            columns={primaryColumns}
            dataSource={[]}
            pagination={false}
          />
        </WorkTableSection>
      )}

      {(!followData || followData.length === 0) && (
        <WorkTableSection className="work-table-section">
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
