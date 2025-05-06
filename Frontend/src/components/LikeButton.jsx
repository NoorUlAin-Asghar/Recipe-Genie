import React, { useState, useEffect } from 'react';
import { getLikeStatus,toggleLike } from '../api';
import '../Home.css';

const LikeButton = ({ recipeId, likeCount, onLikeChange}) => {
   const [likeStatus, setLikeStatus] = useState(false);
   const [likes, setLikes] = useState(0);
   const [actionText, setActionText] = useState('');
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLike = async () => {
      try {
        const status = await getLikeStatus(recipeId);
        setLikeStatus(status.data);
      } catch (err) {
        console.error("Failed to get like status", err);
      } finally {
        setLoading(false);
      }
    };

    setLikes(likeCount);
    checkLike();
  }, [recipeId]);

  useEffect(() => {
      console.log('Like Status: ', likeStatus);
    }, [likeStatus]);


    // Handle like toggle
    const handleLikeClick = async (e) => {
        e.stopPropagation(); // prevents parent click (like <Link>)
        e.preventDefault();  // prevents navigation
        try {
            setLoading(true);
            const res = await toggleLike(recipeId);
            console.log(res)
        
            const newStatus = !likeStatus;
            setLikeStatus(newStatus);
            const newLikes = newStatus ? likes + 1 : likes - 1;
            setLikes(newLikes);
            setActionText(newStatus ? 'LIKED!' : 'UNLIKED!');
            if (onLikeChange) onLikeChange(recipeId, newLikes);
        } catch (err) {
            console.error('Could not update like:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (actionText) {
          const timer = setTimeout(() => {
            setActionText('');
          }, 1000); // 1000 ms = 1 sec
      
          return () => clearTimeout(timer); // Cleanup if component unmounts or actionText changes early
        }
      }, [actionText]);

  return (
    <span className="likes" onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
        {loading ? '...' : likeStatus
            ? <><i className="fas fa-heart" style={{ color: 'red' }} /> {actionText}</>
            : <><i className="far fa-heart" style={{ color: 'red' }} /> {actionText}</>
        }
        <span> {likes} likes</span>
    </span>
  );
};

export default LikeButton;
