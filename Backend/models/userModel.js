const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, minlength: 6,
    match: /^(?=.*[A-Z])(?=.*_).{6,}$/, // Regex to check for capital letter, underscore, and minimum length
    unique: true },
  email: { type: String, required: true,  unique: true,  // Ensures email is unique across all users 
  },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
