import React, { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import GripHandle from "./GripHandle";
import useUserInfo from "@/hooks/useUserInfo";
import { ttnsService } from "@/services/ttnsService";
import HrmNotificationsModal from "@/components/layout/MainLayout/components/HrmNotificationsModal";

const DEFAULT_GROUP_COUNTS = {
  "18": 0,
  "31": 0,
  "33": 0,
  "97_99": 0,
};

const NOTIFICATION_PAGE_SIZE = 10;

function NhiemVuCard({ dragHandleProps }) {
  const { user } = useUserInfo();
  const [groupCounts, setGroupCounts] = useState(DEFAULT_GROUP_COUNTS);
  const [hrmUserId, setHrmUserId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsTotal, setNotificationsTotal] = useState(0);
  const [notificationsPage, setNotificationsPage] = useState(1);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsLoadingMore, setNotificationsLoadingMore] = useState(false);
  const [togglingCode, setTogglingCode] = useState(null);
  const [phepConLai, setPhepConLai] = useState(null);

  const userScreenName = user?.screenName || "";
  const hasMoreNotifications = notifications.length < notificationsTotal;

  useEffect(() => {
    let isMounted = true;

    const resolveHrmUserId = async () => {
      if (!userScreenName) {
        return;
      }

      try {
        const resolvedUserId = await ttnsService.resolveHrmUserIdByScreenName(userScreenName);

        if (isMounted && resolvedUserId) {
          setHrmUserId(resolvedUserId);
        }
      } catch (error) {
        console.error("[NhiemVuCard] Failed to resolve HRM user_id by screenName:", error);
      }
    };

    resolveHrmUserId();

    return () => {
      isMounted = false;
    };
  }, [userScreenName]);

  const loadGroupCounts = useCallback(async () => {
    if (!hrmUserId) {
      setGroupCounts(DEFAULT_GROUP_COUNTS);
      setPhepConLai(null);
      return;
    }

    try {
      const response = await ttnsService.getUnreadCountByGroup({ userId: hrmUserId });

      setGroupCounts({
        "18": Number(response?.groups?.["18"]) || 0,
        "31": Number(response?.groups?.["31"]) || 0,
        "33": Number(response?.groups?.["33"]) || 0,
        "97_99": Number(response?.groups?.["97_99"]) || 0,
      });

      setPhepConLai(
      response?.phep_cl !== null && response?.phep_cl !== undefined
        ? Number(response.phep_cl)
        : null
      );
    } catch (error) {
      console.error("[NhiemVuCard] Failed to load unread notification counts by group:", error);
      setGroupCounts(DEFAULT_GROUP_COUNTS);
      setPhepConLai(null);
    }
  }, [hrmUserId]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!isMounted) return;
      await loadGroupCounts();
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [loadGroupCounts]);

  const notificationCount = useMemo(() => {
    return groupCounts["18"] + groupCounts["31"] + groupCounts["33"] + groupCounts["97_99"];
  }, [groupCounts]);

  const fetchNotifications = useCallback(
    async ({ page, append }) => {
      if (!hrmUserId) return;

      if (append) {
        setNotificationsLoadingMore(true);
      } else {
        setNotificationsLoading(true);
      }

      try {
        const response = await ttnsService.getNotifications({
          userId: hrmUserId,
          page,
          pageSize: NOTIFICATION_PAGE_SIZE,
        });

        const nextItems = response?.items || [];

        setNotifications((prev) => (append ? [...prev, ...nextItems] : nextItems));
        setNotificationsTotal(Number(response?.total) || 0);
        setNotificationsPage(Number(response?.page) || page);
      } catch (error) {
        message.error(ttnsService.getErrorMessage(error));
      } finally {
        if (append) {
          setNotificationsLoadingMore(false);
        } else {
          setNotificationsLoading(false);
        }
      }
    },
    [hrmUserId]
  );

  const handleOpenModal = useCallback(
    (e) => {
      e.preventDefault();
      setModalOpen(true);
      fetchNotifications({ page: 1, append: false });
    },
    [fetchNotifications]
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleLoadMoreNotifications = useCallback(() => {
    if (!hasMoreNotifications || notificationsLoadingMore) return;
    fetchNotifications({ page: notificationsPage + 1, append: true });
  }, [fetchNotifications, hasMoreNotifications, notificationsLoadingMore, notificationsPage]);

  const handleToggleRead = useCallback(
    async (record) => {
      const code = record.code || record.notify_code;
      if (!hrmUserId || !code || togglingCode === code) return;

      const previousSent = record.sent;
      setTogglingCode(code);

      setNotifications((prev) =>
        prev.map((item) =>
          (item.code || item.notify_code) === code ? { ...item, sent: !previousSent } : item
        )
      );

      try {
        const result = await ttnsService.markNotificationRead({
          code,
          userId: hrmUserId,
        });

        if (typeof result?.sent === "boolean") {
          setNotifications((prev) =>
            prev.map((item) =>
              (item.code || item.notify_code) === code ? { ...item, sent: result.sent } : item
            )
          );
        }

        // Đồng bộ lại số đếm theo nhóm từ server, tránh sai lệch do không biết group_code của item
        await loadGroupCounts();
      } catch (error) {
        setNotifications((prev) =>
          prev.map((item) =>
            (item.code || item.notify_code) === code ? { ...item, sent: previousSent } : item
          )
        );
        message.error(ttnsService.getErrorMessage(error));
      } finally {
        setTogglingCode(null);
      }
    },
    [hrmUserId, togglingCode, loadGroupCounts]
  );

  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <GripHandle dragHandleProps={dragHandleProps} />
        <span>Tổng hợp nhân sự</span>
        <a href="#" className="icon-link" onClick={handleOpenModal}>
          {notificationCount > 0 ? (
            <img src="https://res.cloudinary.com/dmd5s46fu/image/upload/v1774929237/notification_1_evmeys.gif" alt="" style={{ width: "20px", height: "20px" }} />
          ) : (
            <img src="https://res.cloudinary.com/dmd5s46fu/image/upload/v1774926423/notification-02_xcwyt6.png" alt="" style={{ width: "20px", height: "20px" }} />
          )}
        </a>
      </div>
      <div className="row no-gutters doc-card-body">
        <div className="col-6 doc-item padding-right-8">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">Số ngày phép còn lại</p>
              <h3>{phepConLai !== null ? phepConLai.toLocaleString("vi-VN") : "00"}</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/file-shredder"} alt="" />
            </div>
          </div>
        </div>
        <div className="col-6 doc-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">Duyệt nghỉ, vắng mặt</p>
              <h3>{groupCounts["18"]}</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/hour-glass"} alt="" />
            </div>
          </div>
        </div>
        <div className="col-3 doc-item padding-right-8">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">Duyệt xác nhận công</p>
              <h3>{groupCounts["33"]}</h3>
            </div>
          </div>
        </div>
        <div className="col-3 doc-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">Duyệt làm thêm giờ</p>
              <h3>{groupCounts["31"]}</h3>
            </div>
          </div>
        </div>
        <div className="col-3 doc-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">Duyệt đánh giá KPI tháng</p>
              <h3>{groupCounts["97_99"]}</h3>
            </div>
          </div>
        </div>
        <div className="col-3 doc-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">Chấm công</p>
              <h3>0</h3>
            </div>
          </div>
        </div>
      </div>

      <HrmNotificationsModal
        open={modalOpen}
        title="Thông báo về Nhân sự"
        notifications={notifications}
        loading={notificationsLoading}
        loadingMore={notificationsLoadingMore}
        hasMore={hasMoreNotifications}
        onLoadMore={handleLoadMoreNotifications}
        onClose={handleCloseModal}
        onToggleRead={handleToggleRead}
        togglingCode={togglingCode}
      />
    </div>
  );
}

export default NhiemVuCard;