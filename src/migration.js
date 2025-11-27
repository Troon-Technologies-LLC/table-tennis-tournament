import { saveMatches } from './storage.js';

/**
 * Migrate data from localStorage to MongoDB
 * Call this once to sync any existing local data to MongoDB
 */
export async function migrateLocalToMongoDB() {
    try {
        const STORAGE_KEY = 'table-tennis-tournament-data';
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (!stored) {
            console.log('No local data to migrate');
            return false;
        }
        
        const localData = JSON.parse(stored);
        console.log('Found local data, migrating to MongoDB...');
        
        // Save to MongoDB
        const success = await saveMatches(localData);
        
        if (success) {
            console.log('Migration successful! Data synced to MongoDB');
            // Optionally clear localStorage after successful migration
            // localStorage.removeItem(STORAGE_KEY);
            return true;
        } else {
            console.warn('Migration failed, local data still available');
            return false;
        }
    } catch (error) {
        console.error('Migration error:', error);
        return false;
    }
}

/**
 * Clear all local storage data
 */
export function clearLocalStorage() {
    try {
        const STORAGE_KEY = 'table-tennis-tournament-data';
        localStorage.removeItem(STORAGE_KEY);
        console.log('Local storage cleared');
        return true;
    } catch (error) {
        console.error('Error clearing local storage:', error);
        return false;
    }
}
