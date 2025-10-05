/**
 * Football API
 * Public API interface for football data
 * This is the main entry point for consuming football data
 */

import { FootballService } from "@/src/application/services/football.service";
import { FootballDataRepository } from "@/src/infrastructure/repositories/football-data.repository";
import { FootballDataDatasource } from "@/src/infrastructure/datasources/football-data.datasource";
import {
  League,
  Match,
  Standing,
  Team,
  TopScorer,
  HeadToHead,
} from "@/src/domain/entities/football.entity";

// Singleton instance
let footballServiceInstance: FootballService | null = null;

/**
 * Get Football Service instance (Singleton pattern)
 */
function getFootballService(): FootballService {
  if (!footballServiceInstance) {
    const datasource = new FootballDataDatasource();
    const repository = new FootballDataRepository(datasource);
    footballServiceInstance = new FootballService(repository);
  }
  return footballServiceInstance;
}

// ============================================================================
// LEAGUES
// ============================================================================

/**
 * Get all available leagues
 */
export async function getAllLeagues(): Promise<League[]> {
  const service = getFootballService();
  return service.getAllLeagues();
}

/**
 * Get league by ID
 */
export async function getLeagueById(leagueId: number): Promise<League> {
  const service = getFootballService();
  return service.getLeagueById(leagueId);
}

/**
 * Get leagues by country
 */
export async function getLeaguesByCountry(country: string): Promise<League[]> {
  const service = getFootballService();
  return service.getLeaguesByCountry(country);
}

/**
 * Get league overview (standings + matches + top scorers)
 */
export async function getLeagueOverview(
  leagueId: number,
  season?: number
): Promise<{
  league: League;
  standings: Standing[];
  recentMatches: Match[];
  topScorers: TopScorer[];
}> {
  const service = getFootballService();
  return service.getLeagueOverview(leagueId, season);
}

// ============================================================================
// MATCHES
// ============================================================================

/**
 * Get live matches
 */
export async function getLiveMatches(): Promise<Match[]> {
  const service = getFootballService();
  return service.getLiveMatches();
}

/**
 * Get today's matches
 */
export async function getTodayMatches(): Promise<Match[]> {
  const service = getFootballService();
  return service.getTodayMatches();
}

/**
 * Get matches by date (format: YYYY-MM-DD)
 */
export async function getMatchesByDate(date: string): Promise<Match[]> {
  const service = getFootballService();
  return service.getMatchesByDate(date);
}

/**
 * Get matches by league
 */
export async function getMatchesByLeague(
  leagueId: number,
  season?: number
): Promise<Match[]> {
  const service = getFootballService();
  return service.getMatchesByLeague(leagueId, season);
}

/**
 * Get match by ID
 */
export async function getMatchById(matchId: number): Promise<Match> {
  const service = getFootballService();
  return service.getMatchById(matchId);
}

/**
 * Get upcoming matches
 */
export async function getUpcomingMatches(leagueId?: number): Promise<Match[]> {
  const service = getFootballService();
  return service.getUpcomingMatches(leagueId);
}

/**
 * Get finished matches
 */
export async function getFinishedMatches(leagueId?: number): Promise<Match[]> {
  const service = getFootballService();
  return service.getFinishedMatches(leagueId);
}

/**
 * Get featured matches (live + today + upcoming)
 */
export async function getFeaturedMatches(): Promise<{
  live: Match[];
  today: Match[];
  upcoming: Match[];
}> {
  const service = getFootballService();
  return service.getFeaturedMatches();
}

// ============================================================================
// STANDINGS
// ============================================================================

/**
 * Get league standings/table
 */
export async function getStandingsByLeague(
  leagueId: number,
  season?: number
): Promise<Standing[]> {
  const service = getFootballService();
  return service.getStandingsByLeague(leagueId, season);
}

// ============================================================================
// TEAMS
// ============================================================================

/**
 * Get team by ID
 */
export async function getTeamById(teamId: number): Promise<Team> {
  const service = getFootballService();
  return service.getTeamById(teamId);
}

/**
 * Get teams by league
 */
export async function getTeamsByLeague(leagueId: number): Promise<Team[]> {
  const service = getFootballService();
  return service.getTeamsByLeague(leagueId);
}

/**
 * Search teams by name
 */
export async function searchTeams(query: string): Promise<Team[]> {
  const service = getFootballService();
  return service.searchTeams(query);
}

/**
 * Get team's recent matches
 */
export async function getTeamRecentMatches(
  teamId: number,
  limit?: number
): Promise<Match[]> {
  const service = getFootballService();
  return service.getTeamRecentMatches(teamId, limit);
}

/**
 * Get team's upcoming matches
 */
export async function getTeamUpcomingMatches(
  teamId: number,
  limit?: number
): Promise<Match[]> {
  const service = getFootballService();
  return service.getTeamUpcomingMatches(teamId, limit);
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get top scorers for a league
 */
export async function getTopScorers(
  leagueId: number,
  season?: number
): Promise<TopScorer[]> {
  const service = getFootballService();
  return service.getTopScorers(leagueId, season);
}

/**
 * Get head to head between two teams
 */
export async function getHeadToHead(
  team1Id: number,
  team2Id: number
): Promise<HeadToHead> {
  const service = getFootballService();
  return service.getHeadToHead(team1Id, team2Id);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get date range (from today to X days ahead/behind)
 */
export function getDateRange(daysOffset: number): {
  from: string;
  to: string;
} {
  const today = new Date();
  const targetDate = new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000);

  if (daysOffset > 0) {
    return {
      from: formatDate(today),
      to: formatDate(targetDate),
    };
  } else {
    return {
      from: formatDate(targetDate),
      to: formatDate(today),
    };
  }
}

/**
 * Check if match is live
 */
export function isMatchLive(match: Match): boolean {
  return match.status === "live" || match.status === "in_play";
}

/**
 * Check if match is finished
 */
export function isMatchFinished(match: Match): boolean {
  return match.status === "finished";
}

/**
 * Check if match is upcoming
 */
export function isMatchUpcoming(match: Match): boolean {
  return match.status === "scheduled";
}

/**
 * Get match result (W/D/L) for a specific team
 */
export function getMatchResult(match: Match, teamId: number): "W" | "D" | "L" | null {
  if (!isMatchFinished(match) || match.score.home === null || match.score.away === null) {
    return null;
  }

  const isHomeTeam = match.homeTeam.id === teamId;
  const teamScore = isHomeTeam ? match.score.home : match.score.away;
  const opponentScore = isHomeTeam ? match.score.away : match.score.home;

  if (teamScore > opponentScore) return "W";
  if (teamScore < opponentScore) return "L";
  return "D";
}
