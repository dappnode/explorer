import React from "react";
import mockChart from "./mockChart.svg";
import "./activity-chart.scss";

export default function ActivityChart() {
  return (
    <div className="activity-chart">
      <img src={mockChart} alt="mock-chart"></img>
    </div>
  );
}
