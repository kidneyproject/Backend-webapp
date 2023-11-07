  import React from "react";
  import { Routes, Route, useLocation } from "react-router-dom";
  import Navbar from "./Component/navbar/Navbar";
  import AdminNavbar from './Component/navbar/navbar-admin';
  import AdminLogin from "./Component/login/Login-admin";
  import AddStaff from "./Component/signUp/AddStaff";
  import Login from "./Component/login/Login";
  import Signup from "./Component/signUp/Signup";
  import AdminHome from "./Component/home/Home-admin";
  import Home from "./Component/home/Home";
  import Chart from "./Component/patient/chart";
  import FinalRecord from "./forms/FinalRecord";
  import WeightRecord from "./forms/Weight";
  import BloodPressureRecord from "./forms/BloodPreasure";
  import BehaviorRecord from "./forms/Behavior";
  import PatientDataPage from "./Component/patient_data/PatientPage";
  import UpdateFaq from "./Component/faq/UpdateFAQ";
  import UpdateBehavior from "./Component/behavior/UpdateBehavior";
  import Profile from "./Component/patient/Profile";
  import "./App.css";

  function App() {
    const location = useLocation();

    // Check if the current route starts with "/admin"
    const isAdminRoute = location.pathname.startsWith("/admin");

    // Check if the current route is the login page
    const isLoginPage = location.pathname === "/login" || location.pathname === "/admin/login" || location.pathname === "/signup";

    return (
      <div>
        {/* Conditionally render the navbar */}
        {!isLoginPage && (isAdminRoute ? <AdminNavbar /> : <Navbar />)}
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<PatientDataPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/addstaff" element={<AddStaff />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chart" element={<Chart />} />
            <Route path="/finalRecord-form" element={<FinalRecord />} />
            <Route path="/blood-pressure-form" element={<BloodPressureRecord />} />
            <Route path="/weight-form" element={<WeightRecord />} />
            <Route path="/behavior-form" element={<BehaviorRecord />} />
            <Route path="/admin/update-faq" element={<UpdateFaq />} />
            <Route path="/admin/update-question" element={<UpdateBehavior />} />
          </Routes>
        </div>
      </div>
    );
  }

  export default App;   