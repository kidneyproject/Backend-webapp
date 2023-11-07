import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css'

function Home() {
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
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
        // Handle error (e.g., unauthorized access)
        console.error("Error fetching patient data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const fetchBehaviorData = async () => {
    try {

      const response = await fetch('http://localhost:3000/api/v1/admin/behaviorForm', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        console.error('Error fetching behavior data:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching behavior data:', error);
      return [];
    }
  };

  function mapAnswerValueToText(value) {
    return value === '1' ? 'ปฏิบัติ' : 'ไม่ปฏิบัติ';
  }

  function findQuestionText(questionId) {
    const question = questions.find((q) => q.id === questionId);
    return question ? question.question : "Unknown Question";
  }

  useEffect(() => {
    fetchPatientData()
      .then(() => {
        fetchBehaviorData();
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="history">
      <h1>ประวัติการบันทึกข้อมูล</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : patient !== "no data available" && patient !== null ? (
        <div>
          {patient.blood_pressure_records !== undefined && (
            <div className="record-section">
              <h3>บันทึกความดันโลหิต</h3>
              <table className="record-table">
                <thead>
                  <tr>
                    <th>เวลา</th>
                    <th>ครั้งที่ 1 (mmHg)</th>
                    <th>ครั้งที่ 2 (mmHg)</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.blood_pressure_records.map((bpRecord, index) => (
                    <tr key={index}>
                      <td>{new Date(bpRecord.timestamp).toLocaleString()}</td>
                      <td>{bpRecord.systolic}/{bpRecord.diastolic}</td>
                      <td>{bpRecord.systolic2}/{bpRecord.diastolic2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {patient.weight_records !== undefined && (
            <div className="record-section">
              <h3>บันทึกน้ำหนัก</h3>
              <table className="record-table">
                <thead>
                  <tr>
                    <th>เวลา</th>
                    <th>น้ำหนัก (กิโลกรัม)</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.weight_records.map((weightRecord, index) => (
                    <tr key={index}>
                      <td>{new Date(weightRecord.timestamp).toLocaleString()}</td>
                      <td>{weightRecord.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {patient.behavior_records.length > 0 && (
            <div className="record-section">
              <h3>บันทึกพฤติกรรม</h3>
              <table className="record-table">
                <thead>
                  <tr>
                    <th>เวลา</th>
                    <th>คำถาม</th>
                    <th>คำตอบ</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.behavior_records.map((record, index) => (
                    record.question.map((question, qIndex) => (
                      <tr key={qIndex}>
                        {qIndex === 0 && (
                          <td rowSpan={record.question.length}>
                            {new Date(record.timestamp).toLocaleString()}
                          </td>
                        )}
                        <td>{findQuestionText(question)}</td>
                        <td>{mapAnswerValueToText(record.response[qIndex])}</td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {patient.eGFR_records !== undefined && (
            <div className="record-section">
              <h3>บันทึกค่าอัตราการกรองไต</h3>
              <table className="record-table">
                <thead>
                  <tr>
                    <th>เวลา</th>
                    <th>ค่าอัตราการกรองไต (ml/min/1.73m2)</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.eGFR_records.map((eGFRrecords, index) => (
                    <tr key={index}>
                      <td>{new Date(eGFRrecords.timestamp).toLocaleString()}</td>
                      <td>{eGFRrecords.egfr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {patient.Hba1c_records !== undefined && (
            <div className="record-section">
              <h3>บันทึกระดับน้ำตาลสะสมในเลือด</h3>
              <table className="record-table">
                <thead>
                  <tr>
                    <th>เวลา</th>
                    <th>ระดับน้ำตาลสะสมในเลือด (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.Hba1c_records.map((Hba1cRecords, index) => (
                    <tr key={index}>
                      <td>{new Date(Hba1cRecords.timestamp).toLocaleString()}</td>
                      <td>{Hba1cRecords.hba1c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <p>ไม่พบข้อมูลผู้ป่วย</p>
      )}
    </div>
  );
}

export default Home;
