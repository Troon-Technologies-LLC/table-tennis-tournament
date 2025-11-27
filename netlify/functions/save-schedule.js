import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const saveDirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(saveDirname, '../../db/tournament.json');

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

    // Save to JSON file
    try {
      const dbDir = path.dirname(DB_FILE);
      await fs.mkdir(dbDir, { recursive: true });
      await fs.writeFile(DB_FILE, JSON.stringify(schedule, null, 2), 'utf-8');
      console.log('Schedule saved to JSON file:', DB_FILE);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Schedule saved successfully'
      }), {
        status: 200,
        headers
      });
    } catch (err) {
      console.error('Error saving to JSON:', err.message);
      return new Response(JSON.stringify({ 
        success: false,
        error: err.message
      }), {
        status: 500,
        headers
      });
    }
  } catch (error) {
    console.error('Error saving schedule:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers
    });
  }
};
