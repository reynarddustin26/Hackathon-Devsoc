const express = require('express');
const cors = require('cors');
require('dotenv').config();

const buildingRoutes = require('./routes/buildings');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/buildings', buildingRoutes);

// Root test route
app.get('/', (req, res) => {
  res.json({ message: 'UNSW Crowd Tracker Backend 🚀' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));