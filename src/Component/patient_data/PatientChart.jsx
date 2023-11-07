import React, { useState } from 'react';
import WeightTracking from '../../charts/WeightTracking.jsx';
import BloodPressureInsights from '../../charts/BloodPressureInsights.jsx';
import BehaviorRecordsChart from '../../charts/BehaviorOverview.jsx';
import EGFRChart from '../../charts/EGFRBar.jsx';
import EGFRPieChart from '../../charts/EGFRRangePie.jsx'
import Hba1cChart from '../../charts/Hba1cBar.jsx';
import Hba1cPieChart from '../../charts/Hba1cRangePie.jsx'

const PatientDetailsPage = () => {
  const token = localStorage.getItem('A-token');

  const [patientData, setPatientData] = useState(null);
  const [lastFetchedPatientData, setLastFetchedPatientData] = useState(null);
  const [selectedRecordTypes, setSelectedRecordTypes] = useState([]);
  const [lastSelectedRecordTypes, setLastSelectedRecordTypes] = useState([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState('');
  const [selectedLineIds, setSelectedLineIds] = useState('');
  const [displayMode, setDisplayMode] = useState('');

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
        setLastSelectedRecordTypes(selectedRecordTypes);
      } else {
        console.error('Error fetching patient data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const buildQueryParameters = () => {
    const queryParameters = [];

    if (selectedPatientIds) {
      queryParameters.push(`patientIds=${selectedPatientIds}`);
    }

    if (selectedLineIds) {
      queryParameters.push(`lineIds=${selectedLineIds}`);
    }

    if (queryParameters.length > 0) {
      return `?${queryParameters.join('&')}`;
    }

    return '';
  };

  const handleDisplayColumns = (mode) => {
    if (mode === 'overview') {
      setDisplayMode('overview');
    } else if (mode === 'specific') {
      setDisplayMode('specific');
    }
    fetchPatientData();
  };

  const handlePatientIdChange = (event) => {
    const inputPatientIds = event.target.value;
    setSelectedPatientIds(inputPatientIds);
  };

  const handleLineIdChange = (event) => {
    const inputLineIds = event.target.value;
    setSelectedLineIds(inputLineIds);
  };

  const handleRecordTypeChange = (recordType) => {
    if (selectedRecordTypes.includes(recordType)) {
      setSelectedRecordTypes(selectedRecordTypes.filter((type) => type !== recordType));
    } else {
      setSelectedRecordTypes([...selectedRecordTypes, recordType]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRecordTypes.length < 5) {
      setSelectedRecordTypes(['blood_pressure_records', 'behavior_records', 'weight_records', 'eGFR_records', 'Hba1c_records']);
    } else {
      setSelectedRecordTypes([]);
    }
  };

  const renderSpecific = () => {
    const data = lastFetchedPatientData;

    if (data === 'No matching records found' || data === null) {
      return null
    }

    return data.map((patient) => {
      return (
        <div className='patient-container detail-section'>
          <h3>Patient ID: <span className='blue-color'>{patient.id}</span></h3>
          <div className="details-content">
            {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('blood_pressure_records') ? (
              <>
                <BloodPressureInsights bloodPressureData={patient.blood_pressure_records} />
              </>
            ) : (
              <>
              </>
            )}
            {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('weight_records') ? (
              <>
                <WeightTracking weightData={patient.weight_records} />
              </>
            ) : (
              <>
              </>
            )}
            {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('eGFR_records') ? (
              <>
                <EGFRChart eGFRRecords={patient.eGFR_records} />
              </>
            ) : (
              <>
              </>
            )}
            {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('Hba1c_records') ? (
              <>
                <Hba1cChart Hba1cRecords={patient.Hba1c_records} />
              </>
            ) : (
              <>
              </>
            )}
            {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('behavior_records') ? (
              <>
                <BehaviorRecordsChart behaviorRecords={patient.behavior_records} />
              </>
            ) : (
              <>
              </>
            )}
            {/* <h4 className="data-table-title">Data Table</h4>
            <table className="record-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Record Type</th>
                  <th>Value (kg / mmHg)</th>
                </tr>
              </thead>
              <tbody>
                {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('weight_records') ? (
                  <>
                    {patient.weight_records.map((weightRecord, index) => (
                      <tr key={index}>
                        <td>{new Date(weightRecord.timestamp).toLocaleString()}</td>
                        <td>Weight</td>
                        <td>{weightRecord.weight}</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                  </>
                )}
                {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('blood_pressure_records') ? (
                  <>
                    {patient.blood_pressure_records.map((bpRecord, index) => (
                      <tr key={index}>
                        <td>{new Date(bpRecord.timestamp).toLocaleString()}</td>
                        <td>Blood Pressure</td>
                        <td>{`${bpRecord.systolic}/${bpRecord.diastolic}`}</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                  </>
                )}
              </tbody>
            </table> */}
          </div>
        </div>
      );
    });
  };

  const renderOverview = () => {
    const data = lastFetchedPatientData;

    if (data === 'No matching records found' || data === null) {
      return null;
    }

    const selectedRecords = [];

    if (lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('eGFR_records')) {
      const alleGFRRecords = data.reduce((combinedRecords, patient) => {
        if (patient.eGFR_records) {
          combinedRecords.push(...patient.eGFR_records);
        }
        return combinedRecords;
      }, []);

      selectedRecords.push({ label: 'eGFR', records: alleGFRRecords });
    }

    if (lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('Hba1c_records')) {
      const allHba1cRecords = data.reduce((combinedRecords, patient) => {
        if (patient.Hba1c_records) {
          combinedRecords.push(...patient.Hba1c_records);
        }
        return combinedRecords;
      }, []);

      selectedRecords.push({ label: 'Hba1c', records: allHba1cRecords });
    }

    if (lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('behavior_records')) {
      const allBehaviorRecords = data.reduce((combinedRecords, patient) => {
        if (patient.behavior_records) {
          combinedRecords.push(...patient.behavior_records);
        }
        return combinedRecords;
      }, []);

      selectedRecords.push({ label: 'Behavior', records: allBehaviorRecords });
    }

    return selectedRecords.map((recordData, index) => (
      <div className='patient-container detail-section' key={index}>
        <div className="details-content">
          {recordData.label === 'eGFR' ? (
            <EGFRPieChart eGFRRecords={recordData.records} />
          ) : null}
          {recordData.label === 'Hba1c' ? (
            <Hba1cPieChart hba1cRecords={recordData.records} />
          ) : null}
          {recordData.label === 'Behavior' ? (
            <BehaviorRecordsChart behaviorRecords={recordData.records} />
          ) : null}
        </div>
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
              placeholder=" Patient ID (e.g. 1)"
              value={selectedPatientIds}
              onChange={handlePatientIdChange} />
            <input type="text"
              class="search-input"
              placeholder=" Line ID (e.g. ABC12)"
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
                <div class="col-lg-2 col-xl-1 sec-col">
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
                <div class="col-lg-1 col-xl-2 ">
                  <div className='container search-button'>
                    <div className='row'>
                      <button
                        className={`btn chart-btn ${displayMode === 'specific' ? 'btn-warning' : 'btn-secondary'}`}
                        onClick={() => handleDisplayColumns('specific')}>
                        Specific
                      </button>
                    </div>
                    <div className='row'>
                      <button
                        class={`btn chart-btn ${displayMode === 'overview' ? 'btn-info' : 'btn-secondary'}`}
                        onClick={() => handleDisplayColumns('overview')}>
                        Overview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {displayMode === 'specific' && ( // Check the display mode
        <>
          {patientData !== 'No matching records found' ? (
            <>
              {renderSpecific()}
            </>
          ) : (
            <div>No matching records found</div>
          )}
        </>
      )}
      {displayMode === 'overview' && ( // Check the display mode
        <>
          {patientData !== 'No matching records found' ? (
            <>
              {renderOverview()}
            </>
          ) : (
            <div>No matching records found</div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientDetailsPage;