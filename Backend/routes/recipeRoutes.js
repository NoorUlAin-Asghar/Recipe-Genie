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

//GET a single recipe
router.get('/:id',getRecipe)

//GET recipe by title
router.get('/search/by-title', getRecipeByTitle);

//POST a single recipe 
router.post('/',createRecipe);

//DELETE a single recipe
router.delete('/:id',deleteRecipe)

//UPDATE a single recipe
router.patch('/:id',updateRecipe)


module.exports=router