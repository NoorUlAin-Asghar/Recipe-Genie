import { useNavigate } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
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

  // --- Timer & comment states ---
  const [newComment, setNewComment] = useState('');
  const [timer, setTimer] = useState({ isRunning:false, startTime:null, elapsed:0, totalDuration:0 });

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
