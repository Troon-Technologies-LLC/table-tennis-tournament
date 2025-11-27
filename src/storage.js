// MongoDB API endpoints (works both locally and on Netlify)
const SAVE_API_URL = '/.netlify/functions/save-schedule';
const LOAD_API_URL = '/.netlify/functions/load-schedule';

/**
 * Load tournament schedule from MongoDB
 * Falls back to default schedule if no data exists
 */
export async function loadMatches() {
    try {
        console.log('Loading schedule from MongoDB...');
        const response = await fetch(LOAD_API_URL);
        
        if (!response.ok) {
            console.warn('Failed to load from MongoDB:', response.statusText);
            return null;
        }
        
        const data = await response.json();
        console.log('Schedule loaded from MongoDB:', data.message);
        return data.schedule || null;
    } catch (error) {
        console.warn('Could not connect to MongoDB:', error.message);
        return null;
    }
}

/**
 * Save tournament schedule to MongoDB
 * This is the single source of truth for all data
 */
export async function saveMatches(matches) {
    try {
        console.log('Saving schedule to MongoDB...');
        
        const response = await fetch(SAVE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(matches)
        });
        
        if (!response.ok) {
            console.error('Failed to save to MongoDB:', response.statusText);
            return false;
        }
        
        const data = await response.json();
        console.log('Schedule saved to MongoDB:', data.message);
        return true;
    } catch (error) {
        console.error('Error saving to MongoDB:', error.message);
        return false;
    }
}

/**
 * Reset tournament data in MongoDB
 */
export async function resetTournament() {
    try {
        console.log('Resetting tournament data in MongoDB...');
        const response = await fetch(SAVE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([])
        });
        
        if (response.ok) {
            console.log('Tournament data reset in MongoDB');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error resetting data:', error);
        return false;
    }
}
