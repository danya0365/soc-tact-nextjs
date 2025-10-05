/**
 * Football Data Mapper
 * Maps external API responses to domain entities
 * Following Single Responsibility Principle (SOLID)
 */

import {
  Team,
  League,
  Match,
  Standing,
  Score,
  MatchStatus,
  MatchStatistics,
  TeamStatistics,
} from "@/src/domain/entities/football.entity";

/**
 * Map Football-Data.org API response to domain entities
 */
export class FootballDataMapper {
  /**
   * Map team from API response
   */
  static mapTeam(apiTeam: any): Team {
    return {
      id: apiTeam.id,
      name: apiTeam.name,
      shortName: apiTeam.shortName || apiTeam.tla || apiTeam.name,
      logo: apiTeam.crest || apiTeam.crestUrl || "",
      founded: apiTeam.founded,
      country: apiTeam.area?.name || "",
      venue: apiTeam.venue,
    };
  }

  /**
   * Map league from API response
   */
  static mapLeague(apiCompetition: any): League {
    return {
      id: apiCompetition.id,
      name: apiCompetition.name,
      country: apiCompetition.area?.name || "",
      logo: apiCompetition.emblem || "",
      season: apiCompetition.currentSeason?.startDate
        ? new Date(apiCompetition.currentSeason.startDate).getFullYear()
        : new Date().getFullYear(),
      type: apiCompetition.type || "LEAGUE",
    };
  }

  /**
   * Map match from API response
   */
  static mapMatch(apiMatch: any): Match {
    return {
      id: apiMatch.id,
      date: apiMatch.utcDate,
      timestamp: new Date(apiMatch.utcDate).getTime(),
      status: this.mapMatchStatus(apiMatch.status),
      minute: apiMatch.minute,
      homeTeam: this.mapTeam(apiMatch.homeTeam),
      awayTeam: this.mapTeam(apiMatch.awayTeam),
      score: this.mapScore(apiMatch.score),
      league: apiMatch.competition
        ? this.mapLeague(apiMatch.competition)
        : ({} as League),
      venue: apiMatch.venue,
    };
  }

  /**
   * Map match status
   */
  static mapMatchStatus(status: string): MatchStatus {
    const statusMap: Record<string, MatchStatus> = {
      SCHEDULED: MatchStatus.SCHEDULED,
      TIMED: MatchStatus.SCHEDULED,
      IN_PLAY: MatchStatus.LIVE,
      PAUSED: MatchStatus.PAUSED,
      FINISHED: MatchStatus.FINISHED,
      POSTPONED: MatchStatus.POSTPONED,
      CANCELLED: MatchStatus.CANCELLED,
      SUSPENDED: MatchStatus.SUSPENDED,
      AWARDED: MatchStatus.FINISHED,
    };

    return statusMap[status] || MatchStatus.SCHEDULED;
  }

  /**
   * Map score from API response
   */
  static mapScore(apiScore: any): Score {
    return {
      home: apiScore?.fullTime?.home ?? apiScore?.home ?? null,
      away: apiScore?.fullTime?.away ?? apiScore?.away ?? null,
      halftime: {
        home: apiScore?.halfTime?.home ?? null,
        away: apiScore?.halfTime?.away ?? null,
      },
      fulltime: {
        home: apiScore?.fullTime?.home ?? null,
        away: apiScore?.fullTime?.away ?? null,
      },
    };
  }

  /**
   * Map standing from API response
   */
  static mapStanding(apiStanding: any): Standing {
    return {
      position: apiStanding.position,
      team: this.mapTeam(apiStanding.team),
      played: apiStanding.playedGames,
      won: apiStanding.won,
      drawn: apiStanding.draw,
      lost: apiStanding.lost,
      goalsFor: apiStanding.goalsFor,
      goalsAgainst: apiStanding.goalsAgainst,
      goalDifference: apiStanding.goalDifference,
      points: apiStanding.points,
      form: apiStanding.form ? apiStanding.form.split(",") : [],
      description: apiStanding.description,
    };
  }

  /**
   * Map match statistics from API response
   */
  static mapMatchStatistics(apiStats: any, matchId: number): MatchStatistics {
    const homeStats = apiStats.find((s: any) => s.team.id === apiStats.homeTeamId);
    const awayStats = apiStats.find((s: any) => s.team.id === apiStats.awayTeamId);

    return {
      matchId,
      homeTeamStats: this.mapTeamStatistics(homeStats?.statistics || []),
      awayTeamStats: this.mapTeamStatistics(awayStats?.statistics || []),
    };
  }

  /**
   * Map team statistics
   */
  static mapTeamStatistics(apiStats: any[]): TeamStatistics {
    const stats: TeamStatistics = {};

    apiStats.forEach((stat: any) => {
      switch (stat.type) {
        case "Ball Possession":
          stats.possession = parseInt(stat.value);
          break;
        case "Total Shots":
          stats.shots = stat.value;
          break;
        case "Shots on Goal":
          stats.shotsOnTarget = stat.value;
          break;
        case "Corner Kicks":
          stats.corners = stat.value;
          break;
        case "Fouls":
          stats.fouls = stat.value;
          break;
        case "Yellow Cards":
          stats.yellowCards = stat.value;
          break;
        case "Red Cards":
          stats.redCards = stat.value;
          break;
        case "Offsides":
          stats.offsides = stat.value;
          break;
        case "Passes":
          stats.passes = stat.value;
          break;
        case "Pass Accuracy":
          stats.passAccuracy = parseInt(stat.value);
          break;
      }
    });

    return stats;
  }
}
