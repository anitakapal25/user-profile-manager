import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GitHubRepos({ username }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) return;
    const fetchRepos = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:5000/api/github/repos/${username}`);
        setRepos(response.data);
      } catch (err) {
        setError('Failed to fetch repositories');
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [username]);

  // eslint-disable-next-line
  const fetchRepos = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:5000/api/github/repos/${username}`);
      setRepos(response.data);
    } catch (err) {
      setError('Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  };

  if (!username) return null;
  
  return (
    <div className="github-repos">
      <h3>GitHub Repositories for {username}</h3>
      {loading && <div>Loading repositories...</div>}
      {error && <div className="error">{error}</div>}
      {repos.length > 0 && (
        <ul className="repos-list">
          {repos.map(repo => (
            <li key={repo.id} className="repo-item">
              <h4>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
              <span>⭐ {repo.stars}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GitHubRepos;