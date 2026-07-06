import React from "react";
import GripHandle from "./GripHandle";

function NhanSuCard({ dragHandleProps }) {
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

export default NhanSuCard;
