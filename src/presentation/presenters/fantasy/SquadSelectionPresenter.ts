// Squad Selection Presenter
// Handles business logic for Squad Selection

import {
  FANTASY_PLAYERS,
  getPlayersByPosition,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";
import {
  MY_FANTASY_TEAM,
  getTotalBudget,
  type FantasyTeam,
} from "@/src/data/mock/fantasy/teams.mock";

export interface SquadSelectionViewModel {
  team: FantasyTeam;
  allPlayers: FantasyPlayer[];
  playersByPosition: {
    goalkeepers: FantasyPlayer[];
    defenders: FantasyPlayer[];
    midfielders: FantasyPlayer[];
    forwards: FantasyPlayer[];
  };
  budget: {
    total: number;
    used: number;
    remaining: number;
  };
  squadRules: {
    maxPlayersPerTeam: number;
    requiredPositions: {
      GK: number;
      DEF: number;
      MID: number;
      FWD: number;
    };
    totalPlayers: number;
  };
  formations: string[];
  currentFormation: string;
}

export class SquadSelectionPresenter {
  async getViewModel(): Promise<SquadSelectionViewModel> {
    const team = MY_FANTASY_TEAM;
    const allPlayers = FANTASY_PLAYERS;

    // Group players by position
    const playersByPosition = {
      goalkeepers: getPlayersByPosition("GK"),
      defenders: getPlayersByPosition("DEF"),
      midfielders: getPlayersByPosition("MID"),
      forwards: getPlayersByPosition("FWD"),
    };

    // Calculate budget
    const totalBudget = getTotalBudget();
    const usedBudget = team.teamValue - team.bank;
    const remainingBudget = team.bank;

    // Available formations
    const formations = [
      "3-4-3",
      "3-5-2",
      "4-3-3",
      "4-4-2",
      "4-5-1",
      "5-3-2",
      "5-4-1",
    ];

    return {
      team,
      allPlayers,
      playersByPosition,
      budget: {
        total: totalBudget,
        used: usedBudget,
        remaining: remainingBudget,
      },
      squadRules: {
        maxPlayersPerTeam: 3,
        requiredPositions: {
          GK: 2,
          DEF: 5,
          MID: 5,
          FWD: 3,
        },
        totalPlayers: 15,
      },
      formations,
      currentFormation: team.formation,
    };
  }
}

// Factory for server-side usage
export class SquadSelectionPresenterFactory {
  static create(): SquadSelectionPresenter {
    return new SquadSelectionPresenter();
  }
}
