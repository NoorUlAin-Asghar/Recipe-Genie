import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { searchUserByName, searchUserByUsername } from '../api';
import '../usersearch.css'; // New dedicated CSS file

const UserSearch = () => {
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New state for tracking loading status
  const [noResults, setNoResults] = useState(false); // New state to track if no results are found
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;  // Track if component is mounted
    setNoResults(false); // Reset noResults flag when search term changes

    if (userSearchTerm === '') {
      setUserResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (userSearchTerm.length > 2 && isMounted) {
        setIsLoading(true); // Set loading to true when search starts
        try {
          // Try searching by name first
          let response = await searchUserByName(userSearchTerm);

          // Only update state if component is still mounted and search term hasn't changed
          if (isMounted && userSearchTerm.length > 2) {
            if (response && response.data.length > 0) {
              const formattedResponse = response.data.map(user => ({
                id: user._id,
                name: user.name,
                username: user.username,
                avatar: user.profilePicture,
              }));
              setUserResults(formattedResponse);
              setNoResults(false); // Reset noResults if we get results
            } else {
              setUserResults([]);
              setNoResults(true); // Set noResults to true if no results
            }
          }
        } catch (error) {
          if (isMounted) {
            // If we catch a 404 from searchUserByName (user not found)
            if (error.response && error.response.status === 404) {
              // Proceed with search by username
              try {
                let response = await searchUserByUsername(userSearchTerm);
                if (response && response.data.length > 0) {
                  const formattedResponse = response.data.map(user => ({
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    avatar: user.profilePicture,
                  }));
                  setUserResults(formattedResponse);
                  setNoResults(false); // Reset noResults if we get results
                } else {
                  setUserResults([]);
                  setNoResults(true); // Set noResults to true if no results
                }
              } catch (usernameError) {
                console.error("Error searching user by username:", usernameError);
                setUserResults([]);
                setNoResults(true); // Handle username search error
              }
            } else {
              console.error('Error searching user:', error);
              setUserResults([]);
              setNoResults(true);
            }
          }
        }
        setIsLoading(false); // Set loading to false when the search is complete
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [userSearchTerm]);

   // Add this function to handle navigation safely
   const handleUserClick = (user) => {
    if (user.id) {
      navigate(`/profile/${user.id}`);
    } else {
      console.error('Cannot navigate: User ID is undefined', user);
      // Optionally show an error message to the user
    }
  };

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
            {isLoading ? (
              <p>Searching...</p> 
            ) : (
              // Only show "No results found" when there are no results and search term length > 2
              userSearchTerm.length > 2 && noResults ? (
                <p>No results found.</p> // Show no results message if no results found
              ) : (
                userResults.map(user => (
                  <div 
                    key={user.id} 
                    className="user-result-card"
                    onClick={() => handleUserClick(user)}
                  >
                    <img src={user.avatar || require('../assetss/images/profile.jpg')} alt={user.name} className="user-avatar-image" />
                    <div className="user-details">
                      <h3 className="user-display-name">{user.name}</h3>
                      <p className="user-username">@{user.username}</p>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
