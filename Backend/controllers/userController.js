const User=require('../models/userModel')
const mongoose=require('mongoose')

//GET User by username
const getUser=async(req,res) =>{
    const {username}= req.query;

    try{
        const users=await User.find({
            username:{$regex: new RegExp(`\\b${username}\\b`, 'i') }// 'i' makes it case-insensitive
        })
        if(!users || users.length === 0){
            console.error("No user exists");
            res.status(404).json("No user found");
        }
        else{
            res.status(200).json(users);
            console.log("Got user by username successfully", users)
        }
        
    }
    catch(error){
        console.log("error getting a user");
        res.status(500).json({error:"Server error while getting a user by username"});
    }
}

//POST User
const createUser=async(req,res)=>{
    const {username,email,password,profilePicture,bio}=req.body;
    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("User already exists with this email");
            return res.status(400).json({ error: "User already exists with this email" });
        }

        const user= await User.create({username,email,password,profilePicture,bio});
        if(!user){
            console.error("No user created");
            res.status(404).json("No user created");
        }
        else{
            res.status(200).json(user);
            console.log("Created user successfully", user)
        }
    }
    catch(error){
        console.log("error creating user");
        res.status(500).json({error:"Server error while creating user"});
    }
};


const updateUser = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error('Incorrect Id');
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,                         
            { ...req.body },                
            { new: true, runValidators: true } // Return updated doc & validate
        );

        if (!user) {
            console.error("No user exists");
            return res.status(404).json("No user found to update");
        }

        res.status(200).json(user);
        console.log("Updated user successfully", user);

    } catch (error) {
        console.log("Error updating user:", error.message);
        res.status(500).json({ error: "Server error while updating user" });
    }
};


module.exports={
    getUser,
    createUser,
    updateUser
} 