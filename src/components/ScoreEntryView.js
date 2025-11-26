import { teams } from '../data.js';

export function createScoreEntryView(schedule, onSave) {
  const container = document.createElement('div');
  container.className = 'score-entry-view';

  let html = `
    <div class="view-header">
      <h2>Enter Match Scores</h2>
      <p class="view-description">Enter scores for 3 matches. Best of 3 wins the fixture (20 points)!</p>
    </div>
  `;

  schedule.forEach(day => {
    html += `
      <div class="day-section">
        <h3 class="day-header">Day ${day.day}</h3>
        <div class="score-entry-grid">
    `;

    day.matches.forEach(match => {
      const team1 = teams[match.team1];
      const team2 = teams[match.team2];
      const hasScore = match.score1 !== null && match.score2 !== null;

      // Ensure subMatches exists (for backward compatibility or if not initialized)
      const subMatches = match.subMatches || [null, null, null];

      html += `
        <div class="score-entry-card" data-match-id="${match.id}">
          <div class="match-header">
            <div class="team-name">${team1.name}</div>
            <div class="vs">VS</div>
            <div class="team-name">${team2.name}</div>
          </div>
          
          <div class="sub-matches-container">
            ${[0, 1, 2].map(i => {
        const subMatch = subMatches[i] || { score1: '', score2: '' };
        return `
                <div class="sub-match-row">
                    <span class="match-label">M${i + 1}</span>
                    <input 
                      type="number" 
                      class="score-input" 
                      data-team="team1"
                      data-submatch="${i}"
                      min="0" 
                      max="99"
                      value="${subMatch.score1 !== undefined && subMatch.score1 !== null ? subMatch.score1 : ''}"
                      placeholder="0"
                    />
                    <span>-</span>
                    <input 
                      type="number" 
                      class="score-input" 
                      data-team="team2"
                      data-submatch="${i}"
                      min="0" 
                      max="99"
                      value="${subMatch.score2 !== undefined && subMatch.score2 !== null ? subMatch.score2 : ''}"
                      placeholder="0"
                    />
                </div>
                `;
      }).join('')}
          </div>
          
          <button class="save-score-btn" data-match-id="${match.id}">
            ${hasScore ? '✓ Update' : 'Save Score'}
          </button>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Add event listeners for save buttons
  container.querySelectorAll('.save-score-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const matchId = btn.dataset.matchId;
      const card = container.querySelector(`[data-match-id="${matchId}"]`);

      const subMatchesData = [];
      let team1Wins = 0;
      let team2Wins = 0;
      let incomplete = false;

      // Collect scores for all 3 sub-matches
      for (let i = 0; i < 3; i++) {
        const s1Input = card.querySelector(`input[data-team="team1"][data-submatch="${i}"]`);
        const s2Input = card.querySelector(`input[data-team="team2"][data-submatch="${i}"]`);

        const s1 = s1Input.value.trim();
        const s2 = s2Input.value.trim();

        if (s1 === '' || s2 === '') {
          incomplete = true;
          subMatchesData.push(null);
        } else {
          const s1Num = parseInt(s1, 10);
          const s2Num = parseInt(s2, 10);

          if (isNaN(s1Num) || isNaN(s2Num) || s1Num < 0 || s2Num < 0) {
            alert(`Invalid score in Match ${i + 1}`);
            return;
          }

          subMatchesData.push({ score1: s1Num, score2: s2Num });

          if (s1Num > s2Num) team1Wins++;
          else if (s2Num > s1Num) team2Wins++;
        }
      }

      if (incomplete) {
        alert('Please enter scores for all 3 matches');
        return;
      }

      // Determine fixture winner based on sub-matches won
      // Even if one team wins 2-0, we still record the 3rd match as per "3 match in each team math"
      // Assuming all 3 must be played.

      onSave(matchId, team1Wins, team2Wins, subMatchesData);

      // Update button text
      btn.textContent = '✓ Updated!';
      btn.classList.add('success');
      setTimeout(() => {
        btn.textContent = '✓ Update';
        btn.classList.remove('success');
      }, 1500);
    });
  });

  return container;
}
