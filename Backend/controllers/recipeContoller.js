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
          .select('title cookTime image likes') // Only select these fields
        
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
    console.log('getting a single recipe')
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
                console.log('Recipe not found')
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
        title, // Map 'name' from frontend to 'title' in backend
        description, 
        cookTime, // Map 'time' to 'cookTime'
        serving,
        ingredients, 
        instructions
    } = req.body;
    // Define a default logo URL
    const defaultLogo = "http://localhost:3000/uploads/default-logo.png"; // Path to your default logo
    
    //add recipe to DB
    try {
        // Construct the full image URL for frontend use
        const imagePath = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : defaultLogo;

        const newRecipe = await Recipe.create({
            title,
            author: userId,
            description,
            cookTime,
            serving,
            ingredients: JSON.parse(ingredients), // Parse the stringified array
            instructions: JSON.parse(instructions), // Parse the stringified array
            image: imagePath// File path if uploaded
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
const updateRecipe = async (req, res) => {
    const defaultImage = "http://localhost:3000/uploads/default-recipe.png"; // Path to your default image

    try {
        const recipeId=req.params.recipeId;
        console.log(recipeId);
        const ingredients = JSON.parse(req.body.ingredients);
        const instructions = JSON.parse(req.body.instructions);

        const {title, description, cookTime, serving} = req.body;

        // Check if recipeId is valid
        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            console.error('Incorrect Id');
            return res.status(400).json({ error: 'No such recipe' });
        }

        const recipe = await Recipe.findById(recipeId);


        if (!recipe) {
            console.error('No recipe exists');
            return res.status(404).json({ error: 'No such recipe' });
        }

        // Build update object
        const updateData = {
            title,
            description,
            cookTime,
            serving,
            ingredients,
            instructions,
            author: req.user._id // Ensure the recipe is updated by the logged-in user
        };

        if (req.file) {
            // If a new image is uploaded
            updateData.image = `http://localhost:3000/uploads/${req.file.filename}`;
        } else if (!recipe.image) {
            // If no image is uploaded and no image exists for the recipe
            updateData.image = defaultImage;
        }

        // Update the recipe
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            recipeId,
            updateData,
            { new: true, runValidators: true }
        );

        console.log('Updated recipe successfully', updatedRecipe);
        res.status(200).json(updatedRecipe);
        
    } catch (error) {
        console.error('Error updating recipe: ', error);
        res.status(500).json({ error: 'Server error while updating recipe' });
    }
};

module.exports={
    createRecipe,
    getAllRecipes,
    getRecipe,
    getRecipeByTitle,
    getPopularRecipes,
    deleteRecipe,
    updateRecipe
}