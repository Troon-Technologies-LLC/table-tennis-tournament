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

    const client = await connectToDatabase();
    const db = client.db('tournament');
    const collection = db.collection('schedule');
    
    // Upsert the schedule (replace if exists, insert if not)
    const result = await collection.updateOne(
      { _id: 'tournament-schedule' },
      { $set: { schedule, updatedAt: new Date() } },
      { upsert: true }
    );

    console.log('Schedule saved to MongoDB');
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Schedule saved to MongoDB successfully',
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
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
