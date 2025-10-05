/**
 * Domain Entities for Football
 * Pure business objects without any dependencies
 */

// Team Entity
export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  founded?: number;
  country: string;
  venue?: string;
}

// League Entity
export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  season: number;
  type: string;
}

// Match Entity
export interface Match {
  id: number;
  date: string;
  timestamp: number;
  status: MatchStatus;
  minute?: number;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  league: League;
  venue?: string;
}

// Match Status
export enum MatchStatus {
  SCHEDULED = "scheduled",
  LIVE = "live",
  IN_PLAY = "in_play",
  PAUSED = "paused",
  FINISHED = "finished",
  POSTPONED = "postponed",
  CANCELLED = "cancelled",
  SUSPENDED = "suspended",
}

// Score Entity
export interface Score {
  home: number | null;
  away: number | null;
  halftime?: {
    home: number | null;
    away: number | null;
  };
  fulltime?: {
    home: number | null;
    away: number | null;
  };
}

// Standing Entity
export interface Standing {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string[];
  description?: string;
}

// Player Entity
export interface Player {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  nationality: string;
  position: string;
  photo?: string;
  number?: number;
}

// Match Statistics Entity
export interface MatchStatistics {
  matchId: number;
  homeTeamStats: TeamStatistics;
  awayTeamStats: TeamStatistics;
}

// Team Statistics
export interface TeamStatistics {
  possession?: number;
  shots?: number;
  shotsOnTarget?: number;
  corners?: number;
  fouls?: number;
  yellowCards?: number;
  redCards?: number;
  offsides?: number;
  passes?: number;
  passAccuracy?: number;
}

// Match Event Entity
export interface MatchEvent {
  id: number;
  matchId: number;
  minute: number;
  type: EventType;
  team: Team;
  player?: Player;
  assist?: Player;
  detail?: string;
}

// Event Type
export enum EventType {
  GOAL = "goal",
  PENALTY = "penalty",
  OWN_GOAL = "own_goal",
  YELLOW_CARD = "yellow_card",
  RED_CARD = "red_card",
  SUBSTITUTION = "substitution",
  VAR = "var",
}

// Lineup Entity
export interface Lineup {
  matchId: number;
  homeTeam: TeamLineup;
  awayTeam: TeamLineup;
}

// Team Lineup
export interface TeamLineup {
  team: Team;
  formation: string;
  startingXI: Player[];
  substitutes: Player[];
  coach?: {
    name: string;
    photo?: string;
  };
}

// Top Scorer Entity
export interface TopScorer {
  player: Player;
  team: Team;
  goals: number;
  assists?: number;
  appearances: number;
}

// Head to Head Entity
export interface HeadToHead {
  team1: Team;
  team2: Team;
  matches: Match[];
  statistics: {
    team1Wins: number;
    team2Wins: number;
    draws: number;
    totalMatches: number;
  };
}
