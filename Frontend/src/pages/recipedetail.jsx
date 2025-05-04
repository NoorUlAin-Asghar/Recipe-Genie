import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import beepSound from '../assetss/beep.mp3';
import '../Home.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dummyRecipes = [
    {
      id: 1,
      name: 'Chicken Curry',
      authorId: 1,
      likes: 100,
      time: 30,
      image: require('../assetss/images/chh.jpg'),
      description: 'Delicious spicy chicken curry with aromatic spices',
      ingredients: ['Chicken', 'Onion', 'Tomato', 'Ginger', 'Garlic', 'Spices'],
      instructions: ['Marinate chicken', 'Sauté onions', 'Add tomatoes', 'Cook with spices']
    },
  ];

  const recipeAuthor = {
    id: 1,
    name: 'Chef Raj',
    bio: 'Professional chef with 10 years of experience',
    avatar: require('../assetss/images/biryani.png')
  };

  const recipe = dummyRecipes.find(r => r.id === parseInt(id));
  const [liked, setLiked] = useState(() => JSON.parse(localStorage.getItem('recipeLikes') || '{}')[id] || false);
  const [likes, setLikes] = useState(() => JSON.parse(localStorage.getItem('recipeLikesCount') || '{}')[id] || (recipe?.likes ?? 0));
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [timer, setTimer] = useState({
    isRunning: false,
    startTime: null,
    elapsed: 0,
    totalDuration: recipe?.time * 60 * 1000 || 0,
    hours: Math.floor((recipe?.time || 0) / 60),
    minutes: (recipe?.time || 0) % 60,
    seconds: 0
  });

  useEffect(() => {
    const savedSubs = JSON.parse(localStorage.getItem('subscriptions')) || [];
    setIsSubscribed(savedSubs.some(chef => chef.id === recipeAuthor.id));
  }, [recipeAuthor.id]);

  const handleLikeClick = () => {
    const updatedLikes = !liked;
    setLiked(updatedLikes);
    setLikes(prev => updatedLikes ? prev + 1 : prev - 1);

    const savedLikes = JSON.parse(localStorage.getItem('recipeLikes') || '{}');
    const savedLikesCount = JSON.parse(localStorage.getItem('recipeLikesCount') || '{}');

    localStorage.setItem('recipeLikes', JSON.stringify({ ...savedLikes, [id]: updatedLikes }));
    localStorage.setItem('recipeLikesCount', JSON.stringify({ ...savedLikesCount, [id]: updatedLikes ? likes + 1 : likes - 1 }));
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments(prev => [
        ...prev,
        { id: Date.now(), text: newComment, author: 'You', timestamp: new Date().toLocaleString() }
      ]);
      setNewComment('');
    }
  };

  const toggleSubscription = () => {
    const savedSubs = JSON.parse(localStorage.getItem('subscriptions')) || [];
    const updated = isSubscribed
      ? savedSubs.filter(chef => chef.id !== recipeAuthor.id)
      : [...savedSubs, recipeAuthor];

    localStorage.setItem('subscriptions', JSON.stringify(updated));
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
            {liked ? <i className="fas fa-heart" style={{ color: 'red' }} /> : <i className="far fa-heart" style={{ color: 'red' }} />}
            <span> {liked ? 'LIKED!' : ''} {likes} likes</span>
          </span>
          <span className="time"><i className="fas fa-clock"></i> {recipe.time} mins</span>
        </div>

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
