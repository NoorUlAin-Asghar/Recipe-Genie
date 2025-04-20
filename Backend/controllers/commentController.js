const Comment = require('../models/commentModel');
const Recipe = require('../models/recipeModel');
const mongoose=require('mongoose') 


//CREATE a new comment
const createComment = async (req, res) => {
    const { author, text } = req.body;
    const { recipeId } = req.params; // Get recipeId from the URL
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        console.error('Incorrect Id');
        return res.status(400).json({ error: 'Invalid recipe ID' });
    }
  
    try {
        const comment = await Comment.create({ author, text, recipeId: recipeId });
    
        // Add this comment's ID to the Recipe
        await Recipe.findByIdAndUpdate(recipeId, {
            $push: { comments: comment._id }
        });
    
        res.status(201).json(comment);
        console.log('Comment created successfully')
    } catch (error) {
        console.error('error creating comment: ',error);
        res.status(400).json({ error: error.message });
    }
};

//DELETE a comment
const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        console.error('Incorrect Id');
        return res.status(400).json({ error: 'Invalid comment ID' });
    }

    try {
        // Find and delete the comment
        const comment = await Comment.findByIdAndDelete(commentId);

        if (!comment) {
            console.error('No comment exists');
            return res.status(404).json({ error: 'Comment not found' });
        }
        //Remove comment reference from recipe
        await Recipe.updateOne(
            { _id: comment.recipeId },
            { $pull: { comments: commentId } }
        );

        res.status(200).json(comment);
        console.log('DELETE comment',comment);

    } catch (error) {
        console.error('error deleting comment: ',error);
        res.status(400).json({ error: error.message });
    }
};

//UPDATE a comment
const updateComment = async (req, res) => {
    const { commentId } = req.params;

    // Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        console.error('Incorrect ID');
        return res.status(400).json({ error: 'Invalid comment ID' });
    }

    try {
        // Update comment
        const updatedComment = await Comment.findByIdAndUpdate(
            {_id:commentId},
            { ...req.body },
            { new: true, runValidators: true } // Return updated doc and validate inputs
        );

        if (!updatedComment) {
            console.error('No comment exists');
            return res.status(404).json({ error: 'No such comment' });
        }

        res.status(200).json(updatedComment);
        console.log('Updated comment successfully:', updatedComment);

    } catch (error) {
        console.error('Error updating comment:', error.message);
        res.status(500).json({ error: 'Server error while updating comment' });
    }
};

module.exports={
    createComment,
    deleteComment,
    updateComment
}