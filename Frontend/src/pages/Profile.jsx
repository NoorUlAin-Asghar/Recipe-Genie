import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import defaultProfilePic from '../assetss/images/profile.jpg'; // add this image
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../components/loadingScreen'
import { getMyProfile, getMyRecipes, updateMyProfile } from '../api';

import '../Profile.css';
import '../Home.css';

const Profile = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [profile, setprofile] = useState([]); // Set initial state to null
  const [loading, setLoading] = useState(true);   // Loading state to track data fetching
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const userResponse = await getMyProfile();
        const userData = userResponse.data;
  
        let recipes = [];
  
        try {
          const recipesResponse = await getMyRecipes();
          recipes = recipesResponse.data || [];
        } catch (recipeError) {
          if (recipeError.response?.status === 404) {
            // No recipes found — treat as empty, not error
            recipes = [];
          } else {
            throw recipeError; // Rethrow if it's another error
          }
        }
  
        const formattedResponse = {
          name: userData.name,
          username: userData.username,
          profileImage: userData.profilePicture,
          tagline: userData.bio,
          following: userData.subscriptionsCount,
          followers: userData.followersCount,
          recipes,
        };
  
        setprofile(formattedResponse);
        setUpdatedUser(formattedResponse);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile or recipes:', error);
        setErrorMessage(
          error?.response?.data?.message ||
          error?.message ||
          'Failed to load profile. Please try again later.'
        );
        setLoading(false);
      }
    };
  
    fetchMyProfile();
  }, []);
  
  useEffect(() => {
    console.log('Profile updated:', profile);
  }, [profile]);

  // Load subscriptions from localStorage
  useEffect(() => {
    const savedSubs = localStorage.getItem('subscriptions');
    if (savedSubs) {
      const parsedSubs = JSON.parse(savedSubs);
      setSubscriptions(parsedSubs);
      // Update following count based on subscriptions
      setprofile(prev => ({ ...prev, following: parsedSubs.length }));
    }
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Update UI immediately
      setUpdatedUser(prev => ({ 
        ...prev, 
        profileImage: previewUrl,
        profileFile: file // Store the actual file for submission
      }));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleSaveUserEdit = async () => {
    try {
      // 1. Check for frontend changes
        const hasChanges = 
        updatedUser.name.trim() !== profile.name.trim() ||
        updatedUser.tagline.trim() !== profile.tagline.trim() ||
        (updatedUser.profileFile !== undefined);
  
      if (!hasChanges) {
        setIsEditing(false);
        toast.info('No changes were made');
        return;
      }
  
      // 2. Prepare and send data
      const formData = new FormData();
      formData.append('name', updatedUser.name.trim());
      formData.append('bio', updatedUser.tagline.trim());
      if (updatedUser.profileFile) {
        formData.append('image', updatedUser.profileFile);
      }
  
      // 3. Make API call
      const updatedProfile = await updateMyProfile(formData);
  
      // 4. Verify if server actually made changes
      const serverMadeChanges = 
        updatedProfile.name !== profile.name ||
        updatedProfile.bio !== profile.tagline ||
        (updatedProfile.profilePicture !== profile.profileImage);
  
      if (!serverMadeChanges) {
        setIsEditing(false);
        toast.info('No changes were saved');
        return;
      }
  
      // 5. Update state and show success
      const updatedData = {
        ...profile,
        ...updatedProfile
      };
  
      setprofile(updatedData);
      setUpdatedUser(updatedData);
      setIsEditing(false);
  
      // Only show success if server actually changed something
      toast.success(
        <div>
          <p>To confirm profile updates, refesh</p>
          <button 
            onClick={() => window.location.reload()} 
            style={refreshButtonStyle}
          >
            Refresh Page
          </button>
        </div>,
        { autoClose: false, closeButton: false }
      );
  
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    }
  };
  
  // Style object for consistency
  const refreshButtonStyle = {
    marginTop: '8px',
    padding: '4px 8px',
    background: '#fff',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };
  const handleCancelUserEdit = () => {
    setUpdatedUser(profile);
    setIsEditing(false);
  };


  // Handle new recipe submission from ShareRecipeForm
  const handleNewRecipe = (newRecipe) => {
    const recipeWithId = {
      ...newRecipe,
      _id: Date.now(), // Temporary ID
      likes: 0,
      time: parseInt(newRecipe.time),
    };
    
    setprofile(prev => ({
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
    setprofile(prev => ({
      ...prev,
      recipes: prev.recipes.filter(recipe => recipe.id !== recipeId),
      // Decrement posts count
      followers: Math.max(0, prev.followers - 1) // Prevent negative count
    }));
    setShowDropdown(null);
  };

  const handleEditRecipe = (recipe, e) => {
    e.stopPropagation();
    //setEditingRecipe(recipe);
    setShowDropdown(null);
    navigate('/sharerecipe', { state: { recipe, isEditing: true } });

  };

  useEffect(() => {
    console.log('Recipe:', editingRecipe);
  }, [editingRecipe]);


  const handleSaveRecipe = (updatedRecipe) => {
    setprofile(prev => ({
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
    setprofile(prev => ({ ...prev, following: updatedSubs.length }));
  };

  // Function to handle subscription (you'll call this when subscribing elsewhere)
  const handleSubscribe = (chef) => {
    const updatedSubs = [...subscriptions, chef];
    setSubscriptions(updatedSubs);
    localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
    // Increase following count
    setprofile(prev => ({ ...prev, following: updatedSubs.length }));
  };

  if (loading) {
    return <LoadingScreen/>
  }
  if (errorMessage) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="error-message">
          <h2>Oops!</h2>
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-main">
          <div className="profile-header">
            <div className="profile-pic-wrapper">
             <img
                src={updatedUser.profileImage || defaultProfilePic}
                alt="Profile"
                className="profile-pic"
             />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="profile-upload"
               />
              )}
           </div>

           {isEditing ? (
             <>
               <input
                  type="text"
                  name="name"
                  value={updatedUser.name}
                  onChange={handleChange}
                  className="profile-edit-input"
                  placeholder="name"
               />
                {/* <input
                  type="text"
                  name="username"
                  value={updatedUser.username}
                  onChange={handleChange}

                  className="profile-edit-input username"
                  placeholder="username"

               /> */}
                <input
                  type="text"
                  name="tagline"
                  value={updatedUser.tagline}
                  onChange={handleChange}
                  className="profile-edit-input tagline"
                  placeholder="Bio"
               />
             </>
            ) : (
              <>
              <h2>{profile.name}</h2>  {/* Use profile.name */}
              <p className="username">@{profile.username}</p>  {/* Use profile.username */}
              <p className="tagline">{profile.tagline}</p>  {/* Use profile.tagline */}
            </>
           )}

            <div className="profile-stats">
              <div className="stat-box">
                <strong>{profile.recipes.length}</strong>
                <span>Posts</span>
             </div>
              <div className="stat-box">
                <strong>{profile.followers}</strong>
                <span>Followers</span>
             </div>
             <div className="stat-box">
               <strong>{profile.following}</strong>
               <span>Following</span>
             </div>
           </div>
           
           <button onClick={isEditing ? handleSaveUserEdit : () => setIsEditing(true)} className="profile-edit-btn">
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>

           {isEditing && (
            <button onClick={handleCancelUserEdit} className="profile-cancel-btn">
              Cancel
            </button>
          )}
      </div>


        <div className="user-recipes">
          <div className="recipes-title-box">
            <h3>My Recipes</h3>
          </div>
            <div className="recipes-grid">
              {profile.recipes.length === 0 ? (
                <div className="no-recipes-message">
                  <p>You haven't added any recipes yet. Get started by sharing your first one!</p>
                </div>
              ) : (
                      profile.recipes.map(recipe => (
                <div 
                  key={recipe._id} 
                  className="user-recipe-card"
                  onClick={() => handleRecipeClick(recipe._id)}
                >
                  <div className="recipe-actions">
                    <button 
                      className="recipe-options-btn"
                      onClick={(e) => toggleDropdown(recipe._id, e)}
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {showDropdown === recipe._id && (
                      <div className="recipe-dropdown">
                        <button onClick={(e) => handleEditRecipe(recipe, e)}>
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button onClick={(e) => handleDeleteRecipe(recipe._id, e)}>
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <img  src={recipe.image} alt={recipe.name} className="recipe-image"/>
                  <div className="recipe-info">
                    <p>{recipe.title}</p>
                    <div className="recipe-meta">
                      <span>
                        <i className={recipe.likes > 0 ? "fas fa-heart" : "far fa-heart"}></i> 
                        {recipe.likes}
                      </span>
                      <span><i className="fas fa-clock"></i> {recipe.cookTime} mins</span>
                    </div>
                  </div>
                </div>
              ))
            )}
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
                  onClick={(e) => {
              // Only navigate if the click wasn't on the unsubscribe button
                    if (!e.target.closest('.unsubscribe-btn')) {
                      navigate(`/pprofile/${chef.id}`);
                    }
                  }}
                >
                  <div className="subscription-header">
                    <img 
                      src={chef.avatar} 
                      alt={chef.name} 
                      className="subscription-pic" 
                    />
                    <div>
                      <p className="subscription-name">{chef.name}</p>
                      <p className="subscription-bio">{chef.bio}</p>
                    </div>
                  </div>
                  <button 
                    className="unsubscribe-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      unsubscribe(chef.id);
                    }}
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

      {/* {editingRecipe && (
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
      )} */}
    </div>
  );
};

export default Profile;