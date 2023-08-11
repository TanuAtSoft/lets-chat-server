const express = require('express');
const { deleteUser, followUser, getAllUsers, getUser, unfollowUser, updateUser } = require('../controllers/UserController')
const authMiddleWare = require('../middleware/AuthMiddleware');
const {authenticated} = require("../middlewares-1/authenticated.middleware")

const router = express.Router()

router.get('/:id',authenticated, getUser);
router.get('/', authenticated,getAllUsers)
router.put('/:id',authMiddleWare, updateUser)
router.delete('/:id',authMiddleWare, deleteUser)
router.put('/:id/follow',authMiddleWare, followUser)
router.put('/:id/unfollow',authMiddleWare, unfollowUser)

module.exports = router;