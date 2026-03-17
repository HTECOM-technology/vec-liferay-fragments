import React from "react";
import "../styles/Dashborad.css";
import "../styles/responsive.css";
import DashboardDnD from "./DashboardDnD";

export default function Dashboard() {
  return (
    <div className="container-fluid">
      <div className="dashboard">
        <DashboardDnD />
      </div>
    </div>
  );
}
