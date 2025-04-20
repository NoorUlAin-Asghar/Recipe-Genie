const Recipe=require('../models/recipeModel')
const mongoose=require('mongoose') 

//GET all recipes
const getAllRecipes= async(req,res)=>{
    const recipes=await Recipe.find({}).sort({createdAt: -1})
    if(recipes){
        res.status(200).json(recipes)
        console.log('GET all recipes');
    }
    else{
        console.log('no recipes exists');
        return res.status(404).json({error: 'No recipes exists'});
    }
}

//GET a single recipe
const getRecipe= async(req,res)=>{
    const{id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        console.error('Incorrect Id');
        return res.status(400).json({error: 'No such recipe'});
    }

    const recipe=await Recipe.findById(id);
    if(recipe){
        res.status(200).json(recipe);
        console.log('GET recipe',recipe);
    }
    else{
        console.log('no such recipe exists', id);
        return res.status(404).json({error: 'No such recipe'});
    }
}

//GET a recipe by title
const getRecipeByTitle = async (req, res) => {
    const { title } = req.query;
  
    try {
        const recipes = await Recipe.find({
            title: { $regex: new RegExp(title, 'i') } // 'i' makes it case-insensitive
        }).sort({createdAt: -1});
        if(recipes){
            res.status(200).json(recipes);
            console.log('GET recipe by title',title);
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
        res.status(200).json(newRecipe);
        console.log('POST a recipe',newRecipe);
    }catch(error){
        console.error('error creating recipe: ',error);
        res.status(400).json({error:error.message});
    }
}

//DELETE a recipe
const deleteRecipe=async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        console.error('Incorrect Id');S
        return res.status(400).json({error: 'No such recipe'});
    }
    const recipe=await Recipe.findOneAndDelete({_id:id});
    if(recipe){
        res.status(200).json(recipe);
        console.log('DELETE recipe',recipe);
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
    const recipe=await Recipe.findOneAndUpdate({_id:id},{...req.body});
    if(recipe){
        res.status(200).json(recipe);
        console.log('UPDATE recipe',recipe);
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