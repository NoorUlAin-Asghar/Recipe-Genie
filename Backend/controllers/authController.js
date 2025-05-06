// controllers/authController.js
const jwt =require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User =require('../models/userModel.js');
const validator =require('validator')

// Secret for JWT token
const SECRET = process.env.JWT_SECRET;

const createToken=(_id)=>{
  return jwt.sign({ _id }, SECRET, { expiresIn: '5h' });
}

// Register a new user
const register = async (req, res) => {
  const defaultProfilePicture = "http://localhost:3000/uploads/default-profile.png"; // Path to your default logo
  const { name, username, email, password } = req.body;

  if(!name || !username || !email || !password)
    return res.status(400).json({ message: 'All fields must be filled' });

  if(!validator.isEmail(email))
    return res.status(400).json({ message: 'Incorrect email format' });

  try {
    // Check if the user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'User on this email already exists' });

    // Check if the user already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Username is taken' });

    // Hash the password
    const salt= await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({ name,username, email, password: hashedPassword, profilePicture:defaultProfilePicture });

    // Create JWT token
    const token = createToken(newUser._id);

    res.status(201).json({userid:newUser._id,username:newUser.username, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Something went wrong during registration' });
  }
};

// Login an existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password)
    return res.status(400).json({ message: 'All fields must be filled' });
  try {
    // Find the user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.error('incorrect email');
      return res.status(404).json({ message: 'Incorrect Email' });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      console.error('incorrect password');
      return res.status(400).json({ message: 'Invalid Password' });
    }

    // Create JWT token
    const token = createToken(existingUser._id);

    // Return user data and token
    res.status(200).json({ userid:existingUser._id,username:existingUser.username, token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Something went wrong during login' });
  }
};


module.exports={
    register,
    login
}