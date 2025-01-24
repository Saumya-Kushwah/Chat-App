import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Make sure your backend is running on this URL

// Set default headers for Axios
axios.defaults.headers = {
  'Content-Type': 'application/json',
};

// Helper function to set Authorization header
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers['Authorization'];
  }
};

// Signup function
const signup = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      username,
      email,
      password,
    });
    return response.data; // { token }
  } catch (error) {
    console.error('Signup error:', error.response.data);
    throw error.response.data;
  }
};

// Login function
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data; // { token }
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error.response.data;
  }
};

// Send message function
const sendMessage = async (recipient, messageText) => {
  try {
    const response = await axios.post(
      `${API_URL}/sendMessage`,
      { recipient, messageText }
    );
    return response.data; // { msg }
  } catch (error) {
    console.error('Send message error:', error.response.data);
    throw error.response.data;
  }
};

// Get messages function
const getMessages = async () => {
  try {
    const response = await axios.get(`${API_URL}/getMessages`);
    return response.data; // Array of messages
  } catch (error) {
    console.error('Get messages error:', error.response.data);
    throw error.response.data;
  }
};

export default {
  signup,
  login,
  sendMessage,
  getMessages,
  setAuthToken,
};
