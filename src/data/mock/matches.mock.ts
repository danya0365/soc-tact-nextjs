/**
 * Mock Data for Matches
 * Used for UI development before API integration
 */

export interface MockMatch {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
    shortName: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
    shortName: string;
  };
  score: {
    home: number | null;
    away: number | null;
    halftime?: {
      home: number;
      away: number;
    };
  };
  status: "live" | "finished" | "upcoming" | "postponed";
  minute: number | null;
  league: {
    id: string;
    name: string;
    logo: string;
    country: string;
  };
  venue: {
    name: string;
    city: string;
  };
  date: string;
  time: string;
  referee?: string;
}

export interface MockMatchDetail extends MockMatch {
  statistics: {
    possession: { home: number; away: number };
    shots: { home: number; away: number };
    shotsOnTarget: { home: number; away: number };
    corners: { home: number; away: number };
    fouls: { home: number; away: number };
    yellowCards: { home: number; away: number };
    redCards: { home: number; away: number };
    offsides: { home: number; away: number };
  };
  lineups: {
    home: {
      formation: string;
      startXI: Array<{
        id: string;
        name: string;
        number: number;
        position: string;
      }>;
      substitutes: Array<{
        id: string;
        name: string;
        number: number;
        position: string;
      }>;
    };
    away: {
      formation: string;
      startXI: Array<{
        id: string;
        name: string;
        number: number;
        position: string;
      }>;
      substitutes: Array<{
        id: string;
        name: string;
        number: number;
        position: string;
      }>;
    };
  };
  events: Array<{
    id: string;
    type: "goal" | "yellow_card" | "red_card" | "substitution" | "var";
    minute: number;
    team: "home" | "away";
    player: string;
    assist?: string;
    detail?: string;
  }>;
  headToHead: Array<{
    id: string;
    date: string;
    homeTeam: string;
    awayTeam: string;
    score: { home: number; away: number };
    competition: string;
  }>;
}

// Mock Matches Data
export const mockMatches: MockMatch[] = [
  // Live Matches
  {
    id: "match-001",
    homeTeam: {
      id: "team-001",
      name: "Manchester City",
      logo: "⚽",
      shortName: "MCI",
    },
    awayTeam: {
      id: "team-002",
      name: "Arsenal",
      logo: "🔴",
      shortName: "ARS",
    },
    score: {
      home: 2,
      away: 1,
      halftime: { home: 1, away: 0 },
    },
    status: "live",
    minute: 67,
    league: {
      id: "league-001",
      name: "Premier League",
      logo: "🏴󐁧󐁢󐁥󐁮󐁧󐁿",
      country: "England",
    },
    venue: {
      name: "Etihad Stadium",
      city: "Manchester",
    },
    date: "2024-03-16",
    time: "22:00",
    referee: "Michael Oliver",
  },
  {
    id: "match-002",
    homeTeam: {
      id: "team-003",
      name: "Liverpool",
      logo: "🔴",
      shortName: "LIV",
    },
    awayTeam: {
      id: "team-004",
      name: "Chelsea",
      logo: "🔵",
      shortName: "CHE",
    },
    score: {
      home: 0,
      away: 0,
      halftime: { home: 0, away: 0 },
    },
    status: "live",
    minute: 52,
    league: {
      id: "league-001",
      name: "Premier League",
      logo: "🏴󐁧󐁢󐁥󐁮󐁧󐁿",
      country: "England",
    },
    venue: {
      name: "Anfield",
      city: "Liverpool",
    },
    date: "2024-03-16",
    time: "22:00",
  },
  // Finished Matches
  {
    id: "match-003",
    homeTeam: {
      id: "team-005",
      name: "Real Madrid",
      logo: "⚪",
      shortName: "RMA",
    },
    awayTeam: {
      id: "team-006",
      name: "Barcelona",
      logo: "🔴🔵",
      shortName: "BAR",
    },
    score: {
      home: 3,
      away: 2,
      halftime: { home: 2, away: 1 },
    },
    status: "finished",
    minute: null,
    league: {
      id: "league-002",
      name: "La Liga",
      logo: "🇪🇸",
      country: "Spain",
    },
    venue: {
      name: "Santiago Bernabéu",
      city: "Madrid",
    },
    date: "2024-03-15",
    time: "21:00",
    referee: "Antonio Mateu Lahoz",
  },
  {
    id: "match-004",
    homeTeam: {
      id: "team-007",
      name: "Bayern Munich",
      logo: "🔴",
      shortName: "BAY",
    },
    awayTeam: {
      id: "team-008",
      name: "Borussia Dortmund",
      logo: "🟡⚫",
      shortName: "BVB",
    },
    score: {
      home: 1,
      away: 1,
      halftime: { home: 0, away: 1 },
    },
    status: "finished",
    minute: null,
    league: {
      id: "league-003",
      name: "Bundesliga",
      logo: "🇩🇪",
      country: "Germany",
    },
    venue: {
      name: "Allianz Arena",
      city: "Munich",
    },
    date: "2024-03-15",
    time: "20:30",
  },
  // Upcoming Matches
  {
    id: "match-005",
    homeTeam: {
      id: "team-009",
      name: "AC Milan",
      logo: "🔴⚫",
      shortName: "MIL",
    },
    awayTeam: {
      id: "team-010",
      name: "Inter Milan",
      logo: "🔵⚫",
      shortName: "INT",
    },
    score: {
      home: null,
      away: null,
    },
    status: "upcoming",
    minute: null,
    league: {
      id: "league-004",
      name: "Serie A",
      logo: "🇮🇹",
      country: "Italy",
    },
    venue: {
      name: "San Siro",
      city: "Milan",
    },
    date: "2024-03-17",
    time: "20:45",
  },
  {
    id: "match-006",
    homeTeam: {
      id: "team-011",
      name: "Paris Saint-Germain",
      logo: "🔴🔵",
      shortName: "PSG",
    },
    awayTeam: {
      id: "team-012",
      name: "Marseille",
      logo: "⚪🔵",
      shortName: "MAR",
    },
    score: {
      home: null,
      away: null,
    },
    status: "upcoming",
    minute: null,
    league: {
      id: "league-005",
      name: "Ligue 1",
      logo: "🇫🇷",
      country: "France",
    },
    venue: {
      name: "Parc des Princes",
      city: "Paris",
    },
    date: "2024-03-17",
    time: "21:00",
  },
  {
    id: "match-007",
    homeTeam: {
      id: "team-013",
      name: "Manchester United",
      logo: "🔴",
      shortName: "MUN",
    },
    awayTeam: {
      id: "team-014",
      name: "Tottenham",
      logo: "⚪",
      shortName: "TOT",
    },
    score: {
      home: null,
      away: null,
    },
    status: "upcoming",
    minute: null,
    league: {
      id: "league-001",
      name: "Premier League",
      logo: "🏴󐁧󐁢󐁥󐁮󐁧󐁿",
      country: "England",
    },
    venue: {
      name: "Old Trafford",
      city: "Manchester",
    },
    date: "2024-03-17",
    time: "16:30",
  },
  {
    id: "match-008",
    homeTeam: {
      id: "team-015",
      name: "Atletico Madrid",
      logo: "🔴⚪",
      shortName: "ATM",
    },
    awayTeam: {
      id: "team-016",
      name: "Sevilla",
      logo: "⚪🔴",
      shortName: "SEV",
    },
    score: {
      home: null,
      away: null,
    },
    status: "upcoming",
    minute: null,
    league: {
      id: "league-002",
      name: "La Liga",
      logo: "🇪🇸",
      country: "Spain",
    },
    venue: {
      name: "Wanda Metropolitano",
      city: "Madrid",
    },
    date: "2024-03-18",
    time: "19:00",
  },
];

// Mock Match Detail Data (for match detail page)
export const mockMatchDetails: Record<string, MockMatchDetail> = {
  "match-001": {
    ...mockMatches[0],
    statistics: {
      possession: { home: 58, away: 42 },
      shots: { home: 15, away: 8 },
      shotsOnTarget: { home: 7, away: 4 },
      corners: { home: 6, away: 3 },
      fouls: { home: 8, away: 12 },
      yellowCards: { home: 2, away: 3 },
      redCards: { home: 0, away: 0 },
      offsides: { home: 2, away: 1 },
    },
    lineups: {
      home: {
        formation: "4-3-3",
        startXI: [
          { id: "p1", name: "Ederson", number: 31, position: "GK" },
          { id: "p2", name: "Walker", number: 2, position: "RB" },
          { id: "p3", name: "Dias", number: 3, position: "CB" },
          { id: "p4", name: "Akanji", number: 25, position: "CB" },
          { id: "p5", name: "Ake", number: 6, position: "LB" },
          { id: "p6", name: "Rodri", number: 16, position: "CDM" },
          { id: "p7", name: "De Bruyne", number: 17, position: "CM" },
          { id: "p8", name: "Bernardo Silva", number: 20, position: "CM" },
          { id: "p9", name: "Foden", number: 47, position: "RW" },
          { id: "p10", name: "Haaland", number: 9, position: "ST" },
          { id: "p11", name: "Grealish", number: 10, position: "LW" },
        ],
        substitutes: [
          { id: "p12", name: "Ortega", number: 18, position: "GK" },
          { id: "p13", name: "Stones", number: 5, position: "CB" },
          { id: "p14", name: "Gvardiol", number: 24, position: "LB" },
          { id: "p15", name: "Kovacic", number: 8, position: "CM" },
          { id: "p16", name: "Alvarez", number: 19, position: "ST" },
        ],
      },
      away: {
        formation: "4-4-2",
        startXI: [
          { id: "p21", name: "Raya", number: 22, position: "GK" },
          { id: "p22", name: "White", number: 4, position: "RB" },
          { id: "p23", name: "Saliba", number: 2, position: "CB" },
          { id: "p24", name: "Gabriel", number: 6, position: "CB" },
          { id: "p25", name: "Zinchenko", number: 35, position: "LB" },
          { id: "p26", name: "Odegaard", number: 8, position: "RM" },
          { id: "p27", name: "Rice", number: 41, position: "CM" },
          { id: "p28", name: "Partey", number: 5, position: "CM" },
          { id: "p29", name: "Martinelli", number: 11, position: "LM" },
          { id: "p30", name: "Saka", number: 7, position: "ST" },
          { id: "p31", name: "Jesus", number: 9, position: "ST" },
        ],
        substitutes: [
          { id: "p32", name: "Ramsdale", number: 1, position: "GK" },
          { id: "p33", name: "Tomiyasu", number: 18, position: "RB" },
          { id: "p34", name: "Kiwior", number: 15, position: "CB" },
          { id: "p35", name: "Jorginho", number: 20, position: "CM" },
          { id: "p36", name: "Nketiah", number: 14, position: "ST" },
        ],
      },
    },
    events: [
      {
        id: "e1",
        type: "goal",
        minute: 23,
        team: "home",
        player: "Haaland",
        assist: "De Bruyne",
        detail: "Right foot shot from the center of the box",
      },
      {
        id: "e2",
        type: "yellow_card",
        minute: 35,
        team: "away",
        player: "Partey",
        detail: "Foul",
      },
      {
        id: "e3",
        type: "goal",
        minute: 58,
        team: "away",
        player: "Saka",
        assist: "Odegaard",
        detail: "Left foot shot from outside the box",
      },
      {
        id: "e4",
        type: "substitution",
        minute: 62,
        team: "home",
        player: "Alvarez → Grealish",
      },
      {
        id: "e5",
        type: "goal",
        minute: 67,
        team: "home",
        player: "Foden",
        assist: "Bernardo Silva",
        detail: "Header from the center of the box",
      },
      {
        id: "e6",
        type: "yellow_card",
        minute: 72,
        team: "home",
        player: "Rodri",
        detail: "Foul",
      },
    ],
    headToHead: [
      {
        id: "h2h-1",
        date: "2024-01-15",
        homeTeam: "Arsenal",
        awayTeam: "Manchester City",
        score: { home: 1, away: 2 },
        competition: "Premier League",
      },
      {
        id: "h2h-2",
        date: "2023-10-08",
        homeTeam: "Manchester City",
        awayTeam: "Arsenal",
        score: { home: 3, away: 1 },
        competition: "Premier League",
      },
      {
        id: "h2h-3",
        date: "2023-04-26",
        homeTeam: "Arsenal",
        awayTeam: "Manchester City",
        score: { home: 3, away: 3 },
        competition: "Premier League",
      },
    ],
  },
};

// Helper functions
export function getMatchById(id: string): MockMatch | undefined {
  return mockMatches.find((match) => match.id === id);
}

export function getMatchDetailById(id: string): MockMatchDetail | undefined {
  return mockMatchDetails[id];
}

export function getMatchesByStatus(
  status: MockMatch["status"]
): MockMatch[] {
  return mockMatches.filter((match) => match.status === status);
}

export function getMatchesByLeague(leagueId: string): MockMatch[] {
  return mockMatches.filter((match) => match.league.id === leagueId);
}

export function getMatchesByDate(date: string): MockMatch[] {
  return mockMatches.filter((match) => match.date === date);
}
