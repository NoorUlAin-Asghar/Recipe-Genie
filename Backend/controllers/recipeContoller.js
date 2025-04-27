const Recipe=require('../models/recipeModel')
const Comment = require('../models/commentModel')
const User = require('../models/userModel')
const mongoose=require('mongoose') 

//GET all recipes
const getAllRecipes= async(req,res)=>{
    console.log('get all my recipes')
    const userId=req.user._id
    try {
        const recipes = await Recipe.find({author:userId})
          .sort({ createdAt: -1 })
          .select('title likes cookTime') // Only select these fields
        
        if (!recipes || recipes.length===0) {
            console.log('No recipes exist');
            return res.status(404).json({ error: 'No recipes exist' });

        } else {
           // Loop through each recipe to convert the likes array to a number
            const formattedRecipes = recipes.map(recipe => ({
            ...recipe.toObject(), // Convert Mongoose document to a plain object
            likes: recipe.likes.length // Replace the 'likes' array with the count
            }));

            res.status(200).json(formattedRecipes);
            console.log('Got all recipes successfully', formattedRecipes);
        }
      } catch (error) {
        console.error('Error getting all recipes:', error);
        res.status(500).json({ error: 'Server error while getting all recipes' });
      }
}

//GET a single recipe
const getRecipe= async(req,res)=>{
    const { recipeId } = req.params;
        if(!mongoose.Types.ObjectId.isValid(recipeId)){
            console.error('Incorrect Id');
            return res.status(400).json({error: 'No such recipe'});
        }
    
        try {
            const recipe = await Recipe.findById(recipeId)
            .populate({
                path: 'comments',
                select: 'text createdAt author', // only select these fields from each comme
                populate: {
                path: 'author',
                select: 'username' // or email, name, etc.
                }
            })
            .populate('author', 'username'); // if you also want the recipe creator
    
            if (!recipe || recipe.length===0) {
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
            res.status(500).json({ error: 'Server error while fetching recipe details' });
        }
}

//GET a recipe by title
const getRecipeByTitle = async (req, res) => {
    const { title } = req.query;
  
    try {
        const recipes = await Recipe.find({
            title: { $regex: new RegExp(`(^|\\s)${title}`, 'i')} // 'i' makes it case-insensitive
        })
        .sort({createdAt: -1})
        .select('title likes cookTime image'); // Only select these fields
        if(!recipes || recipes.length===0){
            console.log('no recipe exists by title',title);
            return res.status(404).json({error: 'No such recipe'});
        }
        else{
            const formattedRecipes = recipes.map(recipe => ({
                _id: recipe._id,
                title: recipe.title,
                cookTime: recipe.cookTime,
                likesCount: recipe.likes.length,
                image:recipe.image
              }));
        
            res.status(200).json(formattedRecipes);
            console.log('Got recipe by title successfully',title);
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error while getting recipe by title' });
        console.error('error getting recipe by title');
    }
};

//GET top 10 recipes
const getPopularRecipes = async (req, res) => {
    console.log('get popular recipes')
    try {
      const popularRecipes = await Recipe.aggregate([
        {
          $addFields: {
            likesCount: { $size: "$likes" } // Convert likes array to count
          }
        },
        { $sort: { likesCount: -1 } },     // Sort by likes (descending)
        { $limit: 10 },                     // Get only top 10
        {
          $project: {                       // Shape the response
            title: 1,
            image: 1,
            cookTime: 1,
            likesCount: 1
          }
        }
      ]);
      if (!popularRecipes){
            console.log('no recipe exists by title',title);
            return res.status(404).json({error: 'No recipes'});
      }
  
      res.status(200).json(popularRecipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top recipes" });
    }
  };

//CREATE a new recipe
const createRecipe = async (req,res)=>{
    console.log("creating recipe",req.body)
    const userId=req.user._id
    const { 
        name: title, // Map 'name' from frontend to 'title' in backend
        description, 
        time: cookTime, // Map 'time' to 'cookTime'
        serving,
        ingredients, 
        instructions
    } = req.body;

    
    //add recipe to DB
    try {
        const newRecipe = await Recipe.create({
            title,
            author: userId,
            description,
            cookTime,
            serving,
            ingredients: JSON.parse(ingredients), // Parse the stringified array
            instructions: JSON.parse(instructions), // Parse the stringified array
            image: req.file?.path // File path if uploaded
        });
        res.status(201).json(newRecipe);
        console.log('Created recipe successfully',newRecipe);
    }catch(error){
        console.error('error creating recipe: ',error);
        res.status(500).json({ error: 'Server error while creating a recipe' });
    }
}

//DELETE a recipe
const deleteRecipe=async(req,res)=>{
    const {recipeId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(recipeId)){
        console.error('Incorrect Id');
        return res.status(400).json({error: 'No such recipe'});
    }
    try{
        const recipe=await Recipe.findByIdAndDelete(recipeId);
        if(recipe){
            res.status(200).json(recipe);
            console.log('Deleted recipe successfully',recipe);
        }
        else{
            console.error('No recipe exists');
            return res.status(404).json({error: 'No such recipe'});
        }
    }
    catch(error){
        console.error('error deleting recipe: ',error);
        res.status(500).json({ error: 'Server error while deleting recipe' });
    }

}

//UPDATE a recipe
const updateRecipe=async(req,res)=>{
    const {recipeId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(recipeId)){
        console.error('Incorrect Id');
        return res.status(400).json({error: 'No such recipe'});
    }
    try{
        const recipe=await Recipe.findByIdAndUpdate(
            recipeId,
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
    catch(error){
        console.error('error updating recipe: ',error);
        res.status(500).json({ error: 'Server error while updating recipe' });
    }

}

module.exports={
    createRecipe,
    getAllRecipes,
    getRecipe,
    getRecipeByTitle,
    getPopularRecipes,
    deleteRecipe,
    updateRecipe
}