/**
 * Mock Data for Leagues and Standings
 * Used for UI development before API integration
 */

export interface MockLeague {
  id: string;
  name: string;
  logo: string;
  country: string;
  season: string;
  totalTeams: number;
  currentMatchday: number;
  totalMatchdays: number;
}

export interface MockStanding {
  position: number;
  team: {
    id: string;
    name: string;
    logo: string;
    shortName: string;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: Array<"W" | "D" | "L">; // Last 5 matches
}

export interface MockTopScorer {
  id: string;
  name: string;
  team: string;
  teamLogo: string;
  goals: number;
  assists: number;
  matches: number;
}

export interface MockFixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
}

// Mock Leagues Data
export const mockLeagues: MockLeague[] = [
  {
    id: "league-001",
    name: "Premier League",
    logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    country: "England",
    season: "2024/25",
    totalTeams: 20,
    currentMatchday: 28,
    totalMatchdays: 38,
  },
  {
    id: "league-002",
    name: "La Liga",
    logo: "🇪🇸",
    country: "Spain",
    season: "2024/25",
    totalTeams: 20,
    currentMatchday: 27,
    totalMatchdays: 38,
  },
  {
    id: "league-003",
    name: "Bundesliga",
    logo: "🇩🇪",
    country: "Germany",
    season: "2024/25",
    totalTeams: 18,
    currentMatchday: 25,
    totalMatchdays: 34,
  },
  {
    id: "league-004",
    name: "Serie A",
    logo: "🇮🇹",
    country: "Italy",
    season: "2024/25",
    totalTeams: 20,
    currentMatchday: 28,
    totalMatchdays: 38,
  },
  {
    id: "league-005",
    name: "Ligue 1",
    logo: "🇫🇷",
    country: "France",
    season: "2024/25",
    totalTeams: 18,
    currentMatchday: 26,
    totalMatchdays: 34,
  },
  {
    id: "league-006",
    name: "Thai Premier League",
    logo: "🇹🇭",
    country: "Thailand",
    season: "2024",
    totalTeams: 16,
    currentMatchday: 20,
    totalMatchdays: 30,
  },
];

// Mock Standings Data - Premier League
export const mockPremierLeagueStandings: MockStanding[] = [
  {
    position: 1,
    team: {
      id: "team-001",
      name: "Manchester City",
      logo: "⚽",
      shortName: "MCI",
    },
    played: 28,
    won: 21,
    drawn: 4,
    lost: 3,
    goalsFor: 68,
    goalsAgainst: 25,
    goalDifference: 43,
    points: 67,
    form: ["W", "W", "D", "W", "W"],
  },
  {
    position: 2,
    team: {
      id: "team-002",
      name: "Arsenal",
      logo: "🔴",
      shortName: "ARS",
    },
    played: 28,
    won: 20,
    drawn: 5,
    lost: 3,
    goalsFor: 65,
    goalsAgainst: 24,
    goalDifference: 41,
    points: 65,
    form: ["W", "W", "W", "D", "L"],
  },
  {
    position: 3,
    team: {
      id: "team-003",
      name: "Liverpool",
      logo: "🔴",
      shortName: "LIV",
    },
    played: 28,
    won: 19,
    drawn: 6,
    lost: 3,
    goalsFor: 62,
    goalsAgainst: 28,
    goalDifference: 34,
    points: 63,
    form: ["D", "W", "W", "W", "D"],
  },
  {
    position: 4,
    team: {
      id: "team-013",
      name: "Manchester United",
      logo: "🔴",
      shortName: "MUN",
    },
    played: 28,
    won: 16,
    drawn: 7,
    lost: 5,
    goalsFor: 52,
    goalsAgainst: 35,
    goalDifference: 17,
    points: 55,
    form: ["W", "L", "W", "D", "W"],
  },
  {
    position: 5,
    team: {
      id: "team-014",
      name: "Tottenham",
      logo: "⚪",
      shortName: "TOT",
    },
    played: 28,
    won: 15,
    drawn: 6,
    lost: 7,
    goalsFor: 55,
    goalsAgainst: 38,
    goalDifference: 17,
    points: 51,
    form: ["W", "W", "L", "D", "W"],
  },
  {
    position: 6,
    team: {
      id: "team-004",
      name: "Chelsea",
      logo: "🔵",
      shortName: "CHE",
    },
    played: 28,
    won: 14,
    drawn: 8,
    lost: 6,
    goalsFor: 48,
    goalsAgainst: 35,
    goalDifference: 13,
    points: 50,
    form: ["D", "W", "L", "W", "D"],
  },
  {
    position: 7,
    team: {
      id: "team-015",
      name: "Newcastle United",
      logo: "⚫⚪",
      shortName: "NEW",
    },
    played: 28,
    won: 13,
    drawn: 9,
    lost: 6,
    goalsFor: 45,
    goalsAgainst: 32,
    goalDifference: 13,
    points: 48,
    form: ["W", "D", "D", "W", "L"],
  },
  {
    position: 8,
    team: {
      id: "team-016",
      name: "Brighton",
      logo: "🔵⚪",
      shortName: "BHA",
    },
    played: 28,
    won: 12,
    drawn: 10,
    lost: 6,
    goalsFor: 42,
    goalsAgainst: 35,
    goalDifference: 7,
    points: 46,
    form: ["D", "W", "D", "L", "W"],
  },
  {
    position: 9,
    team: {
      id: "team-017",
      name: "Aston Villa",
      logo: "🟣",
      shortName: "AVL",
    },
    played: 28,
    won: 12,
    drawn: 8,
    lost: 8,
    goalsFor: 40,
    goalsAgainst: 38,
    goalDifference: 2,
    points: 44,
    form: ["L", "W", "W", "D", "L"],
  },
  {
    position: 10,
    team: {
      id: "team-018",
      name: "West Ham",
      logo: "🟤⚪",
      shortName: "WHU",
    },
    played: 28,
    won: 11,
    drawn: 9,
    lost: 8,
    goalsFor: 38,
    goalsAgainst: 36,
    goalDifference: 2,
    points: 42,
    form: ["D", "L", "W", "D", "W"],
  },
];

// Mock Top Scorers - Premier League
export const mockPremierLeagueTopScorers: MockTopScorer[] = [
  {
    id: "player-001",
    name: "Erling Haaland",
    team: "Manchester City",
    teamLogo: "⚽",
    goals: 24,
    assists: 5,
    matches: 26,
  },
  {
    id: "player-002",
    name: "Mohamed Salah",
    team: "Liverpool",
    teamLogo: "🔴",
    goals: 19,
    assists: 12,
    matches: 27,
  },
  {
    id: "player-003",
    name: "Bukayo Saka",
    team: "Arsenal",
    teamLogo: "🔴",
    goals: 16,
    assists: 9,
    matches: 28,
  },
  {
    id: "player-004",
    name: "Cole Palmer",
    team: "Chelsea",
    teamLogo: "🔵",
    goals: 15,
    assists: 8,
    matches: 27,
  },
  {
    id: "player-005",
    name: "Son Heung-min",
    team: "Tottenham",
    teamLogo: "⚪",
    goals: 14,
    assists: 7,
    matches: 26,
  },
];

// Mock Upcoming Fixtures - Premier League
export const mockPremierLeagueFixtures: MockFixture[] = [
  {
    id: "fixture-001",
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    date: "2024-03-20",
    time: "16:30",
    venue: "Etihad Stadium",
  },
  {
    id: "fixture-002",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    date: "2024-03-20",
    time: "19:00",
    venue: "Emirates Stadium",
  },
  {
    id: "fixture-003",
    homeTeam: "Manchester United",
    awayTeam: "Tottenham",
    date: "2024-03-21",
    time: "14:00",
    venue: "Old Trafford",
  },
  {
    id: "fixture-004",
    homeTeam: "Newcastle United",
    awayTeam: "Brighton",
    date: "2024-03-21",
    time: "16:30",
    venue: "St James' Park",
  },
  {
    id: "fixture-005",
    homeTeam: "Aston Villa",
    awayTeam: "West Ham",
    date: "2024-03-21",
    time: "19:00",
    venue: "Villa Park",
  },
];

// Helper functions
export function getLeagueById(id: string): MockLeague | undefined {
  return mockLeagues.find((league) => league.id === id);
}

export function getStandingsByLeague(leagueId: string): MockStanding[] {
  // For now, only Premier League has standings
  if (leagueId === "league-001") {
    return mockPremierLeagueStandings;
  }
  return [];
}

export function getTopScorersByLeague(leagueId: string): MockTopScorer[] {
  // For now, only Premier League has top scorers
  if (leagueId === "league-001") {
    return mockPremierLeagueTopScorers;
  }
  return [];
}

export function getFixturesByLeague(leagueId: string): MockFixture[] {
  // For now, only Premier League has fixtures
  if (leagueId === "league-001") {
    return mockPremierLeagueFixtures;
  }
  return [];
}
