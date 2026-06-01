import React from "react";
import GripHandle from "./GripHandle";

function LichCoQuanCard({ dragHandleProps }) {
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

export default LichCoQuanCard;
