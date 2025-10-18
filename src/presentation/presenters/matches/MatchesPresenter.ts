/**
 * Matches Presenter
 * Handles business logic for the Matches page
 */

import {
  getMatchesByStatus,
  MockMatch,
  mockMatches,
} from "@/src/data/mock/matches.mock";

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

export class MatchPresenterMapper {
  /**
   * Map API Match to LiveMatch view model
   */
  static mapToMatch(match: MockMatch): Match {
    return {
      id: match.id.toString(),
      homeTeam: {
        id: match.homeTeam.id,
        name: match.homeTeam.name,
        logo: match.homeTeam.logo,
        shortName: match.homeTeam.shortName,
      },
      awayTeam: {
        id: match.awayTeam.id,
        name: match.awayTeam.name,
        logo: match.awayTeam.logo,
        shortName: match.awayTeam.shortName,
      },
      score: {
        home: match.score.home ?? 0,
        away: match.score.away ?? 0,
      },
      minute: match.minute ?? 0,
      status: match.status,
      league: {
        id: match.league.id,
        name: match.league.name,
        logo: match.league.logo,
        country: match.league.country,
      },
      venue: {
        name: match.venue.name,
        city: match.venue.city,
      },
      date: match.date,
      time: match.time,
      referee: match.referee,
    };
  }

  // Group matches by league
  static groupMatchesByLeague(matches: Match[]): LeagueMatches[] {
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
    return Array.from(leagueMap.entries()).map(([league, leagueMatches]) => ({
      league,
      matches: [...leagueMatches].sort(compareMatches),
    }));
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
      // Get filtered matches
      let filteredMatches = [...mockMatches];

      // Apply status filter
      if (filters.status && filters.status !== "all") {
        filteredMatches = getMatchesByStatus(filters.status);
      }

      // Apply league filter
      if (filters.league) {
        filteredMatches = filteredMatches.filter(
          (match) => match.league.id === filters.league
        );
      }

      // Apply date filter
      if (filters.date) {
        filteredMatches = filteredMatches.filter(
          (match) => match.date === filters.date
        );
      }

      // Apply search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredMatches = filteredMatches.filter(
          (match) =>
            match.homeTeam.name.toLowerCase().includes(query) ||
            match.awayTeam.name.toLowerCase().includes(query) ||
            match.league.name.toLowerCase().includes(query)
        );
      }

      // Calculate stats
      const stats: MatchStats = {
        totalMatches: mockMatches.length,
        liveMatches: getMatchesByStatus("live").length,
        finishedMatches: getMatchesByStatus("finished").length,
        upcomingMatches: getMatchesByStatus("upcoming").length,
      };

      // Pagination
      const totalCount = filteredMatches.length;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedMatches = filteredMatches.slice(startIndex, endIndex);

      return {
        matches: [],
        matchesByLeague: MatchPresenterMapper.groupMatchesByLeague([]),
        stats: {
          totalMatches: 0,
          liveMatches: 0,
          finishedMatches: 0,
          upcomingMatches: 0,
        },
        filters,
        totalCount,
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
      const match = mockMatches.find((m) => m.id === id);
      return match || null;
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
      const leagues = mockMatches.reduce((acc, match) => {
        if (!acc.find((l) => l.id === match.league.id)) {
          acc.push({
            id: match.league.id,
            name: match.league.name,
            logo: match.league.logo,
          });
        }
        return acc;
      }, [] as Array<{ id: string; name: string; logo: string }>);
      return leagues;
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
      const dates = [...new Set(mockMatches.map((match) => match.date))];
      return dates.sort();
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
