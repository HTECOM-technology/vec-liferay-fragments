import React from "react";
import TrafficCameraMonitor from "../Trafficcameramonitor";

function CameraCard({ dragHandleProps, canDrag }) {
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

export default CameraCard;
