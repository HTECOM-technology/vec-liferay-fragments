import React, { useState, useCallback } from "react";
import GripHandle from "./GripHandle";
import HrmNotificationsModal from "@/components/layout/MainLayout/components/HrmNotificationsModal";

function CongVanVbCard({ dragHandleProps }) {
  const notificationCount = 1;
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = useCallback((e) => {
    e.preventDefault();
    setModalOpen(true);
    // TODO: khi có API thật, gọi fetchNotifications({ page: 1, append: false }) ở đây
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <GripHandle dragHandleProps={dragHandleProps} />
        <span>Công văn - Văn bản</span>
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
              <p className="min-hight-30"> Văn bản cần xử lý </p>
              <h3>00</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/elements-1-"} alt="" />
            </div>
          </div>
        </div>
        <div className="col-6 doc-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30"> Văn bản thông báo </p>
              <h3>00</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/file-export"} alt="" />
            </div>
          </div>
        </div>
        <div className="col-6 doc-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">Văn bản trả lại</p>
              <h3>00</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/alert-02"} alt="" />
            </div>
          </div>
        </div>
        <div className="col-6 doc-item padding-right-8">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30"> Văn bản theo dõi </p>
              <h3>00</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/time-quarter-pass"} alt="" />
            </div>
          </div>
        </div>
      </div>

      <HrmNotificationsModal
        open={modalOpen}
        title="Thông báo mới"
        notifications={[]}
        loading={false}
        loadingMore={false}
        hasMore={false}
        onLoadMore={() => {}}
        onClose={handleCloseModal}
        onToggleRead={() => {}}
        togglingCode={null}
      />
    </div>
  );
}

export default CongVanVbCard;