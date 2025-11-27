import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const loadDirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(loadDirname, '../../db/tournament.json');

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

    // Load from JSON file
    try {
      const data = await fs.readFile(DB_FILE, 'utf-8');
      schedule = JSON.parse(data);
      console.log('Schedule loaded from JSON file:', DB_FILE);
    } catch (err) {
      console.warn('JSON file load failed:', err.message);
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
      message: 'Schedule loaded successfully from file'
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
