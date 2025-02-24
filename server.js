const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  // Importing CORS package
dotenv.config();

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Import routes
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Middleware
app.use(express.json());
app.use(cors());  // Add this middleware to handle CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Error:', err));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  // Handle events here
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
