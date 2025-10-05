/**
 * Football Service
 * Application service that orchestrates football data operations
 * Following Single Responsibility Principle (SOLID)
 */

import { FootballRepository } from "@/src/domain/repositories/football.repository";
import {
  League,
  Match,
  Standing,
  Team,
  TopScorer,
  HeadToHead,
} from "@/src/domain/entities/football.entity";

export class FootballService {
  constructor(private repository: FootballRepository) {}

  /**
   * Get all available leagues
   */
  async getAllLeagues(): Promise<League[]> {
    return this.repository.getAllLeagues();
  }

  /**
   * Get league details by ID
   */
  async getLeagueById(leagueId: number): Promise<League> {
    return this.repository.getLeagueById(leagueId);
  }

  /**
   * Get leagues by country
   */
  async getLeaguesByCountry(country: string): Promise<League[]> {
    return this.repository.getLeaguesByCountry(country);
  }

  /**
   * Get live matches across all leagues
   */
  async getLiveMatches(): Promise<Match[]> {
    return this.repository.getLiveMatches();
  }

  /**
   * Get matches for a specific date
   */
  async getMatchesByDate(date: string): Promise<Match[]> {
    return this.repository.getMatchesByDate(date);
  }

  /**
   * Get today's matches
   */
  async getTodayMatches(): Promise<Match[]> {
    const today = new Date().toISOString().split("T")[0];
    return this.repository.getMatchesByDate(today);
  }

  /**
   * Get matches by league
   */
  async getMatchesByLeague(
    leagueId: number,
    season?: number
  ): Promise<Match[]> {
    return this.repository.getMatchesByLeague(leagueId, season);
  }

  /**
   * Get match details by ID
   */
  async getMatchById(matchId: number): Promise<Match> {
    return this.repository.getMatchById(matchId);
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches(leagueId?: number): Promise<Match[]> {
    return this.repository.getUpcomingMatches(leagueId);
  }

  /**
   * Get finished matches
   */
  async getFinishedMatches(leagueId?: number): Promise<Match[]> {
    return this.repository.getFinishedMatches(leagueId);
  }

  /**
   * Get league standings/table
   */
  async getStandingsByLeague(
    leagueId: number,
    season?: number
  ): Promise<Standing[]> {
    return this.repository.getStandingsByLeague(leagueId, season);
  }

  /**
   * Get team details by ID
   */
  async getTeamById(teamId: number): Promise<Team> {
    return this.repository.getTeamById(teamId);
  }

  /**
   * Get all teams in a league
   */
  async getTeamsByLeague(leagueId: number): Promise<Team[]> {
    return this.repository.getTeamsByLeague(leagueId);
  }

  /**
   * Search teams by name
   */
  async searchTeams(query: string): Promise<Team[]> {
    if (!query || query.trim().length < 2) {
      throw new Error("Search query must be at least 2 characters");
    }
    return this.repository.searchTeams(query);
  }

  /**
   * Get top scorers for a league
   */
  async getTopScorers(leagueId: number, season?: number): Promise<TopScorer[]> {
    return this.repository.getTopScorers(leagueId, season);
  }

  /**
   * Get head to head statistics between two teams
   */
  async getHeadToHead(team1Id: number, team2Id: number): Promise<HeadToHead> {
    return this.repository.getHeadToHead(team1Id, team2Id);
  }

  /**
   * Get team's recent matches
   */
  async getTeamRecentMatches(teamId: number, limit: number = 5): Promise<Match[]> {
    const matches = await this.repository.getFinishedMatches();
    return matches
      .filter(
        (match) =>
          match.homeTeam.id === teamId || match.awayTeam.id === teamId
      )
      .slice(0, limit);
  }

  /**
   * Get team's upcoming matches
   */
  async getTeamUpcomingMatches(teamId: number, limit: number = 5): Promise<Match[]> {
    const matches = await this.repository.getUpcomingMatches();
    return matches
      .filter(
        (match) =>
          match.homeTeam.id === teamId || match.awayTeam.id === teamId
      )
      .slice(0, limit);
  }

  /**
   * Get featured matches (live + upcoming today)
   */
  async getFeaturedMatches(): Promise<{
    live: Match[];
    today: Match[];
    upcoming: Match[];
  }> {
    const [liveMatches, todayMatches, upcomingMatches] = await Promise.all([
      this.getLiveMatches(),
      this.getTodayMatches(),
      this.getUpcomingMatches(),
    ]);

    return {
      live: liveMatches,
      today: todayMatches.filter((m) => m.status === "scheduled"),
      upcoming: upcomingMatches.slice(0, 10),
    };
  }

  /**
   * Get league overview (standings + recent matches + top scorers)
   */
  async getLeagueOverview(leagueId: number, season?: number): Promise<{
    league: League;
    standings: Standing[];
    recentMatches: Match[];
    topScorers: TopScorer[];
  }> {
    const [league, standings, matches, topScorers] = await Promise.all([
      this.getLeagueById(leagueId),
      this.getStandingsByLeague(leagueId, season),
      this.getMatchesByLeague(leagueId, season),
      this.getTopScorers(leagueId, season),
    ]);

    // Get recent finished matches
    const recentMatches = matches
      .filter((m) => m.status === "finished")
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    return {
      league,
      standings,
      recentMatches,
      topScorers: topScorers.slice(0, 10),
    };
  }
}
