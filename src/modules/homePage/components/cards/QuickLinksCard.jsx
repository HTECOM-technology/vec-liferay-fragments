import React, { useState } from "react";
import { Link } from "react-router-dom";
import FeedbackModal from "../FeedbackModal";
import useQuickLinks from "../quicklinks/useQuickLink";
import GripHandle from "./GripHandle";

function QuickLinksCard({ dragHandleProps }) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const { items } = useQuickLinks();

  return (
    <div className="quick-links-card-group">
      {dragHandleProps && Object.keys(dragHandleProps).length > 0 && (
        <div className="doc-card-header d-flex align-items-center justify-content-between" style={{ marginBottom: 8 }}>
          <GripHandle dragHandleProps={dragHandleProps} />
          <span>Liên kết nhanh</span>
          <span style={{ width: 20 }} />
        </div>
      )}
      {items.map((item) => (
        <div className="doc-card doc-single-card mb-2" key={`quick-link-${item.id}`}>
          <div className="doc-card-header p-0 d-flex align-items-center image-w-50 doc-card-header-link">
            {item.icon}
            <Link to={item.uRL} className="primary-color p-8">
              {item.title}

              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.66797 8H13.3346M13.3346 8L9.33464 4M13.3346 8L9.33464 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      ))}
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
    </div>
  );
}

export default QuickLinksCard;
