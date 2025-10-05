/**
 * Football Repository Interface
 * Defines the contract for football data access
 * Following Dependency Inversion Principle (SOLID)
 */

import {
  League,
  Match,
  Standing,
  Team,
  MatchStatistics,
  MatchEvent,
  Lineup,
  TopScorer,
  HeadToHead,
} from "../entities/football.entity";

export interface FootballRepository {
  // Leagues
  getAllLeagues(): Promise<League[]>;
  getLeagueById(leagueId: number): Promise<League>;
  getLeaguesByCountry(country: string): Promise<League[]>;

  // Matches
  getLiveMatches(): Promise<Match[]>;
  getMatchesByDate(date: string): Promise<Match[]>;
  getMatchesByLeague(leagueId: number, season?: number): Promise<Match[]>;
  getMatchById(matchId: number): Promise<Match>;
  getUpcomingMatches(leagueId?: number): Promise<Match[]>;
  getFinishedMatches(leagueId?: number): Promise<Match[]>;

  // Standings
  getStandingsByLeague(leagueId: number, season?: number): Promise<Standing[]>;

  // Teams
  getTeamById(teamId: number): Promise<Team>;
  getTeamsByLeague(leagueId: number): Promise<Team[]>;
  searchTeams(query: string): Promise<Team[]>;

  // Match Details
  getMatchStatistics(matchId: number): Promise<MatchStatistics>;
  getMatchEvents(matchId: number): Promise<MatchEvent[]>;
  getMatchLineups(matchId: number): Promise<Lineup>;

  // Statistics
  getTopScorers(leagueId: number, season?: number): Promise<TopScorer[]>;
  getHeadToHead(team1Id: number, team2Id: number): Promise<HeadToHead>;
}
