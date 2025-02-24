const Message = require('../models/messageModel');
const User = require('../models/userModel');

// Controller to send a message
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {

    if (!senderId || !receiverId || !message) {
        return res.status(400).json({
          error: "Invalid input",
          details: "senderId, receiverId, and message are required"
        });
      }
    // Create a new message object
    const newMessage = new Message({
      senderId,
      receiverId,
      message
    });

    // Save the message in the database
    await newMessage.save();

    res.status(200).json({
      message: 'Message sent successfully!',
      newMessage
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error in sending message',
      details: err.message
    });
  }
};

// Controller to get messages between two users
exports.getMessages = async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    // Fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({
      error: 'Error fetching messages',
      details: err.message
    });
  }
};
