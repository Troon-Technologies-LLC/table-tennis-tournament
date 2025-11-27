# Deployment Guide

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Netlify Deployment with MongoDB

### Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user with a strong password
5. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/tournament?retryWrites=true&w=majority`)

### Step 2: Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git" and connect your repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Go to Site settings → Environment variables
7. Add environment variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string from Step 1

### Step 3: Verify Deployment

1. Netlify will automatically build and deploy
2. Visit your site URL
3. Go to Scores tab (password: `admin123`)
4. Enter a test score
5. Refresh the page - the score should persist (loaded from MongoDB)

## How It Works

- **Frontend**: Vue-like vanilla JavaScript app (Vite)
- **Backend**: Netlify Functions (serverless)
- **Database**: MongoDB Atlas (cloud database)
- **Data Flow**:
  - When you save a score → sent to Netlify Function → saved to MongoDB
  - When you load the app → Netlify Function retrieves data from MongoDB
  - If no saved data exists → uses default schedule from `src/data.js`

## Troubleshooting

### "MONGODB_URI is not set"
- Make sure you added the environment variable in Netlify site settings
- Redeploy after adding the variable

### "Connection refused"
- Check your MongoDB connection string is correct
- Ensure your IP is whitelisted in MongoDB Atlas (or use 0.0.0.0/0 for development)

### Data not persisting
- Check browser console (F12) for errors
- Check Netlify function logs in the Netlify dashboard
- Verify MongoDB connection string is valid
