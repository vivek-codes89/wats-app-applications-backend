const bcrypt = require('bcrypt');  // Import bcrypt (make sure you installed it)
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Controller to register a new user
exports.registerUser = async (req, res) => {
    const { email, phone, username, password } = req.body;
  
    // Check if phone is provided
    if (!phone || phone === null || phone.trim() === '') {
      return res.status(400).json({ error: 'Phone number is required' });
    }
  
    // Validate the phone number format if needed
    const phoneRegex = /^[0-9]{10}$/; // Example regex for a 10-digit phone number
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }
  
    // Check if password is provided
    if (!password || password === null || password.trim() === '') {
      return res.status(400).json({ error: 'Password is required' });
    }
  
    try {
      // Check if the user already exists (based on email or phone)
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email or phone number' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user
      const newUser = new User({
        email,
        phone,
        username,
        password: hashedPassword  // Store hashed password
      });
  
      // Save the new user to the database
      await newUser.save();
  
      res.status(201).json({
        message: 'User registered successfully',
        newUser
      });
    } catch (err) {
      console.log(">>>>>error", err);
      res.status(500).json({
        error: 'Error registering user',
        details: err.message
      });
    }
  };
  

// Other controller functions (login, updateUserStatus, getAllUsers, etc.) remain the same

  

// Controller to login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    // Check if password matches
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'User logged in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isOnline: user.isOnline
      }
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error logging in user',
      details: err.message
    });
  }
};

// Controller to update user status (Online/Offline)
exports.updateUserStatus = async (req, res) => {
  const { userId, isOnline } = req.body;

  try {
    // Update the user's online status
    const user = await User.findByIdAndUpdate(userId, { isOnline }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User status updated',
      user
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error updating user status',
      details: err.message
    });
  }
};

// Controller to get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      error: 'Error fetching users',
      details: err.message
    });
  }
};
