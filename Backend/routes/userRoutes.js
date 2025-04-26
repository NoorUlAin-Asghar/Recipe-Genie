const express=require('express')
const router=express.Router()
const {verifyToken}=require('../middleware/authMiddleware')

const {
    getUserByName,
    getUserById,
    getUserByUsername,
    // registerUser,
    updateMyUser,
    getMyUser
}=require('../controllers/userController')

router.use(verifyToken)

router.get("/myProfile", getMyUser); // get my own profile  
router.patch("/edit", updateMyUser); // edit my own profile

//GET User by name
router.get("/search/by-name",getUserByName);
//GET User by username
router.get("/search/by-username",getUserByUsername);
//GET User by Id
router.get("/userProfile/:userId",getUserById)

module.exports=router;