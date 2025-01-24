const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();
  res.status(201).send('User created');
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('User not found');
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).send('Invalid password');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to authenticate and verify token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

// User route to get authenticated user's data
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Find the user by ID (from the token)
    if (!user) return res.status(404).send('User not found');
    
    // Return the user data
    res.json({
      email: user.email,
      name: user.name,
      // Add other fields you want to return
    });
  } catch (err) {
    console.error('Error fetching user data', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
