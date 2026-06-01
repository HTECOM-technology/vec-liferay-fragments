import React from "react";
import { Link } from "react-router-dom";
import GripHandle from "./GripHandle";

function CongViecCard({ dragHandleProps }) {
  const notificationCount = 0;

  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <GripHandle dragHandleProps={dragHandleProps} />
        <span>Công việc</span>
        <Link to="/web/intranet/van-phong-dien-tu" className="icon-link">
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
              <p className="min-hight-30">Công việc cần xử lý</p>
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
              <p className="min-hight-30">Tin nhắn nội bộ chưa đọc</p>
              <h3>03</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/hour-glass"} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CongViecCard;
