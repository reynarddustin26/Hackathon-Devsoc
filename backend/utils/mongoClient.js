// backend/utils/mongoClient.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('CrowdTracker'); // Use your DB name
  }
  return db;
}

module.exports = connectDB;
