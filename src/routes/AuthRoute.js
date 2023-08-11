const express = require('express');
const { loginUser, registerUser,forgotPassword,resetPasswordRequest}= require('../controllers/AuthController');
const {authenticated} = require("../middlewares-1/authenticated.middleware")
const router = express.Router()


router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/forgotPassword',forgotPassword )

router.post('/resetPasswordRequest',authenticated,resetPasswordRequest )


module.exports = router;