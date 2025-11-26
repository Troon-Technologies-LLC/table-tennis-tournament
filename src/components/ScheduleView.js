import { teams } from '../data.js';

export function createScheduleView(schedule) {
  const container = document.createElement('div');
  container.className = 'schedule-view';

  let html = '<div class="view-header"><h2>Match Schedule</h2></div>';

  schedule.forEach(day => {
    html += `
      <div class="day-section">
        <h3 class="day-header">${day.title ? day.title : `Day ${day.day}`}</h3>
        <div class="matches-grid">
    `;

    day.matches.forEach(match => {
      const team1 = teams[match.team1];
      const team2 = teams[match.team2];
      const hasScore = match.score1 !== null && match.score2 !== null;
      const isComplete = hasScore;

      html += `
        <div class="match-card ${isComplete ? 'completed' : 'upcoming'}">
          <div class="match-team">
            <div class="team-name">${team1.name}</div>
            <div class="team-players">${team1.players.join(' & ')}</div>
          </div>
          <div class="match-score">
            ${hasScore ? `
              <div class="score-display">
                <span class="score ${match.score1 > match.score2 ? 'winner' : ''}">${match.score1}</span>
                <span class="score-separator">-</span>
                <span class="score ${match.score2 > match.score1 ? 'winner' : ''}">${match.score2}</span>
              </div>
            ` : `
              <div class="vs-text">VS</div>
            `}
          </div>
          <div class="match-team">
            <div class="team-name">${team2.name}</div>
            <div class="team-players">${team2.players.join(' & ')}</div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  return container;
}
