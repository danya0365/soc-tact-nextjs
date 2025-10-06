/**
 * Landing Page Presenter
 * Handles business logic for the Soccer Tactics landing page
 * Integrates with Football API for real data
 */

import {
  getLiveMatches,
  getStandingsByLeague,
  LEAGUE_IDS,
  type Match,
  type Standing,
} from "@/src/infrastructure/api";
import { mockMatches } from "@/src/data/mock/matches.mock";
import { mockPremierLeagueStandings } from "@/src/data/mock/leagues.mock";

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

export interface LandingViewModel {
  liveMatches: LiveMatch[];
  leagueStandings: LeagueStanding[];
  featuredPosts: TacticalPost[];
  stats: LandingStats;
  popularLeagues: string[];
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
}

/**
 * Landing Presenter
 * Integrates with Football API for real data
 */
export class LandingPresenter {
  /**
   * Get fallback data when API fails
   */
  private getFallbackData(): LandingViewModel {
    return {
      liveMatches: [],
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
      popularLeagues: [
        "Premier League",
        "La Liga",
        "Serie A",
        "Bundesliga",
        "Ligue 1",
      ],
    };
  }

  private async getApiData() {
    // Fetch real data from Football API
    const [liveMatchesData, standingsData] = await Promise.all([
      getLiveMatches().catch(() => [] as Match[]),
      getStandingsByLeague(LEAGUE_IDS.PREMIER_LEAGUE).catch(
        () => [] as Standing[]
      ),
    ]);

    // Map to view models
    const liveMatches = liveMatchesData
      .slice(0, 3)
      .map((match) => LandingPresenterMapper.mapToLiveMatch(match));

    const leagueStandings = standingsData
      .slice(0, 5)
      .map((standing) => LandingPresenterMapper.mapToLeagueStanding(standing));

    return {
      liveMatches,
      leagueStandings,
    };
  }

  private async getPopularLeagues() {
    return [
      "Premier League",
      "La Liga",
      "Serie A",
      "Bundesliga",
      "Ligue 1",
      "Thai Premier League",
    ];
  }

  /**
   * Get view model with real API data
   */
  async getViewModel(): Promise<LandingViewModel> {
    try {
      // Mock featured tactical posts (will be replaced with real data later)
      const featuredPosts: TacticalPost[] = [
        {
          id: "1",
          title:
            "วิเคราะห์แทคติค 4-3-3 ของ Man City ที่ทำให้พวกเขาครองบอลได้มากกว่า 70%",
          author: "Tactical Genius",
          authorAvatar: "👨‍💼",
          excerpt:
            "การใช้ False 9 และ Inverted Wingers ทำให้ Man City สามารถสร้างพื้นที่ในกลางสนามได้อย่างมีประสิทธิภาพ...",
          thumbnail: "⚽",
          formation: "4-3-3",
          league: "Premier League",
          upvotes: 245,
          comments: 38,
          createdAt: "2024-03-15T10:30:00Z",
        },
        {
          id: "2",
          title: "ทำไม Arsenal ถึงใช้ Build-up แบบ 3-2-5 และมันได้ผลยังไง?",
          author: "Football Analyst",
          authorAvatar: "🎯",
          excerpt:
            "Arteta ปรับเปลี่ยนวิธีการเล่นจากหลังด้วยการให้ Fullback เข้ามาเป็น Inverted ทำให้มีตัวเลือกในการส่งบอลมากขึ้น...",
          thumbnail: "🎨",
          formation: "4-3-3 → 3-2-5",
          league: "Premier League",
          upvotes: 189,
          comments: 27,
          createdAt: "2024-03-14T15:20:00Z",
        },
        {
          id: "3",
          title:
            "การกดตัวสูงของ Liverpool: High Press ที่มีประสิทธิภาพที่สุดในยุโรป",
          author: "Press Master",
          authorAvatar: "⚡",
          excerpt:
            "Klopp ใช้ระบบ Gegenpressing ที่ทำให้ Liverpool สามารถกดเอาบอลคืนภายใน 5 วินาทีหลังเสียบอล...",
          thumbnail: "🔥",
          formation: "4-3-3",
          league: "Premier League",
          upvotes: 312,
          comments: 45,
          createdAt: "2024-03-13T09:15:00Z",
        },
      ];

      // Stats (using real data where available)
      const stats: LandingStats = {
        totalPosts: 1247,
        totalUsers: 8934,
        totalMatches: 156,
        totalLeagues: 12,
      };

      // Popular leagues
      const popularLeagues = await this.getPopularLeagues();

      // Use mock data for landing page
      const liveMatches = mockMatches
        .filter((m) => m.status === "live" || m.status === "upcoming")
        .slice(0, 4)
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

      const leagueStandings = mockPremierLeagueStandings.slice(0, 5).map((s) => ({
        position: s.position,
        team: s.team.name,
        logo: s.team.logo,
        played: s.played,
        won: s.won,
        drawn: s.drawn,
        lost: s.lost,
        goalsFor: s.goalsFor,
        goalsAgainst: s.goalsAgainst,
        goalDifference: s.goalDifference,
        points: s.points,
        form: s.form,
      }));

      return {
        liveMatches,
        leagueStandings,
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
  static createServer(): LandingPresenter {
    return new LandingPresenter();
  }
}
