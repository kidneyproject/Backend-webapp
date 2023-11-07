import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WeightTracking from '../../charts/WeightTracking.jsx';
import BloodPressureInsights from '../../charts/BloodPressureInsights.jsx';

function Home() {
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Function to fetch patient data
  const fetchPatientData = async () => {
    try {

      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch patient data from the API using the token
      const response = await fetch("http://localhost:3000/api/v1/records", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatient(data);
              } else {
        console.error("Error fetching patient data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    fetchPatientData()
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="chart">
      {isLoading ? (
        <p>Loading...</p>
      ) : patient !== "no data available" && patient !== null ? (
        <div>
          <BloodPressureInsights bloodPressureData={patient.blood_pressure_records} />
          <WeightTracking weightData={patient.weight_records} />
        </div>
      ) : (
        <p>ไม่พบข้อมูลผู้ป่วย</p>
      )}
    </div>
  );
}

export default Home;
