const express=require('express')
const router=express.Router()

const {
    login,
    register
}=require('../controllers/authController')


//Create a User
router.post("/login",login);

//Create a User
router.post("/register",register);

module.exports=router;