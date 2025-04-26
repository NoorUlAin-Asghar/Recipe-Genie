import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css'; // Make sure Tailwind or your CSS is imported
import App from './App';
import { AuthConetxtProvider } from './context/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <AuthConetxtProvider> */}
      <App />
    {/* </AuthConetxtProvider> */}
  </React.StrictMode>
);
