const express=require('express')
const {
    createRecipe,
    // getAllMyRecipes,
    getRecipe,
    getRecipeByTitle,
    getPopularRecipes,
    getAllRecipesOfAUser,
    deleteRecipe,
    updateRecipe

}=require('../controllers/recipeContoller')
const router=express.Router()
const {verifyToken}=require('../middleware/authMiddleware')
const upload = require('../config/multer'); 

router.use(verifyToken)

//GET recipe by title
router.get('/search/by-title', getRecipeByTitle);

router.get('/popular',getPopularRecipes)

//GET a single recipe (gets all detail + comments on the recipe +author details)
router.get('/:recipeId',getRecipe)

//GET all recipes of a specific user
router.get('/userRecipes/:userId',getAllRecipesOfAUser)

//POST a single recipe 
router.post('/',upload.single('image'),createRecipe);

//DELETE a single recipe
router.delete('/:recipeId',upload.single('image'),deleteRecipe)

//UPDATE a single recipe
router.patch('/:recipeId',upload.single('image'),updateRecipe)


module.exports=router