const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'insecure-default-secret', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const user = User.getAll().find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Update user profile
router.put(
  '/profile',
  authenticateToken,
  [
    body('name').optional().trim().escape(),
    body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('githubUsername').optional().trim().escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, githubUsername } = req.body;
    const updatedUser = User.update(req.userId, { name, email, githubUsername });

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  }
);

module.exports = router;