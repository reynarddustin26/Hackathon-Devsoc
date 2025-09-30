const express = require('express');
const router = express.Router();

// Import your data (mock or DB)
let buildings = [
  { id: "library", name: "Main Library", crowdedness: 3.5, count: 0 },
  { id: "gym", name: "Campus Gym", crowdedness: 2.1, count: 0 }
];

// 🟢 GET all buildings
router.get('/', (req, res) => {
  res.json(buildings);
});

// 🟢 POST checkin
router.post('/checkin', (req, res) => {
  const { buildingId } = req.body;
  const building = buildings.find(b => b.id === buildingId);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  building.count++;
  return res.json({ message: 'Checked in successfully', building });
});

// 🟢 POST checkout
router.post('/checkout', (req, res) => {
  const { buildingId } = req.body;
  const building = buildings.find(b => b.id === buildingId);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  if (building.count > 0) building.count--;
  return res.json({ message: 'Checked out successfully', building });
});

// 🟢 POST report crowdedness
router.post('/report', (req, res) => {
  const { buildingId, crowdedness } = req.body;
  const building = buildings.find(b => b.id === buildingId);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  building.crowdedness = crowdedness;
  return res.json({ message: 'Reported successfully', building });
});

module.exports = router;

