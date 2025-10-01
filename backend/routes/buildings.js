const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();
const connectDB = require('../utils/mongoClient');

// 🟢 Helper: Find building by id OR name in DB
async function findBuilding(db, identifier) {
  if (!identifier) return null;
  return db.collection('buildings').findOne({
    $or: [
      { id: identifier.toLowerCase() },
      { name: { $regex: new RegExp(`^${identifier}$`, 'i') } }
    ]
  });
}

// 🟢 GET /api/buildings → list all buildings
router.get('/', async (req, res) => {
  const db = await connectDB();
  const buildings = await db.collection('buildings').find({}).toArray();
  res.json(buildings);
});

// 🟢 POST /api/buildings/report → add crowdedness report
router.post('/report', async (req, res) => {
  const { buildingId, crowdedness } = req.body;
  const db = await connectDB();
  const building = await findBuilding(db, buildingId);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  // Update average crowdedness
  const newCrowdedness = (building.crowdedness + crowdedness) / 2;
  await db.collection('buildings').updateOne(
    { _id: building._id },
    { $set: { crowdedness: newCrowdedness } }
  );
  const updated = await db.collection('buildings').findOne({ _id: building._id });
  res.json({ message: 'Report added successfully', building: updated });
});

// 🟢 POST /api/buildings/checkin → increment occupancy count
router.post('/checkin', async (req, res) => {
  const { buildingId } = req.body;
  const db = await connectDB();
  const building = await findBuilding(db, buildingId);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  await db.collection('buildings').updateOne(
    { _id: building._id },
    { $inc: { count: 1 } }
  );
  const updated = await db.collection('buildings').findOne({ _id: building._id });
  res.json({ message: 'Checked in successfully', building: updated });
});

// 🟢 POST /api/buildings/checkout → decrement occupancy count
router.post('/checkout', async (req, res) => {
  const { buildingId } = req.body;
  const db = await connectDB();
  const building = await findBuilding(db, buildingId);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  if (building.count > 0) {
    await db.collection('buildings').updateOne(
      { _id: building._id },
      { $inc: { count: -1 } }
    );
  }
  const updated = await db.collection('buildings').findOne({ _id: building._id });
  res.json({ message: 'Checked out successfully', building: updated });
});

// 🟢 GET /api/buildings/:id/qr → generate QR code
router.get('/:id/qr', async (req, res) => {
  const { id } = req.params;
  const db = await connectDB();
  const building = await findBuilding(db, id);

  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  // Link to frontend feedback/checkin page
  const frontendUrl = `${process.env.FRONTEND_URL}/feedback/${building.id}`;

  try {
    const qrImage = await QRCode.toDataURL(frontendUrl);
    res.json({ building: building.name, qr: qrImage });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// 🟢 POST /api/buildings/:id/review → submit review + crowdedness
router.post('/:id/review', async (req, res) => {
  const { id } = req.params;
  const { crowdedness, review } = req.body;
  const db = await connectDB();
  const building = await findBuilding(db, id);
  if (!building) {
    return res.status(404).json({ error: 'Building not found' });
  }

  // Update crowdness (simple average)
  const newCrowdedness = (building.crowdedness + crowdedness) / 2;
  // Add review
  const newReviews = building.reviews ? [...building.reviews, { review, crowdedness, timestamp: new Date() }] : [{ review, crowdedness, timestamp: new Date() }];
  await db.collection('buildings').updateOne(
    { _id: building._id },
    { $set: { crowdedness: newCrowdedness, reviews: newReviews } }
  );
  const updated = await db.collection('buildings').findOne({ _id: building._id });
  res.json({ message: 'Review submitted successfully', building: updated });
});

module.exports = router;
