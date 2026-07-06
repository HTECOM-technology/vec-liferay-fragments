import React from "react";
import News from "../News";

function TinTucCard({ dragHandleProps, canDrag }) {
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

export default TinTucCard;
