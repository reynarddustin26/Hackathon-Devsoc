const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:4000', 'https://hackathon-dev-frontend.onrender.com'], methods: ['GET', 'POST'], credentials: true}));
app.use(express.json());

// Routes (make sure buildings.js exists inside backend/routes/)
const buildingsRouter = require('./routes/buildings');
app.use('/api/buildings', buildingsRouter);

// Render requires PORT from environment
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

