import React from "react";
import { Button, Empty, Modal, Spin } from "antd";
import dayjs from "dayjs";
import styled from "styled-components";

const NotificationModalBody = styled.div`
  max-height: 60vh;
  overflow-y: auto;
`;

const StyledModal = styled(Modal)`
  .ant-modal-header {
    padding-bottom: 16px;
    margin-bottom: 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-modal-title {
    font-size: 24px;
    line-height: 1.2;
    font-weight: 700;
    color: #1f1f1f;
  }

  .ant-modal-body {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .ant-modal-footer {
    margin-top: 0;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }
`;

const NotificationItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 10px;
  margin-bottom: 10px;
  background: ${(props) => (props.$unread ? "#eef8ff" : "#fafafa")};
  border: 1px solid ${(props) => (props.$unread ? "#b7e0f6" : "#f0f0f0")};

  &:last-child {
    margin-bottom: 0;
  }

  .notification-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  .notification-top-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .notification-status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(props) => (props.$unread ? "#1677ff" : "#bfbfbf")};
    flex: 0 0 auto;
  }

  .notification-code {
    font-size: 14px;
    font-weight: 700;
    color: #0090cf;
    word-break: break-all;
  }

  .notification-status {
    flex: 0 0 auto;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: ${(props) => (props.$unread ? "#0958d9" : "#595959")};
    background: ${(props) => (props.$unread ? "#d6ecff" : "#ededed")};
  }

  .notification-content {
    font-size: 14px;
    color: #1f1f1f;
    line-height: 1.6;
    white-space: pre-line;
  }

  .notification-date {
    margin-top: 8px;
    font-size: 12px;
    color: #8c8c8c;
  }
`;

const LoadMoreWrap = styled.div`
  padding-top: 16px;
  display: flex;
  justify-content: center;
`;

function HrmNotificationsModal({
  open,
  notifications,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  onClose,
}) {
  return (
    <StyledModal
      open={open}
      onCancel={onClose}
      title="Thông báo về Nhân sự"
      width={760}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <NotificationModalBody>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <Empty description="Không có thông báo" />
        ) : (
          <>
            {notifications.map((item, index) => (
              <NotificationItem
                key={`${item.code || item.notify_code || "notify"}-${item.datetime0 || index}-${index}`}
                $unread={Number(item.sent) === 0}
              >
                <div className="notification-top">
                  <div className="notification-top-left">
                    <span className="notification-status-dot" />
                    <div className="notification-code">{item.code || item.notify_code || "Thông báo"}</div>
                  </div>
                  <div className="notification-status">
                    {Number(item.sent) === 0 ? "Chưa đọc" : "Đã đọc"}
                  </div>
                </div>
                <div className="notification-content">{item.content || item.content_html || "-"}</div>
                <div className="notification-date">
                  {item.datetime0 ? dayjs(item.datetime0).format("DD/MM/YYYY HH:mm") : "-"}
                </div>
              </NotificationItem>
            ))}
            {hasMore ? (
              <LoadMoreWrap>
                <Button onClick={onLoadMore} loading={loadingMore}>
                  Xem thêm
                </Button>
              </LoadMoreWrap>
            ) : null}
          </>
        )}
      </NotificationModalBody>
    </StyledModal>
  );
}

export default HrmNotificationsModal;
