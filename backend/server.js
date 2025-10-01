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
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
