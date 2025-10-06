/**
 * Mock Data for Teams
 * Used for UI development before API integration
 */

export interface MockTeam {
  id: string;
  name: string;
  logo: string;
  shortName: string;
  founded: number;
  stadium: {
    name: string;
    capacity: number;
    city: string;
  };
  league: {
    id: string;
    name: string;
  };
  manager: {
    name: string;
    nationality: string;
    since: string;
  };
  stats: {
    position: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    form: Array<"W" | "D" | "L">;
  };
}

export interface MockPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  nationality: string;
  age: number;
  goals?: number;
  assists?: number;
}

export interface MockTeamMatch {
  id: string;
  opponent: string;
  opponentLogo: string;
  isHome: boolean;
  score?: {
    home: number;
    away: number;
  };
  date: string;
  competition: string;
  status: "finished" | "upcoming";
}

// Mock Teams Data
export const mockTeams: Record<string, MockTeam> = {
  "team-001": {
    id: "team-001",
    name: "Manchester City",
    logo: "⚽",
    shortName: "MCI",
    founded: 1880,
    stadium: {
      name: "Etihad Stadium",
      capacity: 53400,
      city: "Manchester",
    },
    league: {
      id: "league-001",
      name: "Premier League",
    },
    manager: {
      name: "Pep Guardiola",
      nationality: "Spain",
      since: "2016-07-01",
    },
    stats: {
      position: 1,
      played: 28,
      won: 21,
      drawn: 4,
      lost: 3,
      goalsFor: 68,
      goalsAgainst: 25,
      points: 67,
      form: ["W", "W", "D", "W", "W"],
    },
  },
  "team-002": {
    id: "team-002",
    name: "Arsenal",
    logo: "🔴",
    shortName: "ARS",
    founded: 1886,
    stadium: {
      name: "Emirates Stadium",
      capacity: 60704,
      city: "London",
    },
    league: {
      id: "league-001",
      name: "Premier League",
    },
    manager: {
      name: "Mikel Arteta",
      nationality: "Spain",
      since: "2019-12-20",
    },
    stats: {
      position: 2,
      played: 28,
      won: 20,
      drawn: 5,
      lost: 3,
      goalsFor: 65,
      goalsAgainst: 24,
      points: 65,
      form: ["W", "W", "W", "D", "L"],
    },
  },
  "team-003": {
    id: "team-003",
    name: "Liverpool",
    logo: "🔴",
    shortName: "LIV",
    founded: 1892,
    stadium: {
      name: "Anfield",
      capacity: 53394,
      city: "Liverpool",
    },
    league: {
      id: "league-001",
      name: "Premier League",
    },
    manager: {
      name: "Jürgen Klopp",
      nationality: "Germany",
      since: "2015-10-08",
    },
    stats: {
      position: 3,
      played: 28,
      won: 19,
      drawn: 6,
      lost: 3,
      goalsFor: 62,
      goalsAgainst: 28,
      points: 63,
      form: ["D", "W", "W", "W", "D"],
    },
  },
};

// Mock Squad Data
export const mockSquads: Record<string, MockPlayer[]> = {
  "team-001": [
    {
      id: "p1",
      name: "Ederson",
      number: 31,
      position: "GK",
      nationality: "Brazil",
      age: 30,
    },
    {
      id: "p2",
      name: "Kyle Walker",
      number: 2,
      position: "RB",
      nationality: "England",
      age: 33,
    },
    {
      id: "p3",
      name: "Rúben Dias",
      number: 3,
      position: "CB",
      nationality: "Portugal",
      age: 26,
    },
    {
      id: "p4",
      name: "Nathan Aké",
      number: 6,
      position: "LB",
      nationality: "Netherlands",
      age: 28,
    },
    {
      id: "p5",
      name: "Rodri",
      number: 16,
      position: "CDM",
      nationality: "Spain",
      age: 27,
    },
    {
      id: "p6",
      name: "Kevin De Bruyne",
      number: 17,
      position: "CM",
      nationality: "Belgium",
      age: 32,
      goals: 8,
      assists: 15,
    },
    {
      id: "p7",
      name: "Bernardo Silva",
      number: 20,
      position: "CM",
      nationality: "Portugal",
      age: 29,
      goals: 6,
      assists: 10,
    },
    {
      id: "p8",
      name: "Phil Foden",
      number: 47,
      position: "LW",
      nationality: "England",
      age: 23,
      goals: 12,
      assists: 8,
    },
    {
      id: "p9",
      name: "Erling Haaland",
      number: 9,
      position: "ST",
      nationality: "Norway",
      age: 23,
      goals: 24,
      assists: 5,
    },
    {
      id: "p10",
      name: "Jack Grealish",
      number: 10,
      position: "RW",
      nationality: "England",
      age: 28,
      goals: 4,
      assists: 7,
    },
  ],
};

// Mock Recent Matches
export const mockTeamMatches: Record<string, MockTeamMatch[]> = {
  "team-001": [
    {
      id: "match-001",
      opponent: "Arsenal",
      opponentLogo: "🔴",
      isHome: true,
      score: { home: 2, away: 1 },
      date: "2024-03-16",
      competition: "Premier League",
      status: "finished",
    },
    {
      id: "match-002",
      opponent: "Chelsea",
      opponentLogo: "🔵",
      isHome: false,
      score: { home: 1, away: 3 },
      date: "2024-03-10",
      competition: "Premier League",
      status: "finished",
    },
    {
      id: "match-003",
      opponent: "Liverpool",
      opponentLogo: "🔴",
      isHome: true,
      date: "2024-03-20",
      competition: "Premier League",
      status: "upcoming",
    },
    {
      id: "match-004",
      opponent: "Manchester United",
      opponentLogo: "🔴",
      isHome: false,
      date: "2024-03-24",
      competition: "Premier League",
      status: "upcoming",
    },
  ],
};

// Mock Tactical Posts about team
export const mockTeamTacticalPosts = [
  {
    id: "post-001",
    title: "วิเคราะห์แทคติค 4-3-3 ของ Man City ที่ทำให้พวกเขาครองบอลได้มากกว่า 70%",
    excerpt:
      "การใช้ False 9 และ Inverted Wingers ทำให้ Man City สามารถสร้างพื้นที่ในกลางสนามได้อย่างมีประสิทธิภาพ",
    formation: "4-3-3",
    upvotes: 245,
    comments: 38,
  },
];

// Helper functions
export function getTeamById(id: string): MockTeam | undefined {
  return mockTeams[id];
}

export function getSquadByTeamId(teamId: string): MockPlayer[] {
  return mockSquads[teamId] || [];
}

export function getMatchesByTeamId(teamId: string): MockTeamMatch[] {
  return mockTeamMatches[teamId] || [];
}

export function getRecentMatches(teamId: string): MockTeamMatch[] {
  const matches = mockTeamMatches[teamId] || [];
  return matches.filter((m) => m.status === "finished").slice(0, 5);
}

export function getUpcomingMatches(teamId: string): MockTeamMatch[] {
  const matches = mockTeamMatches[teamId] || [];
  return matches.filter((m) => m.status === "upcoming").slice(0, 5);
}
