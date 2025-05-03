const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  cookTime: { type: Number, required: true },
  ingredients: [{
    name: { type: String, required: true }
  }],
  instructions: { type: String, required: true },
  likes: { type: Number, default: 0 },          // Total like count
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;