import express from 'express';
import Excel from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint to save schedule to Excel and JSON
app.post('/api/save-schedule', async (req, res) => {
  try {
    const schedule = req.body;
    const dbDir = path.join(__dirname, 'db');
    
    // Ensure db directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Save as JSON for easy retrieval
    const jsonFilePath = path.join(dbDir, 'tournament.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(schedule, null, 2));
    console.log('Data saved to JSON:', jsonFilePath);

    // Save as Excel for viewing
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('Schedule');
    
    // Add header
    sheet.addRow(['Day', 'Match ID', 'Team 1', 'Team 2', 'Score 1', 'Score 2', 'Sub-Match 1', 'Sub-Match 2', 'Sub-Match 3']);
    
    // Add data
    schedule.forEach(day => {
      day.matches.forEach(match => {
        sheet.addRow([
          day.day,
          match.id,
          match.team1,
          match.team2,
          match.score1 ?? '',
          match.score2 ?? '',
          match.subMatches?.[0] ?? '',
          match.subMatches?.[1] ?? '',
          match.subMatches?.[2] ?? ''
        ]);
      });
    });

    const excelFilePath = path.join(dbDir, 'tournament.xlsx');
    await workbook.xlsx.writeFile(excelFilePath);
    console.log('Data saved to Excel:', excelFilePath);
    
    res.json({ success: true, message: 'Schedule saved to Excel and JSON', file: excelFilePath });
  } catch (error) {
    console.error('Error saving schedule:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to load schedule from JSON
app.get('/api/load-schedule', (req, res) => {
  try {
    const dbDir = path.join(__dirname, 'db');
    const jsonFilePath = path.join(dbDir, 'tournament.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      console.log('No saved data found');
      return res.json({ schedule: null, message: 'No saved data' });
    }
    
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    const schedule = JSON.parse(data);
    console.log('Data loaded from JSON');
    
    res.json({ schedule, message: 'Data loaded successfully' });
  } catch (error) {
    console.error('Error loading schedule:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
