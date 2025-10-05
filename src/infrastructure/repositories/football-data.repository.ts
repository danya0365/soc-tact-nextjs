/**
 * Football Data Repository Implementation
 * Implements FootballRepository interface using Football-Data.org API
 * Following Dependency Inversion Principle (SOLID)
 */

import { FootballRepository } from "@/src/domain/repositories/football.repository";
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
} from "@/src/domain/entities/football.entity";
import { FootballDataDatasource } from "../datasources/football-data.datasource";
import { FootballDataMapper } from "../mappers/football-data.mapper";

export class FootballDataRepository implements FootballRepository {
  constructor(private datasource: FootballDataDatasource) {}

  /**
   * Get all leagues
   */
  async getAllLeagues(): Promise<League[]> {
    try {
      const response = await this.datasource.getCompetitions();
      return response.competitions.map((comp: any) =>
        FootballDataMapper.mapLeague(comp)
      );
    } catch (error) {
      console.error("Error fetching leagues:", error);
      throw new Error("Failed to fetch leagues");
    }
  }

  /**
   * Get league by ID
   */
  async getLeagueById(leagueId: number): Promise<League> {
    try {
      const response = await this.datasource.getCompetitionById(leagueId);
      return FootballDataMapper.mapLeague(response);
    } catch (error) {
      console.error(`Error fetching league ${leagueId}:`, error);
      throw new Error(`Failed to fetch league ${leagueId}`);
    }
  }

  /**
   * Get leagues by country
   */
  async getLeaguesByCountry(country: string): Promise<League[]> {
    try {
      const allLeagues = await this.getAllLeagues();
      return allLeagues.filter(
        (league) => league.country.toLowerCase() === country.toLowerCase()
      );
    } catch (error) {
      console.error(`Error fetching leagues for ${country}:`, error);
      throw new Error(`Failed to fetch leagues for ${country}`);
    }
  }

  /**
   * Get live matches
   */
  async getLiveMatches(): Promise<Match[]> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await this.datasource.getMatchesByDate(today);
      
      const matches = response.matches.map((match: any) =>
        FootballDataMapper.mapMatch(match)
      );

      // Filter only live matches
      return matches.filter((match: Match) => 
        match.status === "live" || match.status === "in_play"
      );
    } catch (error) {
      console.error("Error fetching live matches:", error);
      throw new Error("Failed to fetch live matches");
    }
  }

  /**
   * Get matches by date
   */
  async getMatchesByDate(date: string): Promise<Match[]> {
    try {
      const response = await this.datasource.getMatchesByDate(date);
      return response.matches.map((match: any) =>
        FootballDataMapper.mapMatch(match)
      );
    } catch (error) {
      console.error(`Error fetching matches for ${date}:`, error);
      throw new Error(`Failed to fetch matches for ${date}`);
    }
  }

  /**
   * Get matches by league
   */
  async getMatchesByLeague(
    leagueId: number,
    season?: number
  ): Promise<Match[]> {
    try {
      const response = await this.datasource.getMatchesByCompetition(leagueId, {
        season,
      });
      return response.matches.map((match: any) =>
        FootballDataMapper.mapMatch(match)
      );
    } catch (error) {
      console.error(`Error fetching matches for league ${leagueId}:`, error);
      throw new Error(`Failed to fetch matches for league ${leagueId}`);
    }
  }

  /**
   * Get match by ID
   */
  async getMatchById(matchId: number): Promise<Match> {
    try {
      const response = await this.datasource.getMatchById(matchId);
      return FootballDataMapper.mapMatch(response.match);
    } catch (error) {
      console.error(`Error fetching match ${matchId}:`, error);
      throw new Error(`Failed to fetch match ${matchId}`);
    }
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches(leagueId?: number): Promise<Match[]> {
    try {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const dateFrom = today.toISOString().split("T")[0];
      const dateTo = nextWeek.toISOString().split("T")[0];

      if (leagueId) {
        const response = await this.datasource.getMatchesByCompetition(leagueId, {
          dateFrom,
          dateTo,
          status: "SCHEDULED",
        });
        return response.matches.map((match: any) =>
          FootballDataMapper.mapMatch(match)
        );
      } else {
        const response = await this.datasource.getMatchesByDateRange(
          dateFrom,
          dateTo
        );
        return response.matches
          .filter((match: any) => match.status === "SCHEDULED")
          .map((match: any) => FootballDataMapper.mapMatch(match));
      }
    } catch (error) {
      console.error("Error fetching upcoming matches:", error);
      throw new Error("Failed to fetch upcoming matches");
    }
  }

  /**
   * Get finished matches
   */
  async getFinishedMatches(leagueId?: number): Promise<Match[]> {
    try {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const dateFrom = lastWeek.toISOString().split("T")[0];
      const dateTo = today.toISOString().split("T")[0];

      if (leagueId) {
        const response = await this.datasource.getMatchesByCompetition(leagueId, {
          dateFrom,
          dateTo,
          status: "FINISHED",
        });
        return response.matches.map((match: any) =>
          FootballDataMapper.mapMatch(match)
        );
      } else {
        const response = await this.datasource.getMatchesByDateRange(
          dateFrom,
          dateTo
        );
        return response.matches
          .filter((match: any) => match.status === "FINISHED")
          .map((match: any) => FootballDataMapper.mapMatch(match));
      }
    } catch (error) {
      console.error("Error fetching finished matches:", error);
      throw new Error("Failed to fetch finished matches");
    }
  }

  /**
   * Get standings by league
   */
  async getStandingsByLeague(
    leagueId: number,
    season?: number
  ): Promise<Standing[]> {
    try {
      const response = await this.datasource.getStandingsByCompetition(
        leagueId,
        season
      );
      
      // Football-Data.org returns standings in groups (e.g., HOME, AWAY, TOTAL)
      // We want the TOTAL standings
      const totalStandings = response.standings.find(
        (s: any) => s.type === "TOTAL"
      );

      if (!totalStandings) {
        throw new Error("No total standings found");
      }

      return totalStandings.table.map((standing: any) =>
        FootballDataMapper.mapStanding(standing)
      );
    } catch (error) {
      console.error(`Error fetching standings for league ${leagueId}:`, error);
      throw new Error(`Failed to fetch standings for league ${leagueId}`);
    }
  }

  /**
   * Get team by ID
   */
  async getTeamById(teamId: number): Promise<Team> {
    try {
      const response = await this.datasource.getTeamById(teamId);
      return FootballDataMapper.mapTeam(response);
    } catch (error) {
      console.error(`Error fetching team ${teamId}:`, error);
      throw new Error(`Failed to fetch team ${teamId}`);
    }
  }

  /**
   * Get teams by league
   */
  async getTeamsByLeague(leagueId: number): Promise<Team[]> {
    try {
      const response = await this.datasource.getTeamsByCompetition(leagueId);
      return response.teams.map((team: any) =>
        FootballDataMapper.mapTeam(team)
      );
    } catch (error) {
      console.error(`Error fetching teams for league ${leagueId}:`, error);
      throw new Error(`Failed to fetch teams for league ${leagueId}`);
    }
  }

  /**
   * Search teams
   */
  async searchTeams(query: string): Promise<Team[]> {
    try {
      // Football-Data.org doesn't have a direct search endpoint
      // We'll get all teams and filter client-side
      const allLeagues = await this.getAllLeagues();
      const allTeams: Team[] = [];

      for (const league of allLeagues.slice(0, 5)) {
        // Limit to top 5 leagues to avoid rate limiting
        try {
          const teams = await this.getTeamsByLeague(league.id);
          allTeams.push(...teams);
        } catch (error) {
          // Skip if league doesn't have teams
          continue;
        }
      }

      return allTeams.filter((team) =>
        team.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error(`Error searching teams with query "${query}":`, error);
      throw new Error(`Failed to search teams`);
    }
  }

  /**
   * Get match statistics
   * Note: Football-Data.org free tier doesn't provide detailed statistics
   */
  async getMatchStatistics(matchId: number): Promise<MatchStatistics> {
    console.warn("Match statistics not available in free tier");
    throw new Error("Match statistics not available in free tier");
  }

  /**
   * Get match events
   * Note: Football-Data.org free tier doesn't provide match events
   */
  async getMatchEvents(matchId: number): Promise<MatchEvent[]> {
    console.warn("Match events not available in free tier");
    throw new Error("Match events not available in free tier");
  }

  /**
   * Get match lineups
   * Note: Football-Data.org free tier doesn't provide lineups
   */
  async getMatchLineups(matchId: number): Promise<Lineup> {
    console.warn("Match lineups not available in free tier");
    throw new Error("Match lineups not available in free tier");
  }

  /**
   * Get top scorers
   */
  async getTopScorers(leagueId: number, season?: number): Promise<TopScorer[]> {
    try {
      const response = await this.datasource.getTopScorersByCompetition(
        leagueId,
        season
      );

      return response.scorers.map((scorer: any) => ({
        player: {
          id: scorer.player.id,
          name: scorer.player.name,
          nationality: scorer.player.nationality,
          position: scorer.player.position,
          photo: "",
        },
        team: FootballDataMapper.mapTeam(scorer.team),
        goals: scorer.goals || scorer.numberOfGoals || 0,
        assists: scorer.assists || 0,
        appearances: scorer.playedMatches || 0,
      }));
    } catch (error) {
      console.error(`Error fetching top scorers for league ${leagueId}:`, error);
      throw new Error(`Failed to fetch top scorers for league ${leagueId}`);
    }
  }

  /**
   * Get head to head
   */
  async getHeadToHead(team1Id: number, team2Id: number): Promise<HeadToHead> {
    try {
      // Get recent matches for team1
      const team1Matches = await this.datasource.getTeamMatches(team1Id, {
        limit: 50,
      });

      // Filter matches where both teams played
      const h2hMatches = team1Matches.matches
        .filter(
          (match: any) =>
            (match.homeTeam.id === team1Id && match.awayTeam.id === team2Id) ||
            (match.homeTeam.id === team2Id && match.awayTeam.id === team1Id)
        )
        .map((match: any) => FootballDataMapper.mapMatch(match));

      // Calculate statistics
      let team1Wins = 0;
      let team2Wins = 0;
      let draws = 0;

      h2hMatches.forEach((match: Match) => {
        if (match.score.home !== null && match.score.away !== null) {
          if (match.homeTeam.id === team1Id) {
            if (match.score.home > match.score.away) team1Wins++;
            else if (match.score.home < match.score.away) team2Wins++;
            else draws++;
          } else {
            if (match.score.away > match.score.home) team1Wins++;
            else if (match.score.away < match.score.home) team2Wins++;
            else draws++;
          }
        }
      });

      const team1 = await this.getTeamById(team1Id);
      const team2 = await this.getTeamById(team2Id);

      return {
        team1,
        team2,
        matches: h2hMatches,
        statistics: {
          team1Wins,
          team2Wins,
          draws,
          totalMatches: h2hMatches.length,
        },
      };
    } catch (error) {
      console.error(
        `Error fetching head to head for teams ${team1Id} vs ${team2Id}:`,
        error
      );
      throw new Error(`Failed to fetch head to head`);
    }
  }
}
