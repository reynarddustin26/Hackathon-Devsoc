const express = require('express');
const router = express.Router();

const {
  getBuildings,
  getBuilding,
  addReport,
  addReview,
  getRankings,
  getQRCode
} = require('../controllers/buildingsController');

// Routes
router.get('/', getBuildings);           // GET all buildings
router.get('/rankings', getRankings);    // GET busiest & best
router.get('/:id', getBuilding);         // GET single building
router.post('/report', addReport);       // POST new report
router.post('/review', addReview);       // POST new review
router.get('/:id/qr', getQRCode);        // GET QR code for building

module.exports = router;
