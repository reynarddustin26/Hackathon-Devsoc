// backend/utils/mongoClient.js
const { MongoClient } = require('mongodb');

let client;
let db;

async function connectDB() {
  if (db) return db;

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not set in .env");
  }

  client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  db = client.db(process.env.DB_NAME || 'crowdtracker'); // fallback name
  console.log("✅ Connected to MongoDB Atlas");
  return db;
}

module.exports = connectDB;
