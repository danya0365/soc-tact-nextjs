// Head-to-Head Comparison Presenter
// Compare your team with friends or rivals

import {
  MY_FANTASY_TEAM,
  RIVAL_TEAMS,
  type FantasyTeam,
} from "@/src/data/mock/fantasy/teams.mock";
import {
  FANTASY_PLAYERS,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";

export interface TeamComparison {
  myTeam: FantasyTeam;
  opponentTeam: FantasyTeam;
  comparison: {
    totalPoints: { mine: number; opponent: number; difference: number };
    teamValue: { mine: number; opponent: number; difference: number };
    averagePoints: { mine: number; opponent: number; difference: number };
    formScore: { mine: number; opponent: number; difference: number };
  };
  playerComparison: {
    position: string;
    myPlayer: FantasyPlayer | null;
    opponentPlayer: FantasyPlayer | null;
    advantage: "mine" | "opponent" | "equal";
  }[];
  advantages: string[];
  disadvantages: string[];
  prediction: {
    winner: "mine" | "opponent" | "draw";
    confidence: number;
    reasoning: string[];
  };
}

export interface HeadToHeadViewModel {
  myTeam: FantasyTeam;
  availableOpponents: FantasyTeam[];
}

export class HeadToHeadPresenter {
  async getViewModel(): Promise<HeadToHeadViewModel> {
    return {
      myTeam: MY_FANTASY_TEAM,
      availableOpponents: RIVAL_TEAMS,
    };
  }

  compareTeams(opponentTeamId: string): TeamComparison {
    const myTeam = MY_FANTASY_TEAM;
    const opponentTeam = RIVAL_TEAMS.find((t: FantasyTeam) => t.id === opponentTeamId);

    if (!opponentTeam) {
      throw new Error("Opponent team not found");
    }

    // Get players
    const getPlayer = (playerId: string) =>
      FANTASY_PLAYERS.find((p) => p.id === playerId);

    const myPlayers = myTeam.squad
      .map((s) => getPlayer(s.playerId))
      .filter((p): p is FantasyPlayer => p !== undefined);

    const opponentPlayers = opponentTeam.squad
      .map((s) => getPlayer(s.playerId))
      .filter((p): p is FantasyPlayer => p !== undefined);

    // Calculate stats
    const myTotalPoints = myPlayers.reduce((sum, p) => sum + p.totalPoints, 0);
    const opponentTotalPoints = opponentPlayers.reduce(
      (sum, p) => sum + p.totalPoints,
      0
    );

    const myTeamValue = myPlayers.reduce((sum, p) => sum + p.price, 0);
    const opponentTeamValue = opponentPlayers.reduce((sum, p) => sum + p.price, 0);

    const myAvgPoints = myTotalPoints / myPlayers.length;
    const opponentAvgPoints = opponentTotalPoints / opponentPlayers.length;

    const myFormScore = myPlayers.reduce((sum, p) => sum + p.form, 0) / myPlayers.length;
    const opponentFormScore =
      opponentPlayers.reduce((sum, p) => sum + p.form, 0) / opponentPlayers.length;

    // Position-by-position comparison
    const positions = ["GK", "DEF", "MID", "FWD"];
    const playerComparison = positions.flatMap((pos) => {
      const myPosPlayers = myPlayers.filter((p) => p.position === pos);
      const oppPosPlayers = opponentPlayers.filter((p) => p.position === pos);
      const maxLength = Math.max(myPosPlayers.length, oppPosPlayers.length);

      return Array.from({ length: maxLength }, (_, i) => {
        const myPlayer = myPosPlayers[i] || null;
        const oppPlayer = oppPosPlayers[i] || null;

        let advantage: "mine" | "opponent" | "equal" = "equal";
        if (myPlayer && oppPlayer) {
          if (myPlayer.totalPoints > oppPlayer.totalPoints) advantage = "mine";
          else if (myPlayer.totalPoints < oppPlayer.totalPoints) advantage = "opponent";
        } else if (myPlayer) advantage = "mine";
        else if (oppPlayer) advantage = "opponent";

        return {
          position: pos,
          myPlayer,
          opponentPlayer: oppPlayer,
          advantage,
        };
      });
    });

    // Advantages/Disadvantages
    const advantages: string[] = [];
    const disadvantages: string[] = [];

    if (myTotalPoints > opponentTotalPoints) {
      advantages.push(`คะแนนรวมมากกว่า ${(myTotalPoints - opponentTotalPoints).toFixed(0)} คะแนน`);
    } else {
      disadvantages.push(`คะแนนรวมน้อยกว่า ${(opponentTotalPoints - myTotalPoints).toFixed(0)} คะแนน`);
    }

    if (myFormScore > opponentFormScore) {
      advantages.push("ฟอร์มดีกว่า");
    } else {
      disadvantages.push("ฟอร์มแย่กว่า");
    }

    if (myTeamValue < opponentTeamValue) {
      advantages.push("ใช้งบน้อยกว่า (คุ้มค่ากว่า)");
    }

    // Prediction
    const pointsDiff = myTotalPoints - opponentTotalPoints;
    const formDiff = myFormScore - opponentFormScore;
    
    let winner: "mine" | "opponent" | "draw" = "draw";
    let confidence = 50;
    const reasoning: string[] = [];

    if (Math.abs(pointsDiff) > 100) {
      winner = pointsDiff > 0 ? "mine" : "opponent";
      confidence = 75;
      reasoning.push("ห่างกันมากในคะแนนรวม");
    } else if (Math.abs(pointsDiff) > 50) {
      winner = pointsDiff > 0 ? "mine" : "opponent";
      confidence = 65;
      reasoning.push("ห่างกันปานกลางในคะแนนรวม");
    }

    if (formDiff > 1) {
      if (winner === "mine") confidence += 10;
      reasoning.push("ฟอร์มดีกว่าอย่างชัดเจน");
    } else if (formDiff < -1) {
      if (winner === "opponent") confidence += 10;
      reasoning.push("ฟอร์มแย่กว่าอย่างชัดเจน");
    }

    return {
      myTeam,
      opponentTeam,
      comparison: {
        totalPoints: {
          mine: myTotalPoints,
          opponent: opponentTotalPoints,
          difference: myTotalPoints - opponentTotalPoints,
        },
        teamValue: {
          mine: myTeamValue,
          opponent: opponentTeamValue,
          difference: myTeamValue - opponentTeamValue,
        },
        averagePoints: {
          mine: myAvgPoints,
          opponent: opponentAvgPoints,
          difference: myAvgPoints - opponentAvgPoints,
        },
        formScore: {
          mine: myFormScore,
          opponent: opponentFormScore,
          difference: myFormScore - opponentFormScore,
        },
      },
      playerComparison,
      advantages,
      disadvantages,
      prediction: {
        winner,
        confidence: Math.min(95, confidence),
        reasoning,
      },
    };
  }
}

export class HeadToHeadPresenterFactory {
  static create(): HeadToHeadPresenter {
    return new HeadToHeadPresenter();
  }
}
