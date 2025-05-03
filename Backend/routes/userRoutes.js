const express=require('express')
const router=express.Router()
const {verifyToken}=require('../middleware/authMiddleware')
const upload = require('../config/multer'); 
const {
    getUserByName,
    getUserById,
    getUserByUsername,
    updateMyProfile,
    getProfile,
    followUser,
    unfollowUser,
    isFollowingUser,
    getAllFollowers,
    getAllFollowing
}=require('../controllers/userController')

router.use(verifyToken)

router.get("/profile/:userId", getProfile); // get my own profile  
router.patch("/myProfile",upload.single('image'), updateMyProfile); // edit my own profile

//GET User by name
router.get("/search/by-name",getUserByName);
//GET User by username
router.get("/search/by-username",getUserByUsername);
//GET User by Id
router.get("/userProfile/:userId",getUserById)

//follow user
router.patch("/follow/:userId",followUser);
//unfollow user
router.patch("/unfollow/:userId",unfollowUser)
//get following status
router.get("/is-following/:userId",isFollowingUser);

//get all followers of a user
router.get("/followers/:userId",getAllFollowers);
//get all followings of a user
router.get("/following/:userId",getAllFollowing);

module.exports=router;