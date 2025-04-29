const express=require('express')
const {
    createRecipe,
    getAllRecipes,
    getRecipe,
    getRecipeByTitle,
    getPopularRecipes,
    deleteRecipe,
    updateRecipe

}=require('../controllers/recipeContoller')
const router=express.Router()
const {verifyToken}=require('../middleware/authMiddleware')
const upload = require('../config/multer'); 

router.use(verifyToken)

//GET all my recipes
router.get('/myRecipes',getAllRecipes)

//GET recipe by title
router.get('/search/by-title', getRecipeByTitle);

router.get('/popular',getPopularRecipes)

//GET a single recipe (gets all detail + comments on the recipe
router.get('/:recipeId',getRecipe)


//POST a single recipe 
router.post('/',upload.single('image'),createRecipe);

//DELETE a single recipe
router.delete('/:recipeId',upload.single('image'),deleteRecipe)

//UPDATE a single recipe
router.patch('/:recipeId',upload.single('image'),updateRecipe)


module.exports=router