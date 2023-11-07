import React from "react";
import BloodPressureInsights from "../../charts/BloodPressureInsights";
import WeightTracking from "../../charts/WeightTracking";

const Dashboard = ({ patient }) => {
  // Extract records for blood pressure and weight tracking
  const bloodPressureData = patient.records.filter(
    (record) => record.type === "systolic" || record.type === "diastolic"
  );

  const weightTrackingData = patient.records.filter(
    (record) => record.type === "weight"
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Monitor health data and user submissions</p>
      </div>
      <div className="dashboard-section">
        <div className="dashboard-insight">
          <h3>Blood Pressure</h3>
          <BloodPressureInsights bloodPressureData={bloodPressureData} />
        </div>
        <div className="dashboard-insight">
          <h3>Weight Tracking</h3>
          <WeightTracking weightTrackingData={weightTrackingData} />
        </div>
      </div>
      {/* Add more sections or insights as needed */}
    </div>
  );
};

export default Dashboard;
