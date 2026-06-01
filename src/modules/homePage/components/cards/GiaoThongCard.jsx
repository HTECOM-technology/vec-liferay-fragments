import React from "react";
import GripHandle from "./GripHandle";

function GiaoThongCard({ dragHandleProps }) {
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

export default GiaoThongCard;
