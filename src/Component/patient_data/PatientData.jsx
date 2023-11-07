import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './PatientDataPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientDataPage = () => {
  const token = localStorage.getItem('A-token');

  const [displayedColumns, setDisplayedColumns] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [lastFetchedPatientData, setLastFetchedPatientData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedRecordTypes, setSelectedRecordTypes] = useState([]);
  const [lastSelectedRecordTypes, setLastSelectedRecordTypes] = useState([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState('');
  const [selectedLineIds, setSelectedLineIds] = useState('');

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
        setLastSelectedRecordTypes(selectedRecordTypes);
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
    const newDisplayedColumns = determineDisplayedColumns();
    setDisplayedColumns(newDisplayedColumns);
  };

  const determineDisplayedColumns = () => {
    const uniqueColumns = new Set([
      'Patient ID',
      'Line ID',
      'Record Id',
      'Timestamp',
    ]);

    if (selectedRecordTypes.length === 0 || selectedRecordTypes.includes('blood_pressure_records')) {
      uniqueColumns.add('Systolic 1');
      uniqueColumns.add('Diastolic 1');
      uniqueColumns.add('Systolic 2');
      uniqueColumns.add('Diastolic 2');
    }
    if (selectedRecordTypes.length === 0 || selectedRecordTypes.includes('weight_records')) {
      uniqueColumns.add('Weight');
    }
    if (selectedRecordTypes.length === 0 || selectedRecordTypes.includes('eGFR_records')) {
      uniqueColumns.add('eGFR');
    }
    if (selectedRecordTypes.length === 0 || selectedRecordTypes.includes('Hba1c_records')) {
      uniqueColumns.add('Hba1c');
    }
    if (selectedRecordTypes.length === 0 || selectedRecordTypes.includes('behavior_records')) {
      questions.forEach((question) => {
        uniqueColumns.add(question.question);
      });
    }
    return Array.from(uniqueColumns);
  };

  const renderRecordRows = () => {
    const data = lastFetchedPatientData;

    if (data === 'No matching records found') {
      return null
    }

    let selectedRecordType = lastSelectedRecordTypes[0];

    if (lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('blood_pressure_records')) {
      selectedRecordType = 'blood_pressure_records';
    } else if (lastSelectedRecordTypes.includes('weight_records')) {
      selectedRecordType = 'weight_records';
    } else if (lastSelectedRecordTypes.includes('behavior_records')) {
      selectedRecordType = 'behavior_records';
    }

    return data.map((patient) => {
      if (patient[selectedRecordType] && patient[selectedRecordType].length > 0) {
        return patient[selectedRecordType].map((record, index) => (
          <tr key={index}>
            <td>{patient.id}</td>
            <td>{patient.lineId}</td>
            <td>{index + 1}</td>
            <td>{new Date(record.timestamp).toLocaleString()}</td>
            {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('blood_pressure_records') ? (
              <>
                <td>{record.systolic || 0}</td>
                <td>{record.diastolic || 0}</td>
                <td>{record.systolic2 || 0}</td>
                <td>{record.diastolic2 || 0}</td>
              </>
            ) : (
              <>
              </>
            )}
            {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('weight_records') ? (
              <>
                {index < patient.weight_records.length ? (
                  <td>{patient.weight_records[index].weight || 0}</td>
                ) : (
                  <td>0</td>
                )}
              </>
            ) : (
              <>
              </>
            )}
            {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('eGFR_records') ? (
              <>
                {index < patient.eGFR_records.length ? (
                  <td>{patient.eGFR_records[index].egfr || 0}</td>
                ) : (
                  <td>0</td>
                )}
              </>
            ) : (
              <>
              </>
            )}
            {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('Hba1c_records') ? (
              <>
                {index < patient.Hba1c_records.length ? (
                  <td>{patient.Hba1c_records[index].hba1c || 0}</td>
                ) : (
                  <td>0</td>
                )}
              </>
            ) : (
              <>
              </>
            )}
            {lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('behavior_records') ? (
              <>
                {patient.behavior_records.length > 0 ? (
                  patient.behavior_records[0].question.map((question, i) => (
                    <td key={question}>{patient.behavior_records[0].response[i]}</td>
                  ))
                ) : (
                  questions.map((question) => (
                    question.question.map((question, i) => (
                      <td key={question}>0</td>
                    ))
                  ))
                )}
              </>
            ) : (
              <>
              </>
            )}
          </tr>
        ));
      } else {
        return null;
      }
    });
  };

  const renderToExport = () => {
    const data = lastFetchedPatientData;
    let selectedRecordType = lastSelectedRecordTypes[0];

    if (lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('blood_pressure_records')) {
      selectedRecordType = 'blood_pressure_records';
    }

    const rows = [];

    data.forEach((patient) => {
      if (patient[selectedRecordType] && patient[selectedRecordType].length > 0) {
        patient[selectedRecordType].forEach((record, index) => {
          const row = [
            patient.id.toString(),
            patient.lineId.toString(),
            (index + 1).toString(),
            new Date(record.timestamp).toLocaleString(),
          ];

          if (selectedRecordTypes.length === 0 || selectedRecordTypes.includes('blood_pressure_records')) {
            row.push(record.systolic ? record.systolic.toString() : '0');
            row.push(record.diastolic ? record.diastolic.toString() : '0');
            row.push(record.systolic2 ? record.systolic2.toString() : '0');
            row.push(record.diastolic2 ? record.diastolic2.toString() : '0');
          }

          if (selectedRecordTypes.length === 0 || selectedRecordTypes.includes('weight_records')) {
            row.push(patient.weight_records[0]?.weight ? patient.weight_records[0]?.weight.toString() : '0');
          }

          if (selectedRecordTypes.length === 0 || selectedRecordTypes.includes('eGFR_records')) {
            row.push(patient.eGFR_records[0]?.egfr ? patient.eGFR_records[0]?.egfr.toString() : '0');
          }

          if (selectedRecordTypes.length === 0 || selectedRecordTypes.includes('Hba1c_records')) {
            row.push(patient.Hba1c_records[0]?.hba1c ? patient.Hba1c_records[0]?.hba1c.toString() : '0');
          }

          if (lastSelectedRecordTypes.length === 0 || lastSelectedRecordTypes.includes('behavior_records')) {
            if (patient.behavior_records.length > 0) {
              patient.behavior_records.forEach((behaviorRecord) => {
                const behaviorRecordValue = behaviorRecord.response ? behaviorRecord.response.toString() : '0';
                row.push(behaviorRecordValue);
              });
            } else {
              questions.forEach((question) => {
                row.push('0');
              });
            }
          }

          rows.push(row);
        });
      }
    });

    return rows;
  };

  const exportToExcel = () => {
    const data = [displayedColumns, ...renderToExport()].map((row) =>
      row.map((cell) => (cell ? cell.toString() : '0'))
    );

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PatientData');

    XLSX.writeFile(wb, 'patient_data.xlsx');
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
                    <button class="btn btn-warning btn-export" onClick={exportToExcel}>
                      Export to Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {patientData !== 'No matching records found' ? (
        <table className="record-table">
          <thead>
            <tr>
              {displayedColumns.map((column) => (
                <th key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderRecordRows()}
          </tbody>
        </table>
      ) : (
        <div>No matching records found</div>
      )}
    </div>
  );
};

export default PatientDataPage;