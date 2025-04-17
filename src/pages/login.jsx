/*import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#fff8f0'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ color: '#ff8c42', textAlign: 'center' }}>Login</h2>
        {/* Add your form here later */  /*}
        <Link 
          to="/" 
          style={{
            display: 'block',
            textAlign: 'center',
            color: '#ff8c42',
            marginTop: '1rem'
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Login;*/


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../login.css'; // We'll create this CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');

    try {
      // Replace with your actual API endpoint
      const response = await axios.post('https://your-api.com/login', formData);
      
      // Save token and redirect (adjust based on your auth flow)
      localStorage.setItem('authToken', response.data.token);
      navigate('/');
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img 
            src={require('../assetss/images/logo.jpg')} 
            alt="Recipe Genie Logo" 
            className="login-logo"
          />
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your recipes</p>
        </div>

        {loginError && <div className="login-error">{loginError}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-text">
            Don't have an account?{' '}
            <Link to="/register" className="login-link">Register</Link>
          </p>
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;