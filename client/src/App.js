import React, { useState } from 'react';
import Login from './components/Login';
import Profile from './components/Profile';
import GitHubRepos from './components/GitHubRepos';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>User Profile Manager</h1>
      </header>
      <main>
        {!user ? (
          <Login onLoginSuccess={handleLogin} />
        ) : (
          <div className="dashboard">
            <Profile user={user} onLogout={handleLogout} />
            <GitHubRepos username={user.githubUsername} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;