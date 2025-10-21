/**
 * League Detail Presenter
 * Handles business logic for League Table detail page
 */

import type {
  League,
  Standing,
  Match,
  TopScorer,
} from "@/src/domain/entities/football.entity";
import { MatchStatus } from "@/src/domain/entities/football.entity";
import {
  getLeagueOverview,
  getMatchesByLeague,
} from "@/src/infrastructure/api/football.api";

export type LeagueOverviewResult = Awaited<ReturnType<typeof getLeagueOverview>>;

// View Model interfaces
export interface LeagueDetailViewModel {
  league: LeagueSummary | null;
  standings: StandingSummary[];
  topScorers: TopScorerSummary[];
  upcomingFixtures: FixtureSummary[];
  filter: "overall" | "home" | "away";
}

interface LeagueSummary {
  id: string;
  name: string;
  logo: string;
  country: string;
  season: string;
  totalTeams: number;
  currentMatchday: number | null;
  totalMatchdays: number | null;
}

interface StandingSummary {
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
  form: Array<"W" | "D" | "L">;
}

interface TopScorerSummary {
  id: string;
  name: string;
  team: string;
  teamLogo: string;
  goals: number;
  assists: number;
  matches: number;
}

interface FixtureSummary {
  id: string;
  date: string;
  time: string;
  status: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
}

/**
 * Presenter for League Detail page
 */
export class LeagueDetailPresenter {
  /**
   * Get view model for league detail page
   */
  async getViewModel(
    leagueId: string,
    filter: "overall" | "home" | "away" = "overall"
  ): Promise<LeagueDetailViewModel> {
    try {
      const leagueIdNumber = Number.parseInt(leagueId, 10);
      if (Number.isNaN(leagueIdNumber)) {
        throw new Error("รหัสลีกไม่ถูกต้อง");
      }

      const [overview, matches] = await Promise.all([
        getLeagueOverview(leagueIdNumber),
        getMatchesByLeague(leagueIdNumber),
      ]);

      return buildLeagueDetailViewModel(overview, matches, filter);
    } catch (error) {
      console.error("Error in LeagueDetailPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for league detail page
   */
  async generateMetadata(leagueId: string) {
    try {
      const leagueIdNumber = Number.parseInt(leagueId, 10);
      if (Number.isNaN(leagueIdNumber)) {
        return {
          title: "ไม่พบข้อมูลลีก | Soccer Tactics",
          description: "ไม่พบข้อมูลลีกที่คุณต้องการ",
        };
      }

      const [overview, matches] = await Promise.all([
        getLeagueOverview(leagueIdNumber),
        getMatchesByLeague(leagueIdNumber),
      ]);

      const leagueSummary = mapLeagueSummary(
        overview.league,
        overview.standings,
        matches
      );
      const league = overview.league;

      return {
        title: `ตารางคะแนน ${league.name} - ${league.season} | Soccer Tactics`,
        description: `ดูตารางคะแนน ${league.name} ฤดูกาล ${league.season} อัพเดทล่าสุด`,
        keywords: `${league.name}, ตารางคะแนน, standings, ${league.country}`,
        openGraph: {
          title: `ตารางคะแนน ${league.name}`,
          description: `${league.season} - Matchday ${leagueSummary.currentMatchday ?? "-"}`,
          type: "website",
        },
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      return {
        title: "ตารางคะแนนลีก | Soccer Tactics",
        description: "ดูตารางคะแนนและสถิติลีก",
      };
    }
  }
}

const MATCH_TIME_FORMATTER = new Intl.DateTimeFormat("th-TH", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function buildLeagueDetailViewModel(
  overview: LeagueOverviewResult,
  matches: Match[],
  filter: "overall" | "home" | "away"
): LeagueDetailViewModel {
  const leagueSummary = mapLeagueSummary(
    overview.league,
    overview.standings,
    matches
  );
  const standingsSummary = mapStandingsSummary(overview.standings);
  const topScorerSummary = mapTopScorersSummary(overview.topScorers);
  const fixtureSummary = mapUpcomingFixturesSummary(matches, overview.league);

  return {
    league: leagueSummary,
    standings: standingsSummary,
    topScorers: topScorerSummary,
    upcomingFixtures: fixtureSummary,
    filter,
  };
}

function mapLeagueSummary(
  league: League,
  standings: Standing[],
  matches: Match[]
): LeagueSummary {
  const totalTeams = standings.length;
  const matchdays = matches
    .map((match) => match.matchday)
    .filter((matchday): matchday is number => typeof matchday === "number");

  const completedStatuses = new Set<MatchStatus>([
    MatchStatus.FINISHED,
    MatchStatus.LIVE,
    MatchStatus.IN_PLAY,
    MatchStatus.PAUSED,
  ]);

  const completedMatchdays = matches
    .filter((match) => completedStatuses.has(match.status))
    .map((match) => match.matchday)
    .filter((matchday): matchday is number => typeof matchday === "number");

  const currentMatchday = completedMatchdays.length
    ? Math.max(...completedMatchdays)
    : matchdays.length
      ? Math.min(Math.max(...matchdays), totalTeams ? totalTeams * 2 : 0)
      : null;

  const totalMatchdays = matchdays.length ? Math.max(...matchdays) : null;

  return {
    id: league.id.toString(),
    name: league.name,
    logo: getLogoSymbol(league.logo, league.name, "🏆"),
    country: league.country,
    season: formatSeasonLabel(league.season),
    totalTeams,
    currentMatchday,
    totalMatchdays,
  };
}

function mapStandingsSummary(standings: Standing[]): StandingSummary[] {
  if (!Array.isArray(standings)) {
    return [];
  }

  return standings.map((standing) => ({
    position: standing.position,
    team: {
      id: standing.team.id.toString(),
      name: standing.team.name,
      logo: getLogoSymbol(standing.team.logo, standing.team.name, "⚽"),
      shortName: standing.team.shortName || standing.team.name,
    },
    played: standing.played,
    won: standing.won,
    drawn: standing.drawn,
    lost: standing.lost,
    goalsFor: standing.goalsFor,
    goalsAgainst: standing.goalsAgainst,
    goalDifference: standing.goalDifference,
    points: standing.points,
    form: normalizeForm(standing.form),
  }));
}

function mapTopScorersSummary(topScorers: TopScorer[]): TopScorerSummary[] {
  if (!Array.isArray(topScorers)) {
    return [];
  }

  return topScorers.map((scorer) => ({
    id: scorer.player.id?.toString() ?? scorer.player.name,
    name: scorer.player.name,
    team: scorer.team.name,
    teamLogo: getLogoSymbol(scorer.team.logo, scorer.team.name, "⚽"),
    goals: scorer.goals,
    assists: scorer.assists ?? 0,
    matches: scorer.appearances ?? 0,
  }));
}

function mapUpcomingFixturesSummary(
  matches: Match[],
  league: League
): FixtureSummary[] {
  if (!Array.isArray(matches)) {
    return [];
  }

  const now = Date.now();
  const upcomingStatuses = new Set<MatchStatus>([MatchStatus.SCHEDULED]);

  return matches
    .filter((match) => upcomingStatuses.has(match.status))
    .filter((match) => new Date(match.date).getTime() >= now)
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    .slice(0, 5)
    .map((match) => ({
      id: match.id.toString(),
      date: match.date,
      time: formatMatchTime(match.date),
      status: mapMatchStatusLabel(match.status),
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      venue: match.venue?.trim() || league.country || "สนามแข่งขัน",
    }));
}

function formatSeasonLabel(season?: number): string {
  if (!season) {
    return "-";
  }

  const nextSeason = season + 1;
  const nextSuffix = nextSeason.toString().slice(-2);
  return `${season}/${nextSuffix}`;
}

function getLogoSymbol(
  logo: string | undefined,
  name: string,
  fallback: string
): string {
  if (logo && !logo.startsWith("http")) {
    return logo;
  }

  const initial = name.trim().charAt(0);
  return initial ? initial.toUpperCase() : fallback;
}

function normalizeForm(form?: string[] | null): Array<"W" | "D" | "L"> {
  if (!form || form.length === 0) {
    return [];
  }

  const allowed: Array<"W" | "D" | "L"> = ["W", "D", "L"];

  return form
    .map((result) => result?.trim().toUpperCase().charAt(0))
    .filter((result): result is "W" | "D" | "L" =>
      allowed.includes(result as "W" | "D" | "L")
    );
}

function formatMatchTime(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return MATCH_TIME_FORMATTER.format(parsed);
}

function mapMatchStatusLabel(status: MatchStatus): string {
  switch (status) {
    case MatchStatus.SCHEDULED:
      return "ยังไม่แข่ง";
    case MatchStatus.POSTPONED:
      return "เลื่อน";
    default:
      return status;
  }
}

/**
 * Factory for creating LeagueDetailPresenter instances
 */
export class LeagueDetailPresenterFactory {
  static createServer(): LeagueDetailPresenter {
    return new LeagueDetailPresenter();
  }

  static createClient(): LeagueDetailPresenter {
    return new LeagueDetailPresenter();
  }
}
