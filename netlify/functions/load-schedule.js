import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
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
    console.error('Failed to connect to MongoDB:', error);
    throw error;
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
    const client = await connectToDatabase();
    const db = client.db('tournament');
    const collection = db.collection('schedule');
    
    // Find the tournament schedule
    const doc = await collection.findOne({ _id: 'tournament-schedule' });
    
    if (!doc || !doc.schedule) {
      console.log('No saved schedule found in MongoDB');
      return new Response(JSON.stringify({ 
        schedule: null, 
        message: 'No saved data available. Using default schedule.' 
      }), {
        status: 200,
        headers
      });
    }

    console.log('Schedule loaded from MongoDB');
    
    return new Response(JSON.stringify({ 
      schedule: doc.schedule, 
      message: 'Schedule loaded successfully',
      updatedAt: doc.updatedAt
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
