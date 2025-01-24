const socketio = require('socket.io');

let io;
const users = new Map();
const onlineUsers = new Set(); // To track only online users


const initializeSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: 'http://localhost:5173', // Update if your frontend runs on a different port
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user registration (store userId and socket.id)
    socket.on('register', (email) => {
      users.set(email, socket.id);
      onlineUsers.add(email); // Add to online users list
      console.log(`${email} registered with socket ID ${socket.id}`);

       // Notify all users about the updated online users list
      io.emit('updateOnlineUsers', Array.from(onlineUsers));
    });

    // Handle sending a message
    socket.on('sendMessage', ({ sender, recipient, message }) => {
      const recipientSocketId = users.get(recipient);

      if (recipientSocketId) {
        // Send the message to the recipient
        io.to(recipientSocketId).emit('message', { sender, message });
        console.log(`Message sent from ${sender} to ${recipient}`);
      } else {
        console.log(`Recipient ${recipient} is not connected`);
        // Optionally, you can save the message to the database for offline delivery
      }
    });

    // Handle sending an offer
    socket.on('offer', ({ recipient, offer }) => {
      const recipientSocketId = users.get(recipient);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('offer', { offer, sender: socket.id });
        console.log(`Offer sent from ${socket.id} to ${recipient}`);
      } else {
        console.log(`Recipient ${recipient} is not online`);
      }
    });

    // Handle sending an answer
    socket.on('answer', ({ recipient, answer }) => {
      const recipientSocketId = users.get(recipient);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('answer', { answer, sender: socket.id });
        console.log(`Answer sent from ${socket.id} to ${recipient}`);
      } else {
        console.log(`Recipient ${recipient} is not online`);
      }
    });

    // Handle ICE candidate
    socket.on('ice-candidate', ({ recipient, candidate }) => {
      const recipientSocketId = users.get(recipient);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('ice-candidate', { candidate, sender: socket.id });
        console.log(`ICE candidate sent from ${socket.id} to ${recipient}`);
      } else {
        console.log(`Recipient ${recipient} is not online`);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      for (const [email, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(email);
          onlineUsers.delete(email); // Remove from online users list
          console.log(`${email} disconnected`);
          break;
        }
      }
      io.emit('updateOnlineUsers', Array.from(onlineUsers)); // Update online users list
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

// Helper function to get the io instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
