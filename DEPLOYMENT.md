# Deployment Guide - MongoDB Single Source of Truth

## Architecture

All data is now stored exclusively in **MongoDB**. No local storage, no files.

```
Frontend (Vite) ←→ Netlify Functions ←→ MongoDB Atlas
```

## Local Development

1. Create `.env.local` file with MongoDB connection:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tournament?retryWrites=true&w=majority
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user with a strong password
5. Get your connection string:
   - Click "Connect" → "Drivers"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/tournament?retryWrites=true&w=majority`

## Netlify Deployment

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git" and connect your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Go to Site settings → Environment variables
6. Add environment variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string

7. Netlify will automatically build and deploy

## Testing the Deployment

1. Visit your Netlify site URL
2. Go to Scores tab (password: `admin123`)
3. Enter a test score
4. Refresh the page - score should persist from MongoDB
5. Check Netlify function logs for any errors

## Data Flow

- **Save**: UI → Netlify Function → MongoDB
- **Load**: MongoDB → Netlify Function → UI
- **Default**: If no data in MongoDB, uses default schedule from `src/data.js`

## Migration from Local Storage

If you have existing data in localStorage:

```javascript
import { migrateLocalToMongoDB } from './src/migration.js';
migrateLocalToMongoDB(); // Run in browser console
```

## Troubleshooting

### "MONGODB_URI is not set"
- Verify environment variable is added in Netlify site settings
- Redeploy after adding the variable

### "Connection refused"
- Check MongoDB connection string is correct
- Whitelist your IP in MongoDB Atlas (or use 0.0.0.0/0 for development)
- Ensure database user password doesn't contain special characters (or URL-encode them)

### Data not persisting
- Check browser console (F12) for errors
- Check Netlify function logs in dashboard
- Verify MongoDB connection string format is correct

### Functions not found
- Ensure `netlify.toml` exists with correct `functions` path
- Rebuild and redeploy
