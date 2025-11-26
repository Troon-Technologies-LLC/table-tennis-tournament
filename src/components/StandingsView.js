import { calculateStandings, getMatchStats } from '../calculations.js';

export function createStandingsView(schedule) {
    const container = document.createElement('div');
    container.className = 'standings-view';

    const standings = calculateStandings(schedule);
    const stats = getMatchStats(schedule);

    let html = `
    <div class="view-header">
      <h2>Tournament Standings</h2>
      <div class="tournament-stats">
        <span class="stat-badge">Matches Played: ${stats.played}/${stats.total}</span>
        <span class="stat-badge">Remaining: ${stats.remaining}</span>
      </div>
    </div>
    
    <div class="standings-table-container">
      <table class="standings-table">
        <thead>
          <tr>
            <th class="rank-col">#</th>
            <th class="team-col">Team</th>
            <th>P</th>
            <th>W</th>
            <th>L</th>
            <th>GW</th>
            <th>GL</th>
            <th>GD</th>
            <th class="points-col">Pts</th>
          </tr>
        </thead>
        <tbody>
  `;

    standings.forEach((team, index) => {
        const gameDiff = team.gamesWon - team.gamesLost;
        const isTopThree = index < 3 && team.played > 0;

        html += `
      <tr class="${isTopThree ? 'top-team' : ''}">
        <td class="rank-col">
          ${index === 0 && team.points > 0 ? '🥇' : index === 1 && team.points > 0 ? '🥈' : index === 2 && team.points > 0 ? '🥉' : index + 1}
        </td>
        <td class="team-col">${team.name}</td>
        <td>${team.played}</td>
        <td>${team.won}</td>
        <td>${team.lost}</td>
        <td>${team.gamesWon}</td>
        <td>${team.gamesLost}</td>
        <td class="${gameDiff > 0 ? 'positive' : gameDiff < 0 ? 'negative' : ''}">${gameDiff > 0 ? '+' : ''}${gameDiff}</td>
        <td class="points-col"><strong>${team.points}</strong></td>
      </tr>
    `;
    });

    html += `
        </tbody>
      </table>
    </div>
    
    <div class="table-legend">
      <div class="legend-item"><strong>P</strong> = Played</div>
      <div class="legend-item"><strong>W</strong> = Won</div>
      <div class="legend-item"><strong>L</strong> = Lost</div>
      <div class="legend-item"><strong>GW</strong> = Games Won</div>
      <div class="legend-item"><strong>GL</strong> = Games Lost</div>
      <div class="legend-item"><strong>GD</strong> = Game Difference</div>
      <div class="legend-item"><strong>Pts</strong> = Points (2 per win)</div>
    </div>
  `;

    container.innerHTML = html;
    return container;
}
