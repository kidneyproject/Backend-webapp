import '../authentication/authen.css';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  // State variables for form fields and errors
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState("โปรดระบุ");
  const [birthday, setDate_of_birth] = useState("");
  const [education, setEducation] = useState("โปรดระบุ");
  const [financialStatus, setFinancialStatus] = useState("โปรดระบุ");
  const [sufficiency, setSufficiency] = useState("โปรดระบุ");
  const [caregiver, setCaregiver] = useState("โปรดระบุ");
  const [customCaregiver, setCustomCaregiver] = useState("");
  const [height, setHeight] = useState();
  const [diagnosis, setDiagnosis] = useState();
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [selectedComorbidities, setSelectedComorbidities] = useState([]);
  const [customDrug, setCustomDrug] = useState("");
  const [customComorbidity, setCustomComorbidity] = useState("");
  const [lineId, setLineId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [behavior_records] = useState([]);
  const [weight, setWeight] = useState("");
  const [eGFR, setEGFR] = useState("");
  const [HbA1c, setHbA1c] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [blood_pressure_records, setBloodPressureRecords] = useState([]);
  const [weight_records, setWeightRecords] = useState([]);
  const [eGFR_records, setEGFRRecords] = useState([]);
  const [Hba1c_records, setHbA1cRecords] = useState([]);
  const Timestamp = new Date().toISOString();
  const [formErrors, setFormErrors] = useState({});

  // Change handlers for form fields
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleDate_of_birthChange = (e) => {
    setDate_of_birth(e.target.value);
  };

  const handleEducationChange = (e) => {
    setEducation(e.target.value);
  };

  const handleFinancialStatusChange = (e) => {
    setFinancialStatus(e.target.value);
  };

  const handleSufficiencyChange = (e) => {
    setSufficiency(e.target.value);
  };

  const handleCaregiverChange = (e) => {
    const selectedValue = e.target.value;
    setCaregiver(selectedValue);
  };

  const handleCustomCaregiverChange = (e) => {
    const value = e.target.value;
    setCustomCaregiver(value);
  };

  const handleLineIdChange = (e) => {
    setLineId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleDiagnosisChange = (e) => {
    setDiagnosis(e.target.value);
  };

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
  };

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

  const handleComorbidityChange = (e) => {
    const comorbidity = e.target.value;
    setSelectedComorbidities((prevSelectedComorbidities) => {
      if (prevSelectedComorbidities.includes(comorbidity)) {
        return prevSelectedComorbidities.filter((item) => item !== comorbidity);
      } else {
        return [...prevSelectedComorbidities, comorbidity];
      }
    });
  };

  const handleDrugChange = (e) => {
    const drug = e.target.value;
    setSelectedDrugs((prevSelectedDrug) => {
      if (prevSelectedDrug.includes(drug)) {
        return prevSelectedDrug.filter((item) => item !== drug);
      } else {
        return [...prevSelectedDrug, drug];
      }
    });
  };

  const handleCustomDrugChange = (e) => {
    const value = e.target.value;
    setCustomDrug(value);
  };

  const handleCustomComorbidityChange = (e) => {
    const value = e.target.value;
    setCustomComorbidity(value);
  };

  const handleNext = (e) => {
    e.preventDefault();
    const errors = {};
    if (step === 1) {
      if (!lineId) {
        errors.lineId = "LineId is required";
      } else if (lineId.length < 6) {
        errors.lineId = "LineId must be at least 6 characters long.";
      }
      if (!password) {
        errors.password = "Password is required";
      }
      if (!password || password.length < 6) {
        errors.password = "Password must be at least 6 characters long.";
      }
      if (!confirmPassword) {
        errors.confirmPassword = "Confirm Password is required";
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    } else if (step === 2) {
      if (gender === "โปรดระบุ") {
        errors.gender = "Gender is required";
      }
      if (!birthday) {
        errors.birthday = "Date of Birth is required";
      }
      if (education === "โปรดระบุ") {
        errors.education = "Education is required";
        console.log(errors)
      }
      if (financialStatus === "โปรดระบุ") {
        errors.financialStatus = "financialStatus is required";
      }
      if (sufficiency === "โปรดระบุ") {
        errors.sufficiency = "sufficiency is required";
      }
      if (caregiver === "โปรดระบุ") {
        errors.caregiver = "caregiver is required";
      }
      if (caregiver === "Other" && customCaregiver === "") {
        errors.customCaregiver = "caregiver is required";
      }
    } else if (step === 3) {
      if (diagnosis === undefined || diagnosis < 0) {
        errors.diagnosis = "Diagnosis is required";
      }
      if (height === undefined || height <= 0) {
        errors.height = "Height is required";
      }
      if (selectedComorbidities.includes("5") && !customComorbidity) {
        errors.customComorbidity = "Custom comorbidity is required";
      }
      if (selectedDrugs.includes("9") && !customDrug) {
        errors.customDrug = "Custom drug is required";
      }


    }

    if (Object.keys(errors).length === 0) {
      setFormErrors({});
      setStep(step + 1);
    } else {
      setFormErrors(errors);
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  function updateRecords(prevRecords, data, timestamp) {
    return [
      ...prevRecords,
      {
        ...data,
        timestamp,
      },
    ];
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    const errors = {};

    setFormErrors(errors);

    const selectedComorbiditiesArray = selectedComorbidities.includes("5")
      ? [customComorbidity, ...selectedComorbidities.filter(item => item !== "5")]
      : selectedComorbidities;

    const selectedDrugsArray = selectedDrugs.includes("9")
      ? [customDrug, ...selectedDrugs.filter(item => item !== "9")]
      : selectedDrugs;

    setBloodPressureRecords((prevRecords) =>
      updateRecords(prevRecords, { systolic: parseFloat(systolic), diastolic: parseFloat(diastolic) }, Timestamp)
    );

    setWeightRecords((prevRecords) =>
      updateRecords(prevRecords, { weight: parseFloat(weight) }, Timestamp)
    );

    setEGFRRecords((prevRecords) =>
      updateRecords(prevRecords, { egfr: parseFloat(eGFR) }, Timestamp)
    );

    setHbA1cRecords((prevRecords) =>
      updateRecords(prevRecords, { hba1c: parseFloat(HbA1c) }, Timestamp)
    );

    if (Object.keys(errors).length === 0) {
      const requestBody = {
        gender,
        birthday,
        education,
        financialStatus,
        sufficiency,
        caregiver: caregiver === "Other" ? customCaregiver : caregiver,
        lineId,
        password,
        diagnosis,
        height,
        selectedComorbidities: selectedComorbiditiesArray,
        selectedDrugs: selectedDrugsArray,
        blood_pressure_records,
        weight_records,
        behavior_records,
        eGFR_records,
        Hba1c_records
      };

      try {
        const response = await fetch("http://localhost:3000/api/v1/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const responseData = await response.json();
          if (String(responseData) === "This lineId already existed") {
            alert("อีเมลนี้ถูกใช้แล้ว โปรดกรอกอีเมลใหม่");
          } else {
            navigate("/login");
          }
        } else {
          console.error("Registration failed");
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  return (
    <div className="App">
      <div className="container text-center auth-container">
        <h1>ลงทะเบียน</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-section'>
            {step === 1 && (
              <div>
                <div className='form-group'>
                  <label className="form-label">ไลน์ไอดี:</label>
                  <input type="lineId" className={`form-control ${formErrors.lineId ? "error" : ""}`} value={lineId} onChange={handleLineIdChange} required/>
                </div>
                <div className='form-group'>
                  <label className="form-label">รหัสผ่าน:</label>
                  <input type="password" className={`form-control ${formErrors.password ? "error" : ""}`} value={password} onChange={handlePasswordChange} />
                </div>
                <div className='form-group'>
                  <label className="form-label">ยืนยันรหัสผ่าน:</label>
                  <input type="password" className={`form-control ${formErrors.confirmPassword ? "error" : ""}`} value={confirmPassword} onChange={handleConfirmPasswordChange} />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="step-form">
                <div className='form-group'>
                  <label className="form-label">เพศ:</label>
                  <select className={`form-control ${formErrors.gender ? "error" : ""}`} value={gender} onChange={handleGenderChange}>
                    <option hidden value="โปรดระบุ">--โปรดระบุ--</option>
                    <option value="Male">ชาย</option>
                    <option value="Female">หญิง</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label className="form-label">วัน-เดือน-ปีเกิด:</label>
                  <input type="date" className={`form-control ${formErrors.birthday ? "error" : ""}`} value={birthday} onChange={handleDate_of_birthChange} />
                </div>
                <div className='form-group'>
                  <label className="form-label">ระดับการศึกษา:</label>
                  <select type="text" className={`form-control ${formErrors.education ? "error" : ""}`} value={education} onChange={handleEducationChange}>
                    <option hidden value="โปรดระบุ">--โปรดระบุ--</option>
                    <option value="Not educated">ไม่ได้รับการศึกษา</option>
                    <option value="Elementary School">ประถมศึกษา</option>
                    <option value="High School">มัธยมศึกษา</option>
                    <option value="High Vocational Certificate">อนุปริญญา/ปวส.</option>
                    <option value="Over Bachelor Degrees">ปริญญาตรีหรือสูงกว่า</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label className="form-label">รายได้ต่อเดือน:</label>
                  <select className={`form-control ${formErrors.financialStatus ? "error" : ""}`} value={financialStatus} onChange={handleFinancialStatusChange}>
                    <option hidden value="โปรดระบุ">--โปรดระบุ--</option>
                    <option value="< 5,000">น้อยกว่า 5,000 บาท</option>
                    <option value="5,000 - 10,000">5,000 - 10,000 บาท</option>
                    <option value="10,001 - 15,000">10,001 - 15,000 บาท</option>
                    <option value="15,001 - 20,000">15,001 - 20,000 บาท</option>
                    <option value="20,001 - 25,000">20,001 - 25,000 บาท</option>
                    <option value="25,001 - 30,000">25,001 - 30,000 บาท</option>
                    <option value="> 30,000">30,000 บาทขึ้นไป</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label className="form-label">ความเพียงพอของรายได้ต่อเดือน:</label>
                  <select className={`form-control ${formErrors.sufficiency ? "error" : ""}`} value={sufficiency} onChange={handleSufficiencyChange}>
                    <option hidden value="โปรดระบุ">--โปรดระบุ--</option>
                    <option value="Not Enough">ไม่เพียงพอ</option>
                    <option value="Enough">เพียงพอ</option>
                    <option value="Leftover">เหลือเก็บ</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label className="form-label">ผู้ดูแลหลัก:</label>
                  <select type="text" className={`form-control ${formErrors.caregiver ? "error" : ""}`} value={caregiver} onChange={handleCaregiverChange}>
                    <option hidden value="โปรดระบุ">--โปรดระบุ--</option>
                    <option value="Father">บิดา</option>
                    <option value="Mother">มารดา</option>
                    <option value="Husband">สามี</option>
                    <option value="Wife">ภรรยา</option>
                    <option value="Child">บุตร</option>
                    <option value="Sibling">พี่/น้อง</option>
                    <option value="Grandchild">หลาน</option>
                    <option value="Son-in-law">บุตรเขย</option>
                    <option value="Daughter-in-law">สะใภ้</option>
                    <option value="Other">อื่นๆ</option>
                  </select>
                  {caregiver === "Other" && (
                    <input
                      type="text"
                      className={`form-control ${formErrors.customCaregiver ? "error" : ""}`}
                      value={customCaregiver}
                      onChange={handleCustomCaregiverChange}
                      placeholder="โปรดระบุ"
                    />
                  )}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="step-form">
                <div className='form-group'>
                  <label className="form-label">ระยะเวลาที่ได้รับการวินิจฉัยว่าเป็นโรคไตเรื้อรังระยะที่ 3:</label>
                  <div className="input-with-unit">
                    <input type="number" className={`form-control ${formErrors.diagnosis ? "error" : ""}`} value={diagnosis} onChange={handleDiagnosisChange} />
                    <span className="unit">เดือน</span>
                  </div>
                </div>
                <div className='form-group'>
                  <label className="form-label">ส่วนสูง:</label>
                  <div className="input-with-unit">
                    <input type="number" className={`form-control ${formErrors.height ? "error" : ""}`} value={height} onChange={handleHeightChange} />
                    <span className="unit">เซนติเมตร</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">โรคร่วมหรือมีภาวะอื่นๆ <br /> (เลือกได้มากกว่า 1 ข้อ):</label>
                  <div className="checkbox-group">
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="1"
                        checked={selectedComorbidities.includes("1")}
                        onChange={handleComorbidityChange}
                      />
                      โรคเบาหวาน
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="2"
                        checked={selectedComorbidities.includes("2")}
                        onChange={handleComorbidityChange}
                      />
                      <span className="checkmark"></span>
                      โรคความดันโลหิตสูง
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="3"
                        checked={selectedComorbidities.includes("3")}
                        onChange={handleComorbidityChange}
                      />
                      โรคไขมันในเลือดสูง
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="4"
                        checked={selectedComorbidities.includes("4")}
                        onChange={handleComorbidityChange}
                      />
                      มีภาวะกรดยูริกในเลือกสูง
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="5"
                        checked={selectedComorbidities.includes("5")}
                        onChange={handleComorbidityChange}
                      />
                      โรคอื่นๆ
                    </label>
                    {selectedComorbidities.includes("5") && (
                      <input
                        type="text"
                        className={`form-control ${formErrors.customComorbidity ? "error" : ""}`}
                        value={customComorbidity}
                        onChange={handleCustomComorbidityChange}
                        placeholder="โปรดระบุ"
                      />
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">กลุ่มยาที่ใช้ในปัจจุบัน <br /> (เลือกได้มากกว่า 1 ข้อ):</label>
                  <div>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="11"
                        checked={selectedDrugs.includes("11")}
                        onChange={handleDrugChange}
                      />
                      ยาลดระดับน้ำตาลในเลือด <br /> (ชนิดรับประทาน)
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="12"
                        checked={selectedDrugs.includes("12")}
                        onChange={handleDrugChange}
                      />
                      ยาลดระดับน้ำตาลในเลือด <br /> (ชนิดฉีด)
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="2"
                        checked={selectedDrugs.includes("2")}
                        onChange={handleDrugChange}
                      />
                      ยาควบคุมความดันโลหิต
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="3"
                        checked={selectedDrugs.includes("3")}
                        onChange={handleDrugChange}
                      />
                      ยาลดระดับไขมันในเลือด
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="4"
                        checked={selectedDrugs.includes("4")}
                        onChange={handleDrugChange}
                      />
                      ยารักษาภาวะโลหิตจาง
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="5"
                        checked={selectedDrugs.includes("5")}
                        onChange={handleDrugChange}
                      />
                      ยารักษาภาวะเลือดเป็นกรด
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="6"
                        checked={selectedDrugs.includes("6")}
                        onChange={handleDrugChange}
                      />
                      ยาแก้ปวดลดการอักเสบกลุ่มที่ไม่ใช้สเตียรอยด์ (NSAIDs)
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="7"
                        checked={selectedDrugs.includes("7")}
                        onChange={handleDrugChange}
                      />
                      ยาชุด
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="8"
                        checked={selectedDrugs.includes("8")}
                        onChange={handleDrugChange}
                      />
                      ยาหม้อ ยาลูกกลอน หรือ ยาสมุนไพร
                    </label>
                    <label className='check-container'>
                      <input
                        type="checkbox"
                        value="9"
                        checked={selectedDrugs.includes("9")}
                        onChange={handleDrugChange}
                      />
                      อื่นๆ
                    </label>
                    {selectedDrugs.includes("9") && (
                      <input
                        type="text"
                        className={`form-control ${formErrors.customDrug ? "error" : ""}`}
                        value={customDrug}
                        onChange={handleCustomDrugChange}
                        placeholder="โปรดระบุ"
                      />
                    )}
                  </div>
                </div>
              </div>
            )} {step === 4 && (
              <div>
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
              </div>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                ก่อนหน้า
              </button>
            )}
            {step < 4 ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                ถัดไป
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                สมัคร
              </button>
            )}
          </div>
        </form>
        <p>
          มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
