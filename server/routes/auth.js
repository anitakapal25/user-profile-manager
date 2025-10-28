const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email } = req.body;
  
  let user = User.findByEmail(email);
  if (!user) {
    // Create new user if not exists (simplified registration)
    user = User.create({ email, name: email.split('@')[0] });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, user });
});

module.exports = router;