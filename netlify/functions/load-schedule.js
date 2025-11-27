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
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('tournament');
    const collection = db.collection('schedule');
    
    // Find the tournament schedule
    const doc = await collection.findOne({ _id: 'tournament-schedule' });
    
    if (!doc || !doc.schedule) {
      console.log('No saved schedule found in MongoDB');
      return res.status(200).json({ 
        schedule: null, 
        message: 'No saved data available. Using default schedule.' 
      });
    }

    console.log('Schedule loaded from MongoDB');
    
    res.status(200).json({ 
      schedule: doc.schedule, 
      message: 'Schedule loaded successfully',
      updatedAt: doc.updatedAt
    });
  } catch (error) {
    console.error('Error loading schedule:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
