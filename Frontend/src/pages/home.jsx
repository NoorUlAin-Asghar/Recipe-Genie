import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import foodBg from '../assetss/images/food.png';
import chicken from '../assetss/images/chh.jpg';
import biryani from '../assetss/images/bir.jpeg';
import dosa from '../assetss/images/dd.jpg';
import paneer from '../assetss/images/tt.jpg';
import '../Home.css';
import '../popup.css'; // We'll create this CSS file
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
  // Enhanced recipe data with IDs and details for the detail page
  const allRecipes = [
    { 
      id: 1, 
      name: 'Chicken Curry', 
      likes: 100, 
      time: 30,
      image: chicken,
      description: 'Delicious spicy chicken curry with aromatic spices',
      ingredients: ['Chicken', 'Onion', 'Tomato', 'Ginger', 'Garlic', 'Spices'],
      instructions: ['Marinate chicken', 'Sauté onions', 'Add tomatoes', 'Cook with spices']
    },
    { 
      id: 2, 
      name: 'Vegetable Biryani', 
      likes: 120, 
      time: 45,
      image: biryani,
      description: 'Fragrant rice dish with mixed vegetables',
      ingredients: ['Basmati rice', 'Mixed vegetables', 'Yogurt', 'Biryani masala'],
      instructions: ['Soak rice', 'Layer vegetables and rice', 'Cook on dum']
    },
    { 
      id: 3, 
      name: 'Masala Dosa', 
      likes: 85, 
      time: 25,
      image: dosa,
      description: 'Crispy crepe with spiced potato filling',
      ingredients: ['Rice flour', 'Urad dal', 'Potatoes', 'Spices'],
      instructions: ['Make batter', 'Ferment overnight', 'Spread on griddle', 'Add filling']
    },
    { 
      id: 4, 
      name: 'Paneer Tikka', 
      likes: 95, 
      time: 35,
      image: paneer,
      description: 'Grilled cottage cheese skewers',
      ingredients: ['Paneer', 'Bell peppers', 'Yogurt', 'Tandoori masala'],
      instructions: ['Marinate paneer', 'Skewer with veggies', 'Grill until charred']
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 4;

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setCurrentPage(1);
      return;
    }
    const results = allRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    setCurrentPage(1); // Reset to first page on new search
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
          const timer = setTimeout(() => {
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
      {searchResults.length > 0 ? (
        <section className="recipes">
          <h2 className="section-title">Search Results</h2>
          <div className="recipe-grid">
            {currentRecipes.map((recipe) => (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-card-link">
                <div className="recipe-card">
                  <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                  <div className="recipe-content">
                    <h3 className="recipe-title">{recipe.name}</h3>
                    <div className="recipe-meta">
                      <span className="recipe-likes">
                        <i className="fas fa-heart"></i> {recipe.likes}
                      </span>
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
        <section className="recipes">
          <h2 className="section-title">Popular Recipes</h2>
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
                      <span className="recipe-likes">
                        <i className="fas fa-heart"></i> {recipe.likes}
                      </span>
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
      )}
    </div>
  );
};

export default Home;