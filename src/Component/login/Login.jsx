import '../authentication/authen.css';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import hideIcon from "../../Image/hide.png";
import viewIcon from "../../Image/view.png";

function Login() {
  const [lineId, setLineId] = useState("");
  const [password, setPassword] = useState("");
  const [lineError, setLineIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const isLineIdInvalid = !!lineError;
  const isPasswordInvalid = !!passwordError;

  localStorage.removeItem('token');

  const handleLineIdChange = (e) => {
    const value = e.target.value;
    setLineId(value);
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

    if (!lineId || lineId.length < 6 ){
      setLineIdError("Please enter a valid lineId address.");
    } else {
      setLineIdError("");
    }

    if (!password || password.length < 3) {
      setPasswordError("Password must be at least 3 characters long.");
    } else {
      setPasswordError("");
    }

    if (!lineError && !passwordError) {
      try {
        // Make an API request to authenticate the user
        const response = await fetch("http://localhost:3000/api/v1/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lineId, password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            // User is authenticated
            localStorage.setItem('token', data.token);
            navigate('/');
          } else {
            alert("ไลน์ไอดีหรือรหัสผ่านไม่ถูกต้อง โปรดตรวจสอบอีกครั้ง");
          }
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        alert("ไม่สามารถยืนยันตัวตนได้ โปรดลองไหมอีกครั้ง");
      }
    } else {
      alert("โปรดกรอกรูปแบบไลน์ไอดีและรหัสผ่านให้ถูกต้อง");
    }
  };

  return (
    <div className="App">
      <div className="container text-center auth-container">
        <h1>เข้าสู่ระบบ</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-section'>
            <div className="form-group">
              <label className="form-label">ไลน์ไอดี: </label>
              <input
                type="lineId"
                className={`form-control ${isLineIdInvalid ? "error-input" : ""}`}
                value={lineId}
                onChange={handleLineIdChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">รหัสผ่าน: </label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${isPasswordInvalid ? "error-input" : ""}`}
                  value={password}
                  onChange={handlePasswordChange}
                  required
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
          <button type="submit" className="btn btn-primary">
            เข้าสู่ระบบ
          </button>
        </form>
        <p>
          ยังไม่เคยมีบัญชี? <Link to="/signup">ลงทะเบียน</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;