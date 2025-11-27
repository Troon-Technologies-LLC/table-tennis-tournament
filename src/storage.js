// File-based storage API endpoints
const SAVE_API_URL = '/.netlify/functions/save-schedule';
const LOAD_API_URL = '/.netlify/functions/load-schedule';
const STORAGE_KEY = 'tournament-schedule';

/**
 * Check if we're in development mode (Vite dev server)
 */
function isDevelopment() {
    return import.meta.env.DEV;
}

/**
 * Load tournament schedule from JSON file (production) or localStorage (development)
 * Falls back to default schedule if no data exists
 */
export async function loadMatches() {
    try {
        if (isDevelopment()) {
            // In development, use localStorage
            console.log('Loading schedule from localStorage...');
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                console.log('Schedule loaded from localStorage');
                return JSON.parse(data);
            }
            return null;
        } else {
            // In production, use Netlify functions
            console.log('Loading schedule from file...');
            const response = await fetch(LOAD_API_URL);
            
            if (!response.ok) {
                console.warn('Failed to load from file:', response.statusText);
                return null;
            }
            
            const data = await response.json();
            console.log('Schedule loaded from file:', data.message);
            return data.schedule || null;
        }
    } catch (error) {
        console.warn('Could not load schedule:', error.message);
        return null;
    }
}

/**
 * Save tournament schedule to JSON file (production) or localStorage (development)
 * This is the single source of truth for all data
 */
export async function saveMatches(matches) {
    try {
        if (isDevelopment()) {
            // In development, use localStorage
            console.log('Saving schedule to localStorage...');
            localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
            console.log('Schedule saved to localStorage');
            return true;
        } else {
            // In production, use Netlify functions
            console.log('Saving schedule to file...');
            
            const response = await fetch(SAVE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(matches)
            });
            
            if (!response.ok) {
                console.error('Failed to save to file:', response.statusText);
                return false;
            }
            
            const data = await response.json();
            console.log('Schedule saved to file:', data.message);
            return true;
        }
    } catch (error) {
        console.error('Error saving to file:', error.message);
        return false;
    }
}

/**
 * Reset tournament data in JSON file (production) or localStorage (development)
 */
export async function resetTournament() {
    try {
        if (isDevelopment()) {
            // In development, use localStorage
            console.log('Resetting tournament data...');
            localStorage.removeItem(STORAGE_KEY);
            console.log('Tournament data reset');
            return true;
        } else {
            // In production, use Netlify functions
            console.log('Resetting tournament data...');
            const response = await fetch(SAVE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([])
            });
            
            if (response.ok) {
                console.log('Tournament data reset');
                return true;
            }
            return false;
        }
    } catch (error) {
        console.error('Error resetting data:', error);
        return false;
    }
}
