import '../authentication/authen.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext.jsx";

function Signup() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        navigate('/admin/login');
    }

    // State variables for form fields and errors
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Change handlers for form fields
    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleToLogin = () => {
        navigate('/admin/login');
        localStorage.removeItem('A-token');
    };

    const handleToHome = () => {
        navigate('/admin');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form fields
        const errors = {};
        if (!firstname) {
            errors.firstname = "First Name is required";
        }
        if (!lastname) {
            errors.lastname = "Last Name is required";
        }
        if (!role) {
            errors.role = "Role is required";
        }
        if (!username) {
            errors.username = "Username is required";
        }
        if (username.length < 6) {
            errors.username = "Username must be at least 6 characters long.";
        }
        if (!password) {
            errors.password = "Password is required";
        }
        if (password.length < 6) {
            errors.password = "Password must be at least 6 characters long.";
        }
        if (!confirmPassword) {
            errors.confirmPassword = "Confirm Password is required";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            const requestBody = {
                username,
                password,
                firstname,
                lastname,
                role
            };

            try {
                const response = await fetch("http://localhost:3000/api/v1/admin/addstaff", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    if (String(responseData) === "This user alread existed") {
                        alert("This username is already exists");
                    } else {
                        setSubmitted(true);
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
        <div className="admin-container">
            <h1>Register Admin</h1>
            {!submitted && (
                <form onSubmit={handleSubmit}>
                    <div className='form-section'>
                        <div className='form-group'>
                            <label className="form-label">First Name:</label>
                            <input type="text" className={`form-control ${formErrors.firstname ? "error" : ""}`} value={firstname} onChange={handleFirstNameChange} required />
                        </div>
                        <div className='form-group'>
                            <label className="form-label">Last Name:</label>
                            <input type="text" className={`form-control ${formErrors.lastname ? "error" : ""}`} value={lastname} onChange={handleLastNameChange} required />
                        </div>
                        <div className='form-group'>
                            <label className="form-label">Role:</label>
                            <input type="text" className={`form-control ${formErrors.role ? "error" : ""}`} value={role} onChange={handleRoleChange} required />
                        </div>
                        <div className='form-group'>
                            <label className="form-label">Username:</label>
                            <input type="username" className={`form-control ${formErrors.username ? "error" : ""}`} value={username} onChange={handleUsernameChange} required />
                        </div>
                        <div className='form-group'>
                            <label className="form-label">Password:</label>
                            <input type="password" className={`form-control ${formErrors.password ? "error" : ""}`} value={password} onChange={handlePasswordChange} />
                        </div>
                        <div className='form-group'>
                            <label className="form-label">Confirm Password:</label>
                            <input type="password" className={`form-control ${formErrors.confirmPassword ? "error" : ""}`} value={confirmPassword} onChange={handleConfirmPasswordChange} />
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <button type="submit" className="btn btn-primary">
                            สมัคร
                        </button>
                    </div>
                </form>
            )}
            {submitted && (
                <div>
                    <p className="submission_message">Registration Completed Successfully</p>
                    <div className='submission'>
                        <button type="button" className="cancel-button" onClick={handleToLogin}> Login </button>
                        <button type="button" className="btn-primary" onClick={handleToHome}> Home </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Signup;
