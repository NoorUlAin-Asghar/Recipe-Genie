const Recipe = require('../models/recipeModel');
const mongoose = require('mongoose');

const toggleLike = async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.userId; // From auth middleware

  // Validate recipe ID
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ error: 'Invalid Recipe ID' });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const alreadyLiked = recipe.likedBy.includes(userId);

    if (alreadyLiked) {
      // Unlike: Remove user and decrement count
      recipe.likedBy.pull(userId);
      recipe.likes -= 1;
    } else {
      // Like: Add user and increment count
      recipe.likedBy.push(userId);
      recipe.likes += 1;
    }

    await recipe.save();
    res.status(200).json({
      liked: !alreadyLiked,
      likes: recipe.likes,
      message: alreadyLiked ? 'Recipe unliked' : 'Recipe liked'
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { toggleLike };