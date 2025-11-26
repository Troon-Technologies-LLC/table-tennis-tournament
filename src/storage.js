const STORAGE_KEY = 'table-tennis-tournament-data';

// Load match data from localStorage
export function loadMatches() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Save match data to localStorage
export function saveMatches(matches) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// Reset all data
export function resetTournament() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error resetting data:', error);
        return false;
    }
}
