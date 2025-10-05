/**
 * Landing Page Presenter
 * Handles business logic for the Soccer Tactics landing page
 */

// Mock data interfaces
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

/**
 * Landing Presenter
 * Provides mock data for the landing page
 */
export class LandingPresenter {
  /**
   * Get view model with mock data
   */
  async getViewModel(): Promise<LandingViewModel> {
    // Mock live matches
    const liveMatches: LiveMatch[] = [
      {
        id: "1",
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        homeScore: 2,
        awayScore: 1,
        minute: 67,
        status: "live",
        league: "Premier League",
        homeLogo: "🔴",
        awayLogo: "🔴",
      },
      {
        id: "2",
        homeTeam: "Real Madrid",
        awayTeam: "Barcelona",
        homeScore: 1,
        awayScore: 1,
        minute: 82,
        status: "live",
        league: "La Liga",
        homeLogo: "⚪",
        awayLogo: "🔵",
      },
      {
        id: "3",
        homeTeam: "Bayern Munich",
        awayTeam: "Borussia Dortmund",
        homeScore: 3,
        awayScore: 2,
        minute: 90,
        status: "live",
        league: "Bundesliga",
        homeLogo: "🔴",
        awayLogo: "🟡",
      },
    ];

    // Mock league standings (Premier League)
    const leagueStandings: LeagueStanding[] = [
      {
        position: 1,
        team: "Manchester City",
        logo: "🔵",
        played: 28,
        won: 21,
        drawn: 4,
        lost: 3,
        goalsFor: 68,
        goalsAgainst: 25,
        goalDifference: 43,
        points: 67,
        form: ["W", "W", "D", "W", "W"],
      },
      {
        position: 2,
        team: "Arsenal",
        logo: "🔴",
        played: 28,
        won: 20,
        drawn: 5,
        lost: 3,
        goalsFor: 65,
        goalsAgainst: 28,
        goalDifference: 37,
        points: 65,
        form: ["W", "W", "W", "D", "W"],
      },
      {
        position: 3,
        team: "Liverpool",
        logo: "🔴",
        played: 28,
        won: 19,
        drawn: 6,
        lost: 3,
        goalsFor: 62,
        goalsAgainst: 30,
        goalDifference: 32,
        points: 63,
        form: ["W", "D", "W", "W", "L"],
      },
      {
        position: 4,
        team: "Aston Villa",
        logo: "🟣",
        played: 28,
        won: 17,
        drawn: 5,
        lost: 6,
        goalsFor: 55,
        goalsAgainst: 38,
        goalDifference: 17,
        points: 56,
        form: ["W", "W", "L", "W", "D"],
      },
      {
        position: 5,
        team: "Tottenham",
        logo: "⚪",
        played: 28,
        won: 16,
        drawn: 4,
        lost: 8,
        goalsFor: 58,
        goalsAgainst: 42,
        goalDifference: 16,
        points: 52,
        form: ["L", "W", "W", "D", "W"],
      },
    ];

    // Mock featured tactical posts
    const featuredPosts: TacticalPost[] = [
      {
        id: "1",
        title: "วิเคราะห์แทคติค 4-3-3 ของ Man City ที่ทำให้พวกเขาครองบอลได้มากกว่า 70%",
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
        title: "การกดตัวสูงของ Liverpool: High Press ที่มีประสิทธิภาพที่สุดในยุโรป",
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

    // Mock stats
    const stats: LandingStats = {
      totalPosts: 1247,
      totalUsers: 8934,
      totalMatches: 156,
      totalLeagues: 12,
    };

    // Mock popular leagues
    const popularLeagues = [
      "Premier League",
      "La Liga",
      "Serie A",
      "Bundesliga",
      "Ligue 1",
      "Thai Premier League",
    ];

    return {
      liveMatches,
      leagueStandings,
      featuredPosts,
      stats,
      popularLeagues,
    };
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
        description:
          "แพลตฟอร์มโซเชียลสำหรับวิเคราะห์และวิจารณ์แทคติคฟุตบอล",
        type: "website",
      },
    };
  }
}

/**
 * Factory for creating LandingPresenter instances
 */
export class LandingPresenterFactory {
  static async create(): Promise<LandingPresenter> {
    return new LandingPresenter();
  }
}
