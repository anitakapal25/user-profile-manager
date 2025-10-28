import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GitHubRepos({ username }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [sort, setSort] = useState(''); // '', 'stars', 'updated'
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!username) {
      setRepos([]);
      setError('');
      setLoading(false);
      return;
    }
    setPage(1); // reset page when username changes
  }, [username, sort]);

  useEffect(() => {
    if (!username) return;
    const fetchRepos = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `http://localhost:5000/api/github/repos/${encodeURIComponent(username)}`,
          {
            params: { page, per_page: perPage, sort }
          }
        );
        setRepos(response.data);
        // If returned less than perPage, probably no more
        setHasMore(response.data.length === perPage);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch repositories');
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [username, page, perPage, sort]);

  if (!username) return null;

  return (
    <div className="github-repos">
      <h3>GitHub Repositories for {username}</h3>

      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Sort:</label>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Default</option>
          <option value="stars">Most stars</option>
          <option value="updated">Recently updated</option>
        </select>
      </div>

      {loading && <div>Loading repositories...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && repos.length === 0 && <div>No repositories found.</div>}

      {!loading && repos.length > 0 && (
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

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>
          Prev
        </button>
        <div style={{ alignSelf: 'center' }}>Page {page}</div>
        <button onClick={() => setPage(p => p + 1)} disabled={!hasMore || loading}>
          Next
        </button>
      </div>
    </div>
  );
}

export default GitHubRepos;