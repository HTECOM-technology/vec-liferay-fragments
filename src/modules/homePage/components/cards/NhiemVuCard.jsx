import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GripHandle from "./GripHandle";
import useUserInfo from "@/hooks/useUserInfo";
import { ttnsService } from "@/services/ttnsService";

const DEFAULT_GROUP_COUNTS = {
  "18": 0,
  "31": 0,
  "33": 0,
  "97_99": 0,
};

function NhiemVuCard({ dragHandleProps }) {
  const { user } = useUserInfo();
  const [groupCounts, setGroupCounts] = useState(DEFAULT_GROUP_COUNTS);
  const [hrmUserId, setHrmUserId] = useState(null);

  const userEmail = user?.emailAddress || "";

  useEffect(() => {
    let isMounted = true;

    const resolveHrmUserId = async () => {
      if (!userEmail) {
        return;
      }

      try {
        const items = await ttnsService.getAllEmployees();

        const matched = items.find(
          (item) => (item.email_cty || "").trim().toLowerCase() === userEmail.trim().toLowerCase()
        );

        if (isMounted && matched?.user_id) {
          setHrmUserId(matched.user_id);
        }
      } catch (error) {
        console.error("[NhiemVuCard] Failed to resolve HRM user_id by email:", error);
      }
    };

    resolveHrmUserId();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  useEffect(() => {
    let isMounted = true;

    const loadGroupCounts = async () => {
      if (!hrmUserId) {
        if (isMounted) {
          setGroupCounts(DEFAULT_GROUP_COUNTS);
        }
        return;
      }

      try {
        const response = await ttnsService.getUnreadCountByGroup({ userId: hrmUserId });

        if (!isMounted) return;

        setGroupCounts({
          "18": Number(response?.groups?.["18"]) || 0,
          "31": Number(response?.groups?.["31"]) || 0,
          "33": Number(response?.groups?.["33"]) || 0,
          "97_99": Number(response?.groups?.["97_99"]) || 0,
        });
      } catch (error) {
        console.error("[NhiemVuCard] Failed to load unread notification counts by group:", error);
        if (isMounted) {
          setGroupCounts(DEFAULT_GROUP_COUNTS);
        }
      }
    };

    loadGroupCounts();

    return () => {
      isMounted = false;
    };
  }, [hrmUserId]);

  const notificationCount = useMemo(() => {
    return groupCounts["18"] + groupCounts["31"] + groupCounts["33"] + groupCounts["97_99"];
  }, [groupCounts]);

  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <GripHandle dragHandleProps={dragHandleProps} />
        <span>Tổng hợp nhân sự</span>
        <Link to="/web/intranet/cong-thong-tin-nhan-su" className="icon-link">
          {notificationCount > 0 ? (
            <img src="https://res.cloudinary.com/dmd5s46fu/image/upload/v1774929237/notification_1_evmeys.gif" alt="" style={{ width: "20px", height: "20px" }} />
          ) : (
            <img src="https://res.cloudinary.com/dmd5s46fu/image/upload/v1774926423/notification-02_xcwyt6.png" alt="" style={{ width: "20px", height: "20px" }} />
          )}
        </Link>
      </div>
      <div className="row no-gutters doc-card-body">
        <div className="col-6 doc-item padding-right-8">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">Số ngày phép còn lại</p>
              <h3>00</h3>
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
    </div>
  );
}

export default NhiemVuCard;