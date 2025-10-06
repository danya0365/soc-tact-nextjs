/**
 * Match Detail Presenter
 * Handles business logic for the Match Detail page
 */

import {
  getMatchDetailById,
  type MockMatchDetail,
} from "@/src/data/mock/matches.mock";

// View Model interfaces
export interface MatchDetailViewModel {
  match: MockMatchDetail | null;
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
      const match = getMatchDetailById(matchId);

      return {
        match: match || null,
      };
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
      const match = getMatchDetailById(matchId);

      if (!match) {
        return {
          title: "ไม่พบข้อมูลการแข่งขัน | Soccer Tactics",
          description: "ไม่พบข้อมูลการแข่งขันที่คุณต้องการ",
        };
      }

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
