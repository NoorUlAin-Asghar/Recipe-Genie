const express = require('express');
const {
    createRecipe,
    getRecipe,
    getRecipeByTitle,
    getPopularRecipes,
    getAllRecipesOfAUser,
    deleteRecipe,
    updateRecipe,
    likeRecipe
} = require('../controllers/recipeContoller');  

const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// Middleware to verify token for every route
router.use(verifyToken);

// GET recipe by title
router.get('/search/by-title', getRecipeByTitle);

// GET popular recipes
router.get('/popular', getPopularRecipes);

// GET a single recipe (includes all details, comments, and author details)
router.get('/:recipeId', getRecipe);

// GET all recipes of a specific user
router.get('/userRecipes/:userId', getAllRecipesOfAUser);

// POST a new recipe (with image upload)
router.post('/', upload.single('image'), createRecipe);

// DELETE a specific recipe
router.delete('/:recipeId', upload.single('image'), deleteRecipe);

// UPDATE a specific recipe
router.patch('/:recipeId', upload.single('image'), updateRecipe);

// POST to like/unlike a recipe (toggling like)
router.post('/:recipeId/like', likeRecipe);

module.exports = router;
