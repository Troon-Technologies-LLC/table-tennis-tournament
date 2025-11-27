// Use relative URLs so they work both locally and on Netlify
const API_URL = '/.netlify/functions/save-schedule';
const LOAD_API_URL = '/.netlify/functions/load-schedule';

// Load match data from Excel file
export async function loadMatches() {
    try {
        console.log('Loading data from Excel file...');
        const response = await fetch(LOAD_API_URL);
        
        if (!response.ok) {
            console.warn('Failed to load from Excel:', response.statusText);
            return null;
        }
        
        const data = await response.json();
        console.log('Data loaded from Excel:', data);
        return data.schedule || null;
    } catch (error) {
        console.warn('Could not load from Excel file:', error.message);
        return null;
    }
}

// Save match data to Excel file only
export async function saveMatches(matches) {
    try {
        console.log('Saving data to Excel file...');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(matches)
        });
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            console.error('Failed to save to Excel:', response.statusText);
            return false;
        }
        
        const data = await response.json();
        console.log('Excel saved successfully:', data.message);
        return true;
    } catch (error) {
        console.error('Error saving to Excel:', error.message);
        return false;
    }
}

// Reset all data
export async function resetTournament() {
    try {
        console.log('Resetting tournament data...');
        const response = await fetch(API_URL + '?reset=true', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([])
        });
        
        if (response.ok) {
            console.log('Tournament data reset');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error resetting data:', error);
        return false;
    }
}
