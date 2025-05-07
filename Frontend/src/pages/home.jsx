import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import foodBg from '../assetss/images/food.png';
import logo from '../assetss/images/logo.jpg'; 
import LikeButton from '../components/LikeButton';
import '../Home.css';
import '../popup.css'; 
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPopularRecipes, searchRecipe, getFollowedUsersRecipes } from '../api';

const Home = () => {
  // Enhanced recipe data with IDs and details for the detail page
  const [allRecipes, setAllRecipes] = useState([]); // Initialize as empty array
  const [followedRecipes, setFollowedRecipes] = useState([]);
  const [followedMessage, setFollowedMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');

  const recipesPerPage = 4;

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await getPopularRecipes();
         // Transform API response to match component's expected format
        const formattedRecipes = response.data.map(recipe => ({
          id: recipe._id, // Map _id to id
          name: recipe.title, // Map title to name
          likes: recipe.likesCount, // Use likesCount from API
          time: recipe.cookTime, // Map cookTime to time
          image: recipe.image, // Keep image as is
        }));
        setAllRecipes(formattedRecipes);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    };
    
    fetchAllRecipes();
  }, []);

  useEffect(() => {
    const fetchFollowedRecipes = async () => {
      try {
        const response = await getFollowedUsersRecipes();
  
        if (response.data.recipes && response.data.recipes.length > 0) {
          const formatted = response.data.recipes.map(recipe => ({
            id: recipe._id,
            name: recipe.title,
            likes: recipe.likesCount,
            time: recipe.cookTime,
            image: recipe.image
          }));
          setFollowedRecipes(formatted);
        } else {
          setFollowedMessage(response.data.message); // handles empty or no-follow cases
        }
      } catch (error) {
        console.error('Error fetching followed recipes:', error);
        setFollowedMessage('Failed to fetch followed users\' recipes.');
      }
    };
  
    fetchFollowedRecipes();
  }, []);
  
  
  const handleSearch = async () => {
    setSearchSubmitted(true); // Mark that a search was attempted
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setCurrentPage(1);
      return;
    }
    try {
      const response = await searchRecipe(searchTerm);
      const formattedRecipes = response.data.map(recipe => ({
        id: recipe._id,
        name: recipe.title,
        likes: recipe.likesCount,
        time: recipe.cookTime,
        image: recipe.image
      }));
      setSearchResults(formattedRecipes);
      setCurrentPage(1);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  //sync search and popular data
  const handleLikeChange = (id, newLikes) => {
    // Update in popular recipes
    setFollowedRecipes(prev =>
      prev.map(recipe => recipe.id === id ? { ...recipe, likes: newLikes } : recipe)
    );

    // Update in popular recipes
    setAllRecipes(prev =>
      prev.map(recipe => recipe.id === id ? { ...recipe, likes: newLikes } : recipe)
    );
    // Update in search results
    setSearchResults(prev =>
      prev.map(recipe => recipe.id === id ? { ...recipe, likes: newLikes } : recipe)
    );
  };
  

  // Get current recipes for pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = searchResults.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(searchResults.length / recipesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [popupConfig, setPopupConfig] = useState(null);
  
  useEffect(() => {
    console.log("Location state:", location.state);
  }, [location]);

  useEffect(() => {
    const login = location.state?.login;
    const registered = location.state?.registered;
  
    if (login || registered) {
      const newPopup = login
        ? {
            icon: "👋",
            title: "Logged In!",
            message: "Welcome back to Recipe Genie!"
          }
        : {
            icon: "🎉",
            title: "Registration Successful!",
            message: "Welcome to Recipe Genie! Start exploring delicious recipes."
          };
          setPopupConfig(newPopup);
          setTimeout(() => {
            setPopupConfig(null);
          }, 2000); // 2 seconds
     
      // Clear the state so it doesn't trigger again on navbar click
      navigate(location.pathname, { replace: true, state: {} });
      
    }
  }, [location, navigate]);

  const closePopup = () => {
    setPopupConfig(null);
  };

  return (
    <div className="home-page">
      <Navbar />
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

      {/* Hero Section with Background Image */}
      <section className="hero" style={{ backgroundImage: `url(${foodBg})` }}>
        <div className="hero-content">
          <h1 className="hero-title">Explore Your Taste!</h1>
          <p className="hero-subtitle">
          Don't just wing it - dish it!. Find foolproof recipes in seconds and cook yourself a meal!          </p>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search Recipes..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchSubmitted(false); // Clear previous error state while typing
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="search-button"
              onClick={handleSearch}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </section>
            
      {/* Conditional rendering for search results or popular recipes */}
      {searchSubmitted &&  searchTerm.trim() !== '' &&searchResults.length === 0 ? (
        <section className="recipes">
          <h1 className="section-title">No Results</h1>
          <p className="section-subtitle">No recipes found for "<strong>{searchTerm}</strong>"</p>
        </section>
      ) : searchResults.length > 0 ? (
        <section className="recipes">
          <h2 className="section-title">Search Results</h2>
          <div className="recipe-grid">
            {currentRecipes.map((recipe) => (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-card-link">
                <div className="recipe-card">
                  <img  src={recipe.image || logo} 
                        alt={recipe.name}
                        className={recipe.image ? 'recipe-image' : 'logo-image'}
                        // onError={(e) => {
                        //   e.target.onerror = null; // Prevent infinite loop if fallback fails
                        //   e.target.src = logo;
                        //   e.target.style.objectFit = 'contain'; // Adjust styling for logo
                        // }} 
                  />
                  <div className="recipe-content">
                    <h3 className="recipe-title">{recipe.name}</h3>
                    <div className="recipe-meta">
                      <LikeButton recipeId={recipe.id} likeCount={recipe.likes} onLikeChange={handleLikeChange}/>
                  
                      <span className="recipe-time">
                        <i className="fas fa-clock"></i> {recipe.time} mins
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {searchResults.length > recipesPerPage && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-arrow"
              >
                &lt;
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-arrow"
              >
                &gt;
              </button>
            </div>
          )}
        </section>
      ) : (
          <><div className="tabs">
              <button
                className={activeTab === 'popular' ? 'active' : ''}
                onClick={() => setActiveTab('popular')}
              >
                Popular
              </button>
              <button
                className={activeTab === 'following' ? 'active' : ''}
                onClick={() => setActiveTab('following')}
              >
                Following
              </button>
            </div>
            {activeTab === 'popular' ? (  
            <section className="recipes">
                <h1 className="section-title">Popular Recipes</h1>
                <p className="section-subtitle">
                  Follow our popular recipes and make your own Finger lickin' Food
                </p>
                <div className="recipe-grid">
                  {allRecipes.map((recipe) => (
                    <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-card-link">
                      <div className="recipe-card">
                        <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                        <div className="recipe-content">
                          <h3 className="recipe-title">{recipe.name}</h3>
                          <div className="recipe-meta">
                            <LikeButton recipeId={recipe.id} likeCount={recipe.likes} onLikeChange={handleLikeChange} />

                            <span className="recipe-time">
                              <i className="fas fa-clock"></i> {recipe.time} mins
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
              ) : (
                <section className="recipes">
                  <h1 className="section-title">Recipes From People You Follow</h1>
                  <p class="section-subtitle">See what your favorite cooks are serving — follow their flavors, taste their stories</p>
                  {followedRecipes.length > 0 ? (
                    <div className="recipe-grid">
                      {followedRecipes.map((recipe) => (
                        <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-card-link">
                          <div className="recipe-card">
                            <img src={recipe.image || logo} alt={recipe.name} className="recipe-image" />
                            <div className="recipe-content">
                              <h3 className="recipe-title">{recipe.name}</h3>
                              <div className="recipe-meta">
                                <LikeButton recipeId={recipe.id} likeCount={recipe.likes} onLikeChange={handleLikeChange} />
                                <span className="recipe-time">
                                  <i className="fas fa-clock"></i> {recipe.time} mins
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="section-subtitle">{followedMessage}</p>
                  )}
                </section>
              )}</>
      )}
    </div>
  );
};

export default Home;