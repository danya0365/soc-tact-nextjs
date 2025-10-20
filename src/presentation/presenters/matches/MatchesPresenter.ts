/**
 * Matches Presenter
 * Handles business logic for the Matches page
 */

// View Model interfaces
export interface Match {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
    shortName: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
    shortName: string;
  };
  score: {
    home: number | null;
    away: number | null;
    halftime?: {
      home: number;
      away: number;
    };
  };
  status: "live" | "finished" | "upcoming" | "postponed";
  minute: number | null;
  league: {
    id: string;
    name: string;
    logo: string;
    country: string;
  };
  venue: {
    name: string;
    city: string;
  };
  date: string;
  time: string;
  referee?: string;
}

export interface MatchStats {
  totalMatches: number;
  liveMatches: number;
  finishedMatches: number;
  upcomingMatches: number;
}

export interface MatchFilters {
  status?: "all" | "live" | "finished" | "upcoming";
  league?: string;
  date?: string;
  searchQuery?: string;
}

export interface MatchesViewModel {
  matches: Match[];
  matchesByLeague: LeagueMatches[];
  groupedMatches: StatusGroupedMatches[];
  favouriteLeagueIds: string[];
  stats: MatchStats;
  filters: MatchFilters;
  totalCount: number;
  page: number;
  perPage: number;
}

export interface LeagueMatches {
  league: string;
  matches: Match[];
}

export interface StatusGroupedMatches {
  status: "live" | "upcoming" | "finished";
  leagues: LeagueMatches[];
}

export class MatchPresenterMapper {
  // Group matches by league
  static groupMatchesByLeague(
    matches: Match[],
    favouriteLeagueIds: string[] = []
  ): LeagueMatches[] {
    const leagueMap = new Map<string, Match[]>();

    const parseDate = (dateStr: string) => {
      const parsed = new Date(dateStr);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const normalizeTime = (time: string | undefined) => time?.trim() ?? "";

    const compareMatches = (a: Match, b: Match) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      if (dateA && dateB && dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      if (!dateA && dateB) return 1;
      if (dateA && !dateB) return -1;

      const timeA = normalizeTime(a.time);
      const timeB = normalizeTime(b.time);

      if (timeA && timeB && timeA !== timeB) {
        return timeA.localeCompare(timeB, "th-TH", { numeric: true });
      }

      if (!timeA && timeB) return 1;
      if (timeA && !timeB) return -1;

      const homeCompare = a.homeTeam.name.localeCompare(
        b.homeTeam.name,
        "th-TH",
        {
          sensitivity: "base",
        }
      );
      if (homeCompare !== 0) {
        return homeCompare;
      }

      return a.awayTeam.name.localeCompare(b.awayTeam.name, "th-TH", {
        sensitivity: "base",
      });
    };

    // Group matches by league
    matches.forEach((match) => {
      if (!leagueMap.has(match.league.name)) {
        leagueMap.set(match.league.name, []);
      }
      leagueMap.get(match.league.name)?.push(match);
    });

    // Convert map to array of LeagueMatches
    const favouriteIndex = new Map<string, number>();
    favouriteLeagueIds.forEach((id, index) => {
      favouriteIndex.set(id, index);
    });

    return Array.from(leagueMap.entries())
      .map(([league, leagueMatches]) => ({
        league,
        matches: [...leagueMatches].sort(compareMatches),
      }))
      .sort((a, b) => {
        const aId = String(a.matches[0]?.league.id ?? "");
        const bId = String(b.matches[0]?.league.id ?? "");
        const aFav = favouriteIndex.has(aId)
          ? favouriteIndex.get(aId) ?? Number.MAX_SAFE_INTEGER
          : Number.MAX_SAFE_INTEGER;
        const bFav = favouriteIndex.has(bId)
          ? favouriteIndex.get(bId) ?? Number.MAX_SAFE_INTEGER
          : Number.MAX_SAFE_INTEGER;
        if (aFav === bFav) {
          return a.league.localeCompare(b.league, "th");
        }
        return aFav - bFav;
      });
  }

  static groupMatchesByStatusAndLeague(
    matches: Match[],
    favouriteLeagueIds: string[] = []
  ): StatusGroupedMatches[] {
    const statusOrder: Array<StatusGroupedMatches["status"]> = [
      "live",
      "upcoming",
      "finished",
    ];

    const statusBuckets = new Map<StatusGroupedMatches["status"], Match[]>();

    const normalizeStatus = (
      status: Match["status"]
    ): StatusGroupedMatches["status"] => {
      switch (status) {
        case "live":
          return "live";
        case "finished":
          return "finished";
        default:
          return "upcoming";
      }
    };

    matches.forEach((match) => {
      const statusKey = normalizeStatus(match.status);
      if (!statusBuckets.has(statusKey)) {
        statusBuckets.set(statusKey, []);
      }
      statusBuckets.get(statusKey)?.push(match);
    });

    return statusOrder
      .map((status) => {
        const statusMatches = statusBuckets.get(status) ?? [];
        if (statusMatches.length === 0) {
          return null;
        }
        return {
          status,
          leagues: MatchPresenterMapper.groupMatchesByLeague(
            statusMatches,
            favouriteLeagueIds
          ),
        };
      })
      .filter((group): group is StatusGroupedMatches => Boolean(group));
  }
}

/**
 * Presenter for Matches management
 * Follows Clean Architecture with proper separation of concerns
 */
export class MatchesPresenter {
  /**
   * Get view model for the matches page
   */
  async getViewModel(
    filters: MatchFilters = {},
    page: number = 1,
    perPage: number = 100
  ): Promise<MatchesViewModel> {
    try {
      const stats: MatchStats = {
        totalMatches: 0,
        liveMatches: 0,
        finishedMatches: 0,
        upcomingMatches: 0,
      };

      return {
        matches: [],
        matchesByLeague: MatchPresenterMapper.groupMatchesByLeague([]),
        groupedMatches: MatchPresenterMapper.groupMatchesByStatusAndLeague([]),
        favouriteLeagueIds: [],
        stats,
        filters,
        totalCount: 0,
        page,
        perPage,
      };
    } catch (error) {
      console.error("Error in MatchesPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for the matches page
   */
  async generateMetadata() {
    return {
      title: "ผลบอลสด - Match Center | Soccer Tactics",
      description:
        "ติดตามผลบอลสด ตารางแข่งขัน และสถิติการแข่งขันจากลีกชั้นนำทั่วโลก",
      keywords:
        "ผลบอลสด, live score, ตารางแข่ง, Premier League, La Liga, ฟุตบอล",
      openGraph: {
        title: "ผลบอลสด - Match Center | Soccer Tactics",
        description: "ติดตามผลบอลสดและตารางแข่งขันจากลีกชั้นนำทั่วโลก",
        type: "website",
      },
    };
  }

  /**
   * Get match by ID
   */
  async getMatchById(id: string): Promise<Match | null> {
    try {
      return null;
    } catch (error) {
      console.error("Error in MatchesPresenter.getMatchById:", error);
      throw error;
    }
  }

  /**
   * Get available leagues for filtering
   */
  async getAvailableLeagues(): Promise<
    Array<{ id: string; name: string; logo: string }>
  > {
    try {
      return [];
    } catch (error) {
      console.error("Error in MatchesPresenter.getAvailableLeagues:", error);
      throw error;
    }
  }

  /**
   * Get available dates for filtering
   */
  async getAvailableDates(): Promise<string[]> {
    try {
      return [];
    } catch (error) {
      console.error("Error in MatchesPresenter.getAvailableDates:", error);
      throw error;
    }
  }
}

/**
 * Factory for creating MatchesPresenter instances
 */
export class MatchesPresenterFactory {
  static createServer(): MatchesPresenter {
    return new MatchesPresenter();
  }

  static createClient(): MatchesPresenter {
    return new MatchesPresenter();
  }
}
