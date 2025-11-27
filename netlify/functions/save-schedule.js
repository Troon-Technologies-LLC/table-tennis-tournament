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

export default async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (req.method !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    let schedule;
    
    if (typeof req.body === 'string') {
      schedule = JSON.parse(req.body);
    } else {
      schedule = req.body;
    }
    
    if (!schedule || !Array.isArray(schedule)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid schedule data' })
      };
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
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Schedule saved to MongoDB successfully',
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount
      })
    };
  } catch (error) {
    console.error('Error saving schedule:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
