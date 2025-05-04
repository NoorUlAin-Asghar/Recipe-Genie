import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import beepSound from '../assetss/beep.mp3';
import LoadingScreen from '../components/loadingScreen';
import FollowButton from '../components/FollowButton';
import { getRecipe, createComment, toggleLike } from '../api';  // ← Added toggleLike
import '../Home.css';

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

  const [timer, setTimer] = useState({
    isRunning: false,
    startTime: null,
    elapsed: 0,
    totalDuration: recipe?.time * 60 * 1000 || 0,
    hours: Math.floor((recipe?.time || 0) / 60),
    minutes: (recipe?.time || 0) % 60,
    seconds: 0
  });

  // --- Fetch recipe on mount / recipeId change ---
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const res = await getRecipe(recipeId);
        const data = res.data;

        setRecipe({
          id: data._id,
          name: data.title,
          time: data.cookTime,
          serving: data.serving,
          image: data.image,
          description: data.description,
          ingredients: data.ingredients,
          instructions: data.instructions
        });
        setRecipeAuthor(data.author);
        setComments(data.comments);

        // Initialize like state
        setLikes(data.likes);
        // if your API returns a `likedByCurrentUser` flag, use it; otherwise:
        setLiked(data.likesArray?.includes(data.currentUserId) ?? false);
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  // --- Handle like toggle ---
  const handleLikeClick = async () => {
    // 1) Optimistic UI update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(l => newLiked ? l + 1 : l - 1);

    // 2) Persist to backend
    try {
      const res = await toggleLike(recipeId);
      setLikes(res.data.likesCount);
      setLiked(res.data.message === 'Recipe liked');
    } catch (err) {
      console.error('Could not update like on server', err);
      // roll-back on failure
      setLiked(liked);
      setLikes(likes);
    }
  };

  // --- Comment submit ---
  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await createComment(recipeId, { text: newComment.trim() });
      setNewComment('');
      // re-fetch comments (simplest)
      const res = await getRecipe(recipeId);
      setComments(res.data.comments);
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };
  const playBeep = () => new Audio(beepSound).play();

  const resetTimer = () => {
    const durationMs = recipe.time * 60 * 1000;
    setTimer({
      isRunning: false,
      startTime: null,
      elapsed: 0,
      totalDuration: durationMs,
      hours: Math.floor(recipe.time / 60),
      minutes: recipe.time % 60,
      seconds: 0
    });
  };

  const startTimer = () => {
    if (!timer.isRunning) {
      const totalSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
      setTimer(prev => ({
        ...prev,
        isRunning: true,
        startTime: Date.now(),
        totalDuration: totalSeconds * 1000
      }));
    }
  };

  useEffect(() => {
    if (!timer.isRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - timer.startTime;
      const remaining = timer.totalDuration - elapsed;

      setTimer(prev => ({
        ...prev,
        elapsed,
        remainingTime: remaining
      }));

      if (remaining <= 0) {
        clearInterval(interval);
        playBeep();
        setTimer(prev => ({ ...prev, isRunning: false }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.startTime, timer.totalDuration]);

  const formatTime = (ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600).toString().padStart(2, '0');
    const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };


  if (loading) return <LoadingScreen />;
  if (errorMessage) return (
    <div className="profile-page">
      <Navbar/>
      <div className="error-message">
        <h2>Oops!</h2>
        <p>{errorMessage}</p>
      </div>
    </div>
  );

  return (
    <div className="recipe-detail-page">
      <Navbar/>
      <div className="recipe-detail-container">
        <h1>{recipe.name}</h1>
        <img src={recipe.image} alt={recipe.name} className="detail-image" />

        <div className="recipe-meta-detail">
          <span className="likes" onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
            {liked 
              ? <><i className="fas fa-heart" style={{ color: 'red' }} /> LIKED!</>
              : <i className="far fa-heart" style={{ color: 'red' }} />
            }
            <span> {likes} likes</span>
          </span>
          <span className="time">
            <i className="fas fa-clock" />
            {recipe.time} mins
          </span>
          <span className="time"><i className="fas fa-clock"></i> {recipe.time} mins</span>
        </div>

        {/* Author Section */}
        <div className="author-section">
          <div 
            className="author-info" 
            onClick={() => navigate(`/profile/${recipeAuthor.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img src={recipeAuthor.profilePicture} alt={recipeAuthor.name} className="author-avatar"/>
            <div className="author-details">
              <span className="author-name">{recipeAuthor.name}</span>
              <span className="author-username">@{recipeAuthor.username}</span>
              <p className="author-bio">{recipeAuthor.bio}</p>
            </div>
          </div>
          <FollowButton targetUserId={recipeAuthor.id} isOwner={false}/>
        </div>

        {/* Timer, Description, Ingredients, Instructions omitted for brevity */}

        {/* Comments */}
        <div className="comment-section">
          <h2>Comments</h2>
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea 
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              required
            />
            <button type="submit">Post Comment</button>
          </form>
          <div className="comments-list">
            {comments.length 
              ? comments.map(c => (
                  <div key={c.id} className="comment">
                    <img src={c.author.profilePicture} alt={c.author.username} className="comment-avatar"/>
                    <div>
                      <strong>{c.author.name}</strong> @{c.author.username}
                      <p>{c.text}</p>
                      <small>{new Date(c.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                ))
              : <p>No comments yet. Be the first!</p>
            }
        <div className="author-section">
          <div className="author-info" style={{ cursor: 'pointer' }} onClick={() => navigate(`/pprofile/${recipeAuthor.id}`)}>
            <img src={recipeAuthor.avatar} alt={recipeAuthor.name} className="author-avatar" />
            <div>
              <h3>{recipeAuthor.name}</h3>
              <p className="author-bio">{recipeAuthor.bio}</p>
            </div>
          </div>
          <button onClick={toggleSubscription} className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}>
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        <div className="timer-section">
          <h3>Cooking Timer</h3>
          <div className="timer-inputs">
            <input type="number" value={timer.hours} min="0" max="99" onChange={e => setTimer({ ...timer, hours: parseInt(e.target.value) || 0 })} />
            <span>:</span>
            <input type="number" value={timer.minutes} min="0" max="59" onChange={e => setTimer({ ...timer, minutes: parseInt(e.target.value) || 0 })} />
            <span>:</span>
            <input type="number" value={timer.seconds} min="0" max="59" onChange={e => setTimer({ ...timer, seconds: parseInt(e.target.value) || 0 })} />
          </div>

          <div className="timer-display">{formatTime(timer.isRunning ? timer.totalDuration - timer.elapsed : timer.totalDuration)}</div>
          <div className="timer-controls">
            {!timer.isRunning ? (
              <button onClick={startTimer} className="timer-button"><i className="fas fa-play"></i> Start</button>
            ) : (
              <button onClick={() => setTimer({ ...timer, isRunning: false })} className="timer-button"><i className="fas fa-pause"></i> Pause</button>
            )}
            <button onClick={resetTimer} className="timer-button"><i className="fas fa-redo"></i> Reset</button>
          </div>
        </div>

        <div className="detail-section">
          <h2>Description</h2>
          <p>{recipe.description}</p>
        </div>

        <div className="detail-section">
          <h2>Ingredients</h2>
          <ul>{recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
        </div>

        <div className="detail-section">
          <h2>Instructions</h2>
          <ol>{recipe.instructions.map((step, idx) => <li key={idx}>{step}</li>)}</ol>
        </div>

        <div className="comment-section">
          <h2>Comments</h2>
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..." required />
            <button type="submit">Post Comment</button>
          </form>
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <strong>{comment.author}</strong>
                <span className="timestamp"> — {comment.timestamp}</span>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecipeDetail;
