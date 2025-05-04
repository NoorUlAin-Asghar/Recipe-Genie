const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true }, // Short overview or intro
  cookTime: { type: Number, required: true },    // In minutes
  serving:{type: Number, required:true},
  ingredients: [
    { type: String, required: true }
  ],
  instructions: [
    { type: String, required: true }
  ],
  image: { type: String, default: '' },
  likes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;