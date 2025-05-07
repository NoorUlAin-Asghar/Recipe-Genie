const User=require('../models/userModel')
const mongoose=require('mongoose')

//GET logged in user
const getProfile = async (req, res) => {
    const { userId } = req.params;
    console.log(userId)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error('Incorrect Id');
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(
            userId
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
        console.error(error)
        res.status(500).json({ error: "Server error while getting profile" });
    }
};

//GET User by name
const getUserByName = async (req, res) => {
    const { name } = req.query;

    try {
        const users = await User.find({
            name: { $regex: new RegExp(`(^|\\s)${name}`, 'i') } // Matches if search starts a word
        }).select('_id name username profilePicture bio subscriptions followers');


        if (!users || users.length === 0) {
            console.error("No user exists");
            return res.status(404).json("No user found");
        }

        // Map to return only selected fields + follower/subscription count
        const filteredUsers = users.map(user => ({
            _id:user._id,
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
        }).select('name username profilePicture');


        if (!users || users.length === 0) {
            console.error("No user exists");
            return res.status(404).json("No user found");
        }

        // Map to return only selected fields + follower/subscription count
        const filteredUsers = users.map(user => ({
            userId:user.userId,
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture,
            // bio: user.bio,
            // subscriptionsCount: user.subscriptions.length,
            // followersCount: user.followers.length
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


const updateMyProfile = async (req, res) => {
    const defaultProfilePicture = "http://localhost:3000/uploads/default-profile.png"; // Path to the default logo
    try {
        const { name, bio } = req.body;
    
        const user = await User.findById(req.user._id);
    
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Build update object
        const updateData = { name, bio };
    
        if (req.file) {
          // If a new file is uploaded
          updateData.profilePicture = `http://localhost:3000/uploads/${req.file.filename}`;
        } else if (!user.profilePicture) {
          // If no file is uploaded and no profile picture exists
          updateData.profilePicture = defaultProfilePicture;
        }
        // else: keep the existing one (no change)
    
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          updateData,
          { new: true, runValidators: true }
        );
        console.log(updatedUser)
        res.status(200).json(updatedUser);
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while updating user" });
    }
};

const isFollowingUser = async (req, res) => {
    try {
      const currentUserId = req.user._id;
      const targetUserId = req.params.userId;
  
      if (!currentUserId || !targetUserId) {
        return res.status(400).json({ message: "Missing user ID(s)." });
      }
  
      const currentUser = await User.findById(currentUserId);
  
      if (!currentUser) {
        return res.status(404).json({ message: "Current user not found." });
      }
  
      const isFollowing = currentUser.subscriptions.includes(targetUserId);
      console.log("following status: ",isFollowing);
      res.status(200).json({ isFollowing });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
};
  

// Follow a user
const followUser =async (req, res) => {
    try {
      const currentUserId =req.user._id
      const targetUserId = req.params.userId;
  
      if (currentUserId === targetUserId) {
        return res.status(400).json({ message: "You can't follow yourself." });
      }
  
      const currentUser = await User.findById(currentUserId);
      const targetUser = await User.findById(targetUserId);
  
      if (!targetUser || !currentUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Check if already following
      if (currentUser.subscriptions.includes(targetUserId)) {
        return res.status(400).json({ message: "Already following this user." });
      }
  
      currentUser.subscriptions.push(targetUserId);
      targetUser.followers.push(currentUserId);
  
      await currentUser.save();
      await targetUser.save();
  
      res.status(200).json({ message: "Successfully followed the user." });
      console.log("Successfully followed the user");
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
      console.log(err)
    }
  };
  
  // Unfollow a user
  const unfollowUser= async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const targetUserId = req.params.userId;
  
        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);
    
        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: "User not found." });
        }
        // Check if currentUser is actually following targetUser
        const isFollowing = currentUser.subscriptions.includes(targetUserId);
        if (!isFollowing) {
        return res.status(400).json({ message: "You are not following this user." });
        }
        await User.findByIdAndUpdate(currentUserId, {
            $pull: { subscriptions: targetUserId }
        });
        
        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: currentUserId }
        });
  
        res.status(200).json({ message: "Successfully unfollowed the user." });
        console.log("Successfully followed the user");
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
        console.log(err)
    }
  };
  
    const getAllFollowers= async (req, res) => {
        try {
        const user = await User.findById(req.params.userId).populate(
            {
                path: "followers", 
                select: "name username profilePicture"
            });
        res.json(user.followers);
        console.log("followers: ",user.followers)
        } catch (error) {
        res.status(500).json({ error: "Server error" });
        console.log(error)
        }
    };

    const getAllFollowing= async (req, res) => {
        try {
          const user = await User.findById(req.params.userId).populate(
            {
                path: "subscriptions", 
                select: "name username profilePicture"
            });
          res.json(user.subscriptions);
          console.log("Subscriptions:" ,user.subscriptions)
        } catch (error) {
          res.status(500).json({ error: "Server error" });
          console.log(error)
        }
    };
      
  

module.exports={
    getUserByName,
    getUserByUsername,
    getUserById,
    updateMyProfile,
    getProfile,
    followUser,
    unfollowUser,
    isFollowingUser,
    getAllFollowers,
    getAllFollowing
} 