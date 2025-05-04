const express = require('express');
const { toggleLike } = require('../controllers/likeController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/recipes/:recipeId/like
router.post('/:recipeId/like', verifyToken, toggleLike);

module.exports = router;
