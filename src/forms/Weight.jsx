import React, { useState } from 'react';
import './record.css';
import { useNavigate } from "react-router-dom";

const RecordWeight = () => {
  const [weight, setWeight] = useState('');
  const [error, setError] = useState(null);
  const [submittedWeight, setSubmittedWeight] = useState(null);
  const [formattedTimestamp, setFormattedTimestamp] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Retrieve the JWT token

  if (!token) {
    navigate("/login");
    return;
  }

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const formattedDate = new Date().toISOString();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const weightData = {
      weight: parseFloat(weight),
      timestamp: formattedDate,
    };

    try {
      const recordType = "weight_records";
      let lastSubmissionDate = JSON.parse(localStorage.getItem("lastSubmissionDate")) || {};
      if (
        !lastSubmissionDate[recordType] ||
        new Date(lastSubmissionDate[recordType]).getMonth() !== new Date().getMonth() ||
        new Date(lastSubmissionDate[recordType]).getFullYear() !== new Date().getFullYear()
      ) {
        const timestamp = new Date().toISOString();

        const response = await fetch('http://localhost:3000/api/v1/record/weight_records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(weightData),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        lastSubmissionDate[recordType] = timestamp;
        localStorage.setItem("lastSubmissionDate", JSON.stringify(lastSubmissionDate));

        const parsedTimestamp = new Date(weightData.timestamp);
        setFormattedTimestamp(
          `${parsedTimestamp.toLocaleDateString()} ${parsedTimestamp.toLocaleTimeString()}`
        );
        setSubmittedWeight(weightData.weight);
        setSubmitted(true);
      } else {
                setError(
          <div>
            <p className='success-message'>
              คุณบันทึกพฤติกรรมภายในเดือนนี้เรียบร้อย<br />
              เมื่อวันที่ <span style={{ color: 'red' }}>{new Date(lastSubmissionDate[recordType]).toLocaleString()}</span><br />
              กรุณากลับมาบันทึกใหม่ภายหลัง
            </p>
          </div>);
        setSubmitted('error');
        return;
      }
    } catch (error) {
      setError('บันทึกไม่สำเร็จโปรดลองอีกครั้งภายหลัง');
      setSubmitted('error');
    }
  };

  return (
    <div className="record-container">
      <h2 className="medical-heading">บันทึกน้ำหนัก</h2>
      <div className="red-message">
        ให้ทันทำการชั่งน้ำหนักและบันทึก<span style={{ color: 'red' }}>เดือนละ 1 ครั้ง</span>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="reading-section">
            <label className='form-label'>
              น้ำหนัก (กิโลกรัม) :
              <input
                min="0"
                type="number"
                className="weight-input"
                value={weight}
                onChange={handleWeightChange}
                required
              />
            </label>
          </div>
          <button type="button" className="cancel-button" onClick={handleCancel}> ยกเลิก </button>
          <button type="submit" className="record-button">บันทึก</button>
        </form>
      </div>
      <div className="submission-message">
        {submitted === true && (
          <p className="success-message">
            น้ำหนัก: <span className="highlighted">{submittedWeight}</span> กิโลกรัม <br /> เวลา: {formattedTimestamp}
          </p>
        )}
        {submitted === 'error' && (
          <p className="error-message">{error}</p>
        )}
      </div>
    </div>
  );
};

export default RecordWeight;