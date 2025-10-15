// Fantasy Dashboard Presenter
// Handles business logic for Fantasy Dashboard

import {
  getCurrentGameweek,
  getNextGameweek,
  type Gameweek,
} from "@/src/data/mock/fantasy/gameweeks.mock";
import {
  getMyLeagues,
  getMyRankInLeague,
  type FantasyLeague,
  type LeagueStanding,
} from "@/src/data/mock/fantasy/leagues.mock";
import {
  getPlayerById,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";
import {
  MY_FANTASY_TEAM,
  getBench,
  getStartingXI,
  type FantasyTeam,
} from "@/src/data/mock/fantasy/teams.mock";

export interface FantasyDashboardViewModel {
  team: FantasyTeam;
  currentGameweek: Gameweek | undefined;
  nextGameweek: Gameweek | undefined;
  startingXI: {
    player: FantasyPlayer;
    isCaptain: boolean;
    isViceCaptain: boolean;
  }[];
  bench: {
    player: FantasyPlayer;
    benchOrder: number;
  }[];
  myLeagues: {
    league: FantasyLeague;
    myRank: LeagueStanding | undefined;
  }[];
  stats: {
    totalPoints: number;
    gameweekPoints: number;
    overallRank: number;
    teamValue: number;
    bank: number;
    freeTransfers: number;
  };
  deadlineInfo: {
    deadline: string;
    hoursRemaining: number;
    isUrgent: boolean; // less than 24 hours
  } | null;
}

export class FantasyDashboardPresenter {
  async getViewModel(): Promise<FantasyDashboardViewModel> {
    const team = MY_FANTASY_TEAM;
    const currentGameweek = getCurrentGameweek();
    const nextGameweek = getNextGameweek();

    // Get starting XI with player details
    const startingXIData = getStartingXI(team);
    const startingXI = startingXIData.map((squadPlayer) => {
      const player = getPlayerById(squadPlayer.playerId);
      if (!player) throw new Error(`Player ${squadPlayer.playerId} not found`);

      return {
        player,
        isCaptain: squadPlayer.isCaptain,
        isViceCaptain: squadPlayer.isViceCaptain,
      };
    });

    // Get bench with player details
    const benchData = getBench(team);
    const bench = benchData.map((squadPlayer) => {
      const player = getPlayerById(squadPlayer.playerId);
      if (!player) throw new Error(`Player ${squadPlayer.playerId} not found`);

      return {
        player,
        benchOrder: squadPlayer.benchOrder || 0,
      };
    });

    // Get my leagues with rankings
    const leagues = getMyLeagues();
    const myLeagues = leagues.map((league) => ({
      league,
      myRank: getMyRankInLeague(league.id, team.id),
    }));

    // Calculate deadline info
    let deadlineInfo = null;
    if (currentGameweek && !currentGameweek.isFinished) {
      const deadline = new Date(currentGameweek.deadline);
      const now = new Date();
      const hoursRemaining = Math.max(
        0,
        Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60))
      );

      deadlineInfo = {
        deadline: currentGameweek.deadline,
        hoursRemaining,
        isUrgent: hoursRemaining < 24,
      };
    }

    return {
      team,
      currentGameweek,
      nextGameweek,
      startingXI,
      bench,
      myLeagues,
      stats: {
        totalPoints: team.totalPoints,
        gameweekPoints: team.gameweekPoints,
        overallRank: team.overallRank,
        teamValue: team.teamValue,
        bank: team.bank,
        freeTransfers: team.freeTransfers,
      },
      deadlineInfo,
    };
  }
}

// Factory for server-side usage
export class FantasyDashboardPresenterFactory {
  static create(): FantasyDashboardPresenter {
    return new FantasyDashboardPresenter();
  }
}
