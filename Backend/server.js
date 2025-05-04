require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors = require('cors');
const Groq = require('groq-sdk');
const recipeRoutes=require('./routes/recipeRoutes')
const commentRoutes=require('./routes/commentRoutes')
const userRoutes=require('./routes/userRoutes')
const authRoutes=require('./routes/authRoutes')

const path = require('path');

//express app
const app=express()

// CORS configuration (adjust if needed)
const corsOptions = {
  origin: 'http://localhost:3000', // Update if frontend is hosted elsewhere
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add all necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Add 'Authorization' for JWT
  credentials: true,
};
app.use(cors(corsOptions));

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})


//routes
app.use('/', authRoutes)
app.use('/recipes',recipeRoutes)
app.use('/comments/:recipeId',commentRoutes)
app.use('/users',userRoutes)

// ---------------- Groq Chatbot Route ----------------
const groq = new Groq({ api_key: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192', // Or another supported Groq model
      messages: [...history, { role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 512,
    });

    res.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error in AI route:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});
// ----------------------------------------------------

// MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log('Connected to DB + Server running on port', process.env.PORT || 3001);
    });
  })
  .catch((error) => {
    console.log(error);
  });