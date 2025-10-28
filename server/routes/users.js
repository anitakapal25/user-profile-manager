const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const user = User.getAll().find(u => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const { name, email, githubUsername } = req.body;
  const updatedUser = User.update(req.userId, { name, email, githubUsername });
  
  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json(updatedUser);
});

module.exports = router;