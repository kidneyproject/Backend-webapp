import React, { useState, useEffect } from 'react';
import XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';
import './PatientDataPage.css';

const PatientDataPage = () => {
    const [patientData, setPatientData] = useState(null);
    const token = localStorage.getItem('A-token');

    const exportToExcel = (data, fileName) => {
        const excelData = data.map((patient) => ({
            ID: patient.id,
            Gender: patient.gender,
            Birthday: patient.birthday,
            Education: patient.education,
            'Financial Status': patient.financialStatus,
            Sufficiency: patient.sufficiency,
            Caregiver: patient.caregiver,
            Email: patient.email,
            Diagnosis: patient.diagnosis,
            Height: patient.height,
            Comorbidities: patient.selectedComorbidities.join(', '),
            Drugs: patient.selectedDrugs.join(', '),
        }));

        const workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(workbook, sheet, 'Records');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, fileName);
    };

    const fetchPatientData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/admin/profile/', {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPatientData(data);
            } else {
                console.error('Error fetching patient data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching patient data:', error);
        }
    };

    useEffect(() => {
        fetchPatientData();
    }, []);

    return (
        <div className="patient-container">
            <div className="search-button">
            <button class="btn btn-warning btn-export" onClick={exportToExcel}>
                      Export to Excel
                    </button>
            </div>
            <div className="patient-record">
            {patientData !== null ? (
            <table className="record-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Line ID</th>
                            <th>Gender</th>
                            <th>Birthday</th>
                            <th>Education</th>
                            <th>Financial Status</th>
                            <th>Sufficiency</th>
                            <th>Caregiver</th>
                            <th>Diagnosis</th>
                            <th>Height</th>
                            <th>Comorbidities</th>
                            <th>Drugs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientData.map((patient) => (
                            <tr key={patient.id}>
                                <td>{patient.id}</td>
                                <td>{patient.lineId}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.birthday}</td>
                                <td>{patient.education}</td>
                                <td>{patient.financialStatus}</td>
                                <td>{patient.sufficiency}</td>
                                <td>{patient.caregiver}</td>
                                <td>{patient.diagnosis}</td>
                                <td>{patient.height}</td>
                                <td>{patient.selectedComorbidities.join(', ')}</td>
                                <td>{patient.selectedDrugs.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                    <div>No matching records found</div>
                  )}
            </div>
        </div>
    );
};

export default PatientDataPage;