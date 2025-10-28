const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;

    let user = User.findByEmail(email);
    if (!user) {
      // Create new user if not exists (simplified registration)
      user = User.create({ email, name: email.split('@')[0] });
    }

    const secret = process.env.JWT_SECRET || 'insecure-default-secret';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '24h' });

    res.json({ token, user });
  }
);

module.exports = router;