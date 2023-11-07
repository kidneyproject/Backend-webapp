import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './record.css';

function FirstRecord() {
    const [weight, setWeight] = useState("");
    const [eGFR, setEGFR] = useState("");
    const [HbA1c, setHbA1c] = useState("");
    const [systolic, setSystolic] = useState("");
    const [diastolic, setDiastolic] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const Timestamp = new Date().toISOString();
    const [formattedTimestamp, setFormattedTimestamp] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Retrieve the JWT token

    if (!token) {
        // Redirect to login if no token or patient ID is found
        navigate("/login");
        return;
    }

    const handleWeightChange = (e) => {
        setWeight(e.target.value);
    };

    const handleEGFRChange = (e) => {
        setEGFR(e.target.value);
    };

    const handleHbA1cChange = (e) => {
        setHbA1c(e.target.value);
    };

    const handleSystolicChange = (e) => {
        setSystolic(e.target.value);
    };

    const handleDiastolicChange = (e) => {
        setDiastolic(e.target.value);
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Define data objects for each type of record
            const weightData = {
                weight: parseFloat(weight),
                timestamp: Timestamp,
            };

            const bloodPressureData = {
                systolic: parseFloat(systolic),
                diastolic: parseFloat(diastolic),
                timestamp: Timestamp,
            };

            const hba1cData = {
                hba1c: parseFloat(HbA1c),
                timestamp: Timestamp,
            };

            const egfrData = {
                egfr: parseFloat(eGFR),
                timestamp: Timestamp,
            };

            // Make API requests for each type of record
            await addRecord('weight_records', weightData);
            await addRecord('blood_pressure_records', bloodPressureData);
            await addRecord('Hba1c_records', hba1cData);
            await addRecord('eGFR_records', egfrData);

            setSubmitted(true);
            setFormattedTimestamp(new Date(Timestamp).toLocaleDateString() + ' ' + new Date(Timestamp).toLocaleTimeString());

        } catch (error) {
            throw error;
        }
    };

    const addRecord = async (recordType, data) => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/record/${recordType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Failed to add ${recordType} record`);
            }

        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="record-container">
            <h2 className="medical-heading">บันทึกรายละเอียด</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label className="form-label">น้ำหนัก :</label>
                        <div className="input-with-unit">
                            <input type="number" min="0" value={weight} onChange={handleWeightChange} required />
                            <span className="unit">กิโลกรัม</span>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="form-label">ค่าอัตราการกรองไต (eGFR) :</label>
                        <div className="input-with-unit">
                            <input type="number" min="0" value={eGFR} onChange={handleEGFRChange} required />
                            <span className="unit">ml/min/1.73m2</span>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="form-label">ระดับน้ำตาลสะสมในเลือด (HbA1c) :</label>
                        <div className="input-with-unit">
                            <input type="float" min="0" value={HbA1c} onChange={handleHbA1cChange} required />
                            <span className="unit">%</span>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="form-label">ระดับความดันโลหิต :</label>
                        <div className="input-with-unit">
                            <input
                                type="number" min="0"
                                value={systolic}
                                onChange={handleSystolicChange}
                                placeholder="ตัวบน"
                                required
                            />
                            <span className="separator">/</span>
                            <input
                                type="number" min="0"
                                value={diastolic}
                                onChange={handleDiastolicChange}
                                placeholder="ตัวล่าง"
                                required
                            />
                            <span className="unit">mmHg</span>
                        </div>
                    </div>
                    <button type="button" className="cancel-button" onClick={handleCancel}> ยกเลิก </button>
                    <button type="submit" className="record-button">บันทึก</button>
                </form>
            </div>
            <div className="submission-message">
                {submitted && (
                    <p className="success-message">
                        น้ำหนัก : <span className="highlighted">{weight}</span> กิโลกรัม <br />
                        ค่าอัตราการกรองไต : <span className="highlighted">{eGFR}</span> ml/min/1.73m2 <br />
                        ระดับน้ำตาลสะสมในเลือด : <span className="highlighted">{HbA1c}</span> % <br />
                        ความดันโลหิต : <span className="highlighted">{systolic}/{diastolic}</span> mmHg <br />
                        เวลา : {formattedTimestamp}
                    </p>
                )}
                {!submitted === 'error' && (
                    <p className="error-message">บันทึกไม่สำเร็จโปรดรองอีกครั้งภายหลัง</p>
                )}
            </div>
        </div >
    )
}

export default FirstRecord;