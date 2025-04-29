import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../loading.css';

const ProtectRoute = ()=>{
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  // Check for existing user on mount
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.data?.token) {
        setIsRedirecting(true);
        const timer = setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [navigate]);

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
  return null; // Important: if not redirecting, render nothing
}
export default ProtectRoute