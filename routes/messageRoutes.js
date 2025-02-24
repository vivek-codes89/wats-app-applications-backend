const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

// Send a message
router.post('/send', sendMessage);

// Get messages between two users
router.get('/messages/:userId/:otherUserId', getMessages);

module.exports = router;
