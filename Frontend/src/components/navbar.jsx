import React from 'react';
import logo from '../assetss/images/logo.jpg';
import '../Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserID] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get username directly from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.data?.username) {
      setUsername(user.data.username);
    }
    if(user?.data?.userid){
      setUserID(user.data.userid);
    }
  }, []);

  // Redirect to login if no user in local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <nav className="navbar">
      {/* Logo and Title */}
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="logo-img" />
        <h1 className="navbar-title">Recipe Genie</h1>
      </div>

      {/* Navigation Links - Updated */}
      <div className="navbar-links">
        <Link to="/home" className="navbar-link">Home</Link>
        <Link to="/chatbot" className="navbar-link">Chatbot</Link>
        <Link to="/usersearch" className="navbar-link">User Search</Link>
        <Link to="/sharerecipe" className="navbar-link">
          <i className="fas fa-plus"></i> Share Recipe
        </Link>
        <Link to="/profile" className="navbar-link">
          {username ? (<span>😊{username}</span>) : (<span>Loading...</span>)}
        </Link>
        <Link to="/documentation" className="navbar-link">FAQ</Link> {/* Add this link */}
        <Link to="/login" className="navbar-link login-link" 
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            window.location.replace('/login'); // Hard redirect
          }}
        >
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;