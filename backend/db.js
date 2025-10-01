const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
  if (db) return db;  // reuse connection

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.log("✅ MongoDB connected");

  db = client.db("Campus"); // your Atlas database name
  return db;
}

module.exports = connectDB;
