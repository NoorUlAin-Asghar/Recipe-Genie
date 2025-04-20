const Recipe=require('../models/recipeModel')
const Comment = require('../models/commentModel')
const User = require('../models/userModel')
const mongoose=require('mongoose') 

//GET all recipes
const getAllRecipes= async(req,res)=>{
    try {
        const recipes = await Recipe.find({})
          .sort({ createdAt: -1 })
          .select('title likes cookTime') // Only select these fields
        
        if (recipes) {
            // Loop through each recipe to convert the likes array to a number
            const formattedRecipes = recipes.map(recipe => ({
                ...recipe.toObject(), // Convert Mongoose document to a plain object
                likes: recipe.likes.length // Replace the 'likes' array with the count
            }));
    
          res.status(200).json(formattedRecipes);
          console.log('Got all recipes successfully', formattedRecipes);
        } else {
          console.log('No recipes exist');
          return res.status(404).json({ error: 'No recipes exist' });
        }
      } catch (error) {
        console.error('Error getting all recipes:', error);
        res.status(400).json({ error: 'Error getting all recipes' });
      }
}

//GET a single recipe
const getRecipe= async(req,res)=>{
    const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            console.error('Incorrect Id');
            return res.status(400).json({error: 'No such recipe'});
        }
    
        try {
            const recipe = await Recipe.findById(id)
            .populate({
                path: 'comments',
                select: 'text createdAt author', // only select these fields from each comme
                populate: {
                path: 'author',
                select: 'username' // or email, name, etc.
                }
            })
            .populate('author', 'username'); // if you also want the recipe creator
    
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }
            // Convert likes array to the number of likes (length of the array)
            const recipeWithLikesCount = {
                ...recipe.toObject(), // Convert Mongoose document to a plain object
                likes: recipe.likes.length // Replace the 'likes' array with the count
            };
            res.status(200).json(recipeWithLikesCount);
            console.log('Got recipe details with comments successfully')
        } catch (error) {
            console.error('Error fetching recipe details:', error);
            res.status(400).json({ error: error.message });
        }
}

//GET a recipe by title
const getRecipeByTitle = async (req, res) => {
    const { title } = req.query;
  
    try {
        const recipes = await Recipe.find({
            title: { $regex: new RegExp(title, 'i') } // 'i' makes it case-insensitive
        })
        .sort({createdAt: -1})
        .select('title likes cookTime'); // Only select these fields
        if(recipes){
            const formattedRecipes = recipes.map(recipe => ({
                _id: recipe._id,
                title: recipe.title,
                cookTime: recipe.cookTime,
                likesCount: recipe.likes.length
              }));
        
            res.status(200).json(formattedRecipes);
            console.log('Got recipe by title successfully',title);
        }
        else{
            console.log('no recipe exists by title',title);
            return res.status(404).json({error: 'No such recipe'});
        }
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error('error getting recipe by title');
    }
};

//CREATE a new recipe
const createRecipe = async (req,res)=>{
    const {title,author,ingredients,instructions}=req.body;
    
    //add recipe to DB
    try {
        const newRecipe=await Recipe.create({title,author,ingredients,instructions}) ;
        res.status(201).json(newRecipe);
        console.log('Created recipe successfully',newRecipe);
    }catch(error){
        console.error('error creating recipe: ',error);
        res.status(400).json({error:error.message});
    }
}

//DELETE a recipe
const deleteRecipe=async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        console.error('Incorrect Id');
        return res.status(400).json({error: 'No such recipe'});
    }
    const recipe=await Recipe.findOneAndDelete({_id:id});
    if(recipe){
        res.status(200).json(recipe);
        console.log('Deleted recipe successfully',recipe);
    }
    else{
        console.error('No recipe exists');
        return res.status(404).json({error: 'No such recipe'});
    }

}

//UPDATE a recipe
const updateRecipe=async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        console.error('Incorrect Id');S
        return res.status(400).json({error: 'No such recipe'});
    }
    const recipe=await Recipe.findByIdAndUpdate(
        {_id:id},
        {...req.body},
        { new: true, runValidators: true } // Return updated doc and validate inputs
    );
    
    if(recipe){
        res.status(200).json(recipe);
        console.log('Updated recipe successfully',recipe);
    }
    else{
        console.error('No recipe exists');
        return res.status(404).json({error: 'No such recipe'});
    }

}

module.exports={
    createRecipe,
    getAllRecipes,
    getRecipe,
    getRecipeByTitle,
    deleteRecipe,
    updateRecipe
}