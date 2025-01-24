// db.js
require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

// MongoDB URI from .env
const mongoURI = process.env.MONGO_URI; 

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
