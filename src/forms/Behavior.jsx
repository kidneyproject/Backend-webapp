// BehaviorForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './record.css';

const BehaviorForm = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [submittedTimestamp, setSubmittedTimestamp] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBehaviorData();
  }, [navigate, token]);

  const handleAnswerChange = (event) => {
    const { name, value } = event.target;
    setAnswers({ ...answers, [name]: value });
  };

  function mapAnswerValueToText(value) {
    return value === '1' ? 'ปฏิบัติ' : 'ไม่ปฏิบัติ';
  }

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const currentDate = new Date();
      const recordType = "behavior_records";
      let lastSubmissionDate = JSON.parse(localStorage.getItem("lastSubmissionDate")) || {};

      if (
        !lastSubmissionDate[recordType] ||
        new Date(lastSubmissionDate[recordType]).getMonth() !== currentDate.getMonth() ||
        new Date(lastSubmissionDate[recordType]).getFullYear() !== currentDate.getFullYear()
      ) {
        const timestamp = currentDate.toISOString();

        const behaviorRecord = {
          response: questions.map((question) => answers[`answer_${question.id}`]),
          question: questions.map((question) => question.id),
          timestamp,
        };        

        const response = await fetch(
          'http://localhost:3000/api/v1/record/behavior_records',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify(behaviorRecord),
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        lastSubmissionDate[recordType] = timestamp;
        localStorage.setItem("lastSubmissionDate", JSON.stringify(lastSubmissionDate));

        setSubmittedTimestamp(timestamp);
        setSubmitted(true);
        setError(null);
      } else {
        setError(
          <div>
            <p className='submission-message'>
              ท่านได้บันทึกข้อมูลของท่านในเดือนนี้แล้ว<br />
              เมื่อวันที่ <span style={{ color: 'red' }}>{new Date(lastSubmissionDate[recordType]).toLocaleString()}</span><br />
              กรุณากลับมาบันทึกอีกครั้งในเดือนหน้า
            </p>
          </div>
        );
      }
    } catch (error) {
      setError('บันทึกไม่สำเร็จโปรดลองอีกครั้งภายหลัง');
    }
  };

  return (
    <div className="record-container">
      <h2 className="medical-heading">บันทึกพฤติกรรม</h2>
      <div className="red-message">
        ให้ทันทำการบันทึกพฤติกรรมบันทึก<span style={{ color: 'red' }}>เดือนละ 1 ครั้ง</span>
      </div>
      {!submitted && (
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <p className="question-text">{question.question}</p>
              <div className="answer-options">
                <label className="answer-label">
                  <input
                    type="radio"
                    name={`answer_${question.id}`}
                    value="1"
                    onChange={handleAnswerChange}
                    checked={answers[`answer_${question.id}`] === '1'}
                  />
                  <span className="custom-radio"></span> ปฏิบัติ
                </label>
                <label className="answer-label">
                  <input
                    type="radio"
                    name={`answer_${question.id}`}
                    value="0"
                    onChange={handleAnswerChange}
                    checked={answers[`answer_${question.id}`] === '0'}
                  />
                  <span className="custom-radio"></span> ไม่ปฏิบัติ
                </label>
              </div>
            </div>
          ))}
          {error && <>{error}</>}
          <button type="button" className="cancel-button" onClick={handleCancel}> ยกเลิก </button>
          <button type="submit" className="record-button">บันทึก</button>
        </form>
      )}
      {submitted && (
        <div>
          <p className="submission-message">ขอบคุณที่ตอบคำถาม</p>
          <div className="submission-data">
            <h3>ผลลัพธ์ :</h3>
            {questions.map((question, index) => (
              <div key={index}>
                <p className="question-text">{question.question}</p>
                <p>คำตอบ: {mapAnswerValueToText(answers[`answer_${question.id}`])}</p>
              </div>
            ))}
            เวลาที่บันทึก: {new Date(submittedTimestamp).toLocaleString()}
          </div>
          <div className='submission'>
            <button type="button" className="cancel-button" onClick={handleCancel}> กลับ </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BehaviorForm;