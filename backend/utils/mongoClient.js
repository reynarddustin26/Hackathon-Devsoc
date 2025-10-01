const { MongoClient } = require('mongodb');

let client;
let db;

async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("❌ MONGO_URI not found. Did you set it in Render?");
  }

  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  db = client.db(process.env.DB_NAME || 'Campus');
  console.log("✅ Connected to MongoDB Atlas");
  return db;
}

module.exports = connectDB;
