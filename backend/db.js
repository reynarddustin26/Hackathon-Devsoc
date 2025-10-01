const { MongoClient } = require("mongodb");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

let db;

async function connectDB() {
  if (db) return db;  // reuse connection

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  console.log("✅ MongoDB connected");

  db = client.db("Campus"); // your Atlas database name
  return db;
}

module.exports = connectDB;
