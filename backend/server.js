const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://hackathon-dev-frontend.onrender.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Add headers for debugging
app.use((req, res, next) => {
  console.log('🌐 Incoming request:', req.method, req.url);
  next();
});

// Root route for health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes (make sure buildings.js exists inside backend/routes/)
const buildingsRouter = require('./routes/buildings');
app.use('/api/buildings', buildingsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Render requires PORT from environment
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

