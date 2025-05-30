# Redleaf Fullstack App

This is a monorepo for a fullstack app with a React frontend (Vite) and an Express backend, ready for deployment on Render.

## Project Structure

```
/ (root)
  /client   # React frontend (Vite)
  /server   # Express backend (Node.js)
```

## Local Development

### 1. Install dependencies

```
cd client && npm install
cd ../server && npm install
```

### 2. Build the frontend

```
cd ../client
npm run build
```

### 3. Start the backend (serves the frontend build and API)

```
cd ../server
node index.js
```

- Visit [http://localhost:10000](http://localhost:10000)
- API endpoint: [http://localhost:10000/api/hello](http://localhost:10000/api/hello)

## Deploying to Render

### Backend (Express)
- Create a new Web Service on Render
- Root directory: `server`
- Build command: `npm install`
- Start command: `node index.js`
- Environment variable: `PORT=10000` (Render will inject this automatically)

### Frontend (React)
- Deploy as a static site (optional) or let the backend serve the build
- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

## Environment Variables
- Add any secrets (API keys, DB URLs, etc.) in Render's dashboard under "Environment".

---

**Remove any Firebase-specific code/config if you are not using Firebase.** 