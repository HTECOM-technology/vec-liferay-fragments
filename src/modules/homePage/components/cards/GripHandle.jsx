import React from "react";

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

export default GripHandle;
