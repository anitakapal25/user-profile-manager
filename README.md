# User Profile Manager

A small demo application (Node + Express backend, React frontend) for managing a simple user profile, simulated authentication, and fetching GitHub public repositories.

## Features

- Simulated login with email (JWT returned; no real registration flow)
- View and update user profile (name, email, GitHub username)
- In-memory mock database on the server (non-persistent)
- Fetch public GitHub repositories for a given username
- Loading and error states on the client

## Repo layout

```
server/
  index.js
  package.json
  .env
  models/
    User.js
  routes/
    auth.js
    users.js
    github.js
client/
  package.json
  public/
    index.html
  src/
    index.js
    App.js
    index.css
    components/
      Login.js
      Profile.js
      GitHubRepos.js
README.md
.gitignore
```

## Prerequisites

- Node.js (14+ recommended)
- npm (comes with Node)

## Setup & run

Open two terminals (one for server, one for client).

1. Server

```powershell
cd server
npm install
# create or edit server/.env (see example below)
npm run dev
```

2. Client

```powershell
cd client
npm install
npm start
```

The React app runs by default on http://localhost:3000 and will call the server at http://localhost:5000 (the server port can be changed in `server/.env`).

## Environment variables (server/.env)

Create `server/.env` with the following entries:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-profile-manager
JWT_SECRET=your-secret-key
```

The app uses `JWT_SECRET` to sign tokens. Because the server uses an in-memory mock DB (array), data will be lost when the server restarts.

## API Endpoints

- POST /api/auth/login
  - Body: { email }
  - Response: { token, user }
  - Behavior: creates a new user in-memory if the email is not found and returns a JWT token.

- GET /api/users/profile
  - Requires: Authorization: Bearer <token>
  - Response: user profile object

- PUT /api/users/profile
  - Requires: Authorization: Bearer <token>
  - Body: { name, email, githubUsername }
  - Response: updated user object

- GET /api/github/repos/:username
  - Public: fetches public repositories from GitHub for the given username

## Notes & limitations

- The server stores users in an in-memory array (`server/models/User.js`). This is intentionally simple for demo and testing purposes. For production you should use a real database (MongoDB, Postgres, etc.).
- The login route auto-creates users. There is no password flow — this is a simulated auth system.
- The GitHub API is called without authentication; it is rate-limited by GitHub. For heavier usage, add a GitHub token.

## Troubleshooting

- "Cannot find module 'axios'": run `npm install axios` in the server directory.
- React "Could not find a required file: index.html": ensure `client/public/index.html` exists (this repo includes one).
- If the client cannot reach the server, verify the server is running on port from `server/.env` and that CORS is enabled (server uses `cors`).

## Development notes

- Styles are minimal and live in `client/src/index.css`.
- To change layout of Profile and GitHubRepos, edit `.dashboard` styles in `client/src/index.css`.

## Next steps (suggested)

- Replace in-memory storage with a real database and proper user registration/login flow.
- Add unit and integration tests for server and client.
- Add GitHub API token support to increase rate limits.

---

If you'd like, I can:
- Add an example `.env.example` file.
- Create a small test that verifies the login/profile flow.
- Wire up persistent storage (MongoDB) and add Mongoose models.
