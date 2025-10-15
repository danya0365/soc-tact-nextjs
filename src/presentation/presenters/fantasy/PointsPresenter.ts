// Points & Statistics Presenter
// Handles business logic for Points and Statistics

import {
  GAMEWEEKS,
  getCurrentGameweek,
  type Gameweek,
} from "@/src/data/mock/fantasy/gameweeks.mock";
import {
  FANTASY_PLAYERS,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";
import {
  MY_FANTASY_TEAM,
  type FantasyTeam,
} from "@/src/data/mock/fantasy/teams.mock";

export interface GameweekPerformance {
  gameweek: number;
  points: number;
  totalPoints: number;
  rank: number;
  transfers: number;
  transferCost: number;
  chipUsed?: string;
  benchPoints: number;
  captainPoints: number;
}

export interface PlayerPerformance {
  player: FantasyPlayer;
  gamesPlayed: number;
  totalPoints: number;
  averagePoints: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  bonusPoints: number;
}

export interface PointsViewModel {
  team: FantasyTeam;
  currentGameweek: Gameweek | undefined;
  gameweekHistory: GameweekPerformance[];
  seasonStats: {
    totalPoints: number;
    averagePoints: number;
    highestScore: number;
    lowestScore: number;
    bestGameweek: number;
    worstGameweek: number;
    totalTransfers: number;
    totalTransferCost: number;
    chipsUsed: number;
  };
  topPerformers: {
    byPoints: PlayerPerformance[];
    byAverage: PlayerPerformance[];
    byGoals: PlayerPerformance[];
  };
  rankProgression: {
    gameweek: number;
    rank: number;
  }[];
}

export class PointsPresenter {
  async getViewModel(): Promise<PointsViewModel> {
    const team = MY_FANTASY_TEAM;
    const currentGameweek = getCurrentGameweek();

    // Gameweek history
    const gameweekHistory: GameweekPerformance[] = team.gameweekHistory.map(
      (gw) => ({
        gameweek: gw.gameweek,
        points: gw.points,
        totalPoints: gw.totalPoints,
        rank: gw.rank,
        transfers: gw.transfers,
        transferCost: gw.transferCost,
        chipUsed: gw.chipUsed,
        benchPoints: Math.floor(Math.random() * 10), // Mock
        captainPoints: Math.floor(Math.random() * 20), // Mock
      })
    );

    // Calculate season stats
    const points = gameweekHistory.map((gw) => gw.points);
    const totalPoints = team.totalPoints;
    const averagePoints = points.length > 0 ? totalPoints / points.length : 0;
    const highestScore = Math.max(...points);
    const lowestScore = Math.min(...points);
    const bestGameweek =
      gameweekHistory.find((gw) => gw.points === highestScore)?.gameweek || 0;
    const worstGameweek =
      gameweekHistory.find((gw) => gw.points === lowestScore)?.gameweek || 0;
    const totalTransfers = gameweekHistory.reduce(
      (sum, gw) => sum + gw.transfers,
      0
    );
    const totalTransferCost = gameweekHistory.reduce(
      (sum, gw) => sum + gw.transferCost,
      0
    );
    const chipsUsed = Object.values(team.chips).filter((c) => c.used).length;

    // Top performers (mock data based on current squad)
    const squadPlayerIds = team.squad.map((s) => s.playerId);
    const squadPlayers = FANTASY_PLAYERS.filter((p) =>
      squadPlayerIds.includes(p.id)
    );

    const playerPerformances: PlayerPerformance[] = squadPlayers.map((p) => ({
      player: p,
      gamesPlayed: Math.floor(p.minutesPlayed / 90),
      totalPoints: p.totalPoints,
      averagePoints: p.form,
      goals: p.goalsScored,
      assists: p.assists,
      cleanSheets: p.cleanSheets,
      bonusPoints: p.bonusPoints,
    }));

    const topPerformers = {
      byPoints: [...playerPerformances]
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 5),
      byAverage: [...playerPerformances]
        .sort((a, b) => b.averagePoints - a.averagePoints)
        .slice(0, 5),
      byGoals: [...playerPerformances]
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 5),
    };

    // Rank progression
    const rankProgression = gameweekHistory.map((gw) => ({
      gameweek: gw.gameweek,
      rank: gw.rank,
    }));

    return {
      team,
      currentGameweek,
      gameweekHistory,
      seasonStats: {
        totalPoints,
        averagePoints,
        highestScore,
        lowestScore,
        bestGameweek,
        worstGameweek,
        totalTransfers,
        totalTransferCost,
        chipsUsed,
      },
      topPerformers,
      rankProgression,
    };
  }
}

// Factory for server-side usage
export class PointsPresenterFactory {
  static create(): PointsPresenter {
    return new PointsPresenter();
  }
}
