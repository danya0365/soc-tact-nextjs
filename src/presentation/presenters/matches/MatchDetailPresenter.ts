/**
 * Match Detail Presenter
 * Handles business logic for the Match Detail page
 */

import type { HeadToHead, Match } from "@/src/domain/entities/football.entity";
import { MatchStatus } from "@/src/domain/entities/football.entity";
import { getHeadToHead, getMatchById } from "@/src/infrastructure/api";

// View Model interfaces
export interface MatchDetailViewModel {
  match: MatchDetail | null;
}

export interface MatchDetail {
  id: string;
  homeTeam: TeamSummary;
  awayTeam: TeamSummary;
  score: ScoreSummary;
  status: MatchStatusView;
  minute: number | null;
  league: LeagueSummary;
  venue: VenueSummary;
  date: string;
  time: string;
  referee?: string;
  statistics?: MatchStatisticsSummary;
  events?: MatchEventSummary[];
  lineups?: MatchLineupsSummary;
  headToHead?: HeadToHeadSummary[];
}

type MatchStatusView = "live" | "finished" | "upcoming" | "postponed";

interface TeamSummary {
  id: string;
  name: string;
  logo: string;
  shortName: string;
}

interface ScoreSummary {
  home: number | null;
  away: number | null;
  halftime?: {
    home: number | null;
    away: number | null;
  };
}

interface LeagueSummary {
  id: string;
  name: string;
  logo: string;
  country: string;
}

interface VenueSummary {
  name: string;
  city: string;
}

type MatchStatisticsSummary = Record<
  string,
  {
    home: number;
    away: number;
  }
>;

interface MatchEventSummary {
  id: string;
  type: string;
  minute: number;
  team: "home" | "away";
  player?: string;
  assist?: string;
  detail?: string;
}

interface MatchLineupsSummary {
  home: TeamLineupSummary;
  away: TeamLineupSummary;
}

interface TeamLineupSummary {
  formation: string;
  startXI: Array<{
    id: string;
    name: string;
    number?: number;
    position?: string;
  }>;
  substitutes: Array<{
    id: string;
    name: string;
    number?: number;
    position?: string;
  }>;
}

interface HeadToHeadSummary {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: {
    home: number;
    away: number;
  };
  competition: string;
}

const TIME_DISPLAY_FORMATTER = new Intl.DateTimeFormat("th-TH", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const DEFAULT_LOGO = "⚽";
const DEFAULT_VENUE_NAME = "สนามแข่งขัน";

function mapTeam(team: Match["homeTeam"]): TeamSummary {
  return {
    id: team.id.toString(),
    name: team.name,
    shortName: team.shortName || team.name,
    logo: team.logo?.trim() ? team.logo : DEFAULT_LOGO,
  };
}

function mapLeague(league: Match["league"]): LeagueSummary {
  return {
    id: league.id.toString(),
    name: league.name,
    country: league.country,
    logo: league.logo?.trim() ? league.logo : DEFAULT_LOGO,
  };
}

function mapMatchStatus(status: MatchStatus): MatchStatusView {
  switch (status) {
    case MatchStatus.LIVE:
    case MatchStatus.IN_PLAY:
    case MatchStatus.PAUSED:
      return "live";
    case MatchStatus.FINISHED:
      return "finished";
    case MatchStatus.POSTPONED:
    case MatchStatus.CANCELLED:
    case MatchStatus.SUSPENDED:
      return "postponed";
    default:
      return "upcoming";
  }
}

function formatMatchTime(matchDate: string): string {
  const date = new Date(matchDate);
  const hasValidDate = !Number.isNaN(date.getTime());

  if (!hasValidDate) {
    return "";
  }

  return TIME_DISPLAY_FORMATTER.format(date);
}

function mapHeadToHeadSummary(
  data: HeadToHead | null
): HeadToHeadSummary[] | undefined {
  if (!data || !data.matches || data.matches.length === 0) {
    return undefined;
  }

  return data.matches.map((match, index) => ({
    id: `h2h-${match.id ?? index}`,
    date: match.date,
    homeTeam: match.homeTeam.name,
    awayTeam: match.awayTeam.name,
    score: {
      home: match.score.home ?? 0,
      away: match.score.away ?? 0,
    },
    competition: match.league.name,
  }));
}

function mapDomainMatchToDetail(match: Match): MatchDetail {
  return {
    id: match.id.toString(),
    homeTeam: mapTeam(match.homeTeam),
    awayTeam: mapTeam(match.awayTeam),
    score: {
      home: match.score.home ?? null,
      away: match.score.away ?? null,
      halftime: match.score.halftime
        ? {
            home: match.score.halftime.home ?? null,
            away: match.score.halftime.away ?? null,
          }
        : undefined,
    },
    status: mapMatchStatus(match.status),
    minute: match.minute ?? null,
    league: mapLeague(match.league),
    venue: {
      name: match.venue?.trim() || DEFAULT_VENUE_NAME,
      city: match.league.country,
    },
    date: match.date,
    time: formatMatchTime(match.date),
    referee: undefined,
    statistics: undefined,
    events: undefined,
    lineups: undefined,
    headToHead: undefined,
  };
}

export function buildMatchDetailViewModel(
  match: Match,
  headToHead?: HeadToHead | null
): MatchDetailViewModel {
  const detail = mapDomainMatchToDetail(match);
  const headToHeadSummary = mapHeadToHeadSummary(headToHead ?? null);
  if (headToHeadSummary) {
    detail.headToHead = headToHeadSummary;
  }

  return { match: detail };
}

/**
 * Presenter for Match Detail page
 */
export class MatchDetailPresenter {
  /**
   * Get view model for match detail page
   */
  async getViewModel(matchId: string): Promise<MatchDetailViewModel> {
    try {
      const matchIdNumber = Number.parseInt(matchId, 10);
      if (Number.isNaN(matchIdNumber)) {
        return { match: null };
      }

      const match = await getMatchById(matchIdNumber);
      const headToHeadData = await this.getHeadToHeadSafe(
        match.homeTeam.id,
        match.awayTeam.id
      );

      return buildMatchDetailViewModel(match, headToHeadData);
    } catch (error) {
      console.error("Error in MatchDetailPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for match detail page
   */
  async generateMetadata(matchId: string) {
    try {
      const matchIdNumber = Number.parseInt(matchId, 10);
      if (Number.isNaN(matchIdNumber)) {
        return {
          title: "ไม่พบข้อมูลการแข่งขัน | Soccer Tactics",
          description: "ไม่พบข้อมูลการแข่งขันที่คุณต้องการ",
        };
      }

      const match = await getMatchById(matchIdNumber);

      return {
        title: `${match.homeTeam.name} vs ${match.awayTeam.name} - ${match.league.name} | Soccer Tactics`,
        description: `ติดตามผลการแข่งขัน ${match.homeTeam.name} vs ${match.awayTeam.name} ใน ${match.league.name}`,
        keywords: `${match.homeTeam.name}, ${match.awayTeam.name}, ${match.league.name}, ผลบอล, สถิติ`,
        openGraph: {
          title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
          description: `${match.league.name} - ${match.date}`,
          type: "website",
        },
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      return {
        title: "รายละเอียดการแข่งขัน | Soccer Tactics",
        description: "ดูรายละเอียดการแข่งขัน สถิติ และไฮไลท์",
      };
    }
  }

  private async getHeadToHeadSafe(
    homeTeamId: number,
    awayTeamId: number
  ): Promise<HeadToHead | null> {
    try {
      return await getHeadToHead(homeTeamId, awayTeamId);
    } catch (error) {
      console.warn("Failed to load head-to-head data", error);
      return null;
    }
  }

}

/**
 * Factory for creating MatchDetailPresenter instances
 */
export class MatchDetailPresenterFactory {
  static createServer(): MatchDetailPresenter {
    return new MatchDetailPresenter();
  }

  static createClient(): MatchDetailPresenter {
    return new MatchDetailPresenter();
  }
}
