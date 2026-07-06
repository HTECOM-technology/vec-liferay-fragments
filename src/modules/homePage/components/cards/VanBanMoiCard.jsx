import React from "react";
import GripHandle from "./GripHandle";

function VanBanMoiCard({ dragHandleProps }) {
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

export default VanBanMoiCard;
