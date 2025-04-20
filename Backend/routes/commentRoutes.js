const express=require('express')
const {
    createComment,
    deleteComment,
    updateComment
}=require('../controllers/commentController')
const router = express.Router({ mergeParams: true }); //mergeParams: true, should use when Nested Routers (when a child router depends on params from a parent route).

//POST a comment  
router.post('/',createComment);

//DELETE a comment
router.delete('/:commentId',deleteComment)

//UPDATE a comment
router.patch('/:commentId',updateComment)


module.exports=router