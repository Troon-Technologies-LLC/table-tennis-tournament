// Teams data
export const teams = {
  'techstorm-duo': {
    id: 'techstorm-duo',
    name: 'Techstorm Duo',
    players: ['Figar', 'Hussain']
  },
  'code-press': {
    id: 'code-press',
    name: 'The Code Press',
    players: ['Abbas', 'Ahmed']
  },
  'bug-busters': {
    id: 'bug-busters',
    name: 'Bug Busters',
    players: ['Usman', 'Amin']
  },
  'cool-coders': {
    id: 'cool-coders',
    name: 'Cool Coders',
    players: ['Waqas', 'Nasir']
  },
  'backend-bosses': {
    id: 'backend-bosses',
    name: 'Backend Bosses',
    players: ['Fahad', 'Mehmood']
  },
  'comfy-stackers': {
    id: 'comfy-stackers',
    name: 'Comfy Stackers',
    players: ['Mateen', 'Abubakar']
  },
  'tiny-titan': {
    id: 'tiny-titan',
    name: 'Tiny & Titan',
    players: ['Ehtisham', 'Mehboob']
  },
  'unmatched-buddies': {
    id: 'unmatched-buddies',
    name: 'Unmatched Buddies',
    players: ['Nouman', 'Umair']
  },
  'python-action': {
    id: 'python-action',
    name: 'Python in Action',
    players: ['Faizan', 'Aziz']
  }
};

// Match schedule
export const schedule = [
  {
    day: 1,
    matches: [
      { id: 'd1m1', team1: 'code-press', team2: 'bug-busters', score1: null, score2: null, subMatches: [null, null, null] },
      { id: 'd1m2', team1: 'cool-coders', team2: 'comfy-stackers', score1: null, score2: null, subMatches: [null, null, null] }
    ]
  },
  {
    day: 2,
    matches: [
      { id: 'd2m1', team1: 'techstorm-duo', team2: 'python-action', score1: null, score2: null, subMatches: [null, null, null] },
      { id: 'd2m2', team1: 'backend-bosses', team2: 'tiny-titan', score1: null, score2: null, subMatches: [null, null, null] }
    ]
  },
  {
    day: 3,
    matches: [
      { id: 'd3m1', team1: 'code-press', team2: 'bug-busters', score1: null, score2: null, subMatches: [null, null, null] },
      { id: 'd3m2', team1: 'cool-coders', team2: 'comfy-stackers', score1: null, score2: null, subMatches: [null, null, null] }
    ]
  },
  {
    day: 4,
    matches: [
      { id: 'd4m1', team1: 'techstorm-duo', team2: 'backend-bosses', score1: null, score2: null, subMatches: [null, null, null] },
      { id: 'd4m2', team1: 'tiny-titan', team2: 'unmatched-buddies', score1: null, score2: null, subMatches: [null, null, null] }
    ]
  },
  {
    day: 5,
    matches: [
      { id: 'd5m1', team1: 'code-press', team2: 'cool-coders', score1: null, score2: null, subMatches: [null, null, null] },
      { id: 'd5m2', team1: 'bug-busters', team2: 'python-action', score1: null, score2: null, subMatches: [null, null, null] }
    ]
  },
  {
    day: 6,
    matches: [
      { id: 'd6m1', team1: 'comfy-stackers', team2: 'tiny-titan', score1: null, score2: null, subMatches: [null, null, null] },
      { id: 'd6m2', team1: 'unmatched-buddies', team2: 'backend-bosses', score1: null, score2: null, subMatches: [null, null, null] }
    ]
  },
  {
    day: 7,
    matches: [
      { id: 'd7m1', team1: 'techstorm-duo', team2: 'cool-coders', score1: null, score2: null, subMatches: [null, null, null] },
      { id: 'd7m2', team1: 'python-action', team2: 'code-press', score1: null, score2: null, subMatches: [null, null, null] }
    ]
  },
  {
    day: 8,
    matches: [
      { id: 'd8m1', team1: 'bug-busters', team2: 'comfy-stackers', score1: null, score2: null, subMatches: [null, null, null] },
      { id: 'd8m2', team1: 'tiny-titan', team2: 'unmatched-buddies', score1: null, score2: null, subMatches: [null, null, null] }
    ]
  },
  {
    day: 9,
    matches: [
      { id: 'd9m1', team1: 'techstorm-duo', team2: 'tiny-titan', score1: null, score2: null, subMatches: [null, null, null] },
      { id: 'd9m2', team1: 'backend-bosses', team2: 'python-action', score1: null, score2: null, subMatches: [null, null, null] }
    ]
  }
];
