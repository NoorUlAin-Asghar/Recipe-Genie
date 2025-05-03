import { useNavigate } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import LoadingScreen from '../components/loadingScreen'
import FollowButton from '../components/FollowButton';
import { getRecipe, createComment} from '../api';
import '../Home.css';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [timer, setTimer] = useState({
    isRunning: false,
    startTime: null,
    elapsed: 0,
    totalDuration: 0
  });
  const [recipeAuthor, setRecipeAuthor] = useState({
    id: '',
    name: '',
    bio: '',
    avatar: '',
  });
  const [recipe,setRecipe]=useState({
    id: '', 
    name: '', 
    likes: 0, 
    time: 0,
    serving: 0,
    image: '',
    description: '',
    ingredients: [],
    instructions: []
  });
  const [loading, setLoading] = useState(true);   // Loading state to track data fetching
  const [errorMessage, setErrorMessage] = useState('');
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
  
        } catch (error) {
          console.error('Failed to fetch recipe:', error);
          setErrorMessage(error?.response?.data?.message || 'Failed to load recipe');
        } finally {
          setLoading(false);
        }
      };

    fetchRecipe();
  }, [recipeId]);
 

  const [liked, setLiked] = useState(() => {
    const savedLikes = JSON.parse(localStorage.getItem('recipeLikes') || '{}');
    return savedLikes[recipeId] || false;
  });
  const [likes, setLikes] = useState(recipe.likes);


  const handleLikeClick = () => {
    const savedLikes = JSON.parse(localStorage.getItem('recipeLikes') || '{}');
    const newLikedState = !liked;
    
    // Update localStorage
    localStorage.setItem('recipeLikes', JSON.stringify({
      ...savedLikes,
      [recipeId]: newLikedState
    }));
  
    // Update state
    setLiked(newLikedState);
    setLikes(prevLikes => newLikedState ? prevLikes + 1 : prevLikes - 1);
  };
  useEffect(() => {
    const savedLikesCount = JSON.parse(localStorage.getItem('recipeLikesCount') || '{}');
    localStorage.setItem('recipeLikesCount', JSON.stringify({
      ...savedLikesCount,
      [recipeId]: likes
    }));
  }, [likes, recipeId]);

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

  const handleCommentSubmit = async (e) => {
    console.log(newComment)
    if (!newComment.trim()) return;
    try {
      //Prepare and send data
      const formattedComment ={'text': newComment.trim()}
      console.log(formattedComment)
  
      const response = await createComment(recipeId, formattedComment);
      console.log(response);
      setNewComment('');
    }
    catch (error) {
      console.error('Failed to post comment:', error);
      // Optionally show an error message to the user
    }
  };

  useEffect(() => {
    console.log('Comment: ', newComment);
  }, [newComment]);

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
          <FollowButton targetUserId={recipeAuthor.id} isOwner={isOwner} />
        </div>

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