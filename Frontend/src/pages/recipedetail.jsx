import { useNavigate } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import { getRecipe } from '../api';
import '../Home.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [timer, setTimer] = useState({
    isRunning: false,
    startTime: null,
    elapsed: 0,
    totalDuration: 0
  });
  const navigate = useNavigate();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [recipeAuthor, setRecipeAuthor] = useState({
    id: '',
    name: '',
    bio: '',
    avatar: '',
  });

  // Sample recipe data
  const dummyRecipes = [
    { 
      id: '', 
      name: '', 
      likes: 0, 
      time: 0,
      image: '',
      description: '',
      ingredients: [],
      instructions: []
    },
  ];

  const recipe = dummyRecipes.find(r => r.id === parseInt(id));
  const [liked, setLiked] = useState(() => {
    const savedLikes = JSON.parse(localStorage.getItem('recipeLikes') || '{}');
    return savedLikes[id] || false;
  });
  //const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(recipe.likes);
  // const [likes, setLikes] = useState(() => {
  //   const savedLikesCount = JSON.parse(localStorage.getItem('recipeLikesCount') || '{}');
  //   return savedLikesCount[id] || recipe.likes;
  // });
  // Check subscription status on component mount
  useEffect(() => {
    const savedSubs = JSON.parse(localStorage.getItem('subscriptions')) || [];
    setIsSubscribed(savedSubs.some(chef => chef.id === recipeAuthor.id));
  }, [recipeAuthor.id]);


  const handleLikeClick = () => {
    const savedLikes = JSON.parse(localStorage.getItem('recipeLikes') || '{}');
    const newLikedState = !liked;
    
    // Update localStorage
    localStorage.setItem('recipeLikes', JSON.stringify({
      ...savedLikes,
      [id]: newLikedState
    }));
  
    // Update state
    setLiked(newLikedState);
    setLikes(prevLikes => newLikedState ? prevLikes + 1 : prevLikes - 1);
  };
  useEffect(() => {
    const savedLikesCount = JSON.parse(localStorage.getItem('recipeLikesCount') || '{}');
    localStorage.setItem('recipeLikesCount', JSON.stringify({
      ...savedLikesCount,
      [id]: likes
    }));
  }, [likes, id]);
  /* const handleLikeClick = () => {
    if (liked) {
      setLiked(false);
      setLikes(prevLikes => prevLikes - 1);
    } else {
      setLiked(true);
      setLikes(prevLikes => prevLikes + 1);
    }
  };*/

  // Timer functions
  const startTimer = () => {
    if (!timer.isRunning) {
      setTimer(prev => ({
        ...prev,
        isRunning: true,
        startTime: Date.now() - prev.elapsed,
        totalDuration: recipe.time * 60 * 1000
      }));
    }
  };

  const pauseTimer = () => {
    if (timer.isRunning) {
      setTimer(prev => ({
        ...prev,
        isRunning: false,
        elapsed: Date.now() - prev.startTime
      }));
    }
  };

  const resetTimer = () => {
    setTimer({
      isRunning: false,
      startTime: null,
      elapsed: 0,
      totalDuration: recipe.time * 60 * 1000
    });
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (timer.isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        setTimer(prev => ({
          ...prev,
          elapsed: now - prev.startTime
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning]);

  // Format time display
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate if user took longer than recipe time
  const isOvertime = timer.elapsed > timer.totalDuration;
  const overtimeMinutes = isOvertime 
    ? Math.floor((timer.elapsed - timer.totalDuration) / 60000)
    : 0;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, {
        id: Date.now(),
        text: newComment,
        author: 'You',
        timestamp: new Date().toLocaleString()
      }]);
      setNewComment('');
    }
  };

  const toggleSubscription = () => {
    const savedSubs = JSON.parse(localStorage.getItem('subscriptions')) || [];
    
    if (isSubscribed) {
      // Unsubscribe
      const updatedSubs = savedSubs.filter(chef => chef.id !== recipeAuthor.id);
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
    } else {
      // Subscribe
      const updatedSubs = [...savedSubs, recipeAuthor];
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
    }
    
    setIsSubscribed(!isSubscribed);
  };

  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="recipe-detail-page">
      <Navbar />
      <div className="recipe-detail-container">
        <h1>{recipe.name}</h1>
        <img src={recipe.image} alt={recipe.name} className="detail-image" />
        
        <div className="recipe-meta-detail">
          <span className="likes" onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
            {liked ? (
              <>
                <i className="fas fa-heart" style={{ color: 'red' }}></i>
                <span> LIKED!</span>
              </>
            ) : (
              <i className="far fa-heart" style={{ color: 'red' }}></i>
            )}
            <span> {likes} likes</span>
          </span>

          <span className="time">
            <i className="fas fa-clock"></i>
            {recipe.time} mins
          </span>
        </div>

        {/* Author Section with Subscribe Button */}
                
        {<div className="author-section">
          <div 
          className="author-info"
          style={{ cursor: 'pointer' }} 
          onClick={() => navigate(`/pprofile/${recipeAuthor.id}`)}
          >
            <img src={recipeAuthor.avatar} alt={recipeAuthor.name} className="author-avatar" />
            <div>
              <h3>{recipeAuthor.name}</h3>
              <p className="author-bio">{recipeAuthor.bio}</p>
            </div>
          </div>
          <button 
            onClick={toggleSubscription}
            className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>}

        {/* Timer Section */}
        <div className="timer-section">
          <h3>Cooking Timer</h3>
          <div className="timer-display">
            {formatTime(timer.elapsed)}
          </div>
          
          <div className="timer-controls">
            {!timer.isRunning ? (
              <button onClick={startTimer} className="timer-button">
                <i className="fas fa-play"></i> Start
              </button>
            ) : (
              <button onClick={pauseTimer} className="timer-button">
                <i className="fas fa-pause"></i> Pause
              </button>
            )}
            <button onClick={resetTimer} className="timer-button">
              <i className="fas fa-redo"></i> Reset
            </button>
          </div>

          {isOvertime && (
            <div className="timer-message">
              <p>You took {overtimeMinutes} minute(s) longer than the recipe time!</p>
            </div>
          )}
        </div>

        <div className="detail-section">
          <h2>Description</h2>
          <p>{recipe.description}</p>
        </div>
        
        <div className="detail-section">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div className="detail-section">
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Comment Section */}
        <div className="comment-section">
          <h2>Comments</h2>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              required
            />
            <button type="submit">Post Comment</button>
          </form>
          
          {/* Comments List */}
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-time">{comment.timestamp}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;