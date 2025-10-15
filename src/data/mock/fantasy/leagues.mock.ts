// Mock data for Fantasy Football Leagues

export interface FantasyLeague {
  id: string;
  name: string;
  type: 'global' | 'private';
  code?: string; // for private leagues
  adminId?: string;
  totalManagers: number;
  createdAt: string;
  description?: string;
}

export interface LeagueStanding {
  leagueId: string;
  rank: number;
  lastRank: number;
  teamId: string;
  teamName: string;
  managerName: string;
  totalPoints: number;
  gameweekPoints: number;
}

// Mock leagues
export const FANTASY_LEAGUES: FantasyLeague[] = [
  {
    id: 'global',
    name: 'Overall League',
    type: 'global',
    totalManagers: 9850000,
    createdAt: '2024-08-01T00:00:00Z',
    description: 'The official global league for all Fantasy Premier League managers',
  },
  {
    id: 'league1',
    name: 'Friends & Family',
    type: 'private',
    code: 'FF2425',
    adminId: 'user1',
    totalManagers: 12,
    createdAt: '2024-08-05T10:30:00Z',
    description: 'Our annual fantasy league - winner gets bragging rights!',
  },
  {
    id: 'league2',
    name: 'Office Champions',
    type: 'private',
    code: 'WORK24',
    adminId: 'user5',
    totalManagers: 28,
    createdAt: '2024-08-03T14:20:00Z',
    description: 'Company-wide fantasy league. May the best manager win!',
  },
  {
    id: 'league3',
    name: 'Thailand FPL Community',
    type: 'private',
    code: 'THAI25',
    adminId: 'user8',
    totalManagers: 156,
    createdAt: '2024-07-28T08:00:00Z',
    description: 'สำหรับคนไทยที่รัก Premier League',
  },
];

// Mock league standings - Friends & Family
export const FRIENDS_FAMILY_STANDINGS: LeagueStanding[] = [
  {
    leagueId: 'league1',
    rank: 1,
    lastRank: 2,
    teamId: 'team2',
    teamName: 'Pep Guardiola FC',
    managerName: 'John Smith',
    totalPoints: 892,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 2,
    lastRank: 3,
    teamId: 'team3',
    teamName: 'Klopp\'s Kop',
    managerName: 'Sarah Johnson',
    totalPoints: 867,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 3,
    lastRank: 1,
    teamId: 'team1',
    teamName: 'Tactical Titans',
    managerName: 'Marosdee Uma',
    totalPoints: 845,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 4,
    lastRank: 4,
    teamId: 'team4',
    teamName: 'Arsenal of Democracy',
    managerName: 'Mike Williams',
    totalPoints: 823,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 5,
    lastRank: 5,
    teamId: 'team5',
    teamName: 'Red Devils United',
    managerName: 'Emma Davis',
    totalPoints: 798,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 6,
    lastRank: 7,
    teamId: 'team6',
    teamName: 'Spurs Dynasty',
    managerName: 'Tom Brown',
    totalPoints: 776,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 7,
    lastRank: 6,
    teamId: 'team7',
    teamName: 'Chelsea Blues',
    managerName: 'Lisa Wilson',
    totalPoints: 765,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 8,
    lastRank: 8,
    teamId: 'team8',
    teamName: 'Toon Army',
    managerName: 'David Lee',
    totalPoints: 742,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 9,
    lastRank: 9,
    teamId: 'team9',
    teamName: 'Villa Park Heroes',
    managerName: 'Rachel Green',
    totalPoints: 718,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 10,
    lastRank: 11,
    teamId: 'team10',
    teamName: 'Hammers FC',
    managerName: 'Chris Martin',
    totalPoints: 695,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 11,
    lastRank: 10,
    teamId: 'team11',
    teamName: 'Brighton Seagulls',
    managerName: 'Amy Taylor',
    totalPoints: 682,
    gameweekPoints: 0,
  },
  {
    leagueId: 'league1',
    rank: 12,
    lastRank: 12,
    teamId: 'team12',
    teamName: 'Wolves Pack',
    managerName: 'James Anderson',
    totalPoints: 658,
    gameweekPoints: 0,
  },
];

// Mock global league standings (top 100)
export const GLOBAL_STANDINGS: LeagueStanding[] = [
  {
    leagueId: 'global',
    rank: 1,
    lastRank: 1,
    teamId: 'top1',
    teamName: 'FPL King',
    managerName: 'Magnus Carlsen',
    totalPoints: 1245,
    gameweekPoints: 0,
  },
  {
    leagueId: 'global',
    rank: 2,
    lastRank: 3,
    teamId: 'top2',
    teamName: 'Scout Master',
    managerName: 'Mark Sutherns',
    totalPoints: 1238,
    gameweekPoints: 0,
  },
  {
    leagueId: 'global',
    rank: 3,
    lastRank: 2,
    teamId: 'top3',
    teamName: 'Differential King',
    managerName: 'FPL Focal',
    totalPoints: 1235,
    gameweekPoints: 0,
  },
  // ... more top managers
  {
    leagueId: 'global',
    rank: 125847,
    lastRank: 210000,
    teamId: 'team1',
    teamName: 'Tactical Titans',
    managerName: 'Marosdee Uma',
    totalPoints: 845,
    gameweekPoints: 0,
  },
];

// Helper functions
export const getLeagueById = (id: string) => {
  return FANTASY_LEAGUES.find(league => league.id === id);
};

export const getMyLeagues = () => {
  // Return leagues where user is a member
  return FANTASY_LEAGUES.filter(league => 
    league.id === 'global' || 
    league.id === 'league1' || 
    league.id === 'league2'
  );
};

export const getLeagueStandings = (leagueId: string, page: number = 1, limit: number = 50) => {
  let standings: LeagueStanding[] = [];
  
  if (leagueId === 'league1') {
    standings = FRIENDS_FAMILY_STANDINGS;
  } else if (leagueId === 'global') {
    standings = GLOBAL_STANDINGS;
  }
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    standings: standings.slice(start, end),
    total: standings.length,
    page,
    limit,
    totalPages: Math.ceil(standings.length / limit),
  };
};

export const getMyRankInLeague = (leagueId: string, teamId: string = 'team1') => {
  let standings: LeagueStanding[] = [];
  
  if (leagueId === 'league1') {
    standings = FRIENDS_FAMILY_STANDINGS;
  } else if (leagueId === 'global') {
    standings = GLOBAL_STANDINGS;
  }
  
  return standings.find(s => s.teamId === teamId);
};

export const createPrivateLeague = (name: string, adminId: string, description?: string) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newLeague: FantasyLeague = {
    id: `league${FANTASY_LEAGUES.length + 1}`,
    name,
    type: 'private',
    code,
    adminId,
    totalManagers: 1,
    createdAt: new Date().toISOString(),
    description,
  };
  
  return newLeague;
};

export const joinLeague = (code: string, teamId: string) => {
  const league = FANTASY_LEAGUES.find(l => l.code === code);
  
  if (!league) {
    throw new Error('League not found');
  }
  
  // In real implementation, would add team to league
  return league;
};

export const getLeagueByCode = (code: string) => {
  return FANTASY_LEAGUES.find(league => league.code === code);
};
