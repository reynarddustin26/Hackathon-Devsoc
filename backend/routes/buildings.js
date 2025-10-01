const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();
const connectDB = require('../utils/mongoClient');

// 🔎 Helper: Find building by id OR name
async function findBuilding(db, identifier) {
  if (!identifier) return null;
  return db.collection('Buildings').findOne({
    $or: [
      { id: identifier.toLowerCase() },
      { name: { $regex: new RegExp(`^${identifier}$`, 'i') } }
    ]
  });
}

// 🟢 GET /api/buildings → list all buildings
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const buildings = await db.collection('Buildings').find({}).toArray();
    res.json(buildings);
  } catch (err) {
    console.error('❌ Error fetching buildings:', err);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});

// 🟢 POST /api/buildings/report → add/update crowdedness
router.post('/report', async (req, res) => {
  try {
    const { buildingId, crowdedness } = req.body;
    const db = await connectDB();
    const building = await findBuilding(db, buildingId);

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    const newCrowdedness = (building.crowdedness + crowdedness) / 2;

    await db.collection('Buildings').updateOne(
      { _id: building._id },
      { $set: { crowdedness: newCrowdedness } }
    );

    const updated = await db.collection('Buildings').findOne({ _id: building._id });
    res.json({ message: 'Report added successfully', building: updated });
  } catch (err) {
    console.error('❌ Error reporting crowdedness:', err);
    res.status(500).json({ error: 'Failed to update crowdedness' });
  }
});

// 🟢 POST /api/buildings/checkin → increment occupancy count
router.post('/checkin', async (req, res) => {
  try {
    const { buildingId } = req.body;
    const db = await connectDB();
    const building = await findBuilding(db, buildingId);

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    await db.collection('Buildings').updateOne(
      { _id: building._id },
      { $inc: { count: 1 } }
    );

    const updated = await db.collection('Buildings').findOne({ _id: building._id });
    res.json({ message: 'Checked in successfully', building: updated });
  } catch (err) {
    console.error('❌ Error in checkin:', err);
    res.status(500).json({ error: 'Failed to check in' });
  }
});

// 🟢 POST /api/buildings/checkout → decrement occupancy count
router.post('/checkout', async (req, res) => {
  try {
    const { buildingId } = req.body;
    const db = await connectDB();
    const building = await findBuilding(db, buildingId);

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    if (building.count > 0) {
      await db.collection('Buildings').updateOne(
        { _id: building._id },
        { $inc: { count: -1 } }
      );
    }

    const updated = await db.collection('Buildings').findOne({ _id: building._id });
    res.json({ message: 'Checked out successfully', building: updated });
  } catch (err) {
    console.error('❌ Error in checkout:', err);
    res.status(500).json({ error: 'Failed to check out' });
  }
});

// 🟢 GET /api/buildings/:id/qr → generate QR code
router.get('/:id/qr', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const building = await findBuilding(db, id);

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    const frontendUrl = `${process.env.FRONTEND_URL}/feedback/${building.id}`;
    const qrImage = await QRCode.toDataURL(frontendUrl);

    res.json({ building: building.name, qr: qrImage });
  } catch (err) {
    console.error('❌ Error generating QR:', err);
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// 🟢 POST /api/buildings/:id/review → submit review + crowdedness
router.post('/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { crowdedness, review } = req.body;
    const db = await connectDB();
    const building = await findBuilding(db, id);

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    const newCrowdedness = (building.crowdedness + crowdedness) / 2;
    const newReviews = building.reviews
      ? [...building.reviews, { review, crowdedness, timestamp: new Date() }]
      : [{ review, crowdedness, timestamp: new Date() }];

    await db.collection('Buildings').updateOne(
      { _id: building._id },
      { $set: { crowdedness: newCrowdedness, reviews: newReviews } }
    );

    const updated = await db.collection('Buildings').findOne({ _id: building._id });
    res.json({ message: 'Review submitted successfully', building: updated });
  } catch (err) {
    console.error('❌ Error submitting review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
