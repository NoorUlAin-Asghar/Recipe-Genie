import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import foodBg from '../assetss/images/food.png';
import chicken from '../assetss/images/chh.jpg';
import biryani from '../assetss/images/bir.jpeg';
import dosa from '../assetss/images/dd.jpg';
import paneer from '../assetss/images/tt.jpg';
import '../Home.css';
import '../popup.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
  const initialRecipes = [
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

  const [recipes, setRecipes] = useState(initialRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 4;

  const location = useLocation();
  const navigate = useNavigate();
  const [popupConfig, setPopupConfig] = useState(null);

  useEffect(() => {
    const login = location.state?.login;
    const registered = location.state?.registered;

    if (login || registered) {
      const newPopup = login
        ? {
            icon: '👋',
            title: 'Logged In!',
            message: 'Welcome back to Recipe Genie!'
          }
        : {
            icon: '🎉',
            title: 'Registration Successful!',
            message: 'Welcome to Recipe Genie! Start exploring delicious recipes.'
          };
      setPopupConfig(newPopup);
      const timer = setTimeout(() => {
        setPopupConfig(null);
      }, 2000);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setCurrentPage(1);
      return;
    }
    const results = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleLike = (id) => {
    const updated = recipes.map(recipe => 
      recipe.id === id ? { ...recipe, likes: recipe.likes + 1 } : recipe
    );
    setRecipes(updated);

    // Update search results if applicable
    const updatedSearch = searchResults.map(recipe => 
      recipe.id === id ? { ...recipe, likes: recipe.likes + 1 } : recipe
    );
    setSearchResults(updatedSearch);
  };

  const closePopup = () => {
    setPopupConfig(null);
  };

  const displayedRecipes = searchResults.length > 0 ? searchResults : recipes;
  const indexOfLast = currentPage * recipesPerPage;
  const indexOfFirst = indexOfLast - recipesPerPage;
  const currentRecipes = displayedRecipes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(displayedRecipes.length / recipesPerPage);

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

      <section className="hero" style={{ backgroundImage: `url(${foodBg})` }}>
        <div className="hero-content">
          <h1 className="hero-title">Explore Your Taste!</h1>
          <p className="hero-subtitle">
            Don't just wing it - dish it! Find foolproof recipes in seconds and cook yourself a meal!
          </p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Recipes..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </section>

      <section className="recipes">
        <h2 className="section-title">
          {searchResults.length > 0 ? 'Search Results' : 'Popular Recipes'}
        </h2>
        <p className="section-subtitle">
          {searchResults.length === 0 && "Follow our popular recipes and make your own Finger lickin' Food"}
        </p>

        <div className="recipe-grid">
          {currentRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <Link to={`/recipe/${recipe.id}`} className="recipe-card-link">
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
              </Link>
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.name}</h3>
                <div className="recipe-meta">
                  <button
                    className="like-button"
                    onClick={() => handleLike(recipe.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
                  >
                    <i className="fas fa-heart"></i> {recipe.likes}
                  </button>
                  <span className="recipe-time">
                    <i className="fas fa-clock"></i> {recipe.time} mins
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayedRecipes.length > recipesPerPage && (
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
    </div>
  );
};

export default Home;
