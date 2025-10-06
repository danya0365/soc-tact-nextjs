/**
 * Team Detail Presenter
 * Handles business logic for Team detail page
 */

import {
  getTeamById,
  getSquadByTeamId,
  getRecentMatches,
  getUpcomingMatches,
  mockTeamTacticalPosts,
  type MockTeam,
  type MockPlayer,
  type MockTeamMatch,
} from "@/src/data/mock/teams.mock";

// View Model interfaces
export interface TeamDetailViewModel {
  team: MockTeam | null;
  squad: MockPlayer[];
  recentMatches: MockTeamMatch[];
  upcomingMatches: MockTeamMatch[];
  tacticalPosts: typeof mockTeamTacticalPosts;
}

/**
 * Presenter for Team Detail page
 */
export class TeamDetailPresenter {
  /**
   * Get view model for team detail page
   */
  async getViewModel(teamId: string): Promise<TeamDetailViewModel> {
    try {
      const team = getTeamById(teamId);
      const squad = team ? getSquadByTeamId(teamId) : [];
      const recentMatches = team ? getRecentMatches(teamId) : [];
      const upcomingMatches = team ? getUpcomingMatches(teamId) : [];
      const tacticalPosts = team ? mockTeamTacticalPosts : [];

      return {
        team: team || null,
        squad,
        recentMatches,
        upcomingMatches,
        tacticalPosts,
      };
    } catch (error) {
      console.error("Error in TeamDetailPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for team detail page
   */
  async generateMetadata(teamId: string) {
    try {
      const team = getTeamById(teamId);

      if (!team) {
        return {
          title: "ไม่พบข้อมูลทีม | Soccer Tactics",
          description: "ไม่พบข้อมูลทีมที่คุณต้องการ",
        };
      }

      return {
        title: `${team.name} - ข้อมูลทีม สถิติ และผลการแข่งขัน | Soccer Tactics`,
        description: `ดูข้อมูลทีม ${team.name} สถิติการแข่งขัน ผู้เล่น และบทวิเคราะห์แทคติค`,
        keywords: `${team.name}, ${team.league.name}, สถิติทีม, ผู้เล่น, ผลการแข่งขัน`,
        openGraph: {
          title: `${team.name} - ${team.league.name}`,
          description: `${team.stadium.name} • ${team.manager.name}`,
          type: "website",
        },
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      return {
        title: "ข้อมูลทีม | Soccer Tactics",
        description: "ดูข้อมูลทีม สถิติ และผลการแข่งขัน",
      };
    }
  }
}

/**
 * Factory for creating TeamDetailPresenter instances
 */
export class TeamDetailPresenterFactory {
  static createServer(): TeamDetailPresenter {
    return new TeamDetailPresenter();
  }

  static createClient(): TeamDetailPresenter {
    return new TeamDetailPresenter();
  }
}
