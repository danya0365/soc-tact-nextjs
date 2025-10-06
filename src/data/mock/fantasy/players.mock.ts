// Mock data for Fantasy Football Players
// Based on Premier League 2024/25 season

export interface FantasyPlayer {
  id: string;
  name: string;
  team: string;
  teamId: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  price: number; // in millions
  totalPoints: number;
  form: number; // average points in last 5 games
  goalsScored: number;
  assists: number;
  cleanSheets: number;
  minutesPlayed: number;
  bonusPoints: number;
  ownership: number; // percentage
  priceChange: number; // price change this week
  nextFixtures: {
    opponent: string;
    difficulty: 1 | 2 | 3 | 4 | 5; // 1 = easiest, 5 = hardest
    isHome: boolean;
  }[];
  lastFiveGames: number[]; // points in last 5 games
  photoUrl?: string;
}

// Premier League Teams
export const FANTASY_TEAMS = [
  { id: 'ARS', name: 'Arsenal', shortName: 'ARS' },
  { id: 'AVL', name: 'Aston Villa', shortName: 'AVL' },
  { id: 'BOU', name: 'Bournemouth', shortName: 'BOU' },
  { id: 'BRE', name: 'Brentford', shortName: 'BRE' },
  { id: 'BHA', name: 'Brighton', shortName: 'BHA' },
  { id: 'CHE', name: 'Chelsea', shortName: 'CHE' },
  { id: 'CRY', name: 'Crystal Palace', shortName: 'CRY' },
  { id: 'EVE', name: 'Everton', shortName: 'EVE' },
  { id: 'FUL', name: 'Fulham', shortName: 'FUL' },
  { id: 'LIV', name: 'Liverpool', shortName: 'LIV' },
  { id: 'MCI', name: 'Manchester City', shortName: 'MCI' },
  { id: 'MUN', name: 'Manchester United', shortName: 'MUN' },
  { id: 'NEW', name: 'Newcastle', shortName: 'NEW' },
  { id: 'NFO', name: 'Nottingham Forest', shortName: 'NFO' },
  { id: 'SOU', name: 'Southampton', shortName: 'SOU' },
  { id: 'TOT', name: 'Tottenham', shortName: 'TOT' },
  { id: 'WHU', name: 'West Ham', shortName: 'WHU' },
  { id: 'WOL', name: 'Wolves', shortName: 'WOL' },
];

// Mock Players Data
export const FANTASY_PLAYERS: FantasyPlayer[] = [
  // Goalkeepers
  {
    id: 'gk1',
    name: 'Alisson Becker',
    team: 'Liverpool',
    teamId: 'LIV',
    position: 'GK',
    price: 5.5,
    totalPoints: 145,
    form: 5.8,
    goalsScored: 0,
    assists: 1,
    cleanSheets: 15,
    minutesPlayed: 3240,
    bonusPoints: 12,
    ownership: 18.5,
    priceChange: 0.1,
    nextFixtures: [
      { opponent: 'BOU', difficulty: 2, isHome: true },
      { opponent: 'MCI', difficulty: 5, isHome: false },
      { opponent: 'NEW', difficulty: 3, isHome: true },
    ],
    lastFiveGames: [6, 6, 2, 7, 6],
  },
  {
    id: 'gk2',
    name: 'David Raya',
    team: 'Arsenal',
    teamId: 'ARS',
    position: 'GK',
    price: 5.5,
    totalPoints: 142,
    form: 5.6,
    goalsScored: 0,
    assists: 0,
    cleanSheets: 14,
    minutesPlayed: 3240,
    bonusPoints: 10,
    ownership: 22.3,
    priceChange: 0,
    nextFixtures: [
      { opponent: 'SOU', difficulty: 2, isHome: true },
      { opponent: 'TOT', difficulty: 4, isHome: false },
      { opponent: 'CHE', difficulty: 4, isHome: true },
    ],
    lastFiveGames: [6, 2, 6, 7, 6],
  },
  {
    id: 'gk3',
    name: 'Ederson',
    team: 'Manchester City',
    teamId: 'MCI',
    position: 'GK',
    price: 5.0,
    totalPoints: 138,
    form: 5.4,
    goalsScored: 0,
    assists: 2,
    cleanSheets: 13,
    minutesPlayed: 3150,
    bonusPoints: 11,
    ownership: 15.7,
    priceChange: -0.1,
    nextFixtures: [
      { opponent: 'WHU', difficulty: 3, isHome: true },
      { opponent: 'LIV', difficulty: 5, isHome: true },
      { opponent: 'AVL', difficulty: 3, isHome: false },
    ],
    lastFiveGames: [2, 6, 6, 7, 6],
  },

  // Defenders
  {
    id: 'def1',
    name: 'Trent Alexander-Arnold',
    team: 'Liverpool',
    teamId: 'LIV',
    position: 'DEF',
    price: 7.0,
    totalPoints: 168,
    form: 6.8,
    goalsScored: 3,
    assists: 12,
    cleanSheets: 15,
    minutesPlayed: 3150,
    bonusPoints: 18,
    ownership: 35.2,
    priceChange: 0.2,
    nextFixtures: [
      { opponent: 'BOU', difficulty: 2, isHome: true },
      { opponent: 'MCI', difficulty: 5, isHome: false },
      { opponent: 'NEW', difficulty: 3, isHome: true },
    ],
    lastFiveGames: [8, 6, 2, 9, 7],
  },
  {
    id: 'def2',
    name: 'William Saliba',
    team: 'Arsenal',
    teamId: 'ARS',
    position: 'DEF',
    price: 6.0,
    totalPoints: 155,
    form: 6.2,
    goalsScored: 2,
    assists: 3,
    cleanSheets: 14,
    minutesPlayed: 3240,
    bonusPoints: 15,
    ownership: 28.9,
    priceChange: 0.1,
    nextFixtures: [
      { opponent: 'SOU', difficulty: 2, isHome: true },
      { opponent: 'TOT', difficulty: 4, isHome: false },
      { opponent: 'CHE', difficulty: 4, isHome: true },
    ],
    lastFiveGames: [6, 7, 2, 6, 10],
  },
  {
    id: 'def3',
    name: 'Kyle Walker',
    team: 'Manchester City',
    teamId: 'MCI',
    position: 'DEF',
    price: 5.5,
    totalPoints: 142,
    form: 5.6,
    goalsScored: 1,
    assists: 5,
    cleanSheets: 13,
    minutesPlayed: 2970,
    bonusPoints: 12,
    ownership: 18.4,
    priceChange: 0,
    nextFixtures: [
      { opponent: 'WHU', difficulty: 3, isHome: true },
      { opponent: 'LIV', difficulty: 5, isHome: true },
      { opponent: 'AVL', difficulty: 3, isHome: false },
    ],
    lastFiveGames: [2, 6, 6, 7, 7],
  },
  {
    id: 'def4',
    name: 'Gabriel Magalhães',
    team: 'Arsenal',
    teamId: 'ARS',
    position: 'DEF',
    price: 6.0,
    totalPoints: 158,
    form: 6.4,
    goalsScored: 4,
    assists: 2,
    cleanSheets: 14,
    minutesPlayed: 3240,
    bonusPoints: 14,
    ownership: 32.1,
    priceChange: 0.1,
    nextFixtures: [
      { opponent: 'SOU', difficulty: 2, isHome: true },
      { opponent: 'TOT', difficulty: 4, isHome: false },
      { opponent: 'CHE', difficulty: 4, isHome: true },
    ],
    lastFiveGames: [6, 2, 11, 6, 6],
  },
  {
    id: 'def5',
    name: 'Virgil van Dijk',
    team: 'Liverpool',
    teamId: 'LIV',
    position: 'DEF',
    price: 6.5,
    totalPoints: 162,
    form: 6.6,
    goalsScored: 3,
    assists: 2,
    cleanSheets: 15,
    minutesPlayed: 3240,
    bonusPoints: 16,
    ownership: 25.8,
    priceChange: 0.1,
    nextFixtures: [
      { opponent: 'BOU', difficulty: 2, isHome: true },
      { opponent: 'MCI', difficulty: 5, isHome: false },
      { opponent: 'NEW', difficulty: 3, isHome: true },
    ],
    lastFiveGames: [6, 6, 2, 8, 9],
  },

  // Midfielders
  {
    id: 'mid1',
    name: 'Mohamed Salah',
    team: 'Liverpool',
    teamId: 'LIV',
    position: 'MID',
    price: 13.0,
    totalPoints: 245,
    form: 9.8,
    goalsScored: 18,
    assists: 12,
    cleanSheets: 15,
    minutesPlayed: 3150,
    bonusPoints: 28,
    ownership: 68.5,
    priceChange: 0.3,
    nextFixtures: [
      { opponent: 'BOU', difficulty: 2, isHome: true },
      { opponent: 'MCI', difficulty: 5, isHome: false },
      { opponent: 'NEW', difficulty: 3, isHome: true },
    ],
    lastFiveGames: [12, 8, 2, 13, 14],
  },
  {
    id: 'mid2',
    name: 'Kevin De Bruyne',
    team: 'Manchester City',
    teamId: 'MCI',
    position: 'MID',
    price: 12.5,
    totalPoints: 228,
    form: 9.2,
    goalsScored: 12,
    assists: 16,
    cleanSheets: 13,
    minutesPlayed: 2880,
    bonusPoints: 25,
    ownership: 45.3,
    priceChange: 0.2,
    nextFixtures: [
      { opponent: 'WHU', difficulty: 3, isHome: true },
      { opponent: 'LIV', difficulty: 5, isHome: true },
      { opponent: 'AVL', difficulty: 3, isHome: false },
    ],
    lastFiveGames: [8, 11, 10, 2, 15],
  },
  {
    id: 'mid3',
    name: 'Bukayo Saka',
    team: 'Arsenal',
    teamId: 'ARS',
    position: 'MID',
    price: 10.0,
    totalPoints: 198,
    form: 7.8,
    goalsScored: 14,
    assists: 9,
    cleanSheets: 14,
    minutesPlayed: 3060,
    bonusPoints: 22,
    ownership: 52.7,
    priceChange: 0.2,
    nextFixtures: [
      { opponent: 'SOU', difficulty: 2, isHome: true },
      { opponent: 'TOT', difficulty: 4, isHome: false },
      { opponent: 'CHE', difficulty: 4, isHome: true },
    ],
    lastFiveGames: [6, 9, 2, 10, 12],
  },
  {
    id: 'mid4',
    name: 'Bruno Fernandes',
    team: 'Manchester United',
    teamId: 'MUN',
    position: 'MID',
    price: 11.0,
    totalPoints: 185,
    form: 7.4,
    goalsScored: 10,
    assists: 11,
    cleanSheets: 8,
    minutesPlayed: 3150,
    bonusPoints: 18,
    ownership: 38.2,
    priceChange: 0,
    nextFixtures: [
      { opponent: 'EVE', difficulty: 3, isHome: true },
      { opponent: 'CHE', difficulty: 4, isHome: false },
      { opponent: 'BOU', difficulty: 2, isHome: true },
    ],
    lastFiveGames: [8, 2, 9, 11, 7],
  },
  {
    id: 'mid5',
    name: 'Son Heung-min',
    team: 'Tottenham',
    teamId: 'TOT',
    position: 'MID',
    price: 10.5,
    totalPoints: 192,
    form: 7.6,
    goalsScored: 15,
    assists: 8,
    cleanSheets: 9,
    minutesPlayed: 2970,
    bonusPoints: 20,
    ownership: 42.1,
    priceChange: 0.1,
    nextFixtures: [
      { opponent: 'CRY', difficulty: 3, isHome: true },
      { opponent: 'ARS', difficulty: 5, isHome: true },
      { opponent: 'NEW', difficulty: 3, isHome: false },
    ],
    lastFiveGames: [9, 2, 8, 11, 8],
  },

  // Forwards
  {
    id: 'fwd1',
    name: 'Erling Haaland',
    team: 'Manchester City',
    teamId: 'MCI',
    position: 'FWD',
    price: 14.5,
    totalPoints: 268,
    form: 10.8,
    goalsScored: 27,
    assists: 5,
    cleanSheets: 13,
    minutesPlayed: 2970,
    bonusPoints: 32,
    ownership: 82.3,
    priceChange: 0.4,
    nextFixtures: [
      { opponent: 'WHU', difficulty: 3, isHome: true },
      { opponent: 'LIV', difficulty: 5, isHome: true },
      { opponent: 'AVL', difficulty: 3, isHome: false },
    ],
    lastFiveGames: [14, 12, 2, 15, 11],
  },
  {
    id: 'fwd2',
    name: 'Darwin Núñez',
    team: 'Liverpool',
    teamId: 'LIV',
    position: 'FWD',
    price: 8.5,
    totalPoints: 165,
    form: 6.6,
    goalsScored: 14,
    assists: 7,
    cleanSheets: 15,
    minutesPlayed: 2520,
    bonusPoints: 15,
    ownership: 28.9,
    priceChange: 0.1,
    nextFixtures: [
      { opponent: 'BOU', difficulty: 2, isHome: true },
      { opponent: 'MCI', difficulty: 5, isHome: false },
      { opponent: 'NEW', difficulty: 3, isHome: true },
    ],
    lastFiveGames: [6, 8, 2, 9, 8],
  },
  {
    id: 'fwd3',
    name: 'Alexander Isak',
    team: 'Newcastle',
    teamId: 'NEW',
    position: 'FWD',
    price: 9.0,
    totalPoints: 178,
    form: 7.2,
    goalsScored: 16,
    assists: 4,
    cleanSheets: 10,
    minutesPlayed: 2880,
    bonusPoints: 18,
    ownership: 35.6,
    priceChange: 0.2,
    nextFixtures: [
      { opponent: 'FUL', difficulty: 3, isHome: true },
      { opponent: 'LIV', difficulty: 5, isHome: false },
      { opponent: 'TOT', difficulty: 4, isHome: true },
    ],
    lastFiveGames: [8, 2, 9, 10, 7],
  },
  {
    id: 'fwd4',
    name: 'Ollie Watkins',
    team: 'Aston Villa',
    teamId: 'AVL',
    position: 'FWD',
    price: 9.5,
    totalPoints: 182,
    form: 7.4,
    goalsScored: 17,
    assists: 6,
    cleanSheets: 11,
    minutesPlayed: 3060,
    bonusPoints: 19,
    ownership: 32.4,
    priceChange: 0.1,
    nextFixtures: [
      { opponent: 'WOL', difficulty: 2, isHome: true },
      { opponent: 'MCI', difficulty: 5, isHome: true },
      { opponent: 'BRE', difficulty: 3, isHome: false },
    ],
    lastFiveGames: [9, 2, 8, 10, 8],
  },
  {
    id: 'fwd5',
    name: 'Cole Palmer',
    team: 'Chelsea',
    teamId: 'CHE',
    position: 'FWD',
    price: 10.5,
    totalPoints: 195,
    form: 7.8,
    goalsScored: 18,
    assists: 8,
    cleanSheets: 9,
    minutesPlayed: 2970,
    bonusPoints: 21,
    ownership: 48.7,
    priceChange: 0.3,
    nextFixtures: [
      { opponent: 'BHA', difficulty: 3, isHome: true },
      { opponent: 'MUN', difficulty: 4, isHome: true },
      { opponent: 'ARS', difficulty: 5, isHome: false },
    ],
    lastFiveGames: [10, 2, 8, 11, 8],
  },
];

// Helper functions
export const getPlayersByPosition = (position: FantasyPlayer['position']) => {
  return FANTASY_PLAYERS.filter(player => player.position === position);
};

export const getPlayersByTeam = (teamId: string) => {
  return FANTASY_PLAYERS.filter(player => player.teamId === teamId);
};

export const getPlayerById = (id: string) => {
  return FANTASY_PLAYERS.find(player => player.id === id);
};

export const getTopPlayersByPoints = (limit: number = 10) => {
  return [...FANTASY_PLAYERS]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, limit);
};

export const getTopPlayersByForm = (limit: number = 10) => {
  return [...FANTASY_PLAYERS]
    .sort((a, b) => b.form - a.form)
    .slice(0, limit);
};
