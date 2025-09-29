const buildings = require('../data/buildings.json');
const calculateCrowdedness = require('../utils/calculateCrowdedness');
const QRCode = require('qrcode');

// GET all buildings
function getBuildings(req, res) {
  const result = buildings.map(b => ({
    id: b.id,
    name: b.name,
    crowdedness: calculateCrowdedness(b.reports),
    reportsCount: b.reports.length,
    reviewsCount: b.reviews.length
  }));
  res.json(result);
}

// GET single building
function getBuilding(req, res) {
  const building = buildings.find(b => b.id === req.params.id);
  if (!building) return res.status(404).json({ error: 'Building not found' });

  res.json({
    id: building.id,
    name: building.name,
    crowdedness: calculateCrowdedness(building.reports),
    reportsCount: building.reports.length,
    reviews: building.reviews
  });
}

// POST report
function addReport(req, res) {
  const { buildingId, crowdedness } = req.body;
  const building = buildings.find(b => b.id === buildingId);
  if (!building) return res.status(404).json({ error: 'Building not found' });

  building.reports.push({ crowdedness, timestamp: Date.now() });

  res.json({ 
    message: 'Report added',
    buildingId,
    newCrowdedness: calculateCrowdedness(building.reports)
  });
}

// POST review
function addReview(req, res) {
  const { buildingId, review } = req.body;
  const building = buildings.find(b => b.id === buildingId);
  if (!building) return res.status(404).json({ error: 'Building not found' });

  building.reviews.push({ text: review, timestamp: Date.now() });

  res.json({
    message: 'Review added',
    buildingId,
    totalReviews: building.reviews.length
  });
}

// GET rankings
function getRankings(req, res) {
  const busiest = [...buildings]
    .sort((a, b) => calculateCrowdedness(b.reports) - calculateCrowdedness(a.reports))
    .slice(0, 3);

  const bestStudySpots = [...buildings]
    .sort((a, b) => calculateCrowdedness(a.reports) - calculateCrowdedness(b.reports))
    .slice(0, 3);

  res.json({
    busiest: busiest.map(b => ({ id: b.id, name: b.name, crowdedness: calculateCrowdedness(b.reports) })),
    bestStudySpots: bestStudySpots.map(b => ({ id: b.id, name: b.name, crowdedness: calculateCrowdedness(b.reports) }))
  });
}

// GET QR code for building
async function getQRCode(req, res) {
  const building = buildings.find(b => b.id === req.params.id);
  if (!building) return res.status(404).json({ error: 'Building not found' });

  try {
    const qrCodeData = await QRCode.toDataURL(
      `http://localhost:4000/api/buildings/${building.id}`
    );
    res.json({ buildingId: building.id, qrCode: qrCodeData });
  } catch (err) {
    res.status(500).json({ error: 'QR code generation failed' });
  }
}

module.exports = {
  getBuildings,
  getBuilding,
  addReport,
  addReview,
  getRankings,
  getQRCode
};
