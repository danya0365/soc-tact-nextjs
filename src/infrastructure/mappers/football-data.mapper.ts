/**
 * Football Data Mapper
 * Maps external API responses to domain entities
 * Following Single Responsibility Principle (SOLID)
 */

import {
  League,
  Match,
  MatchStatistics,
  MatchStatus,
  Referee,
  Score,
  Standing,
  Team,
  TeamStatistics,
} from "@/src/domain/entities/football.entity";
import type {
  ApiArea,
  ApiCompetition,
  ApiMatch,
  ApiMatchTeam,
  ApiReferee,
  ApiScore,
  ApiStandingsTeam,
  ApiTeam,
} from "../datasources/types/football-data.types";

/**
 * Map Football-Data.org API response to domain entities
 */
export class FootballDataMapper {
  /**
   * Map team from API response
   */
  static mapTeam(apiTeam: ApiMatchTeam | ApiTeam): Team {
    if (!apiTeam) {
      return {
        id: 0,
        name: "ทีมไม่ทราบชื่อ",
        shortName: "ทีมไม่ทราบชื่อ",
        logo: "",
        country: "",
      };
    }

    const teamData = apiTeam as ApiMatchTeam & ApiTeam;
    return {
      id: teamData.id,
      name: teamData.name,
      shortName: teamData.shortName || teamData.tla || teamData.name,
      logo: teamData.crest || teamData.crestUrl || "",
      founded: teamData.founded,
      country: teamData.area?.name || "",
      venue: teamData.venue,
    };
  }

  /**
   * Map league from API response
   */
  static mapLeague(apiCompetition: ApiCompetition): League {
    return this.mapLeagueWithContext(apiCompetition, apiCompetition.area);
  }

  private static mapLeagueFromMatch(apiMatch: ApiMatch): League {
    return this.mapLeagueWithContext(
      apiMatch.competition ?? {},
      apiMatch.area
    );
  }

  private static mapLeagueWithContext(
    apiCompetition: ApiCompetition,
    area?: ApiArea
  ): League {
    return {
      id: apiCompetition.id ?? 0,
      name: apiCompetition.name ?? "",
      country: apiCompetition.area?.name ?? area?.name ?? "",
      logo: apiCompetition.emblem ?? area?.flag ?? "",
      season: apiCompetition.currentSeason?.startDate
        ? new Date(apiCompetition.currentSeason.startDate).getFullYear()
        : new Date().getFullYear(),
      type: apiCompetition.type ?? "LEAGUE",
    };
  }

  /**
   * Map match from API response
   */
  static mapMatch(apiMatch: ApiMatch): Match {
    return {
      id: apiMatch.id,
      date: apiMatch.utcDate,
      timestamp: new Date(apiMatch.utcDate).getTime(),
      status: this.mapMatchStatus(apiMatch.status),
      minute: typeof apiMatch.minute === "number" ? apiMatch.minute : undefined,
      stage: apiMatch.stage ?? undefined,
      matchday: typeof apiMatch.matchday === "number" ? apiMatch.matchday : undefined,
      homeTeam: this.mapTeam(apiMatch.homeTeam),
      awayTeam: this.mapTeam(apiMatch.awayTeam),
      score: this.mapScore(apiMatch.score),
      league: this.mapLeagueFromMatch(apiMatch),
      venue: apiMatch.venue ?? undefined,
      referee: this.mapMainReferee(apiMatch.referees),
      winner: this.mapWinner(apiMatch.score?.winner),
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
  static mapScore(apiScore: ApiScore | undefined): Score {
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
      winner: this.mapWinner(apiScore?.winner),
      duration: this.mapDuration(apiScore?.duration),
    };
  }

  static mapMainReferee(referees?: ApiReferee[]): Referee | undefined {
    if (!Array.isArray(referees) || referees.length === 0) {
      return undefined;
    }

    const mainRef = referees.find((ref) => ref.type === "REFEREE") ?? referees[0];

    return {
      id: mainRef.id,
      name: mainRef.name,
      type: mainRef.type ?? "REFEREE",
      nationality: mainRef.nationality ?? "",
    };
  }

  private static mapWinner(winner?: ApiScore["winner"]): Score["winner"] {
    if (!winner) return null;
    const allowed: Score["winner"][] = ["HOME_TEAM", "AWAY_TEAM", "DRAW", null];
    return allowed.includes(winner) ? winner : null;
  }

  private static mapDuration(
    duration?: ApiScore["duration"]
  ): Score["duration"] {
    if (!duration) return null;

    const map: Record<string, Score["duration"]> = {
      REGULAR: "REGULAR",
      EXTRA_TIME: "EXTRA_TIME",
      PENALTY_SHOOTOUT: "PENALTY_SHOOTOUT",
    };

    return map[duration] ?? "UNKNOWN";
  }

  /**
   * Map standing from API response
   */
  static mapStanding(apiStanding: ApiStandingsTeam): Standing {
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
      description: apiStanding.description ?? undefined,
    };
  }

  /**
   * Map match statistics from API response
   */
  static mapMatchStatistics(apiStats: any, matchId: number): MatchStatistics {
    const homeStats = apiStats.find(
      (s: any) => s.team.id === apiStats.homeTeamId
    );
    const awayStats = apiStats.find(
      (s: any) => s.team.id === apiStats.awayTeamId
    );

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
