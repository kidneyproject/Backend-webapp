import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';

const genderTranslations = {
    "Male": "ชาย",
    "Female": "หญิง",
};

const educationTranslations = {
    "Not educated": "ไม่ได้รับการศึกษา",
    "Elementary School": "ประถมศึกษา",
    "High School": "มัธยมศึกษา",
    "High Vocational Certificate": "อนุปริญญา/ปวส.",
    "Over Bachelor Degrees": "ปริญญาตรีหรือสูงกว่า",
};

const financialStatusTranslations = {
    "< 5,000": "น้อยกว่า 5,000 บาท",
    "5,000 - 10,000": "5,000 - 10,000 บาท",
    "10,001 - 15,000": "10,001 - 15,000 บาท",
    "15,001 - 20,000": "15,001 - 20,000 บาท",
    "20,001 - 25,000": "20,001 - 25,000 บาท",
    "25,001 - 30,000": "25,001 - 30,000 บาท",
    "> 30,000": "30,000 บาทขึ้นไป",
};

const sufficiencyTranslations = {
    "Not Enough": "ไม่เพียงพอ",
    "Enough": "เพียงพอ",
    "Leftover": "เหลือเก็บ",
};

const caregiverTranslations = {
    "Father": "บิดา",
    "Mother": "มารดา",
    "Husband": "สามี",
    "Wife": "ภรรยา",
    "Child": "บุตร",
    "Sibling": "พี่/น้อง",
    "Grandchild": "หลาน",
    "Son-in-law": "บุตรเขย",
    "Daughter-in-law": "สะใภ้",
    "Other": "อื่นๆ",
};

function Profile() {
    const navigate = useNavigate();

    // Initialize state variables for edit mode and patient data
    const [isEditMode, setIsEditMode] = useState(false);
    const [patientData, setPatientData] = useState({});
    const [editGender, setEditGender] = useState("");
    const [editBirthday, setEditBirthday] = useState("");
    const [editEducation, setEditEducation] = useState("");
    const [editFinancialStatus, setEditFinancialStatus] = useState("");
    const [editSufficiency, setEditSufficiency] = useState("");
    const [editCaregiver, setEditCaregiver] = useState("");

    // Function to fetch patient data
    const fetchPatientData = async () => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the JWT token

            if (!token) {
                // Redirect to login if no token is found
                navigate("/login");
                return;
            }

            const response = await fetch("http://localhost:3000/api/v1/profile", {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPatientData(data);
            } else {
                console.error("Error fetching patient data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching patient data:", error);
        }
    };

    useEffect(() => {
        fetchPatientData();
      }, []);

    // Toggle between edit and view modes
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setEditGender(patientData.gender);
        setEditBirthday(patientData.birthday);
        setEditEducation(patientData.education);
        setEditFinancialStatus(patientData.financialStatus);
        setEditSufficiency(patientData.sufficiency);
        setEditCaregiver(patientData.caregiver);
    };

    // Save the edited profile data
    const saveProfile = () => {
        // Update the patient data with the edited values
        const updatedPatientData = {
            ...patientData,
            gender: editGender,
            birthday: editBirthday,
            education: editEducation,
            financialStatus: editFinancialStatus,
            sufficiency: editSufficiency,
            caregiver: editCaregiver,
        };

        updatePatientData(updatedPatientData);

        setPatientData(updatedPatientData);

        setIsEditMode(false);
    };

    const handleCancel = () => {
        navigate('/');
    };

    const updatePatientData = async (updatedPatientData) => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the JWT token

            if (!token) {
                // Redirect to login if no token is found
                navigate("/login");
                return;
            }

            // Send the PUT request to update the profile data
            const response = await fetch("http://localhost:3000/api/v1/profile", {
                method: "PUT",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPatientData),
            });

            if (response.ok) {
                // Profile data updated successfully
                const updatedData = await response.json();
                setPatientData(updatedData);
            } else {
                // Handle error (e.g., unauthorized access)
                console.error("Error updating patient data:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating patient data:", error);
        }
    };

    return (
        <div className="profile">
            <h1>ข้อมูลส่วนตัว</h1>
            <div>
                <div className="info-container">
                    <strong>ไลน์ไอดี :</strong>{" "}
                    {patientData.lineId}
                </div>
                <div className="info-container">
                    <strong>เพศ :</strong>{" "}
                    {isEditMode ? (
                        <select
                            className={`form-control input-field`}
                            value={editGender}
                            onChange={(e) => setEditGender(e.target.value)}
                        >
                            {Object.keys(genderTranslations).map((key) => (
                                <option key={key} value={key}>
                                    {genderTranslations[key]}
                                </option>
                            ))}
                        </select>
                    ) : (
                        genderTranslations[patientData.gender]
                    )}
                </div>
                <div className="info-container">
                    <strong>วัน-เดือน-ปีเกิด :</strong>{" "}
                    {isEditMode ? (
                        <input
                            type="date"
                            className={`form-control date-input-field`}
                            value={editBirthday}
                            onChange={(e) => setEditBirthday(e.target.value)}
                        />
                    ) : (
                        new Date(patientData.birthday).toLocaleDateString('en-GB')
                    )}
                </div>
                <div className="info-container">
                    <strong>ระดับการศึกษา :</strong>{" "}
                    {isEditMode ? (
                        <select
                            className={`form-control input-field`}
                            value={editEducation}
                            onChange={(e) => setEditEducation(e.target.value)}
                        >
                            {Object.keys(educationTranslations).map((key) => (
                                <option key={key} value={key}>
                                    {educationTranslations[key]}
                                </option>
                            ))}
                        </select>
                    ) : (
                        educationTranslations[patientData.education]
                    )}
                </div>
                <div className="info-container">
                    <strong>รายได้ต่อเดือน :</strong>{" "}
                    {isEditMode ? (
                        <select
                            className={`form-control input-field`}
                            value={editFinancialStatus}
                            onChange={(e) => setEditFinancialStatus(e.target.value)}
                        >
                            {Object.keys(financialStatusTranslations).map((key) => (
                                <option key={key} value={key}>
                                    {financialStatusTranslations[key]}
                                </option>
                            ))}
                        </select>
                    ) : (
                        financialStatusTranslations[patientData.financialStatus]
                    )}
                </div>
                <div className="info-container">
                    <strong>ความเพียงพอของรายได้ต่อเดือน :</strong><br />{" "}
                    {isEditMode ? (
                        <select
                            className={`form-control input-field`}
                            value={editSufficiency}
                            onChange={(e) => setEditSufficiency(e.target.value)}
                        >
                            {Object.keys(sufficiencyTranslations).map((key) => (
                                <option key={key} value={key}>
                                    {sufficiencyTranslations[key]}
                                </option>
                            ))}
                        </select>
                    ) : (
                        sufficiencyTranslations[patientData.sufficiency]
                    )}
                </div>
                <div className="info-container">
                    <strong>ผู้ดูแลหลัก :</strong>{" "}
                    {isEditMode ? (
                        <select
                            className={`form-control input-field`}
                            value={editCaregiver}
                            onChange={(e) => setEditCaregiver(e.target.value)}
                        >
                            {Object.keys(caregiverTranslations).map((key) => (
                                <option key={key} value={key}>
                                    {caregiverTranslations[key]}
                                </option>
                            ))}
                        </select>
                    ) : (
                        caregiverTranslations[patientData.caregiver]
                    )}
                </div>
                <button type="button" className="cancel-button" onClick={handleCancel}> กลับ </button>
                {isEditMode ? (
                    <button className="save-button" onClick={saveProfile}>บันทึก</button>
                ) : (
                    <button className="edit-button" onClick={toggleEditMode}>แก้ไข</button>
                )}
            </div>
        </div>
    );
}

export default Profile;