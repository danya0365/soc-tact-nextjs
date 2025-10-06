/**
 * Create Tactic Presenter
 * Handles business logic for creating tactical posts
 */

import { mockLeagues } from "@/src/data/mock/leagues.mock";
import { mockTeams } from "@/src/data/mock/teams.mock";

// Form data interface
export interface CreateTacticFormData {
  title: string;
  content: string;
  formation: string;
  league: string;
  team?: string;
  tags: string[];
  relatedMatchId?: string;
}

// View Model interfaces
export interface CreateTacticViewModel {
  availableFormations: string[];
  availableLeagues: Array<{ id: string; name: string }>;
  availableTeams: Array<{ id: string; name: string }>;
}

/**
 * Presenter for Create Tactic page
 */
export class CreateTacticPresenter {
  /**
   * Get view model for create tactic page
   */
  async getViewModel(): Promise<CreateTacticViewModel> {
    try {
      const availableFormations = [
        "4-3-3",
        "4-4-2",
        "4-2-3-1",
        "3-5-2",
        "3-4-3",
        "4-1-4-1",
        "5-3-2",
        "4-3-2-1",
        "3-2-5",
        "4-4-1-1",
      ];

      const availableLeagues = mockLeagues.map((league) => ({
        id: league.id,
        name: league.name,
      }));

      const availableTeams = Object.values(mockTeams).map((team) => ({
        id: team.id,
        name: team.name,
      }));

      return {
        availableFormations,
        availableLeagues,
        availableTeams,
      };
    } catch (error) {
      console.error("Error in CreateTacticPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for create tactic page
   */
  async generateMetadata() {
    return {
      title: "สร้างบทวิเคราะห์แทคติค | Soccer Tactics",
      description: "เขียนบทวิเคราะห์แทคติคฟุตบอลของคุณและแชร์กับชุมชน",
      keywords: "สร้างบทความ, วิเคราะห์แทคติค, เขียนบทความ, tactical analysis",
    };
  }

  /**
   * Create a new tactical post
   */
  async createPost(data: CreateTacticFormData): Promise<{ id: string }> {
    try {
      // In real implementation, this would call an API
      console.log("Creating tactical post:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return mock post ID
      const newPostId = `post-${Date.now()}`;
      return { id: newPostId };
    } catch (error) {
      console.error("Error creating tactical post:", error);
      throw error;
    }
  }

  /**
   * Save draft
   */
  async saveDraft(data: CreateTacticFormData): Promise<{ id: string }> {
    try {
      // In real implementation, this would save to local storage or API
      console.log("Saving draft:", data);

      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 500));

      const draftId = `draft-${Date.now()}`;
      return { id: draftId };
    } catch (error) {
      console.error("Error saving draft:", error);
      throw error;
    }
  }
}

/**
 * Factory for creating CreateTacticPresenter instances
 */
export class CreateTacticPresenterFactory {
  static createServer(): CreateTacticPresenter {
    return new CreateTacticPresenter();
  }

  static createClient(): CreateTacticPresenter {
    return new CreateTacticPresenter();
  }
}
