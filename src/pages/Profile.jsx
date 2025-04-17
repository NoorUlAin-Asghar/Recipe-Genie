import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import '../Profile.css';
import '../Home.css';

const Profile = () => {
  // State for subscriptions
  const [subscriptions, setSubscriptions] = useState([]);

  // Load subscriptions from localStorage on component mount
  useEffect(() => {
    const savedSubs = localStorage.getItem('subscriptions');
    if (savedSubs) {
      setSubscriptions(JSON.parse(savedSubs));
    }
  }, []);

  // User profile data
  const [user] = useState({
    name: 'John Doe',
    username: 'johndoe123',
    tagline: 'Loves cooking & sharing tasty dishes 🌟',
    profileImage: require('../assetss/images/paneer.png'),
    followers: 150,
    following: 80,
    recipes: [
      {
        id: 1,
        name: 'Chicken Curry',
        image: require('../assetss/images/chh.jpg'),
        likes: 101,
        time: 30,
      },
    ],
  });

  const unsubscribe = (chefId) => {
    const updatedSubs = subscriptions.filter(chef => chef.id !== chefId);
    setSubscriptions(updatedSubs);
    localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-main">
          <div className="profile-header">
            <img src={user.profileImage} alt="Profile" className="profile-pic" />
            <h2>{user.name}</h2>
            <p className="username">@{user.username}</p>
            <p className="tagline">{user.tagline}</p>
            <div className="profile-stats">
              <div className="stat-box">
                <strong>{user.recipes.length}</strong>
                <span>Posts</span>
              </div>
              <div className="stat-box">
                <strong>{user.followers}</strong>
                <span>Followers</span>
              </div>
              <div className="stat-box">
                <strong>{user.following}</strong>
                <span>Following</span>
              </div>
            </div>
          </div>

          <div className="user-recipes">
            <h3>My Recipes</h3>
            {user.recipes.map(recipe => (
              <div key={recipe.id} className="user-recipe-card">
                <img src={recipe.image} alt={recipe.name} />
                <div className="recipe-info">
                  <p>{recipe.name}</p>
                  <div className="recipe-meta">
                    <span><i className="fas fa-heart"></i> {recipe.likes}</span>
                    <span><i className="fas fa-clock"></i> {recipe.time} mins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="sidebar-section">
            <h3>Subscriptions</h3>
            {subscriptions.length > 0 ? (
              <div className="subscriptions-list">
                {subscriptions.map(chef => (
                  <div key={chef.id} className="subscription-item">
                    <div className="subscription-header">
                      <img src={chef.avatar} alt={chef.name} className="subscription-pic" />
                      <div>
                        <p className="subscription-name">{chef.name}</p>
                        <p className="subscription-bio">{chef.bio}</p>
                      </div>
                    </div>
                    <button 
                      className="unsubscribe-btn"
                      onClick={() => unsubscribe(chef.id)}
                    >
                      Unsubscribe
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-subscriptions">No subscriptions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;