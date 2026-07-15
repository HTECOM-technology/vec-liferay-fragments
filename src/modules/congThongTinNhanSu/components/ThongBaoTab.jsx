import React, { useCallback, useEffect, useState } from "react";
import { Table, Spin, Empty, Button, message, Tag } from "antd";
import styled from "styled-components";
import useUserInfo from "@/hooks/useUserInfo";
import { ttnsService } from "@/services/ttnsService";

const PAGE_SIZE = 20;

const Wrap = styled.div`
  padding: 16px 0;

  .ant-table-tbody > tr > td {
    border-bottom: 2px solid #d9d9d9 !important;
    padding: 16px !important;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f5faff !important;
  }

  .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: none !important;
  }
`;

const RowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background: ${(props) => (props.$unread ? "#1890ff" : "#bfbfbf")};
`;

const CodeText = styled.span`
  color: #888;
  font-size: 13px;
`;

const NotiContent = styled.div`
  font-size: 14px;
  color: #333;

  table.ntf-t {
    width: 100%;
    border-collapse: collapse;
  }
  table.ntf-t td.ntf-c {
    padding: 2px 6px;
    vertical-align: top;
  }
  .ntf-x {
    font-size: 13px;
  }
  tr.ntf-r td.ntf-c:first-child {
    font-weight: 600;
    color: #555;
    width: 140px;
  }
  .ntf-plain-content {
    font-size: 14px;
  }
`;

const NotiTime = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

function formatDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stripNoiDungLabel(html) {
  if (!html) return "";

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = doc.querySelectorAll("tr.ntf-r");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td.ntf-c");
      if (cells.length === 2) {
        const label = cells[0].textContent.trim();
        if (label === "Nội dung") {
          const valueHtml = cells[1].innerHTML;
          const plainDiv = doc.createElement("div");
          plainDiv.className = "ntf-plain-content";
          plainDiv.innerHTML = valueHtml;
          row.replaceWith(plainDiv);
        }
      }
    });

    return doc.body.innerHTML;
  } catch (error) {
    console.error("[ThongBaoTab] Failed to strip 'Nội dung' label:", error);
    return html;
  }
}

function ThongBaoTab() {
  const { user } = useUserInfo();
  const [hrmUserId, setHrmUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [togglingCode, setTogglingCode] = useState(null);

  const userScreenName = user?.screenName || "";
  const hasMore = notifications.length < total;

  useEffect(() => {
    let isMounted = true;

    const resolveHrmUserId = async () => {
      if (!userScreenName) return;

      try {
        const resolvedUserId = await ttnsService.resolveHrmUserIdByScreenName(userScreenName);

        if (!isMounted) return;

        if (resolvedUserId) {
          setHrmUserId(resolvedUserId);
        } else {
          setHrmUserId(null);
          message.warning("Không tìm thấy thông tin nhân sự tương ứng với tài khoản của bạn. Danh sách thông báo có thể không hiển thị.");
        }
      } catch (error) {
        if (isMounted) {
          console.error("[ThongBaoTab] Failed to resolve HRM user_id by screenName:", error);
          message.error(ttnsService.getErrorMessage(error));
        }
      }
    };

    resolveHrmUserId();

    return () => {
      isMounted = false;
    };
  }, [userScreenName]);

  const fetchNotifications = useCallback(async ({ page: fetchPage, append }) => {
    if (!hrmUserId) return;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await ttnsService.getNotifications({
        userId: hrmUserId,
        page: fetchPage,
        pageSize: PAGE_SIZE,
      });

      const items = response?.items || [];

      setNotifications((prev) => (append ? [...prev, ...items] : items));
      setTotal(Number(response?.total) || 0);
      setPage(Number(response?.page) || fetchPage);
    } catch (error) {
      message.error(ttnsService.getErrorMessage(error));
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [hrmUserId]);

  useEffect(() => {
    if (hrmUserId) {
      fetchNotifications({ page: 1, append: false });
    }
  }, [hrmUserId, fetchNotifications]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchNotifications({ page: page + 1, append: true });
  };

  const handleToggleRead = useCallback(
    async (record) => {
      if (!hrmUserId || togglingCode === record.code) return;

      const previousSent = record.sent;
      setTogglingCode(record.code);

      setNotifications((prev) =>
        prev.map((item) =>
          item.code === record.code ? { ...item, sent: !previousSent } : item
        )
      );

      try {
        const result = await ttnsService.markNotificationRead({
          code: record.code,
          userId: hrmUserId,
        });

        if (typeof result?.sent === "boolean") {
          setNotifications((prev) =>
            prev.map((item) =>
              item.code === record.code ? { ...item, sent: result.sent } : item
            )
          );
        }
      } catch (error) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.code === record.code ? { ...item, sent: previousSent } : item
          )
        );
        message.error(ttnsService.getErrorMessage(error));
      } finally {
        setTogglingCode(null);
      }
    },
    [hrmUserId, togglingCode]
  );

  const columns = [
    {
      title: "Thông báo",
      dataIndex: "content_html",
      render: (_, record) => {
        const isUnread = !record.sent;

        return (
          <div>
            <RowHeader>
              <span>
                <StatusDot $unread={isUnread} />
                <CodeText>{record.code}</CodeText>
              </span>
              <Tag
                color={isUnread ? "blue" : "default"}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleRead(record);
                }}
              >
                {isUnread ? "Chưa đọc" : "Đã đọc"}
              </Tag>
            </RowHeader>
            <NotiContent
              dangerouslySetInnerHTML={{
                __html: stripNoiDungLabel(record.content_html) || record.content || "",
              }}
            />
            <NotiTime>{formatDateTime(record.datetime0)}</NotiTime>
          </div>
        );
      },
    },
  ];

  return (
    <Wrap>
      <Spin spinning={loading}>
        {notifications.length === 0 && !loading ? (
          <Empty description="Không có thông báo nào" />
        ) : (
          <Table
            rowKey="code"
            columns={columns}
            dataSource={notifications}
            pagination={false}
            bordered
            showHeader={false}
          />
        )}

        {hasMore && (
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Button loading={loadingMore} onClick={handleLoadMore}>
              Xem thêm
            </Button>
          </div>
        )}
      </Spin>
    </Wrap>
  );
}

export default ThongBaoTab;