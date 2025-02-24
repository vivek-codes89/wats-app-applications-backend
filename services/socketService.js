let users = {}; // Store connected users

// Connect sockets
exports.connectSockets = (socket, io) => {
  socket.on('user_connected', (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} connected`);
    io.emit('user_list', Object.keys(users)); // Send user list to all clients
  });

  socket.on('send_message', (data) => {
    const { receiverId, message } = data;
    const receiverSocket = users[receiverId];

    if (receiverSocket) {
      io.to(receiverSocket).emit('receive_message', message); // Send to receiver
    } else {
      console.log(`User ${receiverId} is offline. Message saved.`);
      // Save message in database if user is offline
    }
  });

  socket.on('disconnect', () => {
    // Handle disconnect
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
};
