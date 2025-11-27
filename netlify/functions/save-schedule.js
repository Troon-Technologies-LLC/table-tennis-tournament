import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const saveDirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(saveDirname, '../../db/tournament.json');

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set, skipping MongoDB save');
    return null;
  }

  try {
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
    });

    await client.connect();
    cachedClient = client;
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.warn('Failed to connect to MongoDB:', error.message);
    return null;
  }
}

export default async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    let schedule;
    
    if (typeof req.body === 'string') {
      schedule = JSON.parse(req.body);
    } else {
      schedule = req.body;
    }
    
    if (!schedule || !Array.isArray(schedule)) {
      return new Response(JSON.stringify({ error: 'Invalid schedule data' }), {
        status: 400,
        headers
      });
    }

    const results = {
      json: false,
      mongodb: false,
      errors: []
    };

    // Save to JSON file
    try {
      const dbDir = path.dirname(DB_FILE);
      await fs.mkdir(dbDir, { recursive: true });
      await fs.writeFile(DB_FILE, JSON.stringify(schedule, null, 2), 'utf-8');
      console.log('Schedule saved to JSON file:', DB_FILE);
      results.json = true;
    } catch (err) {
      console.error('Error saving to JSON:', err.message);
      results.errors.push(`JSON save failed: ${err.message}`);
    }

    // Save to MongoDB
    try {
      const client = await connectToDatabase();
      if (client) {
        const db = client.db('tournament');
        const collection = db.collection('schedule');
        
        const result = await collection.updateOne(
          { _id: 'tournament-schedule' },
          { $set: { schedule, updatedAt: new Date() } },
          { upsert: true }
        );
        
        console.log('Schedule saved to MongoDB');
        results.mongodb = true;
      }
    } catch (err) {
      console.error('Error saving to MongoDB:', err.message);
      results.errors.push(`MongoDB save failed: ${err.message}`);
    }

    return new Response(JSON.stringify({ 
      success: results.json || results.mongodb,
      message: 'Schedule saved',
      saved: results
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error saving schedule:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers
    });
  }
};
