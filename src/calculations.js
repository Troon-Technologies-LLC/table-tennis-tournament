import { teams } from './data.js';

// Calculate standings from match results
export function calculateStandings(schedule) {
    const standings = {};

    // Initialize standings for all teams
    Object.keys(teams).forEach(teamId => {
        standings[teamId] = {
            teamId,
            name: teams[teamId].name,
            played: 0,
            won: 0,
            lost: 0,
            gamesWon: 0,
            gamesLost: 0,
            points: 0
        };
    });

    // Process all matches
    schedule.forEach(day => {
        day.matches.forEach(match => {
            // Only count matches that have been played
            if (match.score1 !== null && match.score2 !== null) {
                const team1Stats = standings[match.team1];
                const team2Stats = standings[match.team2];

                team1Stats.played++;
                team2Stats.played++;

                team1Stats.gamesWon += match.score1;
                team1Stats.gamesLost += match.score2;
                team2Stats.gamesWon += match.score2;
                team2Stats.gamesLost += match.score1;

                // Determine winner (20 points for win, 0 for loss)
                if (match.score1 > match.score2) {
                    team1Stats.won++;
                    team1Stats.points += 20;
                    team2Stats.lost++;
                } else if (match.score2 > match.score1) {
                    team2Stats.won++;
                    team2Stats.points += 20;
                    team1Stats.lost++;
                }
                // Note: If scores are equal, it's a draw - no points awarded
            }
        });
    });

    // Convert to array and sort
    const standingsArray = Object.values(standings);

    // Sort by: 1) Points (desc), 2) Games won (desc), 3) Games difference (desc)
    standingsArray.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gamesWon !== a.gamesWon) return b.gamesWon - a.gamesWon;
        const aDiff = a.gamesWon - a.gamesLost;
        const bDiff = b.gamesWon - b.gamesLost;
        return bDiff - aDiff;
    });

    return standingsArray;
}

// Get match statistics
export function getMatchStats(schedule) {
    let totalMatches = 0;
    let playedMatches = 0;

    schedule.forEach(day => {
        day.matches.forEach(match => {
            totalMatches++;
            if (match.score1 !== null && match.score2 !== null) {
                playedMatches++;
            }
        });
    });

    return {
        total: totalMatches,
        played: playedMatches,
        remaining: totalMatches - playedMatches
    };
}

// Get top 4 teams for playoffs
export function getPlayoffTeams(schedule) {
    const stats = getMatchStats(schedule);
    if (stats.remaining > 0) {
        return null; // Season not finished
    }

    const standings = calculateStandings(schedule);
    return standings.slice(0, 4);
}
