// components/FollowButton.js
import React, { useState, useEffect } from 'react';
import { followUser, unfollowUser, followingStatus } from '../api';
import '../Home.css';

const FollowButton = ({ targetUserId, isOwner , show=false}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton]=useState(true);
  useEffect(() => {
    const checkFollow = async () => {
      try {
        const status = await followingStatus(targetUserId);
        setIsFollowing(status.data.isFollowing);
      } catch (err) {
        console.error("Failed to get following status", err);
      } finally {
        setLoading(false);
      }
    };

    if (targetUserId && isOwner!==targetUserId) {
      checkFollow();
    }
    if(isOwner===targetUserId){
      setShowButton(false)
    }
  }, [targetUserId, isOwner]);

  useEffect(() => {
      console.log('Following Status: ', isFollowing);
    }, [isFollowing]);


  const toggleSubscription = async () => {
    try {
      setLoading(true);
      if (isFollowing) {
        await unfollowUser(targetUserId);
        setIsFollowing(false);
      } else {
        await followUser(targetUserId);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Failed to toggle follow state", err);
    } finally {
      setLoading(false);
    }
  };

  // if (isOwner) return null;
  if(!showButton)
    return

  return (
    <button
      onClick={toggleSubscription}
      disabled={loading}
      className={`subscribe-btn ${isFollowing ? 'following' : ''}`}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
