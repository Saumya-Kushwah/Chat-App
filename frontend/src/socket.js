import io from 'socket.io-client';

// Make sure this URL matches the backend server's address
const socket = io('http://localhost:8080', {
  transports: ['websocket'], // Explicitly use WebSocket transport
});

// Handle socket events
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('reconnect', () => {
  console.log('Reconnected to server');
});

// Event listener for incoming messages
socket.on('message', (msg) => {
  console.log('New message:', msg);
});

// Function to send message
const sendMessage = (sender, recipient, message) => {
  socket.emit('sendMessage', { sender, recipient, message });
};

// Export socket functions if needed elsewhere
export { socket, sendMessage };
