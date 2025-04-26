import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import '../login.css'; // We'll create this CSS file
import '../loading.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  
  const navigate = useNavigate();

  // Check for existing user on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.data?.token) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        navigate('/home', { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

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
      const response = await loginUser(formData);
      
      console.log("user logged in: ",response)
      // Save token and redirect (adjust based on your auth flow)
      localStorage.setItem('user', JSON.stringify(response));
      navigate('/home', {replace: true, state:{login: true}});
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed. Please try again.');
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  };
  if (isRedirecting) {
    return (
      <div className="redirect-screen">
        <div className="redirect-card">
          <img 
            src={require('../assetss/images/logo.jpg')} 
            alt="Logo" 
            className="redirect-logo"
          />
          <h2>Welcome Back!</h2>
          <h3>Already Signed In</h3>
          <p>Taking you to your recipes...</p>
          <div className="redirect-spinner"></div>
        </div>
      </div>
    );
  }
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