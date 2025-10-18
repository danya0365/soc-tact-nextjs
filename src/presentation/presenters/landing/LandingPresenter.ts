/**
 * Landing Page Presenter
 * Handles business logic for the Soccer Tactics landing page
 * Integrates with Football API for real data
 */

import { mockMatches } from "@/src/data/mock/matches.mock";
import { mockTacticalPosts } from "@/src/data/mock/tactics.mock";
import {
  LEAGUE_IDS,
  type Match,
  type Standing,
} from "@/src/infrastructure/api";

// View Model interfaces for Landing Page
export interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: "live" | "finished" | "upcoming";
  league: string;
  homeLogo: string;
  awayLogo: string;
}

export interface LeagueStanding {
  position: number;
  team: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
}

export interface TacticalPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  excerpt: string;
  thumbnail: string;
  formation: string;
  league: string;
  upvotes: number;
  comments: number;
  createdAt: string;
}

export interface LandingStats {
  totalPosts: number;
  totalUsers: number;
  totalMatches: number;
  totalLeagues: number;
}

export interface LeagueMatches {
  league: string;
  matches: LiveMatch[];
}

export interface PopularLeague {
  id: number;
  name: string;
}

export interface LandingViewModel {
  liveMatches: LiveMatch[];
  liveMatchesByLeague: LeagueMatches[];
  leagueStandings: LeagueStanding[];
  featuredPosts: TacticalPost[];
  stats: LandingStats;
  popularLeagues: PopularLeague[];
}

export class LandingPresenterMapper {
  /**
   * Map API Match to LiveMatch view model
   */
  static mapToLiveMatch(match: Match): LiveMatch {
    return {
      id: match.id.toString(),
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeScore: match.score.home ?? 0,
      awayScore: match.score.away ?? 0,
      minute: match.minute ?? 0,
      status:
        match.status === "live" || match.status === "in_play"
          ? "live"
          : "upcoming",
      league: match.league.name,
      homeLogo: match.homeTeam.logo || "⚽",
      awayLogo: match.awayTeam.logo || "⚽",
    };
  }

  /**
   * Map API Standing to LeagueStanding view model
   */
  static mapToLeagueStanding(standing: Standing): LeagueStanding {
    return {
      position: standing.position,
      team: standing.team.name,
      logo: standing.team.logo || "⚽",
      played: standing.played,
      won: standing.won,
      drawn: standing.drawn,
      lost: standing.lost,
      goalsFor: standing.goalsFor,
      goalsAgainst: standing.goalsAgainst,
      goalDifference: standing.goalDifference,
      points: standing.points,
      form: standing.form || [],
    };
  }

  // Group matches by league
  static groupMatchesByLeague(matches: LiveMatch[]): LeagueMatches[] {
    const leagueMap = new Map<string, LiveMatch[]>();

    // Group matches by league
    matches.forEach((match) => {
      if (!leagueMap.has(match.league)) {
        leagueMap.set(match.league, []);
      }
      leagueMap.get(match.league)?.push(match);
    });

    // Convert map to array of LeagueMatches
    return Array.from(leagueMap.entries()).map(([league, matches]) => ({
      league,
      matches,
    }));
  }
}

/**
 * Landing Presenter
 * Integrates with Football API for real data
 */
export class LandingPresenter {
  private async getPopularLeagues(): Promise<PopularLeague[]> {
    return [
      { id: LEAGUE_IDS.PREMIER_LEAGUE, name: "Premier League" },
      { id: LEAGUE_IDS.LA_LIGA, name: "La Liga" },
      { id: LEAGUE_IDS.SERIE_A, name: "Serie A" },
      { id: LEAGUE_IDS.BUNDESLIGA, name: "Bundesliga" },
      { id: LEAGUE_IDS.LIGUE_1, name: "Ligue 1" },
    ];
  }

  /**
   * Get fallback data when API fails
   */
  private getFallbackData(): LandingViewModel {
    return {
      liveMatches: [],
      liveMatchesByLeague: [],
      leagueStandings: [],
      featuredPosts: [
        {
          id: "1",
          title: "วิเคราะห์แทคติค 4-3-3 ของ Man City",
          author: "Tactical Genius",
          authorAvatar: "👨‍💼",
          excerpt: "การใช้ False 9 และ Inverted Wingers...",
          thumbnail: "⚽",
          formation: "4-3-3",
          league: "Premier League",
          upvotes: 245,
          comments: 38,
          createdAt: new Date().toISOString(),
        },
      ],
      stats: {
        totalPosts: 1247,
        totalUsers: 8934,
        totalMatches: 0,
        totalLeagues: 12,
      },
      popularLeagues: [],
    };
  }

  /**
   * Get view model with real API data
   */
  async getViewModel(): Promise<LandingViewModel> {
    try {
      // Mock featured tactical posts (will be replaced with real data later)
      const featuredPosts: TacticalPost[] = mockTacticalPosts
        .slice(0, 3)
        .map((post) => ({
          id: post.id,
          title: post.title,
          author: post.author.name,
          authorAvatar: post.author.avatar,
          excerpt: post.excerpt,
          thumbnail: post.thumbnail,
          formation: post.formation,
          league: post.league,
          upvotes: post.upvotes,
          comments: post.comments,
          createdAt: post.createdAt,
        }));

      // Stats (using real data where available)
      const stats: LandingStats = {
        totalPosts: 1247,
        totalUsers: 8934,
        totalMatches: 156,
        totalLeagues: 12,
      };

      // Use mock data for landing page
      const liveMatches = mockMatches
        .filter((m) => m.status === "live" || m.status === "upcoming")
        .map((match) => ({
          id: match.id,
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          homeScore: match.score.home ?? 0,
          awayScore: match.score.away ?? 0,
          minute: match.minute ?? 0,
          status: match.status as "live" | "finished" | "upcoming",
          league: match.league.name,
          homeLogo: "⚽",
          awayLogo: "⚽",
        }));

      const popularLeagues = await this.getPopularLeagues();

      return {
        liveMatches,
        liveMatchesByLeague:
          LandingPresenterMapper.groupMatchesByLeague(liveMatches),
        leagueStandings: [],
        featuredPosts,
        stats,
        popularLeagues,
      };
    } catch (error) {
      console.error("Error fetching landing data:", error);

      // Return fallback data if API fails
      return this.getFallbackData();
    }
  }

  /**
   * Generate metadata for the landing page
   */
  async generateMetadata() {
    return {
      title: "Soccer Tactics - แพลตฟอร์มวิเคราะห์แทคติคฟุตบอล",
      description:
        "แพลตฟอร์มโซเชียลสำหรับวิเคราะห์และวิจารณ์แทคติคฟุตบอล พร้อมระบบตารางคะแนนลีกและ Live Score แบบเรียลไทม์",
      keywords:
        "ฟุตบอล, แทคติค, วิเคราะห์, Premier League, La Liga, ตารางคะแนน, ผลบอลสด",
      openGraph: {
        title: "Soccer Tactics - แพลตฟอร์มวิเคราะห์แทคติคฟุตบอล",
        description: "แพลตฟอร์มโซเชียลสำหรับวิเคราะห์และวิจารณ์แทคติคฟุตบอล",
        type: "website",
      },
    };
  }
}

/**
 * Factory for creating LandingPresenter instances
 */
export class LandingPresenterFactory {
  static createClient(): LandingPresenter {
    return new LandingPresenter();
  }
  static async createServer(): Promise<LandingPresenter> {
    return new LandingPresenter();
  }
}
