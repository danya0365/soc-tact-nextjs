/**
 * Matches Presenter
 * Handles business logic for the Matches page
 * Uses mock data for UI development
 */

import {
  mockMatches,
  getMatchesByStatus,
  getMatchesByLeague,
  getMatchesByDate,
  type MockMatch,
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
  stats: MatchStats;
  filters: MatchFilters;
  totalCount: number;
  page: number;
  perPage: number;
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
    perPage: number = 10
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
        matches: paginatedMatches,
        stats,
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
      const leagues = mockMatches.reduce(
        (acc, match) => {
          if (!acc.find((l) => l.id === match.league.id)) {
            acc.push({
              id: match.league.id,
              name: match.league.name,
              logo: match.league.logo,
            });
          }
          return acc;
        },
        [] as Array<{ id: string; name: string; logo: string }>
      );
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
