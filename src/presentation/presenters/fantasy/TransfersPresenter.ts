// Transfers Presenter
// Handles business logic for Transfers

import {
  getCurrentGameweek,
  type Gameweek,
} from "@/src/data/mock/fantasy/gameweeks.mock";
import {
  FANTASY_PLAYERS,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";
import {
  MY_FANTASY_TEAM,
  getStartingXI,
  getBench,
  type FantasyTeam,
} from "@/src/data/mock/fantasy/teams.mock";

export interface TransferPlan {
  playerOut: FantasyPlayer | null;
  playerIn: FantasyPlayer | null;
  cost: number;
}

export interface TransfersViewModel {
  team: FantasyTeam;
  currentGameweek: Gameweek | undefined;
  allPlayers: FantasyPlayer[];
  currentSquad: {
    starting: FantasyPlayer[];
    bench: FantasyPlayer[];
  };
  transferInfo: {
    freeTransfers: number;
    transferCost: number; // points per extra transfer
    deadline: string;
    hoursRemaining: number;
  };
  chips: {
    wildcard: { available: boolean; used: boolean };
    freeHit: { available: boolean; used: boolean };
  };
  suggestedTransfers: {
    playersToSell: FantasyPlayer[];
    playersToBuy: FantasyPlayer[];
  };
}

export class TransfersPresenter {
  async getViewModel(): Promise<TransfersViewModel> {
    const team = MY_FANTASY_TEAM;
    const currentGameweek = getCurrentGameweek();
    const allPlayers = FANTASY_PLAYERS;

    // Get current squad
    const startingXIData = getStartingXI(team);
    const benchData = getBench(team);

    const starting = startingXIData
      .map((sp) => FANTASY_PLAYERS.find((p) => p.id === sp.playerId))
      .filter((p): p is FantasyPlayer => p !== undefined);

    const bench = benchData
      .map((sp) => FANTASY_PLAYERS.find((p) => p.id === sp.playerId))
      .filter((p): p is FantasyPlayer => p !== undefined);

    // Calculate deadline
    let hoursRemaining = 0;
    if (currentGameweek && !currentGameweek.isFinished) {
      const deadline = new Date(currentGameweek.deadline);
      const now = new Date();
      hoursRemaining = Math.max(
        0,
        Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60))
      );
    }

    // Suggested transfers (based on form and fixtures)
    const playersToSell = starting
      .filter((p) => {
        // Consider selling if: poor form OR difficult fixtures
        const avgFixtureDiff = p.nextFixtures.slice(0, 3).reduce((sum, f) => sum + f.difficulty, 0) / 3;
        return p.form < 6.5 || avgFixtureDiff >= 4;
      })
      .sort((a, b) => a.form - b.form)
      .slice(0, 3);

    const playersToBuy = allPlayers
      .filter((p) => {
        // Consider buying if: good form AND not in squad AND easy fixtures
        const avgFixtureDiff = p.nextFixtures.slice(0, 3).reduce((sum, f) => sum + f.difficulty, 0) / 3;
        const notInSquad = !starting.find((sp) => sp.id === p.id) && !bench.find((bp) => bp.id === p.id);
        return p.form > 7 && notInSquad && avgFixtureDiff <= 3;
      })
      .sort((a, b) => b.form - a.form)
      .slice(0, 5);

    return {
      team,
      currentGameweek,
      allPlayers,
      currentSquad: {
        starting,
        bench,
      },
      transferInfo: {
        freeTransfers: team.freeTransfers,
        transferCost: 4,
        deadline: currentGameweek?.deadline || "",
        hoursRemaining,
      },
      chips: {
        wildcard: {
          available: !team.chips.wildcard.used,
          used: team.chips.wildcard.used,
        },
        freeHit: {
          available: !team.chips.freeHit.used,
          used: team.chips.freeHit.used,
        },
      },
      suggestedTransfers: {
        playersToSell,
        playersToBuy,
      },
    };
  }
}

// Factory for server-side usage
export class TransfersPresenterFactory {
  static create(): TransfersPresenter {
    return new TransfersPresenter();
  }
}
