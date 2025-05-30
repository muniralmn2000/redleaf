const functions = require('firebase-functions');
const express = require('express');
const path = require('path');

const app = express();

// Simple API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Firebase Functions' });
});

// Serve static files from the frontend build (optional, for SSR or static serving)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Export the Express app as a Firebase Function
exports.app = functions.https.onRequest(app); 