import { getScheduleCollection } from './lib/mongodb.js';

export default async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const schedule = req.body;
    
    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({ error: 'Invalid schedule data' });
    }

    const collection = await getScheduleCollection();
    
    // Upsert the schedule (replace if exists, insert if not)
    const result = await collection.updateOne(
      { _id: 'tournament-schedule' },
      { $set: { schedule, updatedAt: new Date() } },
      { upsert: true }
    );

    console.log('Schedule saved to MongoDB');
    
    res.status(200).json({ 
      success: true, 
      message: 'Schedule saved to MongoDB successfully',
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
  } catch (error) {
    console.error('Error saving schedule:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
