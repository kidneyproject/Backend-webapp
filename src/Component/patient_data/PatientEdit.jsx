import React, { useState, useEffect } from 'react';
import './PatientDataPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientDataPage = () => {
  const token = localStorage.getItem('A-token');
  const apiUrl = 'http://localhost:3000/api/v1/admin/records/';

  const [patientData, setPatientData] = useState([]);
  const [lastFetchedPatientData, setLastFetchedPatientData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedRecordTypes, setSelectedRecordTypes] = useState([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState('');
  const [selectedLineIds, setSelectedLineIds] = useState('');
  const [isEditing, setIsEditing] = useState({}); // Track editing state
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);


  useEffect(() => {
    fetchBehaviorData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const queryParams = buildQueryParameters();
      const response = await fetch(`http://localhost:3000/api/v1/admin/query-records${queryParams}`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientData(data);
        setLastFetchedPatientData(data);
      } else {
        console.error('Error fetching patient data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const buildQueryParameters = () => {
    const selectedRecordTypesString = selectedRecordTypes.join(',');
    const queryParameters = [];

    if (selectedPatientIds) {
      queryParameters.push(`patientIds=${selectedPatientIds}`);
    }

    if (selectedLineIds) {
      queryParameters.push(`lineIds=${selectedLineIds}`);
    }

    if (selectedRecordTypes.length > 0) {
      queryParameters.push(`recordTypes=${selectedRecordTypesString}`);
    }

    if (queryParameters.length > 0) {
      return `?${queryParameters.join('&')}`;
    }

    return '';
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

  const handleSelectAll = () => {
    if (selectedRecordTypes.length < 5) {
      setSelectedRecordTypes(['blood_pressure_records', 'behavior_records', 'weight_records', 'eGFR_records', 'Hba1c_records']);
    } else {
      setSelectedRecordTypes([]);
    }
  };

  const handleRecordTypeChange = (recordType) => {
    if (selectedRecordTypes.includes(recordType)) {
      setSelectedRecordTypes(selectedRecordTypes.filter((type) => type !== recordType));
    } else {
      setSelectedRecordTypes([...selectedRecordTypes, recordType]);
    }
  };

  const handlePatientIdChange = (event) => {
    const inputPatientIds = event.target.value;
    setSelectedPatientIds(inputPatientIds);
  };

  const handleLineIdChange = (event) => {
    const inputLineIds = event.target.value;
    setSelectedLineIds(inputLineIds);
  };

  const handleDisplayColumns = () => {
    fetchPatientData();
  };

  const handleEditBehaviorRecord = (patientId, recordType, recordIndex) => {
    // Set the editing state for the specified behavior record
    setIsEditing({
      ...isEditing,
      [patientId]: {
        ...isEditing[patientId],
        [recordType]: {
          ...isEditing[patientId]?.[recordType],
          [recordIndex]: true,
        },
      },
    });
  };

  const handleSaveBehaviorRecord = (patientId, recordType, recordIndex) => {
    // Implement the logic to save the edited behavior record
    // Update the state to indicate that editing is complete
    setIsEditing({
      ...isEditing,
      [patientId]: {
        ...isEditing[patientId],
        [recordType]: {
          ...isEditing[patientId]?.[recordType],
          [recordIndex]: false,
        },
      },
    });
  };

  const handleDeleteBehaviorRecord = (patientId, recordType, recordIndex) => {
    setDeleteConfirmation({
      patientId,
      recordType,
      recordIndex,
    });
  };

  const confirmDelete = () => {
    // Implement the logic to confirm and perform the deletion
    // Update the state to reflect the deleted record
    const { patientId, recordType, recordIndex } = deleteConfirmation;
    // Delete the record and update the state accordingly
    // ...

    setDeleteConfirmation(null); // Clear the delete confirmation state
  };


  const renderRecordRows = () => {
    const data = lastFetchedPatientData;

    if (data === 'No matching records found') {
      return null;
    }

    return data.map((patient, index) => (
      <div key={index} className="patient-record">
        <div className='patient-id'>
          <h3>Patient ID: <span className='blue-color'>{patient.id}</span></h3>
        </div>

        {Object.keys(patient).map((recordType) => {
          if (recordType !== 'id' && Array.isArray(patient[recordType]) && patient[recordType].length > 0) {
            return (
              <div className="record-section" key={recordType}>
                <h4>{recordType.replace(/_/g, ' ').toUpperCase()}</h4>
                <table className="record-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      {recordType === 'blood_pressure_records' && (
                        <>
                          <th>Systolic#1 (mmHg)</th>
                          <th>Diastolic#1 (mmHg)</th>
                          <th>Systolic#2 (mmHg)</th>
                          <th>Diastolic#2 (mmHg)</th>
                        </>
                      )}
                      {recordType === 'behavior_records' && (
                        <>
                          <th>Question</th>
                          <th>Response</th>
                        </>
                      )}
                      {recordType === 'weight_records' && <th>Weight (kg)</th>}
                      {recordType === 'eGFR_records' && <th>eGFR (ml/min/1.73m²)</th>}
                      {recordType === 'Hba1c_records' && <th>Hba1c (%)</th>}
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient[recordType].map((record, recordIndex) => (
                      <>
                        {recordType === 'behavior_records' ? (
                          <>
                            {record.question.map((question, qIndex) => (
                              <tr key={qIndex}>
                                {qIndex === 0 && (
                                  <td rowSpan={record.question.length}>
                                    {new Date(record.timestamp).toLocaleString()}
                                  </td>
                                )}
                                <td>{findQuestionText(question)}</td>
                                <td>{mapAnswerValueToText(record.response[qIndex])}</td>
                                <td>
                                  {isEditing[patient.id]?.[recordType]?.[recordIndex] ? (
                                    <button className='btn btn-success save-btn' onClick={() => handleSaveBehaviorRecord(patient.id, recordType, recordIndex)}>Save</button>
                                  ) : (
                                    <button className='btn btn-warning edit-btn' onClick={() => handleEditBehaviorRecord(patient.id, recordType, recordIndex)}>Edit</button>
                                  )}
                                </td>
                                <td>
                                  <button className='btn btn-danger' onClick={() => handleDeleteBehaviorRecord(patient.id, recordType, recordIndex)}>
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <>
                            <tr>
                              <td>
                                {new Date(record.timestamp).toLocaleString()}
                              </td>
                              {recordType === 'blood_pressure_records' && (
                                <>
                                  <td>{record.systolic || '0'
                                  }</td>
                                  <td>{record.diastolic || '0'
                                  }</td>
                                  <td>{record.systolic2 || '0'
                                  }</td>
                                  <td>{record.diastolic2 || '0'
                                  }</td>
                                </>
                              )}
                              {recordType === 'weight_records' && (
                                <>
                                  <td>{record.weight || '0'
                                  }</td>
                                </>
                              )}
                              {recordType === 'eGFR_records' && (
                                <>
                                  <td>{record.egfr || '0'
                                  }</td>
                                </>
                              )}
                              {recordType === 'Hba1c_records' && (
                                <>
                                  <td>{record.hba1c || '0'
                                  }</td>
                                </>
                              )}
                              <td>
                                {isEditing[patient.id]?.[recordType]?.[recordIndex] ? (
                                    <button className='btn btn-success save-btn' onClick={() => handleSaveBehaviorRecord(patient.id, recordType, recordIndex)}>Save</button>
                                    ) : (
                                  <button className='btn btn-warning edit-btn' onClick={() => handleEditBehaviorRecord(patient.id, recordType, recordIndex)}>Edit</button>
                                )}
                              </td>
                              <td>
                                <button className='btn btn-danger' onClick={() => handleDeleteBehaviorRecord(patient.id, recordType, recordIndex)}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          </>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        })}
      </div>
    ));
  };

  return (
    <div className="patient-container">
      <div class="container text-center">
        <div class="row rowContainer">
          <div class="col">
            <input type="text"
              class="search-input"
              placeholder=" Patient ID (e.g. 1, 2, 3)"
              value={selectedPatientIds}
              onChange={handlePatientIdChange} />
            <input type="text"
              class="search-input"
              placeholder=" Line ID (e.g. ABC12, BOT555)"
              value={selectedLineIds}
              onChange={handleLineIdChange} />
            <div class="search-labels">
              <div class="row myRow">
                <div class="col-lg-2 col-xl-1">
                  <div class="form-check">
                    <input id="formCheck-1"
                      class="form-check-input" type="checkbox"
                      checked={selectedRecordTypes.length === 5}
                      onChange={handleSelectAll} />
                    <label class="form-check-label" for="formCheck-1">Select All</label>
                  </div>
                  <div class="form-check">
                    <input id="formCheck-2"
                      class="form-check-input" type="checkbox"
                      checked={selectedRecordTypes.includes('blood_pressure_records')}
                      onChange={() => handleRecordTypeChange('blood_pressure_records')} />
                    <label class="form-check-label" for="formCheck-2">Blood Pressure</label>
                  </div>
                </div>
                <div class="col-lg-2 col-xl-1 sec-col">
                  <div class="form-check">
                    <input id="formCheck-3"
                      class="form-check-input" type="checkbox"
                      checked={selectedRecordTypes.includes('behavior_records')}
                      onChange={() => handleRecordTypeChange('behavior_records')} />
                    <label class="form-check-label" for="formCheck-3">Behavior</label>
                  </div>
                  <div class="form-check">
                    <input id="formCheck-4"
                      class="form-check-input" type="checkbox"
                      checked={selectedRecordTypes.includes('weight_records')}
                      onChange={() => handleRecordTypeChange('weight_records')} />
                    <label class="form-check-label" for="formCheck-4">Weight</label>
                  </div>
                </div>
                <div class="col-lg-2 col-xl-1 tir-col">
                  <div class="form-check">
                    <input id="formCheck-5"
                      class="form-check-input" type="checkbox"
                      checked={selectedRecordTypes.includes('eGFR_records')}
                      onChange={() => handleRecordTypeChange('eGFR_records')} />
                    <label class="form-check-label" for="formCheck-5">eGFR</label>
                  </div>
                  <div class="form-check">
                    <input id="formCheck-6"
                      class="form-check-input" type="checkbox"
                      checked={selectedRecordTypes.includes('Hba1c_records')}
                      onChange={() => handleRecordTypeChange('Hba1c_records')} />
                    <label class="form-check-label" for="formCheck-6">Hba1c</label>
                  </div>
                </div>
                <div class="col-lg-2 col-xl-2">
                  <div className='search-button'>
                    <button class="btn btn-primary" onClick={handleDisplayColumns}>
                      Display
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {patientData !== 'No matching records found' ? (
        <>
          {renderRecordRows()}
        </>
      ) : (
        <div>No matching records found</div>
      )}
      
      {deleteConfirmation && (
        // Display a delete confirmation dialog with 'Confirm' and 'Cancel' buttons
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this behavior record?</p>
          <button className="confirm-delete-btn" onClick={confirmDelete}>
            Confirm Delete
          </button>
          <button className="cancel-delete-btn" onClick={() => setDeleteConfirmation(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDataPage;