const express = require('express');
const { registerUser, updateUserStatus, getAllUsers } = require('../controllers/userController');
const router = express.Router();

// Register a new user
router.post('/signup', registerUser);

// Update user status (online/offline)
router.post('/update-status', updateUserStatus);

// Get all users
router.get('/', getAllUsers);

module.exports = router;
