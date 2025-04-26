require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const recipeRoutes=require('./routes/recipeRoutes')
const commentRoutes=require('./routes/commentRoutes')
const userRoutes=require('./routes/userRoutes')
const authRoutes=require('./routes/authRoutes')


//express app
const app=express()

//middleware
app.use(express.json())

app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    //listen for request
    app.listen(process.env.PORT,()=>{
    console.log('connected to DB + listening on port', process.env.PORT)
})
})
.catch((error)=>{
    console.log(error)
})

//routes
app.use('/', authRoutes)
app.use('/recipes',recipeRoutes)
app.use('/recipes/:recipeId/comments',commentRoutes)
app.use('/users',userRoutes)