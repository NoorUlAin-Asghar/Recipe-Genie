const express=require('express')
const recipe=require('../models/recipeModel')
const router=express.Router()

//GET all recipes
router.get('/',(req,res)=>{
    res.json({mssg:"GET all recipes"})
})

//GET a single recipe
router.get('/:id',(req,res)=>{
    res.json({mssg:"GET a single recipe"})
})

//DELETE a single recipe
router.delete('/:id',(req,res)=>{
    res.json({mssg:"DELETE a single recipe"})
})



module.exports=router