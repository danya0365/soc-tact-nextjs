// My Team Presenter
// Handles business logic for detailed team view

import {
  MY_FANTASY_TEAM,
  getStartingXI,
  getBench,
  type FantasyTeam,
} from "@/src/data/mock/fantasy/teams.mock";
import {
  getCurrentGameweek,
  type Gameweek,
} from "@/src/data/mock/fantasy/gameweeks.mock";
import {
  FANTASY_PLAYERS,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";

export interface PlayerWithStats extends FantasyPlayer {
  gamesPlayed: number;
  pointsPerGame: number;
  selectedByUser: number; // weeks ago
  transferredIn: boolean;
  transferredOut: boolean;
}

export interface MyTeamViewModel {
  team: FantasyTeam;
  currentGameweek: Gameweek | undefined;
  startingXI: {
    player: PlayerWithStats;
    isCaptain: boolean;
    isViceCaptain: boolean;
  }[];
  bench: {
    player: PlayerWithStats;
    benchOrder: number;
  }[];
  teamStats: {
    totalValue: number;
    averageAge: number;
    averagePoints: number;
    mostExpensivePlayer: PlayerWithStats;
    bestPerformer: PlayerWithStats;
    worstPerformer: PlayerWithStats;
  };
  formationAnalysis: {
    formation: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  upcomingFixtures: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export class MyTeamPresenter {
  async getViewModel(): Promise<MyTeamViewModel> {
    const team = MY_FANTASY_TEAM;
    const currentGameweek = getCurrentGameweek();

    // Enhance players with stats
    const enhancePlayer = (playerId: string): PlayerWithStats => {
      const player = FANTASY_PLAYERS.find((p) => p.id === playerId);
      if (!player) throw new Error(`Player ${playerId} not found`);

      const gamesPlayed = Math.floor(player.minutesPlayed / 90);
      const pointsPerGame = gamesPlayed > 0 ? player.totalPoints / gamesPlayed : 0;

      return {
        ...player,
        gamesPlayed,
        pointsPerGame,
        selectedByUser: Math.floor(Math.random() * 10), // Mock
        transferredIn: false,
        transferredOut: false,
      };
    };

    // Get starting XI with enhanced stats
    const startingXIData = getStartingXI(team);
    const startingXI = startingXIData.map((squadPlayer) => ({
      player: enhancePlayer(squadPlayer.playerId),
      isCaptain: squadPlayer.isCaptain,
      isViceCaptain: squadPlayer.isViceCaptain,
    }));

    // Get bench with enhanced stats
    const benchData = getBench(team);
    const bench = benchData.map((squadPlayer) => ({
      player: enhancePlayer(squadPlayer.playerId),
      benchOrder: squadPlayer.benchOrder || 0,
    }));

    // Calculate team stats
    const allPlayers = [...startingXI.map((s) => s.player), ...bench.map((b) => b.player)];
    const totalValue = allPlayers.reduce((sum, p) => sum + p.price, 0);
    const averagePoints = allPlayers.reduce((sum, p) => sum + p.totalPoints, 0) / allPlayers.length;
    
    const mostExpensivePlayer = allPlayers.reduce((max, p) => 
      p.price > max.price ? p : max
    );
    
    const bestPerformer = allPlayers.reduce((max, p) => 
      p.totalPoints > max.totalPoints ? p : max
    );
    
    const worstPerformer = allPlayers.reduce((min, p) => 
      p.totalPoints < min.totalPoints ? p : min
    );

    // Formation analysis
    const defCount = startingXI.filter((s) => s.player.position === "DEF").length;
    const midCount = startingXI.filter((s) => s.player.position === "MID").length;
    const fwdCount = startingXI.filter((s) => s.player.position === "FWD").length;

    const formationAnalysis = {
      formation: team.formation,
      strengths: [
        defCount >= 4 ? "การป้องกันแข็งแกร่ง" : "",
        midCount >= 5 ? "ครองเกมได้ดี" : "",
        fwdCount >= 3 ? "พลังโจมตีสูง" : "",
      ].filter(Boolean),
      weaknesses: [
        defCount <= 3 ? "การป้องกันอ่อนแอ" : "",
        fwdCount <= 2 ? "ขาดพลังโจมตี" : "",
      ].filter(Boolean),
      suggestions: [
        "พิจารณาเปลี่ยนฟอร์เมชั่นตามคู่แข่ง",
        "ตรวจสอบนักเตะที่บาดเจ็บก่อน Deadline",
      ],
    };

    // Upcoming fixtures difficulty
    const upcomingFixtures = {
      easy: allPlayers.filter((p) => 
        p.nextFixtures.slice(0, 3).some((f) => f.difficulty <= 2)
      ).length,
      medium: allPlayers.filter((p) => 
        p.nextFixtures.slice(0, 3).some((f) => f.difficulty === 3)
      ).length,
      hard: allPlayers.filter((p) => 
        p.nextFixtures.slice(0, 3).some((f) => f.difficulty >= 4)
      ).length,
    };

    return {
      team,
      currentGameweek,
      startingXI,
      bench,
      teamStats: {
        totalValue,
        averageAge: 26.5, // Mock
        averagePoints,
        mostExpensivePlayer,
        bestPerformer,
        worstPerformer,
      },
      formationAnalysis,
      upcomingFixtures,
    };
  }
}

// Factory for server-side usage
export class MyTeamPresenterFactory {
  static create(): MyTeamPresenter {
    return new MyTeamPresenter();
  }
}
