export function createHeader(currentView, onNavigate) {
    const header = document.createElement('header');
    header.className = 'header';

    header.innerHTML = `
    <div class="header-content">
      <div class="header-title">
        <h1>🏓 Table Tennis Tournament</h1>
        <p class="subtitle">Office Championship 2025</p>
      </div>
      <nav class="nav-tabs">
        <button class="nav-tab ${currentView === 'schedule' ? 'active' : ''}" data-view="schedule">
          📅 Schedule
        </button>
        <button class="nav-tab ${currentView === 'standings' ? 'active' : ''}" data-view="standings">
          🏆 Standings
        </button>
        <button class="nav-tab ${currentView === 'scores' ? 'active' : ''}" data-view="scores">
          ⚡ Enter Scores
        </button>
      </nav>
    </div>
  `;

    // Add click handlers
    header.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.dataset.view;
            onNavigate(view);
        });
    });

    return header;
}
