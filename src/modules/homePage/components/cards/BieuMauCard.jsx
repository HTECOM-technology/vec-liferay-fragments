import React from "react";
import GripHandle from "./GripHandle";

function BieuMauCard({ dragHandleProps }) {
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

export default BieuMauCard;
