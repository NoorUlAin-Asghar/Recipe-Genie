
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import LoadingScreen from '../components/loadingScreen';
import FollowButton from '../components/FollowButton';
import { getRecipe, createComment, toggleLike } from '../api';
import '../Home.css';
import beepSound from '../assetss/beep.mp3';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  // --- Data states ---
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [recipeAuthor, setRecipeAuthor] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // --- Like states ---
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [actionText, setActionText] = useState('');

  // --- Comment state ---
  const [newComment, setNewComment] = useState('');

  // --- Timer states ---
  const [timer, setTimer] = useState({
    isRunning: false,
    startTime: null,
    elapsed: 0,
    totalDuration: 0,
    remainingTime: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [currentUserId, setCurrentUserId] = useState('');
  const isOwner = currentUserId === recipeAuthor.id;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
      if(user?.data?.userid){
        setCurrentUserId(user.data.userid);
      }
    }, []);
    useEffect(() => {
      const fetchRecipe = async () => {
        try {
          if (!recipeId) return;
          
          setLoading(true);
          console.log("Fetching recipe:", recipeId);
          
          const response = await getRecipe(recipeId)
          console.log(response)
          const recipeResponse = {
            name: response.data.title,
            likes: response.data.likes,
            time: response.data.cookTime,
            serving: response.data.serving,
            image: response.data.image,
            description: response.data.description,
            ingredients: response.data.ingredients,
            instructions: response.data.instructions,
          };
          const authorResponse={
            id:response.data.author.id,
            name: response.data.author.name,
            username: response.data.author.username,
            avatar: response.data.author.profilePicture,
            bio: response.data.author.bio
          };
  
          setRecipe(recipeResponse);
          setRecipeAuthor(authorResponse);
          setComments(response.data.comments);
                  
          // likes
          setLikes(response.data.likesCount ?? response.data.likes);
          setLiked(response.data.likedByCurrentUser ?? response.data.likesArray?.includes(response.data.currentUserId) ?? false);
          // initialize timer from cookTime
          const hrs = Math.floor((response.data.cookTime || 0) / 60);
          const mins = (response.data.cookTime || 0) % 60;
          const totalMs = ((hrs * 3600) + (mins * 60)) * 1000;
          setTimer({
            isRunning: false,
            startTime: null,
            elapsed: 0,
            totalDuration: totalMs,
            remainingTime: totalMs,
            hours: hrs,
            minutes: mins,
            seconds: 0
          });
        } catch (error) {
          console.error('Failed to fetch recipe:', error);
          setErrorMessage(error?.response?.data?.message || 'Failed to load recipe');
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    }, [recipeId]);

  // Handle like toggle
  const handleLikeClick = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(l => newLiked ? l + 1 : l - 1);
    try {
      const res = await toggleLike(recipeId);
      const { likesCount, message } = res.data;
      setLikes(likesCount);
      const likedNow = message === 'Recipe liked';
      setLiked(likedNow);
      setActionText(likedNow ? 'LIKED!' : 'UNLIKED!');
    } catch (err) {
      console.error('Could not update like:', err);
      setLiked(liked);
      setLikes(likes);
    }
  };

  // Handle comment submit
  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await createComment(recipeId, { text: newComment.trim() });
      setNewComment('');
      const res = await getRecipe(recipeId);
      setComments(res.data.comments);
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  // Timer controls
  const playBeep = () => new Audio(beepSound).play();

  const startTimer = () => {
    if (!timer.isRunning) {
      const totalSec = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
      const totalMs = totalSec * 1000;
      setTimer(prev => ({
        ...prev,
        isRunning: true,
        startTime: Date.now(),
        totalDuration: totalMs,
        remainingTime: totalMs
      }));
    }
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    const totalSec = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
    const totalMs = totalSec * 1000;
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      startTime: null,
      elapsed: 0,
      totalDuration: totalMs,
      remainingTime: totalMs
    }));
  };

  // Timer effect
  useEffect(() => {
    if (!timer.isRunning) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - timer.startTime;
      const remaining = timer.totalDuration - elapsed;
      if (remaining <= 0) {
        clearInterval(interval);
        playBeep();
        setTimer(prev => ({ ...prev, isRunning: false, remainingTime: 0 }));
      } else {
        setTimer(prev => ({ ...prev, elapsed, remainingTime: remaining }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.startTime, timer.totalDuration]);

  const formatTime = ms => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = String(Math.floor(total / 3600)).padStart(2, '0');
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (loading) return <LoadingScreen />;
  if (errorMessage) return (
    <div className="profile-page">
      <Navbar />
      <div className="error-message">
        <h2>Oops!</h2><p>{errorMessage}</p>
      </div>
    </div>
  );

  return (
    <div className="recipe-detail-page">
      <Navbar />
      <div className="recipe-detail-container">
        <h1>{recipe.name}</h1>
        <img src={recipe.image} alt={recipe.name} className="detail-image" />

        <div className="recipe-meta-detail">
          <span className="likes" onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
            {liked
              ? <><i className="fas fa-heart" style={{ color: 'red' }} /> {actionText}</>
              : <><i className="far fa-heart" style={{ color: 'red' }} /> {actionText}</>
            }
            <span> {likes} likes</span>
          </span>
          <span className="recipe-time"><i className="fas fa-clock" /> {recipe.time} mins</span>
        </div>

        {/* Timer Section with editable inputs */}
        <div className="timer-section">
          <h3>Cooking Timer</h3>
          <div className="timer-inputs">
            <input
              type="number"
              value={timer.hours}
              min="0"
              max="99"
              onChange={e => setTimer({ ...timer, hours: parseInt(e.target.value) || 0 })}
            />
            <span>:</span>
            <input
              type="number"
              value={timer.minutes}
              min="0"
              max="59"
              onChange={e => setTimer({ ...timer, minutes: parseInt(e.target.value) || 0 })}
            />
            <span>:</span>
            <input
              type="number"
              value={timer.seconds}
              min="0"
              max="59"
              onChange={e => setTimer({ ...timer, seconds: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="timer-display">{formatTime(timer.isRunning ? timer.remainingTime : timer.totalDuration)}</div>
          <div className="timer-controls">
            {!timer.isRunning
              ? <button onClick={startTimer} className="timer-button"><i className="fas fa-play" /> Start</button>
              : <button onClick={pauseTimer} className="timer-button"><i className="fas fa-pause" /> Pause</button>
            }
            <button onClick={resetTimer} className="timer-button"><i className="fas fa-redo" /> Reset</button>
          </div>
        </div>

          {/* Author Section with Subscribe Button */}
                
          <div className="author-section">
          <div className="author-info" onClick={() => navigate(`/profile/${recipeAuthor.id}`)} style={{ cursor: 'pointer' }}>
            <img src={recipeAuthor.avatar} alt={recipeAuthor.name} className="author-avatar" />
            <div className="author-details">
              <div className="author-name-line">
                <span className="author-name">{recipeAuthor.name}</span>
                <span className="author-username">@{recipeAuthor.username}</span>
              </div>
              <p className="author-bio">{recipeAuthor.bio}</p>
            </div>
          </div>
          <FollowButton targetUserId={recipeAuthor.id} isOwner={currentUserId} />
        </div>
        
        {/*Recipe Detail Section*/}
        <div className="detail-section">
          <h2>Description</h2>
          <p>{recipe.description}</p>
        </div>

        <div className="detail-section">
          <h2>Serving</h2>
          <p>{recipe.serving}</p>
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
                  <div className="comment-header" onClick={() => navigate(`/profile/${comment.author.id}`)} style={{ cursor: 'pointer' }}>
                    <img 
                      src={comment.author.profilePicture} 
                      alt={comment.author.username} 
                      className="comment-avatar" 
                    />
                    <div className="comment-content-wrapper">
                      <div className="comment-top-row">
                        <div className="author-info-wrapper">
                          <div className="author-info">
                            <span className="comment-author">{comment.author.name}</span>
                            <span className="comment-username">@{comment.author.username}</span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                        <span className="comment-time">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
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
