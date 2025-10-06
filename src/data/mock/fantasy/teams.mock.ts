// Mock data for Fantasy Football User Teams

export interface FantasyTeam {
  id: string;
  userId: string;
  teamName: string;
  managerName: string;
  formation: '3-4-3' | '3-5-2' | '4-3-3' | '4-4-2' | '4-5-1' | '5-3-2' | '5-4-1';
  totalPoints: number;
  gameweekPoints: number;
  overallRank: number;
  gameweekRank: number;
  teamValue: number; // in millions
  bank: number; // remaining budget in millions
  freeTransfers: number;
  chips: {
    wildcard: { used: boolean; gameweek?: number };
    benchBoost: { used: boolean; gameweek?: number };
    tripleCaptain: { used: boolean; gameweek?: number };
    freeHit: { used: boolean; gameweek?: number };
  };
  squad: {
    playerId: string;
    position: 'GK' | 'DEF' | 'MID' | 'FWD';
    isCaptain: boolean;
    isViceCaptain: boolean;
    isStarting: boolean; // true = starting XI, false = bench
    benchOrder?: number; // 1-4 for bench players
  }[];
  gameweekHistory: {
    gameweek: number;
    points: number;
    totalPoints: number;
    rank: number;
    transfers: number;
    transferCost: number;
    chipUsed?: string;
  }[];
}

// Mock user's fantasy team
export const MY_FANTASY_TEAM: FantasyTeam = {
  id: 'team1',
  userId: 'user1',
  teamName: 'Tactical Titans',
  managerName: 'Marosdee Uma',
  formation: '3-4-3',
  totalPoints: 845,
  gameweekPoints: 0, // Current gameweek not finished
  overallRank: 125847,
  gameweekRank: 0,
  teamValue: 100.5,
  bank: 0.5,
  freeTransfers: 1,
  chips: {
    wildcard: { used: false },
    benchBoost: { used: false },
    tripleCaptain: { used: true, gameweek: 1 },
    freeHit: { used: false },
  },
  squad: [
    // Starting XI (3-4-3)
    // GK
    { playerId: 'gk1', position: 'GK', isCaptain: false, isViceCaptain: false, isStarting: true },
    // DEF (3)
    { playerId: 'def1', position: 'DEF', isCaptain: false, isViceCaptain: false, isStarting: true },
    { playerId: 'def2', position: 'DEF', isCaptain: false, isViceCaptain: false, isStarting: true },
    { playerId: 'def5', position: 'DEF', isCaptain: false, isViceCaptain: false, isStarting: true },
    // MID (4)
    { playerId: 'mid1', position: 'MID', isCaptain: false, isViceCaptain: true, isStarting: true },
    { playerId: 'mid2', position: 'MID', isCaptain: false, isViceCaptain: false, isStarting: true },
    { playerId: 'mid3', position: 'MID', isCaptain: false, isViceCaptain: false, isStarting: true },
    { playerId: 'mid5', position: 'MID', isCaptain: false, isViceCaptain: false, isStarting: true },
    // FWD (3)
    { playerId: 'fwd1', position: 'FWD', isCaptain: true, isViceCaptain: false, isStarting: true },
    { playerId: 'fwd3', position: 'FWD', isCaptain: false, isViceCaptain: false, isStarting: true },
    { playerId: 'fwd5', position: 'FWD', isCaptain: false, isViceCaptain: false, isStarting: true },
    
    // Bench (4)
    { playerId: 'gk2', position: 'GK', isCaptain: false, isViceCaptain: false, isStarting: false, benchOrder: 1 },
    { playerId: 'def4', position: 'DEF', isCaptain: false, isViceCaptain: false, isStarting: false, benchOrder: 2 },
    { playerId: 'mid4', position: 'MID', isCaptain: false, isViceCaptain: false, isStarting: false, benchOrder: 3 },
    { playerId: 'fwd2', position: 'FWD', isCaptain: false, isViceCaptain: false, isStarting: false, benchOrder: 4 },
  ],
  gameweekHistory: [
    { gameweek: 1, points: 68, totalPoints: 68, rank: 1250000, transfers: 0, transferCost: 0, chipUsed: 'tripleCaptain' },
    { gameweek: 2, points: 52, totalPoints: 120, rank: 980000, transfers: 1, transferCost: 0 },
    { gameweek: 3, points: 78, totalPoints: 198, rank: 650000, transfers: 1, transferCost: 0 },
    { gameweek: 4, points: 45, totalPoints: 243, rank: 720000, transfers: 2, transferCost: 4 },
    { gameweek: 5, points: 88, totalPoints: 331, rank: 450000, transfers: 1, transferCost: 0 },
    { gameweek: 6, points: 62, totalPoints: 393, rank: 380000, transfers: 1, transferCost: 0 },
    { gameweek: 7, points: 95, totalPoints: 488, rank: 220000, transfers: 1, transferCost: 0 },
    { gameweek: 8, points: 58, totalPoints: 546, rank: 210000, transfers: 2, transferCost: 4 },
    { gameweek: 9, points: 103, totalPoints: 649, rank: 125847, transfers: 1, transferCost: 0 },
  ],
};

// Mock rival teams for league
export const RIVAL_TEAMS: FantasyTeam[] = [
  {
    id: 'team2',
    userId: 'user2',
    teamName: 'Pep Guardiola FC',
    managerName: 'John Smith',
    formation: '4-3-3',
    totalPoints: 892,
    gameweekPoints: 0,
    overallRank: 85234,
    gameweekRank: 0,
    teamValue: 101.2,
    bank: 0.2,
    freeTransfers: 2,
    chips: {
      wildcard: { used: true, gameweek: 5 },
      benchBoost: { used: false },
      tripleCaptain: { used: true, gameweek: 2 },
      freeHit: { used: false },
    },
    squad: [],
    gameweekHistory: [],
  },
  {
    id: 'team3',
    userId: 'user3',
    teamName: 'Klopp\'s Kop',
    managerName: 'Sarah Johnson',
    formation: '4-4-2',
    totalPoints: 867,
    gameweekPoints: 0,
    overallRank: 102456,
    gameweekRank: 0,
    teamValue: 100.8,
    bank: 0.3,
    freeTransfers: 1,
    chips: {
      wildcard: { used: false },
      benchBoost: { used: true, gameweek: 7 },
      tripleCaptain: { used: true, gameweek: 1 },
      freeHit: { used: false },
    },
    squad: [],
    gameweekHistory: [],
  },
  {
    id: 'team4',
    userId: 'user4',
    teamName: 'Arsenal of Democracy',
    managerName: 'Mike Williams',
    formation: '3-5-2',
    totalPoints: 823,
    gameweekPoints: 0,
    overallRank: 156789,
    gameweekRank: 0,
    teamValue: 99.8,
    bank: 1.2,
    freeTransfers: 1,
    chips: {
      wildcard: { used: false },
      benchBoost: { used: false },
      tripleCaptain: { used: true, gameweek: 3 },
      freeHit: { used: false },
    },
    squad: [],
    gameweekHistory: [],
  },
];

// Helper functions
export const getMyTeam = () => MY_FANTASY_TEAM;

export const getStartingXI = (team: FantasyTeam) => {
  return team.squad.filter(player => player.isStarting);
};

export const getBench = (team: FantasyTeam) => {
  return team.squad
    .filter(player => !player.isStarting)
    .sort((a, b) => (a.benchOrder || 0) - (b.benchOrder || 0));
};

export const getCaptain = (team: FantasyTeam) => {
  return team.squad.find(player => player.isCaptain);
};

export const getViceCaptain = (team: FantasyTeam) => {
  return team.squad.find(player => player.isViceCaptain);
};

export const getPlayersByPosition = (team: FantasyTeam, position: 'GK' | 'DEF' | 'MID' | 'FWD', startingOnly: boolean = false) => {
  let players = team.squad.filter(player => player.position === position);
  if (startingOnly) {
    players = players.filter(player => player.isStarting);
  }
  return players;
};

export const getTotalBudget = () => 100; // £100m

export const getAvailableBudget = (team: FantasyTeam) => {
  return team.bank;
};

export const canMakeTransfer = (team: FantasyTeam) => {
  return team.freeTransfers > 0 || team.bank >= 0;
};

export const getTransferCost = (team: FantasyTeam, transfersCount: number) => {
  const freeTransfersUsed = Math.min(transfersCount, team.freeTransfers);
  const paidTransfers = transfersCount - freeTransfersUsed;
  return paidTransfers * 4; // 4 points per extra transfer
};
