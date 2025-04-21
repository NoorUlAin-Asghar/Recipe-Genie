const express=require('express')
const router=express.Router()

const {
    getUser,
    createUser,
    updateUser
}=require('../controllers/userController')


//GET User by username
router.get("/search/by-username",getUser);

//Create a User
router.post("/",createUser);

//Update a User
router.patch("/:userId",updateUser)

module.exports=router;