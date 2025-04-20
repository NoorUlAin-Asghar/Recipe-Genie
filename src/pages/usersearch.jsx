

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import '../usersearch.css'; // New dedicated CSS file

const UserSearch = () => {
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userResults, setUserResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userSearchTerm.length > 2) {
      const timer = setTimeout(() => {
        // Mock API call
        setUserResults([
          { id: 1, username: 'chef_john', name: 'John Doe', avatar: 'john.jpg' },
          { id: 2, username: 'baking_sarah', name: 'Sarah Smith', avatar: 'sarah.jpg' }
        ]);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUserResults([]);
    }
  }, [userSearchTerm]);

  return (
    <div className="user-search-page">
      <Navbar />
      
      {/* Grey box container added here */}
      <div className="user-search-container">
        <div className="user-search-content">
          <div className="user-search-bar-container">
            <input
              type="text"
              placeholder="Search Users..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="user-search-input"
            />
            <button className="user-search-button">
              <i className="fas fa-search user-search-icon"></i>
            </button>
          </div>
          
          <div className="user-results-container">
            {userResults.map(user => (
              <div 
                key={user.id} 
                className="user-result-card"
                onClick={() => navigate(`/Profile/${user.username}`)}
              >
                <img src={user.avatar} alt={user.name} className="user-avatar-image" />
                <div className="user-details">
                  <h3 className="user-display-name">{user.name}</h3>
                  <p className="user-username">@{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
);
};

export default UserSearch;