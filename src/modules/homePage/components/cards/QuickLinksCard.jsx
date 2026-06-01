import React, { useState } from "react";
import { Link } from "react-router-dom";
import FeedbackModal from "../FeedbackModal";
import useQuickLinks from "../quicklinks/useQuickLink";

function QuickLinksCard() {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const { items } = useQuickLinks();

  return (
    <div className="quick-links-card-group">
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
