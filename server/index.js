const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Basic global rate limiter (100 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const githubRoutes = require('./routes/github');

// Routes
app.get('/', (req, res) => {
  res.send('User Profile Manager API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/github', githubRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});