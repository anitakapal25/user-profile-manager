const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/repos/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
    const repos = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      url: repo.html_url
    }));
    res.json(repos);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.message || 'Error fetching GitHub repositories' 
    });
  }
});

module.exports = router;