import React from 'react';
import logo from '../assetss/images/logo.jpg';
import '../Navbar.css';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo and Title */}
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="logo-img"/>
        <h1 className="navbar-title">Recipe Genie</h1>
      </div>

      {/* Navigation Links - Updated */}
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/explore" className="navbar-link">Explore</Link>
        <Link to="/Profile" className="navbar-link">Profile</Link>
        <Link to="/contact" className="navbar-link">Contact</Link>
        <Link to="/login" className="navbar-link login-link">Login</Link>
        <Link to="/register" className="navbar-link register-link">Register</Link>

      </div>
    </nav>
  );
};

export default Navbar;