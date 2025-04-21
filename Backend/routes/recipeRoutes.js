const express=require('express')
const {
    createRecipe,
    getAllRecipes,
    getRecipe,
    getRecipeByTitle,
    deleteRecipe,
    updateRecipe

}=require('../controllers/recipeContoller')
const router=express.Router()

//GET all recipes
router.get('/',getAllRecipes)

//GET a single recipe (gets all detail + comments on the recipe
router.get('/:recipeId',getRecipe)

//GET recipe by title
router.get('/search/by-title', getRecipeByTitle);


//POST a single recipe 
router.post('/',createRecipe);

//DELETE a single recipe
router.delete('/:recipeId',deleteRecipe)

//UPDATE a single recipe
router.patch('/:recipeId',updateRecipe)


module.exports=router