import React, { useState, useEffect } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import Navbar from '../components/navbar';
import defaultProfilePic from '../assetss/images/profile.jpg'; // add this image
import { toast } from 'react-toastify';
import { ConfirmToast } from '../components/ConfirmToast'; // Import the component
import LoadingScreen from '../components/loadingScreen'
import FollowButton from '../components/FollowButton';
import { getProfile, getAllRecipesOfAUser, updateMyProfile, deleteRecipe, getFollowers,getFollowing } from '../api';

import '../Profile.css';
import '../Home.css';
import LikeButton from '../components/LikeButton';

const Profile = ({ user}) => {
  const { userId} = useParams(); // ID from URL - whose profile we are currently visitng
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [profile, setprofile] = useState({
  name: '',
  username: '',
  profileImage: '',
  tagline: '',
  followers: 0,
  following: 0,
  recipes: []
});
  const [loading, setLoading] = useState(true);   // Loading state to track data fetching
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
      if(user?.data?.userid){
        setCurrentUserId(user.data.userid);
      }
    }, []);
  
  const isOwner = currentUserId === userId;

  // Reset state when userId changes
  useEffect(() => {
    return () => {
      setprofile({
        name: '',
        username: '',
        profileImage: '',
        tagline: '',
        followers: 0,
        following: 0,
        recipes: []
      });
      setLoading(true);
    };
  }, [userId]);

  // Fetch profile data
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        if (!userId) return;
        
        setLoading(true);
        console.log("Fetching profile for:", userId);
        
        const [userResponse, recipesResponse] = await Promise.all([
          getProfile(userId),
          getAllRecipesOfAUser(userId).catch(() => ({ data: [] })) // Graceful fallback
        ]);

        const formattedResponse = {
          name: userResponse.data.name,
          username: userResponse.data.username,
          profileImage: userResponse.data.profilePicture,
          tagline: userResponse.data.bio,
          following: userResponse.data.subscriptionsCount,
          followers: userResponse.data.followersCount,
          recipes: recipesResponse.data || [],
        };

        setprofile(formattedResponse);
        setUpdatedUser(formattedResponse);
        fetchConnections();
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setErrorMessage(error?.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    const fetchConnections = async () => {
      try {
        const [followerData, followingData] = await Promise.all([
          getFollowers(userId),
          getFollowing(userId),
        ]);
        setFollowers(followerData.data);
        setFollowing(followingData.data);
        console.log("Followers: ",followers,"\nFollowing: ",following)
      } catch (err) {
        console.error("Failed to fetch connections", err);
      }
    };

    fetchMyProfile();
  }, [userId, navigate]);

  
  useEffect(() => {
    console.log('Profile updated:', profile);
  }, [profile]);
  // Log the updated followers and following
  useEffect(() => {
    console.log("Updated Followers: ", followers);
    console.log("Updated Following: ", following);
  }, [followers, following]);

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
        'Updating Profile, refreshing...',
        { autoClose: 1000, closeButton: false }
      );
      
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Refresh after 1 seconds
      setShowDropdown(null);
    
  
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

  const toggleDropdown = (recipeId, e) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === recipeId ? null : recipeId);
  };

  const handleRecipeClick = (recipeId) => {
    if (!showDropdown) {
      navigate(`/recipe/${recipeId}`);
    }
  };

  const handleDeleteRecipe = async (recipeId, e) => {
    e.stopPropagation();

    // Show confirmation toast
    const confirmed = await new Promise((resolve) => {
      toast(
        <ConfirmToast 
          message="Do you really want to delete this recipe? This action cannot be undone."
          onConfirm={() => {
            toast.dismiss();
            resolve(true);
          }}
          onCancel={() => {
            toast.dismiss();
            resolve(false);
          }}
          confirmText="Delete"  // Optional - defaults to "Delete"
          cancelText="Cancel"    // Optional - defaults to "Cancel"
        />,
        {
          position: 'top-center',
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
          draggable: false
        }
      );
    });

    if (!confirmed) {
      setShowDropdown(null);
      return;
    }

    try {
      toast.success('Deleting recipe...', { autoClose: 1000 });
      await deleteRecipe(recipeId);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error('Failed to delete recipe');
    } finally {
      setShowDropdown(null);
    }
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
           
           {isOwner ? (
              <button onClick={isEditing ? handleSaveUserEdit : () => setIsEditing(true)} className="profile-edit-btn">
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
            ) : (
              <FollowButton targetUserId={userId} isOwner={currentUserId} />
            )}

           {isEditing && (
            <button onClick={handleCancelUserEdit} className="profile-cancel-btn">
              Cancel
            </button>
          )}
      </div>


        <div className="user-recipes">
          <div className="recipes-title-box">
            {isOwner ? (
               <h3>My Recipes</h3>
            ) : (
              <h3>{profile.username}'s Recipes</h3>
            )}
          </div>
            <div className="recipes-grid">
              {profile.recipes.length === 0 ? (
                <div className="no-recipes-message">
                  {isOwner ? (
                    <p>You haven't added any recipes yet. Get started by sharing your first one!</p>
                  ) : (
                    <p>This user hasn't shared any recipes yet.</p>
                  )}
                </div>
              ) : (
                      profile.recipes.map(recipe => (
                <div 
                  key={recipe._id} 
                  className="user-recipe-card"
                  onClick={() => handleRecipeClick(recipe._id)}
                >
                {isOwner && (
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
                )}
                  <img  src={recipe.image} alt={recipe.name} className="recipe-image"/>
                  <div className="recipe-info">
                    <p>{recipe.title}</p>
                    <div className="recipe-meta">
                      <LikeButton recipeId={recipe._id} likeCount={recipe.likes}/>
                      {/* <span>
                        <i className={recipe.likes > 0 ? "fas fa-heart" : "far fa-heart"}></i> 
                        {recipe.likes}
                      </span> */}
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
           <h3>Following</h3>
           {following.length > 0 ? (
             <div className="subscriptions-list">
             {following.map(chef => (
               <div 
                 key={chef.id} 
                 className="subscription-item"
                 onClick={(e) => {
                   if (!e.target.closest('.follow-button-wrapper')) {
                     navigate(`/profile/${chef._id}`);
                   }
                 }}
               >
                 <div className="user-content">
                   <img 
                     src={chef.profilePicture} 
                     alt={chef.name} 
                     className="subscription-pic" 
                   />
                   <div className="user-text">
                     <span className="subscription-name">{chef.name}</span>
                     <span className="subscription-username">@{chef.username}</span>
                   </div>
                 </div>
                 <div className="follow-button-wrapper">
                   <FollowButton targetUserId={chef._id} isOwner={currentUserId} />
                 </div>
               </div>
             ))}
           </div>
          ) : (
            <p className="no-subscriptions">Not following anyone</p>
          )}
         </div>

         <div className="sidebar-section">
           <h3>Followers</h3>
           {followers.length > 0 ? (
             <div className="subscriptions-list">
             {followers.map(chef => (
               <div 
                 key={chef.id} 
                 className="subscription-item"
                 onClick={(e) => {
                   if (!e.target.closest('.follow-button-wrapper')) {
                     navigate(`/profile/${chef._id}`);
                   }
                 }}
               >
                 <div className="user-content">
                   <img 
                     src={chef.profilePicture} 
                     alt={chef.name} 
                     className="subscription-pic" 
                   />
                   <div className="user-text">
                     <span className="subscription-name">{chef.name}</span>
                     <span className="subscription-username">@{chef.username}</span>
                   </div>
                 </div>
                 <div className="follow-button-wrapper">
                   <FollowButton targetUserId={chef._id} isOwner={currentUserId} />
                 </div>
               </div>
             ))}
           </div>
          ) : (
            <p className="no-subscriptions">No followers yet</p>
          )}
         </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;