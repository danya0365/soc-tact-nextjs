// Gameweek Planner Presenter
// Plan ahead for multiple gameweeks with fixture analysis

import { MY_FANTASY_TEAM } from "@/src/data/mock/fantasy/teams.mock";
import {
  FANTASY_PLAYERS,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";
import { getCurrentGameweek } from "@/src/data/mock/fantasy/gameweeks.mock";

export interface FixtureDifficulty {
  gameweek: number;
  difficulty: number; // 1-5
  opponent: string;
  isHome: boolean;
}

export interface PlayerFixtureAnalysis extends FantasyPlayer {
  next5Fixtures: FixtureDifficulty[];
  averageDifficulty: number;
  easyFixtures: number; // difficulty <= 2
  hardFixtures: number; // difficulty >= 4
  recommendation: "buy" | "hold" | "sell";
  expectedPoints: number[];
}

export interface TeamFixtureRun {
  teamId: string;
  teamName: string;
  next5Fixtures: FixtureDifficulty[];
  averageDifficulty: number;
  rating: "excellent" | "good" | "average" | "poor" | "terrible";
  playersCount: number;
}

export interface TransferPlan {
  gameweek: number;
  transfersIn: {
    player: FantasyPlayer;
    reason: string;
  }[];
  transfersOut: {
    player: FantasyPlayer;
    reason: string;
  }[];
  chipRecommendation?: {
    chip: "wildcard" | "benchBoost" | "tripleCaptain" | "freeHit";
    reason: string;
  };
}

export interface GameweekPlannerViewModel {
  currentGameweek: number;
  myPlayers: PlayerFixtureAnalysis[];
  teamFixtureRuns: TeamFixtureRun[];
  bestFixtures: PlayerFixtureAnalysis[];
  worstFixtures: PlayerFixtureAnalysis[];
  transferPlans: TransferPlan[];
  upcomingBlanks: number[];
  upcomingDoubles: number[];
}

export class GameweekPlannerPresenter {
  async getViewModel(): Promise<GameweekPlannerViewModel> {
    const currentGW = getCurrentGameweek();
    const currentGameweek = currentGW?.id || 10;

    // Get my squad players
    const myTeam = MY_FANTASY_TEAM;
    const myPlayerIds = myTeam.squad.map((s) => s.playerId);
    const myPlayersData = FANTASY_PLAYERS.filter((p) =>
      myPlayerIds.includes(p.id)
    );

    // Analyze fixtures for my players
    const myPlayers: PlayerFixtureAnalysis[] = myPlayersData.map((player) => {
      const next5 = player.nextFixtures.slice(0, 5).map((f, idx) => ({
        gameweek: currentGameweek + idx + 1,
        difficulty: f.difficulty,
        opponent: f.opponent,
        isHome: f.isHome,
      }));
      const avgDiff =
        next5.reduce((sum, f) => sum + f.difficulty, 0) / next5.length;
      const easy = next5.filter((f) => f.difficulty <= 2).length;
      const hard = next5.filter((f) => f.difficulty >= 4).length;

      let recommendation: "buy" | "hold" | "sell" = "hold";
      if (avgDiff <= 2.5 && player.form >= 6) recommendation = "buy";
      else if (avgDiff >= 3.5 || player.form < 4) recommendation = "sell";

      const expectedPoints = next5.map((f) => {
        const basePoints = player.form * 2;
        const difficultyModifier = (6 - f.difficulty) * 2;
        return Math.round(basePoints + difficultyModifier);
      });

      return {
        ...player,
        next5Fixtures: next5,
        averageDifficulty: avgDiff,
        easyFixtures: easy,
        hardFixtures: hard,
        recommendation,
        expectedPoints,
      };
    });

    // Analyze team fixture runs
    const teamMap = new Map<string, FantasyPlayer[]>();
    FANTASY_PLAYERS.forEach((p) => {
      if (!teamMap.has(p.teamId)) {
        teamMap.set(p.teamId, []);
      }
      teamMap.get(p.teamId)!.push(p);
    });

    const teamFixtureRuns: TeamFixtureRun[] = Array.from(teamMap.entries()).map(
      ([teamId, players]) => {
        const firstPlayer = players[0];
        const next5 = firstPlayer.nextFixtures.slice(0, 5).map((f, idx) => ({
          gameweek: currentGameweek + idx + 1,
          difficulty: f.difficulty,
          opponent: f.opponent,
          isHome: f.isHome,
        }));
        const avgDiff =
          next5.reduce((sum, f) => sum + f.difficulty, 0) / next5.length;

        let rating: TeamFixtureRun["rating"] = "average";
        if (avgDiff <= 2) rating = "excellent";
        else if (avgDiff <= 2.5) rating = "good";
        else if (avgDiff >= 4) rating = "terrible";
        else if (avgDiff >= 3.5) rating = "poor";

        return {
          teamId,
          teamName: firstPlayer.team,
          next5Fixtures: next5,
          averageDifficulty: avgDiff,
          rating,
          playersCount: players.length,
        };
      }
    );

    // Sort by fixture difficulty
    const sortedTeams = [...teamFixtureRuns].sort(
      (a, b) => a.averageDifficulty - b.averageDifficulty
    );

    // Best and worst fixtures
    const allPlayersAnalysis: PlayerFixtureAnalysis[] = FANTASY_PLAYERS.map(
      (player) => {
        const next5 = player.nextFixtures.slice(0, 5).map((f, idx) => ({
          gameweek: currentGameweek + idx + 1,
          difficulty: f.difficulty,
          opponent: f.opponent,
          isHome: f.isHome,
        }));
        const avgDiff =
          next5.reduce((sum, f) => sum + f.difficulty, 0) / next5.length;
        const easy = next5.filter((f) => f.difficulty <= 2).length;
        const hard = next5.filter((f) => f.difficulty >= 4).length;

        let recommendation: "buy" | "hold" | "sell" = "hold";
        if (avgDiff <= 2.5 && player.form >= 6) recommendation = "buy";
        else if (avgDiff >= 3.5 || player.form < 4) recommendation = "sell";

        const expectedPoints = next5.map((f) => {
          const basePoints = player.form * 2;
          const difficultyModifier = (6 - f.difficulty) * 2;
          return Math.round(basePoints + difficultyModifier);
        });

        return {
          ...player,
          next5Fixtures: next5,
          averageDifficulty: avgDiff,
          easyFixtures: easy,
          hardFixtures: hard,
          recommendation,
          expectedPoints,
        };
      }
    );

    const bestFixtures = [...allPlayersAnalysis]
      .sort((a, b) => a.averageDifficulty - b.averageDifficulty)
      .slice(0, 10);

    const worstFixtures = [...allPlayersAnalysis]
      .sort((a, b) => b.averageDifficulty - a.averageDifficulty)
      .slice(0, 10);

    // Generate transfer plans
    const transferPlans: TransferPlan[] = [];
    for (let i = 0; i < 3; i++) {
      const gw = currentGameweek + i + 1;
      const playersToSell = myPlayers
        .filter((p) => p.recommendation === "sell")
        .slice(0, 2);

      const playersToBy = bestFixtures
        .filter((p) => !myPlayerIds.includes(p.id))
        .slice(0, 2);

      if (playersToSell.length > 0 || playersToBy.length > 0) {
        transferPlans.push({
          gameweek: gw,
          transfersIn: playersToBy.map((p) => ({
            player: p,
            reason: `ตารางแข่งง่าย (${p.averageDifficulty.toFixed(1)})`,
          })),
          transfersOut: playersToSell.map((p) => ({
            player: p,
            reason: `ตารางแข่งยาก (${p.averageDifficulty.toFixed(1)})`,
          })),
        });
      }
    }

    // Mock blank and double gameweeks
    const upcomingBlanks = [18, 25];
    const upcomingDoubles = [19, 26];

    return {
      currentGameweek,
      myPlayers,
      teamFixtureRuns: sortedTeams,
      bestFixtures,
      worstFixtures,
      transferPlans,
      upcomingBlanks,
      upcomingDoubles,
    };
  }
}

export class GameweekPlannerPresenterFactory {
  static create(): GameweekPlannerPresenter {
    return new GameweekPlannerPresenter();
  }
}
