/**
 * Football Data Service (Non-React)
 * Server-side service for fetching and caching football data
 * This can be used in Server Components and API routes
 */

import { useFootballStore } from "@/src/stores/footballStore";
import {
  getAllLeagues,
  getLeagueById,
  getLeaguesByCountry,
  getLeagueOverview,
  getLiveMatches,
  getTodayMatches,
  getMatchesByDate,
  getMatchesByLeague,
  getMatchById,
  getUpcomingMatches,
  getFinishedMatches,
  getFeaturedMatches,
  getStandingsByLeague,
  getTeamById,
  getTeamsByLeague,
  searchTeams,
  getTeamRecentMatches,
  getTeamUpcomingMatches,
  getTopScorers,
  getHeadToHead,
} from "@/src/infrastructure/api";
import type {
  League,
  Match,
  Standing,
  Team,
  TopScorer,
  HeadToHead,
} from "@/src/domain/entities/football.entity";

/**
 * Football Data Service
 * Provides cached access to football data for server-side usage
 */
export class FootballDataService {
  private store = useFootballStore.getState();

  // ============================================================================
  // LEAGUES
  // ============================================================================

  async fetchAllLeagues(): Promise<League[]> {
    const cached = this.store.getLeagues();
    if (cached) return cached;

    const data = await getAllLeagues();
    this.store.setLeagues(data);
    return data;
  }

  async fetchLeagueById(leagueId: number): Promise<League> {
    const cached = this.store.getLeagueById(leagueId);
    if (cached) return cached;

    const data = await getLeagueById(leagueId);
    this.store.setLeagueById(leagueId, data);
    return data;
  }

  async fetchLeaguesByCountry(country: string): Promise<League[]> {
    const cached = this.store.getLeaguesByCountry(country);
    if (cached) return cached;

    const data = await getLeaguesByCountry(country);
    this.store.setLeaguesByCountry(country, data);
    return data;
  }

  async fetchLeagueOverview(
    leagueId: number,
    season?: number
  ): Promise<{
    league: League;
    standings: Standing[];
    recentMatches: Match[];
    topScorers: TopScorer[];
  }> {
    const cached = this.store.getLeagueOverview(leagueId, season);
    if (cached) return cached;

    const data = await getLeagueOverview(leagueId, season);
    this.store.setLeagueOverview(leagueId, season, data);
    return data;
  }

  // ============================================================================
  // MATCHES
  // ============================================================================

  async fetchLiveMatches(): Promise<Match[]> {
    const cached = this.store.getLiveMatches();
    if (cached) return cached;

    const data = await getLiveMatches();
    this.store.setLiveMatches(data);
    return data;
  }

  async fetchTodayMatches(): Promise<Match[]> {
    const today = new Date().toISOString().split("T")[0];
    return this.fetchMatchesByDate(today);
  }

  async fetchMatchesByDate(date: string): Promise<Match[]> {
    const cached = this.store.getMatchesByDate(date);
    if (cached) return cached;

    const data = await getMatchesByDate(date);
    this.store.setMatchesByDate(date, data);
    return data;
  }

  async fetchMatchesByLeague(
    leagueId: number,
    season?: number
  ): Promise<Match[]> {
    const cached = this.store.getMatchesByLeague(leagueId, season);
    if (cached) return cached;

    const data = await getMatchesByLeague(leagueId, season);
    this.store.setMatchesByLeague(leagueId, season, data);
    return data;
  }

  async fetchMatchById(matchId: number): Promise<Match> {
    const cached = this.store.getMatchById(matchId);
    if (cached) return cached;

    const data = await getMatchById(matchId);
    this.store.setMatchById(matchId, data);
    return data;
  }

  async fetchUpcomingMatches(leagueId?: number): Promise<Match[]> {
    const cached = this.store.getUpcomingMatches(leagueId);
    if (cached) return cached;

    const data = await getUpcomingMatches(leagueId);
    this.store.setUpcomingMatches(leagueId, data);
    return data;
  }

  async fetchFinishedMatches(leagueId?: number): Promise<Match[]> {
    const cached = this.store.getFinishedMatches(leagueId);
    if (cached) return cached;

    const data = await getFinishedMatches(leagueId);
    this.store.setFinishedMatches(leagueId, data);
    return data;
  }

  async fetchFeaturedMatches(): Promise<{
    live: Match[];
    today: Match[];
    upcoming: Match[];
  }> {
    const cached = this.store.getFeaturedMatches();
    if (cached) return cached;

    const data = await getFeaturedMatches();
    this.store.setFeaturedMatches(data);
    return data;
  }

  // ============================================================================
  // STANDINGS
  // ============================================================================

  async fetchStandingsByLeague(
    leagueId: number,
    season?: number
  ): Promise<Standing[]> {
    const cached = this.store.getStandingsByLeague(leagueId, season);
    if (cached) return cached;

    const data = await getStandingsByLeague(leagueId, season);
    this.store.setStandingsByLeague(leagueId, season, data);
    return data;
  }

  // ============================================================================
  // TEAMS
  // ============================================================================

  async fetchTeamById(teamId: number): Promise<Team> {
    const cached = this.store.getTeamById(teamId);
    if (cached) return cached;

    const data = await getTeamById(teamId);
    this.store.setTeamById(teamId, data);
    return data;
  }

  async fetchTeamsByLeague(leagueId: number): Promise<Team[]> {
    const cached = this.store.getTeamsByLeague(leagueId);
    if (cached) return cached;

    const data = await getTeamsByLeague(leagueId);
    this.store.setTeamsByLeague(leagueId, data);
    return data;
  }

  async fetchSearchTeams(query: string): Promise<Team[]> {
    const cached = this.store.getSearchedTeams(query);
    if (cached) return cached;

    const data = await searchTeams(query);
    this.store.setSearchedTeams(query, data);
    return data;
  }

  async fetchTeamRecentMatches(
    teamId: number,
    limit: number = 5
  ): Promise<Match[]> {
    const cached = this.store.getTeamRecentMatches(teamId, limit);
    if (cached) return cached;

    const data = await getTeamRecentMatches(teamId, limit);
    this.store.setTeamRecentMatches(teamId, limit, data);
    return data;
  }

  async fetchTeamUpcomingMatches(
    teamId: number,
    limit: number = 5
  ): Promise<Match[]> {
    const cached = this.store.getTeamUpcomingMatches(teamId, limit);
    if (cached) return cached;

    const data = await getTeamUpcomingMatches(teamId, limit);
    this.store.setTeamUpcomingMatches(teamId, limit, data);
    return data;
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  async fetchTopScorers(
    leagueId: number,
    season?: number
  ): Promise<TopScorer[]> {
    const cached = this.store.getTopScorers(leagueId, season);
    if (cached) return cached;

    const data = await getTopScorers(leagueId, season);
    this.store.setTopScorers(leagueId, season, data);
    return data;
  }

  async fetchHeadToHead(
    team1Id: number,
    team2Id: number
  ): Promise<HeadToHead> {
    const cached = this.store.getHeadToHead(team1Id, team2Id);
    if (cached) return cached;

    const data = await getHeadToHead(team1Id, team2Id);
    this.store.setHeadToHead(team1Id, team2Id, data);
    return data;
  }

  // ============================================================================
  // UTILITY
  // ============================================================================

  clearCache(): void {
    this.store.clearCache();
  }

  clearExpiredCache(): void {
    this.store.clearExpiredCache();
  }
}

// Singleton instance for server-side usage
let footballDataServiceInstance: FootballDataService | null = null;

export function getFootballDataService(): FootballDataService {
  if (!footballDataServiceInstance) {
    footballDataServiceInstance = new FootballDataService();
  }
  return footballDataServiceInstance;
}
