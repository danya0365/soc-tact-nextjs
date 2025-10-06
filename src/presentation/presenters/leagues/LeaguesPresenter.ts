/**
 * Leagues Presenter
 * Handles business logic for the Leagues list page
 */

import { mockLeagues, type MockLeague } from "@/src/data/mock/leagues.mock";

// View Model interfaces
export interface League {
  id: string;
  name: string;
  logo: string;
  country: string;
  season: string;
  totalTeams: number;
  currentMatchday: number;
  totalMatchdays: number;
}

export interface LeaguesViewModel {
  leagues: League[];
  totalCount: number;
}

/**
 * Presenter for Leagues list page
 */
export class LeaguesPresenter {
  /**
   * Get view model for leagues page
   */
  async getViewModel(): Promise<LeaguesViewModel> {
    try {
      return {
        leagues: mockLeagues,
        totalCount: mockLeagues.length,
      };
    } catch (error) {
      console.error("Error in LeaguesPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for leagues page
   */
  async generateMetadata() {
    return {
      title: "ตารางคะแนนลีก - League Tables | Soccer Tactics",
      description:
        "ดูตารางคะแนนจากลีกชั้นนำทั่วโลก Premier League, La Liga, Serie A, Bundesliga และอื่นๆ",
      keywords:
        "ตารางคะแนน, league table, Premier League, La Liga, Serie A, Bundesliga, standings",
      openGraph: {
        title: "ตารางคะแนนลีก | Soccer Tactics",
        description: "ดูตารางคะแนนจากลีกชั้นนำทั่วโลก",
        type: "website",
      },
    };
  }

  /**
   * Get league by ID
   */
  async getLeagueById(id: string): Promise<League | null> {
    try {
      const league = mockLeagues.find((l) => l.id === id);
      return league || null;
    } catch (error) {
      console.error("Error in LeaguesPresenter.getLeagueById:", error);
      throw error;
    }
  }
}

/**
 * Factory for creating LeaguesPresenter instances
 */
export class LeaguesPresenterFactory {
  static createServer(): LeaguesPresenter {
    return new LeaguesPresenter();
  }

  static createClient(): LeaguesPresenter {
    return new LeaguesPresenter();
  }
}
