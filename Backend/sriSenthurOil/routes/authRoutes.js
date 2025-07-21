const express=require('express');
const router =express.Router();
const authController=require('../controllers/authController');

//Register and Login Routes
router.post('/register',authController.register);
router.post('/login',authController.login);

module.exports=router;