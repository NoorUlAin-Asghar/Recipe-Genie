import React, { useState, useEffect} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { loginUser } from '../api';
import ProtectRoute from '../components/protectRoute'; 
import '../login.css'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [popupConfig, setPopupConfig] = useState(null);  
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
      const response = await loginUser(formData);
      
      console.log("user logged in: ",response)
      // Save token and redirect to home page
      localStorage.setItem('user', JSON.stringify(response));
      navigate('/home', {replace: true, state:{login: true}});
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed. Please try again.');
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  };
   
   useEffect(() => {
    const msg = localStorage.getItem('sessionMessage');
    if (msg) {
      const parts = msg.split('. ');
      
      localStorage.removeItem('sessionMessage'); // Clear after showing
      const newPopup = 
      {
        icon: "⏰",
        title: parts[0],
        message: parts[1]
      }
      setPopupConfig(newPopup);
      setTimeout(() => {
        setPopupConfig(null);
      }, 4000); // 4 seconds
    }
  }, []);
 
  const closePopup = () => {
    setPopupConfig(null);
  };


  return (
    <>
    <ProtectRoute /> 
    {popupConfig && (
      <div className="popup-overlay">
        <div className="popup-container">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            <div className="popup-icon">{popupConfig.icon}</div>
            <h3>{popupConfig.title}</h3>
            <p>{popupConfig.message}</p>
          </div>
        </div>
      </div>
    )}

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
          {/* <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link> */}
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;