import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import './PatientDataPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientDataPage from './PatientData';
import PatientProfile from './PatientProfile';
import PatientChart from './PatientChart';
import PatientEdit from './PatientEdit';

const PatientPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState('data');

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/admin/login');
  //   }
  // }, [isAuthenticated, navigate]);

  return (
    <div className="patient-data-container">
      <h2 className="page-title">Patient Data</h2>
      <div className="container text-center">
        <div className="tab-container">
          <div className={`tab ${selectedTab === 'data' ? 'active' : ''}`} onClick={() => handleTabChange('data')}>
            Data
          </div>
          <div className={`tab ${selectedTab === 'chart' ? 'active' : ''}`} onClick={() => handleTabChange('chart')}>
            Chart
          </div>
          <div className={`tab ${selectedTab === 'edit' ? 'active' : ''}`} onClick={() => handleTabChange('edit')}>
            Edit
          </div>
          <div className={`tab ${selectedTab === 'profile' ? 'active' : ''}`} onClick={() => handleTabChange('profile')}>
            Profile
          </div>
        </div>
        {selectedTab === 'data' && (
          <PatientDataPage />
        )}
        {selectedTab === 'profile' && (
          <PatientProfile />
        )}
        {selectedTab === 'chart' && (
          <PatientChart />
        )}
        {selectedTab === 'edit' && (
          <PatientEdit />
        )}
      </div>


    </div>
  );
};

export default PatientPage;