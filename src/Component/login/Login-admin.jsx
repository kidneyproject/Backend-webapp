import '../authentication/authen.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import hideIcon from "../../Image/hide.png";
import viewIcon from "../../Image/view.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const isUsernameInvalid = !!usernameError;
  const isPasswordInvalid = !!passwordError;

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 3) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }

    if (!usernameError && !passwordError) {
      try {
        // Make an API request to authenticate the user
        const response = await fetch("http://localhost:3000/api/v1/admin/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            // User is authenticated
            login({ username });
            localStorage.setItem('A-token', data.token);
            navigate('/admin');
          } else {
            alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดตรวจสอบอีกครั้ง");
          }
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        alert("ไม่สามารถยืนยันตัวตนได้ โปรดลองไหมอีกครั้ง");
      }
    } else {
      alert("โปรดกรอกรูปแบบอีเมลและรหัสผ่านให้ถูกต้อง");
    }
  };


  return (
    <div className="App">
      <div className="container text-center auth-container">
        <h1>Login</h1>
          <form onSubmit={handleSubmit}>
          <div className='form-section'>
            <div className="form-group">
              <label className="form-label">ชื่อผู้ใช้: </label>
              <input type="text" className={`form-control ${isUsernameInvalid ? "error-input" : ""}`} value={username} onChange={handleUsernameChange} />
            </div>
            <div className="form-group">
              <label className="form-label">รหัสผ่าน: </label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${isPasswordInvalid ? "error-input" : ""}`}
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span
                  id="toggle-password"
                  className={`toggle-password ${showPassword ? "visible" : ""}`}
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? hideIcon : viewIcon}
                    alt={showPassword ? "Hide" : "View"} // Set the alt text accordingly
                  />
                </span>
              </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
  );
}

export default Login;