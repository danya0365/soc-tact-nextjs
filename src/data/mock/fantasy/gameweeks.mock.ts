// Mock data for Fantasy Football Gameweeks

export interface Gameweek {
  id: number;
  name: string;
  deadline: string; // ISO date string
  isFinished: boolean;
  isCurrent: boolean;
  isNext: boolean;
  averageScore: number;
  highestScore: number;
  mostCaptained: string; // player id
  mostTransferredIn: string; // player id
  mostTransferredOut: string; // player id
  chipPlays: {
    wildcard: number;
    benchBoost: number;
    tripleCaptain: number;
    freeHit: number;
  };
}

export interface GameweekFixture {
  id: string;
  gameweek: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoffTime: string; // ISO date string
  homeScore?: number;
  awayScore?: number;
  isFinished: boolean;
  difficulty: {
    home: 1 | 2 | 3 | 4 | 5;
    away: 1 | 2 | 3 | 4 | 5;
  };
}

// Current season: 2024/25
export const CURRENT_SEASON = '2024/25';
export const CURRENT_GAMEWEEK = 10;
export const TOTAL_GAMEWEEKS = 38;

// Gameweeks data
export const GAMEWEEKS: Gameweek[] = [
  {
    id: 1,
    name: 'Gameweek 1',
    deadline: '2024-08-16T18:30:00Z',
    isFinished: true,
    isCurrent: false,
    isNext: false,
    averageScore: 52,
    highestScore: 118,
    mostCaptained: 'fwd1', // Haaland
    mostTransferredIn: 'mid1', // Salah
    mostTransferredOut: 'mid4', // Bruno
    chipPlays: {
      wildcard: 12500,
      benchBoost: 0,
      tripleCaptain: 8900,
      freeHit: 0,
    },
  },
  {
    id: 2,
    name: 'Gameweek 2',
    deadline: '2024-08-23T18:30:00Z',
    isFinished: true,
    isCurrent: false,
    isNext: false,
    averageScore: 48,
    highestScore: 112,
    mostCaptained: 'fwd1',
    mostTransferredIn: 'mid2', // KDB
    mostTransferredOut: 'fwd2',
    chipPlays: {
      wildcard: 8200,
      benchBoost: 0,
      tripleCaptain: 6500,
      freeHit: 0,
    },
  },
  {
    id: 3,
    name: 'Gameweek 3',
    deadline: '2024-08-30T18:30:00Z',
    isFinished: true,
    isCurrent: false,
    isNext: false,
    averageScore: 55,
    highestScore: 125,
    mostCaptained: 'mid1',
    mostTransferredIn: 'def1', // TAA
    mostTransferredOut: 'def3',
    chipPlays: {
      wildcard: 6800,
      benchBoost: 0,
      tripleCaptain: 5200,
      freeHit: 0,
    },
  },
  {
    id: 9,
    name: 'Gameweek 9',
    deadline: '2024-10-25T18:30:00Z',
    isFinished: true,
    isCurrent: false,
    isNext: false,
    averageScore: 58,
    highestScore: 132,
    mostCaptained: 'fwd1',
    mostTransferredIn: 'mid3', // Saka
    mostTransferredOut: 'mid5',
    chipPlays: {
      wildcard: 4200,
      benchBoost: 3500,
      tripleCaptain: 2800,
      freeHit: 1200,
    },
  },
  {
    id: 10,
    name: 'Gameweek 10',
    deadline: '2025-10-08T18:30:00Z', // Next deadline
    isFinished: false,
    isCurrent: true,
    isNext: false,
    averageScore: 0,
    highestScore: 0,
    mostCaptained: 'fwd1',
    mostTransferredIn: 'fwd5', // Palmer
    mostTransferredOut: 'mid4',
    chipPlays: {
      wildcard: 0,
      benchBoost: 0,
      tripleCaptain: 0,
      freeHit: 0,
    },
  },
  {
    id: 11,
    name: 'Gameweek 11',
    deadline: '2025-10-15T18:30:00Z',
    isFinished: false,
    isCurrent: false,
    isNext: true,
    averageScore: 0,
    highestScore: 0,
    mostCaptained: '',
    mostTransferredIn: '',
    mostTransferredOut: '',
    chipPlays: {
      wildcard: 0,
      benchBoost: 0,
      tripleCaptain: 0,
      freeHit: 0,
    },
  },
];

// Gameweek 10 Fixtures (Current)
export const GAMEWEEK_FIXTURES: GameweekFixture[] = [
  {
    id: 'gw10-1',
    gameweek: 10,
    homeTeam: 'Liverpool',
    awayTeam: 'Bournemouth',
    homeTeamId: 'LIV',
    awayTeamId: 'BOU',
    kickoffTime: '2025-10-08T14:00:00Z',
    difficulty: { home: 2, away: 4 },
    isFinished: false,
  },
  {
    id: 'gw10-2',
    gameweek: 10,
    homeTeam: 'Arsenal',
    awayTeam: 'Southampton',
    homeTeamId: 'ARS',
    awayTeamId: 'SOU',
    kickoffTime: '2025-10-08T14:00:00Z',
    difficulty: { home: 2, away: 5 },
    isFinished: false,
  },
  {
    id: 'gw10-3',
    gameweek: 10,
    homeTeam: 'Manchester City',
    awayTeam: 'West Ham',
    homeTeamId: 'MCI',
    awayTeamId: 'WHU',
    kickoffTime: '2025-10-08T16:30:00Z',
    difficulty: { home: 3, away: 4 },
    isFinished: false,
  },
  {
    id: 'gw10-4',
    gameweek: 10,
    homeTeam: 'Manchester United',
    awayTeam: 'Everton',
    homeTeamId: 'MUN',
    awayTeamId: 'EVE',
    kickoffTime: '2025-10-08T14:00:00Z',
    difficulty: { home: 3, away: 4 },
    isFinished: false,
  },
  {
    id: 'gw10-5',
    gameweek: 10,
    homeTeam: 'Tottenham',
    awayTeam: 'Crystal Palace',
    homeTeamId: 'TOT',
    awayTeamId: 'CRY',
    kickoffTime: '2025-10-08T14:00:00Z',
    difficulty: { home: 3, away: 4 },
    isFinished: false,
  },
  {
    id: 'gw10-6',
    gameweek: 10,
    homeTeam: 'Chelsea',
    awayTeam: 'Brighton',
    homeTeamId: 'CHE',
    awayTeamId: 'BHA',
    kickoffTime: '2025-10-09T19:00:00Z',
    difficulty: { home: 3, away: 3 },
    isFinished: false,
  },
  {
    id: 'gw10-7',
    gameweek: 10,
    homeTeam: 'Newcastle',
    awayTeam: 'Fulham',
    homeTeamId: 'NEW',
    awayTeamId: 'FUL',
    kickoffTime: '2025-10-09T19:00:00Z',
    difficulty: { home: 3, away: 3 },
    isFinished: false,
  },
  {
    id: 'gw10-8',
    gameweek: 10,
    homeTeam: 'Aston Villa',
    awayTeam: 'Wolves',
    homeTeamId: 'AVL',
    awayTeamId: 'WOL',
    kickoffTime: '2025-10-09T19:00:00Z',
    difficulty: { home: 2, away: 4 },
    isFinished: false,
  },
];

// Helper functions
export const getCurrentGameweek = () => {
  return GAMEWEEKS.find(gw => gw.isCurrent) || GAMEWEEKS[CURRENT_GAMEWEEK - 1];
};

export const getNextGameweek = () => {
  return GAMEWEEKS.find(gw => gw.isNext);
};

export const getGameweekById = (id: number) => {
  return GAMEWEEKS.find(gw => gw.id === id);
};

export const getGameweekFixtures = (gameweekId: number) => {
  return GAMEWEEK_FIXTURES.filter(fixture => fixture.gameweek === gameweekId);
};

export const getFinishedGameweeks = () => {
  return GAMEWEEKS.filter(gw => gw.isFinished);
};

export const getUpcomingGameweeks = () => {
  return GAMEWEEKS.filter(gw => !gw.isFinished);
};
