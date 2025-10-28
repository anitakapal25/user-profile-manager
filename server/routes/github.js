const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const { param, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // 5 min TTL

// Rate limit specifically for GitHub proxying to protect GitHub API usage
const githubLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // max 30 requests per IP per minute
  message: 'Too many GitHub requests, please try again later'
});

router.get(
  '/repos/:username',
  githubLimiter,
  [
    param('username').trim().notEmpty().escape(),
    query('page').optional().toInt(),
    query('per_page').optional().toInt(),
    query('sort').optional().trim().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { username } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const per_page = parseInt(req.query.per_page, 10) || 30;
      const sort = req.query.sort || ''; // e.g. 'stars'

      const cacheKey = `${username}|${page}|${per_page}|${sort}`;
      const cached = cache.get(cacheKey);
      if (cached) return res.json(cached);

      // Query GitHub user's repos with pagination
      const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: { per_page, page },
        headers: {
          'User-Agent': 'user-profile-manager'
          // Optionally add Authorization header if you have a token to increase rate limits
        },
        timeout: 10000
      });

      let repos = response.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        url: repo.html_url,
        updated_at: repo.updated_at
      }));

      // Sorting: if client requests 'stars' sort, sort locally as GitHub 'repos' endpoint doesn't support stars sort
      if (sort === 'stars') {
        repos.sort((a, b) => b.stars - a.stars);
      } else if (sort === 'updated') {
        repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      }

      cache.set(cacheKey, repos);
      res.json(repos);
    } catch (error) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Error fetching GitHub repositories';
      res.status(status).json({ message });
    }
  }
);

module.exports = router;