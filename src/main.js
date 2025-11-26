import './style.css';
import { schedule as initialSchedule } from './data.js';
import { loadMatches, saveMatches } from './storage.js';
import { createHeader } from './components/Header.js';
import { createScheduleView } from './components/ScheduleView.js';
import { createStandingsView } from './components/StandingsView.js';
import { createScoreEntryView } from './components/ScoreEntryView.js';
import { getPlayoffTeams } from './calculations.js';

// App state
let currentView = 'schedule';
let schedule = JSON.parse(JSON.stringify(initialSchedule)); // Deep copy

// Initialize app
function init() {
  // Load saved data
  const savedMatches = loadMatches();
  if (savedMatches) {
    schedule = savedMatches;
  }

  render();
}

// Render the app
function render() {
  const app = document.querySelector('#app');
  app.innerHTML = '';

  // Create header
  const header = createHeader(currentView, navigateTo);
  app.appendChild(header);

  // Create main content
  const main = document.createElement('main');
  main.className = 'main-content';

  // Render current view
  let view;
  switch (currentView) {
    case 'schedule':
      view = createScheduleView(schedule);
      break;
    case 'standings':
      view = createStandingsView(schedule);
      break;
    case 'scores':
      view = createScoreEntryView(schedule, saveScore);
      break;
    default:
      view = createScheduleView(schedule);
  }

  main.appendChild(view);
  app.appendChild(main);
}

// Navigate to a different view
function navigateTo(view) {
  if (view === 'scores') {
    const password = prompt('Enter admin password to edit scores:');
    if (password !== 'admin123') { // Simple password
      alert('Incorrect password!');
      return;
    }
  }
  currentView = view;
  render();
}

// Save a match score
function saveScore(matchId, score1, score2, subMatches) {
  // Find and update the match
  schedule.forEach(day => {
    day.matches.forEach(match => {
      if (match.id === matchId) {
        match.score1 = score1;
        match.score2 = score2;
        match.subMatches = subMatches;
      }
    });
  });

  checkAndGeneratePlayoffs();

  // Save to localStorage
  saveMatches(schedule);

  // Re-render if in scores view to show new matches if any
  if (currentView === 'scores') {
    render();
  }
}

function checkAndGeneratePlayoffs() {
  // Check if regular season (Day 9) is finished
  const day9 = schedule.find(d => d.day === 9);
  if (!day9) return;

  const regularSeasonFinished = day9.matches.every(m => m.score1 !== null && m.score2 !== null);

  // Generate Semi-Finals (Day 10)
  let day10 = schedule.find(d => d.day === 10);
  if (regularSeasonFinished && !day10) {
    const topTeams = getPlayoffTeams(schedule);
    if (topTeams && topTeams.length >= 4) {
      day10 = {
        day: 10,
        title: 'Semi-Finals',
        matches: [
          { id: 'sf1', team1: topTeams[0].teamId, team2: topTeams[3].teamId, score1: null, score2: null, subMatches: [null, null, null] },
          { id: 'sf2', team1: topTeams[1].teamId, team2: topTeams[2].teamId, score1: null, score2: null, subMatches: [null, null, null] }
        ]
      };
      schedule.push(day10);
      alert('Semi-Finals generated!');
    }
  }

  // Generate Final (Day 11)
  if (day10) {
    const sfFinished = day10.matches.every(m => m.score1 !== null && m.score2 !== null);
    let day11 = schedule.find(d => d.day === 11);

    if (sfFinished && !day11) {
      const sf1 = day10.matches[0];
      const sf2 = day10.matches[1];

      const winner1 = sf1.score1 > sf1.score2 ? sf1.team1 : sf1.team2;
      const winner2 = sf2.score1 > sf2.score2 ? sf2.team1 : sf2.team2;

      day11 = {
        day: 11,
        title: 'Final',
        matches: [
          { id: 'final', team1: winner1, team2: winner2, score1: null, score2: null, subMatches: [null, null, null] }
        ]
      };
      schedule.push(day11);
      alert('Final match generated!');
    }
  }
}

// Start the app
init();
