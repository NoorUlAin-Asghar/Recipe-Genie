const express=require('express')
const router=express.Router()
const {verifyToken}=require('../middleware/authMiddleware')
const upload = require('../config/multer'); 
const {
    getUserByName,
    getUserById,
    getUserByUsername,
    // registerUser,
    updateMyProfile,
    getMyProfile
}=require('../controllers/userController')

router.use(verifyToken)

router.get("/myProfile", getMyProfile); // get my own profile  
router.patch("/myProfile",upload.single('image'), updateMyProfile); // edit my own profile

//GET User by name
router.get("/search/by-name",getUserByName);
//GET User by username
router.get("/search/by-username",getUserByUsername);
//GET User by Id
router.get("/userProfile/:userId",getUserById)

module.exports=router;