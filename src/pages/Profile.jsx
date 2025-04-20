



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import ShareRecipeForm from './sharerecipe';
import '../Profile.css';
import '../Home.css';

const Profile = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // User profile data
  const [user, setUser] = useState({
    name: 'John Doe',
    username: 'johndoe123',
    tagline: 'Loves cooking & sharing tasty dishes 🌟',
    profileImage: require('../assetss/images/chh.jpg'),
    followers: 150,
    following: 80,
    recipes: [
      {
        id: 1,
        name: 'Chicken Curry',
        image: require('../assetss/images/chh.jpg'),
        likes: 101,
        time: 30,
        description: 'Delicious spicy chicken curry',
        ingredients: ['Chicken', 'Spices', 'Onion'],
        instructions: ['Marinate chicken', 'Cook with spices']
      },
    ],
  });

  // Load subscriptions from localStorage
  useEffect(() => {
    const savedSubs = localStorage.getItem('subscriptions');
    if (savedSubs) {
      const parsedSubs = JSON.parse(savedSubs);
      setSubscriptions(parsedSubs);
      // Update following count based on subscriptions
      setUser(prev => ({ ...prev, following: parsedSubs.length }));
    }
  }, []);

  // Handle new recipe submission from ShareRecipeForm
  const handleNewRecipe = (newRecipe) => {
    const recipeWithId = {
      ...newRecipe,
      id: Date.now(), // Temporary ID
      likes: 0,
      time: parseInt(newRecipe.time),
    };
    
    setUser(prev => ({
      ...prev,
      recipes: [recipeWithId, ...prev.recipes],
      // Increment posts count
      followers: prev.followers + 1 // Or whatever increment logic you want
    }));
  };

  const toggleDropdown = (recipeId, e) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === recipeId ? null : recipeId);
  };

  const handleRecipeClick = (recipeId) => {
    if (!showDropdown) {
      navigate(`/recipe/${recipeId}`);
    }
  };

  const handleDeleteRecipe = (recipeId, e) => {
    e.stopPropagation();
    setUser(prev => ({
      ...prev,
      recipes: prev.recipes.filter(recipe => recipe.id !== recipeId),
      // Decrement posts count
      followers: Math.max(0, prev.followers - 1) // Prevent negative count
    }));
    setShowDropdown(null);
  };

  const handleEditRecipe = (recipe, e) => {
    e.stopPropagation();
    setEditingRecipe(recipe);
    setShowDropdown(null);
  };

  const handleSaveRecipe = (updatedRecipe) => {
    setUser(prev => ({
      ...prev,
      recipes: prev.recipes.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    }));
    setEditingRecipe(null);
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
  };

  const unsubscribe = (chefId) => {
    const updatedSubs = subscriptions.filter(chef => chef.id !== chefId);
    setSubscriptions(updatedSubs);
    localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
    // Decrease following count
    setUser(prev => ({ ...prev, following: updatedSubs.length }));
  };

  // Function to handle subscription (you'll call this when subscribing elsewhere)
  const handleSubscribe = (chef) => {
    const updatedSubs = [...subscriptions, chef];
    setSubscriptions(updatedSubs);
    localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
    // Increase following count
    setUser(prev => ({ ...prev, following: updatedSubs.length }));
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
            <div className="recipes-title-box">
              <h3>My Recipes</h3>
            </div>
            <div className="recipes-grid">
              {user.recipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className="user-recipe-card"
                  onClick={() => handleRecipeClick(recipe.id)}
                >
                  <div className="recipe-actions">
                    <button 
                      className="recipe-options-btn"
                      onClick={(e) => toggleDropdown(recipe.id, e)}
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {showDropdown === recipe.id && (
                      <div className="recipe-dropdown">
                        <button onClick={(e) => handleEditRecipe(recipe, e)}>
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button onClick={(e) => handleDeleteRecipe(recipe.id, e)}>
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    )}
                  </div>
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

      {editingRecipe && (
        <div className="edit-recipe-modal">
          <div className="modal-content">
            <ShareRecipeForm 
              initialRecipe={editingRecipe}
              onSave={handleSaveRecipe}
              onCancel={handleCancelEdit}
              isEditing={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;