import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import '../Profile.css';
import '../Home.css';
const PProfile = () => {
  const { userId } = useParams(); // Get the ID from URL 
  const [user, setUser] = useState(null); // Add user state
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);

  // Static fallback user data (until real fetch is added)
  useEffect(() => {
    // Simulating fetch logic (in real app you'd fetch from API/backend using userId)
    const dummyUser = {
      id: userId,
      name: 'John Doe',
      username: 'johndoe123',
      tagline: 'Loves cooking & sharing tasty dishes 🌟',
      profileImage: require('../assetss/images/chh.jpg'),
      followers: 150,
      following: 80,
      recipes: [
        {
          id: 1,
          name: ' Curry',
          image: require('../assetss/images/paneer.png'),
          likes: 101,
          time: 30,
          servings:'2person',
          description: 'Delicious spicy chicken curry',
          ingredients: ['Chicken', 'Spices', 'Onion'],
          instructions: ['Marinate chicken', 'Cook with spices']
        },
      ],
    };
    setUser(dummyUser);
    setUpdatedUser(dummyUser); // keep it in sync
  }, [userId]);

  const [profile, setprofile] = useState({
    name: 'John Doe',
    username: 'johndoe123',
    tagline: 'Loves cooking & sharing tasty dishes 🌟',
    profileImage: require('../assetss/images/chh.jpg'),
    followers: 150,
    following: 80,
    recipes: [
      {
        id: 1,
        name: ' Curry',
        image: require('../assetss/images/paneer.png'),
        likes: 101,
        time: 30,
        servings:'2person',
        description: 'Delicious spicy chicken curry',
        ingredients: ['Chicken', 'Spices', 'Onion'],
        instructions: ['Marinate chicken', 'Cook with spices']
      },
    ],
  });

  useEffect(() => {
    const savedSubs = localStorage.getItem('subscriptions');
    if (savedSubs) {
      const parsedSubs = JSON.parse(savedSubs);
      setSubscriptions(parsedSubs);
      setprofile(prev => ({ ...prev, following: parsedSubs.length }));
    }
  }, []);

  const toggleDropdown = (recipeId, e) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === recipeId ? null : recipeId);
  };

  const handleRecipeClick = (recipeId) => {
    if (!showDropdown) {
      navigate(`/recipe/${recipeId}`);
    }
  };

  if (!user) return <div>Loading profile...</div>;

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
            <div className="recipes-title-box">
              <h3> Recipes</h3>
            </div>
            <div className="recipes-grid">
              {profile.recipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className="user-recipe-card"
                  onClick={() => handleRecipeClick(recipe.id)}
                >
                  <img src={recipe.image} alt={recipe.name} />
                  <div className="recipe-info">
                    <p>{recipe.name}</p>
                    <div className="recipe-meta">
                      <span>
                        <i className={recipe.likes > 0 ? "fas fa-heart" : "far fa-heart"}></i> 
                        {recipe.likes}
                      </span>
                      <span><i className="fas fa-clock"></i> {recipe.time} mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="sidebar-section">
            <h3>Subscriptions</h3>
            {subscriptions.length > 0 ? (
              <div className="subscriptions-list">
                {subscriptions.map(chef => (
                  <div 
                    key={chef.id} 
                    className="subscription-item"
                    onClick={() => navigate(`/pprofile/${chef.id}`)}
                  >
                    <img src={chef.profileImage} alt={chef.username} className="sub-profile-pic" />
                    <span>@{chef.username}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No subscriptions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PProfile;
