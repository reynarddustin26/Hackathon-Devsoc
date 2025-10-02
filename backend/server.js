const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');  // <- new file

const app = express();

// Middleware
app.use(cors({

  origin: [
    'http://localhost:3000',  // frontend local
    'https://hackathon-dev-frontend.onrender.com'  // frontend deployed
  ],
  origin: ['http://localhost:3000', 'https://hackathon-dev-frontend.onrender.com', 'https://hackathon-dev.onrender.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Inject DB into requests
app.use(async (req, res, next) => {
  req.db = await connectDB();
  next();
});

// Routes
const buildingsRouter = require('./routes/buildings');
app.use('/api/buildings', buildingsRouter);

// Server
// Log all requests for debugging
app.use((req, res, next) => {
  console.log('📡 Request:', {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers.origin
  });
  next();
});

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
