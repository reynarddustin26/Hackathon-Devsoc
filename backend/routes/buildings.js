const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load buildings.json
const dataPath = path.join(__dirname, '../data/buildings.json');
let buildings = require('../data/buildings.json');

// 🛠️ Helper to persist changes back to buildings.json
function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(buildings, null, 2), 'utf-8');
}

// 🟢 GET /api/buildings → list all buildings
router.get('/', (req, res) => {
  res.json(buildings);
});

// 🟢 POST /api/buildings/report → add crowdedness report
router.post('/report', (req, res) => {
  const { buildingId, crowdedness } = req.body;
  const building = buildings.find(b => b.id === buildingId);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  building.crowdedness = (building.crowdedness + crowdedness) / 2;
  saveData();

  res.json({ message: 'Report added successfully', building });
});

// 🟢 POST /api/buildings/checkin → increment occupancy count
router.post('/checkin', (req, res) => {
  const { buildingId } = req.body;
  const building = buildings.find(b => b.id === buildingId);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  building.count++;
  saveData();

  res.json({ message: 'Checked in successfully', building });
});

// 🟢 POST /api/buildings/checkout → decrement occupancy count
router.post('/checkout', (req, res) => {
  const { buildingId } = req.body;
  const building = buildings.find(b => b.id === buildingId);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  if (building.count > 0) building.count--;
  saveData();

  res.json({ message: 'Checked out successfully', building });
});

// 🟢 GET /api/buildings/:id/qr → generate QR code
router.get('/:id/qr', async (req, res) => {
  const { id } = req.params;
  const building = buildings.find(b => b.id === id);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  // Link to frontend feedback page for this building
  const frontendUrl = `https://your-frontend-url.com/feedback/${id}`;

  try {
    const qrImage = await QRCode.toDataURL(frontendUrl);
    res.json({ building: building.name, qr: qrImage });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// 🟢 POST /api/buildings/:id/review → submit review + crowdedness
router.post('/:id/review', (req, res) => {
  const { id } = req.params;
  const { crowdedness, review } = req.body;

  const building = buildings.find(b => b.id === id);
  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  // Update crowdness (simple average)
  building.crowdedness = (building.crowdedness + crowdedness) / 2;

  // Add review
  if (!building.reviews) building.reviews = [];
  building.reviews.push({
    review,
    crowdedness,
    timestamp: new Date()
  });

  saveData();

  res.json({ message: 'Review submitted successfully', building });
});

module.exports = router;
