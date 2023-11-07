import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './NavbarMobile.css';
import logoImage from '../../Image/logo.png';
import recordImage from '../../Image/patient.png'
import profileImage from '../../Image/user.png'
import bloodPreasureImage from '../../Image/blood-pressure.png'
import weightImage from '../../Image/weight-scale.png'
import behaviorImage from '../../Image/decision.png'
import signOutImage from '../../Image/exit.png'
import chartImage from '../../Image/chart.png'

const NavbarMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
  };

  useEffect(() => {
    closeMenu();
  }, [navigate]);

  return (
    <nav className={`navbar-mobile ${menuOpen ? 'open' : ''}`}>
      <div className="navbar-content">
        <div className="logo-container">
          <Link to="/" className="logo">
            <img src={logoImage} alt="Your Logo" className="logo-image" />
            <h4 className='system-name'>Kidney BOT</h4>
          </Link>
        </div>
        <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <NavLink exact to="/" activeClassName="active">
            <img src={recordImage} alt='recordImage' className="link-image" /> ประวัติการบันทึก</NavLink>
        </li>
        <li>
          <NavLink to="/blood-pressure-form">
            <img src={bloodPreasureImage} alt='bloodPreasureImage' className="link-image" /> บันทึกความดันโลหิต</NavLink>
        </li>
        <li>
          <NavLink to="/weight-form">
            <img src={weightImage} alt='weightImage' className="link-image" /> บันทึกน้ำหนัก</NavLink>
        </li>
        <li>
          <NavLink to="/behavior-form">
            <img src={behaviorImage} alt='behaviorImage' className="link-image" /> บันทึกพฤติกรรม</NavLink>
        </li>
        <li>
          <NavLink to="/chart">
            <img src={chartImage} alt='chartImage' className="link-image" /> แผนภูมิ</NavLink>
        </li>
        <li>
          <NavLink to="/profile">
            <img src={profileImage} alt='profileImage' className="link-image" /> ข้อมูลส่วนตัว</NavLink>
        </li>
        <li onClick={handleSignOut} className="Sign-Out">
          <NavLink to="/login">
            <img src={signOutImage} alt='signOutImage' className="link-image" /> ออกจากระบบ</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarMobile;
