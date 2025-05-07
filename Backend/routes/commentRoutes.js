const express=require('express')
const {verifyToken}=require('../middleware/authMiddleware')
const {
    createComment,
    deleteComment,
    updateComment
}=require('../controllers/commentController')
const router = express.Router({ mergeParams: true }); //mergeParams: true, is used because of Nested Routers (when a child router depends on params from a parent route).

//POST a comment  
router.post('/',verifyToken,createComment);

//DELETE a comment
router.delete('/:commentId',deleteComment)

//UPDATE a comment
router.patch('/:commentId',updateComment)


module.exports=router