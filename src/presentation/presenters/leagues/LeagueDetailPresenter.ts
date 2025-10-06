/**
 * League Detail Presenter
 * Handles business logic for League Table detail page
 */

import {
  getLeagueById,
  getStandingsByLeague,
  getTopScorersByLeague,
  getFixturesByLeague,
  type MockLeague,
  type MockStanding,
  type MockTopScorer,
  type MockFixture,
} from "@/src/data/mock/leagues.mock";

// View Model interfaces
export interface LeagueDetailViewModel {
  league: MockLeague | null;
  standings: MockStanding[];
  topScorers: MockTopScorer[];
  upcomingFixtures: MockFixture[];
  filter: "overall" | "home" | "away";
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
      const league = getLeagueById(leagueId);
      const standings = getStandingsByLeague(leagueId);
      const topScorers = getTopScorersByLeague(leagueId);
      const upcomingFixtures = getFixturesByLeague(leagueId);

      // Apply filter to standings (for now, just return all)
      // In real implementation, this would filter home/away records
      const filteredStandings = standings;

      return {
        league: league || null,
        standings: filteredStandings,
        topScorers,
        upcomingFixtures,
        filter,
      };
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
      const league = getLeagueById(leagueId);

      if (!league) {
        return {
          title: "ไม่พบข้อมูลลีก | Soccer Tactics",
          description: "ไม่พบข้อมูลลีกที่คุณต้องการ",
        };
      }

      return {
        title: `ตารางคะแนน ${league.name} - ${league.season} | Soccer Tactics`,
        description: `ดูตารางคะแนน ${league.name} ฤดูกาล ${league.season} อัพเดทล่าสุด`,
        keywords: `${league.name}, ตารางคะแนน, standings, ${league.country}`,
        openGraph: {
          title: `ตารางคะแนน ${league.name}`,
          description: `${league.season} - Matchday ${league.currentMatchday}/${league.totalMatchdays}`,
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
