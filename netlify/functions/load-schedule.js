import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, '../../db/tournament.json');

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.warn('MONGODB_URI not set, skipping MongoDB');
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers
    });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    let schedule = null;
    let source = null;

    // Try MongoDB first
    try {
      const client = await connectToDatabase();
      if (client) {
        const db = client.db('tournament');
        const collection = db.collection('schedule');
        const doc = await collection.findOne({ _id: 'tournament-schedule' });
        
        if (doc && doc.schedule) {
          schedule = doc.schedule;
          source = 'MongoDB';
          console.log('Schedule loaded from MongoDB');
        }
      }
    } catch (err) {
      console.warn('MongoDB load failed:', err.message);
    }

    // If MongoDB failed, try JSON file
    if (!schedule) {
      try {
        const data = await fs.readFile(DB_FILE, 'utf-8');
        schedule = JSON.parse(data);
        source = 'JSON file';
        console.log('Schedule loaded from JSON file:', DB_FILE);
      } catch (err) {
        console.warn('JSON file load failed:', err.message);
      }
    }

    if (!schedule) {
      console.log('No saved schedule found');
      return new Response(JSON.stringify({ 
        schedule: null, 
        message: 'No saved data available. Using default schedule.' 
      }), {
        status: 200,
        headers
      });
    }

    return new Response(JSON.stringify({ 
      schedule,
      message: `Schedule loaded successfully from ${source}`,
      source
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error loading schedule:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers
    });
  }
};
