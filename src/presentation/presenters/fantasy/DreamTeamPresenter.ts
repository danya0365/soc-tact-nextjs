// Dream Team Builder Presenter
// Handles business logic for auto-generating optimal fantasy teams

import {
  FANTASY_PLAYERS,
  getPlayersByPosition,
  getTopPlayersByPoints,
  getTopPlayersByForm,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";

export type BuildStrategy = "balanced" | "attack" | "defense" | "value" | "form";

export interface DreamTeamConstraints {
  budget: number;
  formation: string;
  strategy: BuildStrategy;
  maxPlayersPerTeam: number;
  prioritizeForm: boolean;
  prioritizeFixtures: boolean;
}

export interface GeneratedTeam {
  players: FantasyPlayer[];
  totalCost: number;
  remainingBudget: number;
  projectedPoints: number;
  formation: string;
  teamBalance: {
    attack: number;
    midfield: number;
    defense: number;
  };
  valueRating: number; // 0-100
}

export interface DreamTeamViewModel {
  availablePlayers: FantasyPlayer[];
  topPlayersByPoints: FantasyPlayer[];
  topPlayersByForm: FantasyPlayer[];
  topPlayersByValue: FantasyPlayer[];
  formations: string[];
  strategies: {
    id: BuildStrategy;
    name: string;
    description: string;
  }[];
  defaultConstraints: DreamTeamConstraints;
}

export class DreamTeamPresenter {
  async getViewModel(): Promise<DreamTeamViewModel> {
    const availablePlayers = FANTASY_PLAYERS;
    const topPlayersByPoints = getTopPlayersByPoints(20);
    const topPlayersByForm = getTopPlayersByForm(20);

    // Calculate value (points per million)
    const topPlayersByValue = [...FANTASY_PLAYERS]
      .map((p) => ({
        ...p,
        value: p.totalPoints / p.price,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);

    const formations = [
      "3-4-3",
      "3-5-2",
      "4-3-3",
      "4-4-2",
      "4-5-1",
      "5-3-2",
      "5-4-1",
    ];

    const strategies = [
      {
        id: "balanced" as BuildStrategy,
        name: "สมดุล",
        description: "กระจายงบประมาณอย่างสมดุลทุกตำแหน่ง",
      },
      {
        id: "attack" as BuildStrategy,
        name: "โจมตี",
        description: "เน้นนักเตะกองหน้าและกองกลางราคาแพง",
      },
      {
        id: "defense" as BuildStrategy,
        name: "ป้องกัน",
        description: "เน้นกองหลังและผู้รักษาประตูที่แข็งแกร่ง",
      },
      {
        id: "value" as BuildStrategy,
        name: "คุ้มค่า",
        description: "เลือกนักเตะที่ให้คะแนนต่อราคาสูงสุด",
      },
      {
        id: "form" as BuildStrategy,
        name: "ฟอร์มดี",
        description: "เลือกนักเตะที่มีฟอร์มดีที่สุด 5 เกมล่าสุด",
      },
    ];

    const defaultConstraints: DreamTeamConstraints = {
      budget: 100,
      formation: "3-4-3",
      strategy: "balanced",
      maxPlayersPerTeam: 3,
      prioritizeForm: true,
      prioritizeFixtures: true,
    };

    return {
      availablePlayers,
      topPlayersByPoints,
      topPlayersByForm,
      topPlayersByValue,
      formations,
      strategies,
      defaultConstraints,
    };
  }

  // Auto-generate team based on constraints
  generateDreamTeam(constraints: DreamTeamConstraints): GeneratedTeam {
    const { budget, formation, strategy, maxPlayersPerTeam } = constraints;

    // Parse formation
    const [def, mid, fwd] = formation.split("-").map(Number);
    const gk = 2; // Always 2 GKs

    // Get players by position
    const goalkeepers = getPlayersByPosition("GK");
    const defenders = getPlayersByPosition("DEF");
    const midfielders = getPlayersByPosition("MID");
    const forwards = getPlayersByPosition("FWD");

    // Sort players based on strategy
    const sortPlayers = (players: FantasyPlayer[]) => {
      switch (strategy) {
        case "form":
          return [...players].sort((a, b) => b.form - a.form);
        case "value":
          return [...players].sort(
            (a, b) => b.totalPoints / b.price - a.totalPoints / a.price
          );
        case "attack":
        case "defense":
        case "balanced":
        default:
          return [...players].sort((a, b) => b.totalPoints - a.totalPoints);
      }
    };

    const selectedPlayers: FantasyPlayer[] = [];
    let remainingBudget = budget;
    const teamCount: Record<string, number> = {};

    // Helper to check team constraint
    const canAddPlayer = (player: FantasyPlayer) => {
      const currentCount = teamCount[player.teamId] || 0;
      return currentCount < maxPlayersPerTeam;
    };

    // Helper to add player
    const addPlayer = (player: FantasyPlayer) => {
      selectedPlayers.push(player);
      remainingBudget -= player.price;
      teamCount[player.teamId] = (teamCount[player.teamId] || 0) + 1;
    };

    // Select players by position
    const selectByPosition = (
      players: FantasyPlayer[],
      count: number,
      budgetPerPlayer: number
    ) => {
      const sorted = sortPlayers(players);
      let selected = 0;

      for (const player of sorted) {
        if (selected >= count) break;
        if (player.price <= budgetPerPlayer && canAddPlayer(player)) {
          addPlayer(player);
          selected++;
        }
      }

      // Fill remaining slots with cheaper players if needed
      if (selected < count) {
        const cheapSorted = [...players].sort((a, b) => a.price - b.price);
        for (const player of cheapSorted) {
          if (selected >= count) break;
          if (
            player.price <= remainingBudget &&
            canAddPlayer(player) &&
            !selectedPlayers.includes(player)
          ) {
            addPlayer(player);
            selected++;
          }
        }
      }
    };

    // Budget allocation based on strategy
    let gkBudget = 9;
    let defBudget = 20;
    let midBudget = 35;
    let fwdBudget = 36;

    if (strategy === "attack") {
      gkBudget = 8;
      defBudget = 18;
      midBudget = 32;
      fwdBudget = 42;
    } else if (strategy === "defense") {
      gkBudget = 10;
      defBudget = 28;
      midBudget = 32;
      fwdBudget = 30;
    }

    // Select players
    selectByPosition(goalkeepers, gk, gkBudget / gk);
    selectByPosition(defenders, def + 2, defBudget / (def + 2)); // +2 for bench
    selectByPosition(midfielders, mid + 2, midBudget / (mid + 2)); // +2 for bench
    selectByPosition(forwards, fwd + 1, fwdBudget / (fwd + 1)); // +1 for bench

    // Calculate metrics
    const totalCost = selectedPlayers.reduce((sum, p) => sum + p.price, 0);
    const projectedPoints = selectedPlayers.reduce(
      (sum, p) => sum + p.totalPoints,
      0
    );

    const attackPoints = selectedPlayers
      .filter((p) => p.position === "FWD" || p.position === "MID")
      .reduce((sum, p) => sum + p.totalPoints, 0);
    const midfieldPoints = selectedPlayers
      .filter((p) => p.position === "MID")
      .reduce((sum, p) => sum + p.totalPoints, 0);
    const defensePoints = selectedPlayers
      .filter((p) => p.position === "DEF" || p.position === "GK")
      .reduce((sum, p) => sum + p.totalPoints, 0);

    const valueRating = Math.min(
      100,
      (projectedPoints / totalCost) * 10
    );

    return {
      players: selectedPlayers,
      totalCost,
      remainingBudget: budget - totalCost,
      projectedPoints,
      formation,
      teamBalance: {
        attack: Math.round((attackPoints / projectedPoints) * 100),
        midfield: Math.round((midfieldPoints / projectedPoints) * 100),
        defense: Math.round((defensePoints / projectedPoints) * 100),
      },
      valueRating: Math.round(valueRating),
    };
  }
}

// Factory for server-side usage
export class DreamTeamPresenterFactory {
  static create(): DreamTeamPresenter {
    return new DreamTeamPresenter();
  }
}
