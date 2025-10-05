/**
 * Football API - Main Export
 * Central export point for all football API functions
 */

// Export all API functions
export {
  // Leagues
  getAllLeagues,
  getLeagueById,
  getLeaguesByCountry,
  getLeagueOverview,
  
  // Matches
  getLiveMatches,
  getTodayMatches,
  getMatchesByDate,
  getMatchesByLeague,
  getMatchById,
  getUpcomingMatches,
  getFinishedMatches,
  getFeaturedMatches,
  
  // Standings
  getStandingsByLeague,
  
  // Teams
  getTeamById,
  getTeamsByLeague,
  searchTeams,
  getTeamRecentMatches,
  getTeamUpcomingMatches,
  
  // Statistics
  getTopScorers,
  getHeadToHead,
  
  // Utility functions
  formatDate,
  getDateRange,
  isMatchLive,
  isMatchFinished,
  isMatchUpcoming,
  getMatchResult,
} from "./football.api";

// Export types
export type {
  Team,
  League,
  Match,
  Standing,
  Score,
  Player,
  MatchStatistics,
  TeamStatistics,
  MatchEvent,
  Lineup,
  TeamLineup,
  TopScorer,
  HeadToHead,
} from "@/src/domain/entities/football.entity";

export {
  MatchStatus,
  EventType,
} from "@/src/domain/entities/football.entity";

// Export configuration
export {
  LEAGUE_IDS,
  FOOTBALL_API_CONFIG,
  RATE_LIMITS,
  CACHE_CONFIG,
} from "@/src/infrastructure/config/football-api.config";
