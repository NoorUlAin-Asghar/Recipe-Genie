const User=require('../models/userModel')
const mongoose=require('mongoose')

//GET logged in user
const getMyUser = async (req, res) => {
    try {
        const user = await User.findById(
            req.userId
        ).select('name username profilePicture bio subscriptions followers');// req.user is set in middleware
        const filteredData = {
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture,
            bio: user.bio,
            subscriptionsCount: user.subscriptions.length,
            followersCount: user.followers.length
        };
        res.status(200).json(filteredData);
    } catch (error) {
        res.status(500).json({ error: "Server error while getting profile" });
    }
};

//GET User by name
const getUserByName = async (req, res) => {
    const { name } = req.query;

    try {
        const users = await User.find({
            name: { $regex: new RegExp(`(^|\\s)${name}`, 'i') } // Matches if search starts a word
        }).select('name username profilePicture bio subscriptions followers');


        if (!users || users.length === 0) {
            console.error("No user exists");
            return res.status(404).json("No user found");
        }

        // Map to return only selected fields + follower/subscription count
        const filteredUsers = users.map(user => ({
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture,
            bio: user.bio,
            subscriptionsCount: user.subscriptions.length,
            followersCount: user.followers.length
        }));

        res.status(200).json(filteredUsers);
        console.log("Got user by name successfully", filteredUsers);

    } catch (error) {
        console.log("Error getting a user:", error);
        res.status(500).json({ error: "Server error while getting a user by name" });
    }
};
//GET user by username
const getUserByUsername = async (req, res) => {
    const { username } = req.query;

    try {
        const users = await User.find({
            username: { $regex: new RegExp(`^${username}`) } 
        }).select('name username profilePicture bio subscriptions followers');


        if (!users || users.length === 0) {
            console.error("No user exists");
            return res.status(404).json("No user found");
        }

        // Map to return only selected fields + follower/subscription count
        const filteredUsers = users.map(user => ({
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture,
            bio: user.bio,
            subscriptionsCount: user.subscriptions.length,
            followersCount: user.followers.length
        }));

        res.status(200).json(filteredUsers);
        console.log("Got user by username successfully", filteredUsers);

    } catch (error) {
        console.log("Error getting a user:", error);
        res.status(500).json({ error: "Server error while getting a user by username" });
    }
};

//GET User by ID
const getUserById = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error('Incorrect Id');
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId)
            .select('name username profilePicture bio subscriptions followers');

        if (!user) {
            console.error("No user exists");
            return res.status(404).json("No user found");
        }

        const filteredUser = {
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture,
            bio: user.bio,
            subscriptionsCount: user.subscriptions.length,
            followersCount: user.followers.length
        };

        res.status(200).json(filteredUser);
        console.log("Got user by ID successfully", filteredUser);

    } catch (error) {
        console.log("Error getting a user:", error.message);
        res.status(500).json({ error: "Server error while getting a user by ID" });
    }
};


const updateMyUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.userId,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json("User not found");
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error while updating user" });
    }
};



module.exports={
    getUserByName,
    getUserByUsername,
    getUserById,
    // registerUser,
    updateMyUser,
    getMyUser
} 