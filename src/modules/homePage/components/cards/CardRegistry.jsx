import React, { useState } from "react";
import News from "../News";
import TrafficCameraMonitor from "../Trafficcameramonitor";
import FeedbackModal from "../FeedbackModal";
import { Link } from "react-router-dom";

// Grip icon shown in header when drag is enabled
function GripHandle({ dragHandleProps }) {
  if (!dragHandleProps || Object.keys(dragHandleProps).length === 0) return null;
  return (
    <span
      {...dragHandleProps}
      className="drag-grip-icon"
      title="Kéo để sắp xếp"
    >
      &#8942;&#8942;
    </span>
  );
}

// ─── ROW 1 CARDS ─────────────────────────────────────────────────────────────

export function CongVanVbCard({ dragHandleProps }) {
  const notificationCount = 1;
  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <GripHandle dragHandleProps={dragHandleProps} />
        {/* <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
          <img src={"/documents/d/guest/archive-02"} alt="icon" />
        </div> */}
        <span>Công văn - Văn bản</span>
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
    </div>
  );
}

export function CongViecCard({ dragHandleProps }) {
  const notificationCount = 0;
  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <GripHandle dragHandleProps={dragHandleProps} />
        {/* <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
          <img src={"/documents/d/guest/briefcase-03"} alt="icon" />
        </div> */}
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

export function NhiemVuCard({ dragHandleProps }) {
  const notificationCount = 1;
  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <GripHandle dragHandleProps={dragHandleProps} />
        {/* <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
          <img src={"/documents/d/guest/card-icon-3"} alt="icon" />
        </div> */}
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
              <h3>02</h3>
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
              <h3>04</h3>
            </div>
          </div>
        </div>
        <div className="col-3 doc-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">Duyệt làm thêm giờ</p>
              <h3>0</h3>
            </div>
          </div>
        </div>
        <div className="col-3 doc-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">Duyệt đánh giá KPI tháng</p>
              <h3>0</h3>
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

export function GiaoThongCard({ dragHandleProps }) {
  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center">
        <GripHandle dragHandleProps={dragHandleProps} />
        <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
          <img src={"/documents/d/guest/card-icon-3"} alt="icon" />
        </div>
        <span>Tình trạng giao thông</span>
      </div>
      <div className="row no-gutters doc-card-body">
        <div className="col-6 doc-item padding-right-8">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="min-hight-30">SL phương<br />tiện vi phạm</p>
              <h3>08</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/accident"} alt="" />
            </div>
          </div>
        </div>
        <div className="col-6 doc-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p>Tốc độ lưu<br />thông TB</p>
              <h3>02</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/dashboard-speed-01"} alt="" />
            </div>
          </div>
        </div>
        <div className="col-6 doc-item padding-right-8">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p>SL gia súc<br />đi vào cao tốc</p>
              <h3>02</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/frame"} alt="" />
            </div>
          </div>
        </div>
        <div className="col-6 doc-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p>Số lượng<br />camera bị lỗi</p>
              <h3>0</h3>
            </div>
            <div className="doc-item-icon">
              <img src={"/documents/d/guest/cctv-camera"} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickLinksCard({ dragHandleProps, canDrag }) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  return (
    <div className="quick-links-card-group">
      {/* <div className="drag-handle-bar" {...dragHandleProps}>
        {canDrag && <span className="drag-grip-icon">&#8942;&#8942;</span>}
        <span className="drag-handle-label">Liên kết nhanh</span>
      </div> */}
      {/* <div className="doc-card doc-single-card mb-2" onClick={() => setIsFeedbackModalOpen(true)} style={{ cursor: "pointer" }}>
        <div className="doc-card-header p-0 d-flex align-items-center image-w-50 doc-card-header-link">
          <div className="d-flex justify-content-center p-0 image-w-50 align-items-center">
            <img src={"/documents/d/guest/chat-icon"} alt="icon" />
          </div>
          <Link to="/web/intranet/quy-trinh-yeu-cau-ho-tro" className="primary-color p-8">
            Góp ý - Sáng kiến cải tiến

            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.66797 8H13.3346M13.3346 8L9.33464 4M13.3346 8L9.33464 12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Link>
        </div>
      </div> */}
      <div className="doc-card doc-single-card mb-2">
        <div className="doc-card-header p-0 d-flex align-items-center image-w-50 doc-card-header-link">
          {/* <img src={"http://45.77.240.85:8080/documents/d/guest/user-add-01"} alt="icon" /> */}
          <img src={"/documents/d/guest/user-add-01"} alt="icon" />
          <Link to="/web/intranet/quy-trinh-yeu-cau-ho-tro" className="primary-color p-8">
            Góp ý - Sáng kiến cải tiến

            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.66797 8H13.3346M13.3346 8L9.33464 4M13.3346 8L9.33464 12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="doc-card doc-single-card mb-2">
        <div className="doc-card-header p-0 d-flex align-items-center image-w-50 doc-card-header-link">
          {/* <img src={"http://45.77.240.85:8080/documents/d/guest/briefcase-01"} alt="icon" /> */}
          <img src={"/documents/d/guest/briefcase-01"} alt="icon" />
          <Link to="/web/intranet/khao-sat-va-bieu-quyet-noi-bo" className="primary-color p-8">
            Khảo sát & biểu quyết nội bộ

            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.66797 8H13.3346M13.3346 8L9.33464 4M13.3346 8L9.33464 12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="doc-card doc-single-card mb-2">
        <div className="doc-card-header p-0 d-flex align-items-center image-w-50 doc-card-header-link">
          {/* <img src={"http://45.77.240.85:8080/documents/d/guest/card-exchange-01"} alt="icon" /> */}
          <img src={"/documents/d/guest/card-exchange-01"} alt="icon" />
          <Link to="/web/intranet/quy-trinh-yeu-cau-ho-tro" className="primary-color p-8">
            Quy trình - Yêu cầu hỗ trợ

            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.66797 8H13.3346M13.3346 8L9.33464 4M13.3346 8L9.33464 12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="doc-card doc-single-card mb-2">
        <div className="doc-card-header p-0 d-flex align-items-center image-w-50 doc-card-header-link">
          {/* <img src={"http://45.77.240.85:8080/documents/d/guest/traffic-light-2"} alt="icon" /> */}
          <img src={"/documents/d/guest/traffic-light-2"} alt="icon" />
          <Link to="/web/intranet/so-tay-nhan-vien" className="primary-color p-8">
            Sổ tay nhân viên

            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.66797 8H13.3346M13.3346 8L9.33464 4M13.3346 8L9.33464 12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
      {/* <div className="doc-card doc-single-card">
        <div className="doc-card-header d-flex align-items-center p-0 doc-card-header-link">
          <div className="d-flex justify-content-center p-0 image-w-50 align-items-center">
            <img src={"/documents/d/guest/notebook-icon"} alt="icon" />
          </div>
          <Link to="/web/intranet/quy-trinh-yeu-cau-ho-tro" className="primary-color p-8">
            Sổ tay nhân viên

            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.66797 8H13.3346M13.3346 8L9.33464 4M13.3346 8L9.33464 12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Link>
        </div>
      </div> */}
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
    </div >
  );
}

// ─── ROW 2 CARDS ─────────────────────────────────────────────────────────────

export function VanBanMoiCard({ dragHandleProps }) {
  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center">
        <GripHandle dragHandleProps={dragHandleProps} />
        <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
          <img src={"/documents/d/guest/card-icon-2"} alt="icon" />
        </div>
        <span>Văn bản mới</span>
      </div>
      <div className="height-290 overflow-y">
        <div className="card-body-list">
          <ul>
            {[1, 2, 3].map((i) => (
              <li key={i} className="d-flex align-items-start pb-2 mb-2">
                <div className="upper-card-icon">
                  <img src={"/documents/d/guest/bullet"} alt="" />
                </div>
                <div className="upper-card-content">
                  <p className="mb-1">
                    Công bố danh mục thủ tục hành chính mới ban hành, thủ tục hành chính bị bãi bỏ lĩnh vực hoạt động...
                  </p>
                  <div className="card-content-date">
                    <span className="red-text">1562/QĐ-TTPVHCC</span> - <span>12/06/2024</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function LichCoQuanCard({ dragHandleProps }) {
  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <div className="d-flex justify-content-center align-items-center gap-8">
          <GripHandle dragHandleProps={dragHandleProps} />
          <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
            <img src={"/documents/d/guest/calendar"} alt="icon" />
          </div>
          <span>Lịch cơ quan</span>
        </div>
        <div className="d-flex align-items-center gap-8">
          <input type="checkbox" className="checkbox-custom" />
          <span>SK tôi tham gia</span>
        </div>
      </div>
      <div className="height-290 overflow-y">
        <div className="d-flex align-items-center gap-8 px-12 py-10 border-bottom">
          <img src={"/documents/d/guest/calendar-1"} alt="" />
          <p className="text-14">Hôm nay (08/01/2026)</p>
        </div>
        <div className="card-body-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="light-border-bottom mb-2 pb-2">
              <ul className="list-icon">
                <li><p className="font-bold">TGĐ - Phạm Hồng Quang | 09:00 AM</p></li>
              </ul>
              <p className="line-2 sm-text margin-top-5">Họp kiểm điểm dự án BLLT và mở rộng HLD (Chuẩn bị: PTGĐ Nam chỉ đạo c/b báo...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SinhNhatCard({ dragHandleProps }) {
  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <div className="d-flex justify-content-center align-items-center gap-8">
          <GripHandle dragHandleProps={dragHandleProps} />
          <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
            <img src={"/documents/d/guest/candel"} alt="icon" />
          </div>
          <span>Sinh nhật công ty</span>
        </div>
        <div className="d-flex align-items-center justify-content-end gap-8">
          <input type="month" className="custom-date" />
        </div>
      </div>
      <div className="height-290 overflow-y">
        <div className="card-body-list">
          <div>
            <div className="d-flex align-items-center gap-8 pb-2 border-bottom">
              <img src={"/documents/d/guest/calendar-1"} alt="" />
              <p className="text-14">Hôm nay <strong>Thứ 6, 09/01/2026</strong></p>
            </div>
            <div className="light-border-bottom mb-2 pb-2">
              <div className="d-flex align-items-center gap-8 pt-2">
                <img src={"/documents/d/guest/cake"} alt="" />
                <p className="text-14">Phan Thị Thùy Linh</p>
              </div>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center gap-8 pb-2 border-bottom">
              <img src={"/documents/d/guest/calendar-1"} alt="" />
              <p className="text-14">Ngày mai <strong>Thứ bảy, 10/1/2026</strong></p>
            </div>
            <div className="light-border-bottom mb-2 pb-2">
              {["Bùi Minh Phượng", "Nguyễn Hồng Sơn", "Nguyễn Minh Thảo"].map((name) => (
                <div key={name} className="d-flex align-items-center gap-8 pt-2">
                  <img src={"/documents/d/guest/cake"} alt="" />
                  <p className="text-14">{name}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center gap-8 pb-2 border-bottom">
              <img src={"/documents/d/guest/calendar-1"} alt="" />
              <p className="text-14">Ngày kia <strong>Chủ nhật, 11/01/2026</strong></p>
            </div>
          </div>
          <span className="sm-text pt-2 font-medium d-block">Không có ai sinh nhật</span>
        </div>
      </div>
    </div>
  );
}

export function NhanSuCard({ dragHandleProps }) {
  const items = [
    { icon: "container", title: "Quyết định bổ nhiệm", desc: "Ông NVA thành nhân viên kế toán" },
    { icon: "container2", title: "Quyết định nghỉ việc", desc: "Quyết thị nghỉ việc Bà Nguyễn Thị A" },
    { icon: "container3", title: "Thông báo nghỉ phép", desc: "Bà Nguyễn Thị A xin thông báo nghỉ phép" },
    { icon: "container4", title: "Quyết định khen thưởng", desc: "Ông NVA được khen thưởng nhờ đóng..." },
    { icon: "container", title: "Quyết định bổ nhiệm", desc: "Ông NVA thành nhân viên kế toán" },
  ];
  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-8">
          <GripHandle dragHandleProps={dragHandleProps} />
          <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
            <img src={"/documents/d/guest/card-icon-5"} alt="icon" />
          </div>
          <span>Hoạt động nhân sự</span>
        </div>
        <div className="d-flex align-items-center justify-content-end">
          <select className="custom-select-cls">
            <option value="Mới nhất">Mới nhất</option>
          </select>
        </div>
      </div>
      <div className="height-290 overflow-y">
        <div className="card-body-list">
          {items.map((item, i) => (
            <div key={i} className="hr-box d-flex gap-8 pb-2 mb-2 border-bottom">
              <div className="hr-box-icon">
                <img src={`/documents/d/guest/${item.icon}`} alt="icon" />
              </div>
              <div className="hr-box-content">
                <p className="mb-0 font-medium">{item.title}</p>
                <span className="sm-text pt-1 d-block">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BieuMauCard({ dragHandleProps }) {
  const files = ["Biểu mẫu tờ trình", "Biểu mẫu quyết định", "Biểu mẫu văn phòng", "Biểu mẫu thanh toán", "Biểu mẫu hợp đồng", "Biểu mẫu quyết toán"];
  return (
    <div className="doc-card">
      <div className="doc-card-header d-flex align-items-center">
        <GripHandle dragHandleProps={dragHandleProps} />
        <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
          <img src={"/documents/d/guest/card-icon-1"} alt="icon" />
        </div>
        <span>Công văn - Văn bản</span>
      </div>
      <div className="row no-gutters doc-card-body height-290 overflow-y">
        {files.map((name) => (
          <div key={name} className="card-files d-flex align-items-center mb-1">
            <img src={"/documents/d/guest/file"} alt="" />
            <p>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROW 3 CARDS ─────────────────────────────────────────────────────────────

export function TinTucCard({ dragHandleProps, canDrag }) {
  return (
    <div className="row3-card-wrapper">
      <div className="drag-handle-bar" {...dragHandleProps}>
        {canDrag && <span className="drag-grip-icon">&#8942;&#8942;</span>}
        <span className="drag-handle-label">Tin tức - Sự kiện</span>
      </div>
      <News />
    </div>
  );
}

export function CameraCard({ dragHandleProps, canDrag }) {
  return (
    <div className="row3-card-wrapper">
      <div className="drag-handle-bar" {...dragHandleProps}>
        {canDrag && <span className="drag-grip-icon">&#8942;&#8942;</span>}
        <span className="drag-handle-label">Camera giao thông</span>
      </div>
      <TrafficCameraMonitor />
    </div>
  );
}

// ─── REGISTRY MAP ─────────────────────────────────────────────────────────────

export const CARD_REGISTRY = {
  "cong-van-vb": CongVanVbCard,
  "cong-viec": CongViecCard,
  "nhiem-vu": NhiemVuCard,
  // "giao-thong": GiaoThongCard,
  "quick-links": QuickLinksCard,
  // "van-ban-moi": VanBanMoiCard,
  // "lich-co-quan": LichCoQuanCard,
  // "sinh-nhat": SinhNhatCard,
  // "nhan-su": NhanSuCard,
  // "bieu-mau": BieuMauCard,
  "tin-tuc": TinTucCard,
  "camera": CameraCard,
};
