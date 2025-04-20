const express=require('express')
const {
 
}=require('../controllers/commentContoller')
const router=express.Router()

//GET all comments on a specific recipe
router.get('/',getAllComments)

//POST a comment  
router.post('/',createComment);

//DELETE a comment
router.delete('/:id',deleteComment)

//UPDATE a comment
router.patch('/:id',updateComment)


module.exports=router