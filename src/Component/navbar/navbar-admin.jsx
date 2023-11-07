import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logoImage from '../../Image/logo.png'

const Navbar = () => {
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem('A-token');
  };

  const renderNavLinks = () => {
    if (location.pathname === "/login") {
      return (
        <ul className="navbar-links">
          <li>
            <Link to=""></Link>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="navbar-links">
          <li>
            <Link to="/admin">Patient Data</Link>
          </li>
          <li>
            <Link to="/admin/update-question">Update Question</Link>
          </li>
          <li>
            <Link to="/admin/addstaff">Register Admin</Link>
          </li>
          <li onClick={handleSignOut}>
            <Link to="/admin/login">Sign Out</Link>
          </li>
        </ul>
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo">
          <img src={logoImage} alt="Your Logo" className="logo-image" />
          <h2>Admin Panel</h2>
        </Link>
      </div>
      {renderNavLinks()}
    </nav>
  );
};

export default Navbar;
