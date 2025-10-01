const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const db = client.db('Campus'); // Use your DB name
    const collection = db.collection('Buildings'); // Use your collection name

    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync('./data/buildings.json', 'utf-8'));

    // Insert all documents
    const result = await collection.insertMany(data);
    console.log(`Inserted ${result.insertedCount} buildings`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();