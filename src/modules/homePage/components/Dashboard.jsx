import React from "react";
import "../styles/Dashborad.css";
import "../styles/responsive.css";

// component
import News from "./News";
import TrafficCameraMonitor from "./Trafficcameramonitor";
import TopCardsSection from "./TopCardsSection";
import MiddleCardsSection from "./MiddleCardsSection";

export default function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="dashboard">
        <TopCardsSection />

        <MiddleCardsSection />

        <div className="dashboard-upper-cards bottom-area row mt-4">
          <div className="col-lg-8">
            <News />
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0" style={{ paddingRight: 0 }}>
            <TrafficCameraMonitor />
          </div>
        </div>
      </div>
    </div>
  );
}
