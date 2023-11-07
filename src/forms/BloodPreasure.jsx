import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './record.css';
import systolicImage from '../Image/systolic_image.jpg';
import diastolicImage from '../Image/diastolic_image.jpg';

const RecordBloodPressure = () => {
  const [firstReading, setFirstReading] = useState({
    time: '',
    systolic: '',
    diastolic: '',
  });
  const [secondReading, setSecondReading] = useState({
    time: '',
    systolic: '',
    diastolic: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formattedRecord, setFormattedRecord] = useState({
    systolic1: null,
    systolic2: null,
    diastolic1: null,
    diastolic2: null,
    first: null,
    second: null,
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return null;
  }

  const trackSubmissions = () => {
    resetSubmissions();
    const previousSubmissions = JSON.parse(localStorage.getItem('submissions')) || [];

    const currentTimestamp = new Date().toISOString();
    previousSubmissions.push(currentTimestamp); 

    if (previousSubmissions.length > 6) {
      previousSubmissions.shift();
    }

    localStorage.setItem('submissions', JSON.stringify(previousSubmissions));

    return previousSubmissions;
  };

  const resetSubmissions = () => {
    const currentMonth = new Date().getMonth();
    const storedMonth = parseInt(localStorage.getItem('currentMonth'));
    console.log(storedMonth,currentMonth)

    if (storedMonth !== currentMonth) {
      localStorage.setItem('submissions', '[]');
      localStorage.setItem('currentMonth', currentMonth.toString());
    }
  };

  const handleReadingChange = (e, reading, setReading) => {
    setReading({ ...reading, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate('/');
  };

  const sendReadingToServer = async (reading) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/record/blood_pressure_records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(reading),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      setError('บันทึกไม่สำเร็จโปรดลองอีกครั้งภายหลัง');
      setSubmitted('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const previousSubmissions = trackSubmissions();
console.log(previousSubmissions.length === 6)
    if (previousSubmissions.length === 6) {
      setError(
        <div>
          <p className='success-message'>
            ท่านได้บันทึกข้อมูลของท่านในเดือนนี้แล้วครบ 3 วันแล้ว<br />
            ล่าสุดเมื่อวันที่ <span style={{ color: 'red' }}>{new Date(previousSubmissions[previousSubmissions.length - 2]).toLocaleString()}</span><br />
            กรุณากลับมาบันทึกอีกครั้งในเดือนหน้า
          </p>
        </div>
      );
      setSubmitted('error');

    } else {

      const firstTimestamp = new Date().toISOString().split('T')[0] + 'T' + firstReading.time + ':00.000Z';
      const secondTimestamp = new Date().toISOString().split('T')[0] + 'T' + secondReading.time + ':00.000Z';

      const reading = {
        systolic: parseInt(firstReading.systolic),
        diastolic: parseInt(firstReading.diastolic),
        timestamp: firstTimestamp,
        systolic2: parseInt(secondReading.systolic),
        diastolic2: parseInt(secondReading.diastolic),
        timestamp2: secondTimestamp,
      };

      await sendReadingToServer(reading);


      setFormattedRecord({
        systolic1: firstReading.systolic,
        systolic2: secondReading.systolic,
        diastolic1: firstReading.diastolic,
        diastolic2: secondReading.diastolic,
        first: new Date(reading.second.timestamp).toLocaleDateString() + ' ' + firstReading.time,
        second: new Date(reading.second.timestamp).toLocaleDateString() + ' ' + secondReading.time,
      });

      setSubmitted(true);
      setError(null);

      setFirstReading({ time: '', systolic: '', diastolic: '' });
      setSecondReading({ time: '', systolic: '', diastolic: '' });
    }
  };

  return (
    <div className="record-container">
      <h2 className="medical-heading">บันทึกความดันโลหิต</h2>
      <div className="red-message">
      </div>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className="reading-section">
            <h3>ครั้งที่ 1</h3>
            <label className='form-label'>
              เวลา :
              <input
                type="time"
                name="time"
                value={firstReading.time}
                onChange={(e) => handleReadingChange(e, firstReading, setFirstReading)}
                required
              />
            </label>
            <label className='form-label'>
              ความดันโลหิตซิสโตลิก (ตัวบน) :
              <input
                min="0"
                type="number"
                name="systolic"
                value={firstReading.systolic}
                onChange={(e) => handleReadingChange(e, firstReading, setFirstReading)}
                required
                placeholder='โปรดระบุ'
              />
              <img src={systolicImage} className='bp_ex' alt="Systolic Explanation" />
            </label>
            <label className='form-label'>
              ความดันโลหิตไดแอสโตลิก (ตัวล่าง) :
              <input
                min="0"
                type="number"
                name="diastolic"
                value={firstReading.diastolic}
                onChange={(e) => handleReadingChange(e, firstReading, setFirstReading)}
                required
                placeholder='โปรดระบุ'
              />
              <img src={diastolicImage} className='bp_ex' alt="Diastolic Explanation" />
            </label>
          </div>
          <div className="reading-section">
            <h3>ครั้งที่ 2</h3>
            <label className='form-label'>
              เวลา :
              <input
                type="time"
                name="time"
                value={secondReading.time}
                onChange={(e) => handleReadingChange(e, secondReading, setSecondReading)}
                required
              />
            </label>
            <label className='form-label'>
              ความดันโลหิตซิสโตลิก (ตัวบน) :
              <input
                min="0"
                type="number"
                name="systolic"
                value={secondReading.systolic}
                onChange={(e) => handleReadingChange(e, secondReading, setSecondReading)}
                required
                placeholder='โปรดระบุ'
              />
            </label>
            <label className='form-label'>
              ความดันโลหิตไดแอสโตลิก (ตัวล่าง) :
              <input
                min="0"
                type="number"
                name="diastolic"
                value={secondReading.diastolic}
                onChange={(e) => handleReadingChange(e, secondReading, setSecondReading)}
                required
                placeholder='โปรดระบุ'
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
            ความดันโลหิตครั้งที่ 1 : <span className="highlighted">{formattedRecord.systolic1}/{formattedRecord.diastolic1}</span> mmHg <br /> เวลา : {formattedRecord.first}
            <br /><br />
            ความดันโลหิตครั้งที่ 2 : <span className="highlighted">{formattedRecord.systolic2}/{formattedRecord.diastolic2}</span> mmHg <br /> เวลา : {formattedRecord.second}
          </p>
        )}
        {submitted === 'error' && (
          <p className="success-message">{error}</p>
        )}
      </div>
    </div>
  );
};

export default RecordBloodPressure;