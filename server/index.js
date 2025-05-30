const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../client/dist')));

// API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Render!' });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`)); 