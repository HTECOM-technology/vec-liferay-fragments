import React, { useEffect, useState } from "react";
import { Button, Checkbox, Empty, Modal, Spin } from "antd";
import styled from "styled-components";
import { mergeCameraShowState } from "@/services/cameraShowStateService";

const ModalBody = styled.div`
  min-height: 240px;
`;

const GridHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e8edf3;
  background: linear-gradient(180deg, #f7fbfe 0%, #eef6fb 100%);
  border-radius: 10px 10px 0 0;
  font-size: 13px;
  font-weight: 700;
  color: #365168;
`;

const GridRows = styled.div`
  max-height: 420px;
  overflow: auto;
  border: 1px solid #e8edf3;
  border-top: none;
  border-radius: 0 0 10px 10px;
  background: #fff;
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f3f7;

  &:last-child {
    border-bottom: none;
  }
`;

const CameraCell = styled.div`
  grid-column: span 3;
  min-width: 0;
  color: #1f2d3d;
  font-size: 14px;
  font-weight: 500;
  word-break: break-word;
`;

const HeaderCellCamera = styled.div`
  grid-column: span 3;
`;

const HeaderCellBoolean = styled.div`
  grid-column: span 2;
  text-align: center;
`;

const BooleanCell = styled.div`
  grid-column: span 2;
  display: flex;
  justify-content: center;
`;

const Hint = styled.div`
  margin-bottom: 12px;
  color: #5b7083;
  font-size: 13px;
`;

const LoadingWrap = styled.div`
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function CameraShowStateModal({
  open,
  routeTitle,
  cameras,
  settings,
  loading,
  saving,
  onCancel,
  onSave,
}) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setRows(mergeCameraShowState(cameras, settings));
  }, [open, cameras, settings]);

  const handleToggle = (cameraId, key, checked) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.cameraId === cameraId
          ? {
              ...row,
              [key]: checked,
            }
          : row
      )
    );
  };

  const footer = [
    <Button key="close" onClick={onCancel}>
      Đóng
    </Button>,
    <Button
      key="save"
      type="primary"
      disabled={loading || rows.length === 0}
      loading={saving}
      onClick={() => onSave(rows)}
    >
      Lưu
    </Button>,
  ];

  return (
    <Modal
      open={open}
      title="Cấu hình hiển thị camera"
      onCancel={onCancel}
      footer={footer}
      width={920}
      destroyOnClose
    >
      <ModalBody>
        <Hint>
          {routeTitle
            ? `Thiết lập hiển thị camera cho tuyến ${routeTitle}.`
            : "Thiết lập hiển thị camera cho tuyến đang chọn."}
        </Hint>

        {loading ? (
          <LoadingWrap>
            <Spin size="large" />
          </LoadingWrap>
        ) : rows.length === 0 ? (
          <Empty description="Không có camera để cấu hình" />
        ) : (
          <>
            <GridHeader>
              <HeaderCellCamera>Camera</HeaderCellCamera>
              <HeaderCellBoolean>Hiển thị ở Internet</HeaderCellBoolean>
              <HeaderCellBoolean>Hiển thị ở Intranet</HeaderCellBoolean>
            </GridHeader>

            <GridRows>
              {rows.map((row) => (
                <GridRow key={row.cameraId}>
                  <CameraCell>{row.cameraName}</CameraCell>
                  <BooleanCell>
                    <Checkbox
                      checked={row.internetVisible}
                      onChange={(event) =>
                        handleToggle(row.cameraId, "internetVisible", event.target.checked)
                      }
                    />
                  </BooleanCell>
                  <BooleanCell>
                    <Checkbox
                      checked={row.intranetVisible}
                      onChange={(event) =>
                        handleToggle(row.cameraId, "intranetVisible", event.target.checked)
                      }
                    />
                  </BooleanCell>
                </GridRow>
              ))}
            </GridRows>
          </>
        )}
      </ModalBody>
    </Modal>
  );
}

export default CameraShowStateModal;
