import React from "react";
import GripHandle from "./GripHandle";

function SinhNhatCard({ dragHandleProps }) {
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

export default SinhNhatCard;
