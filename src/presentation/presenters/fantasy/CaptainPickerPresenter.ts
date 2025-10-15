// Captain Picker & Differential Finder Presenter
// Helps users choose captain and find differential players

import {
  FANTASY_PLAYERS,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";
import {
  getCurrentGameweek,
  type Gameweek,
} from "@/src/data/mock/fantasy/gameweeks.mock";

export interface CaptainCandidate extends FantasyPlayer {
  captainScore: number; // 0-100
  reasons: string[];
  risks: string[];
  expectedPoints: number;
}

export interface DifferentialPlayer extends FantasyPlayer {
  differentialScore: number; // 0-100
  upside: string[];
  downside: string[];
  vsTemplate: number; // % difference from template ownership
}

export interface CaptainPickerViewModel {
  currentGameweek: Gameweek | undefined;
  topCaptainPicks: CaptainCandidate[];
  safeCaptains: CaptainCandidate[];
  differentialCaptains: CaptainCandidate[];
  differentialPlayers: DifferentialPlayer[];
  lowOwnershipGems: DifferentialPlayer[];
  templatePlayers: FantasyPlayer[]; // High ownership players
}

export class CaptainPickerPresenter {
  async getViewModel(): Promise<CaptainPickerViewModel> {
    const currentGameweek = getCurrentGameweek();
    const allPlayers = FANTASY_PLAYERS;

    // Calculate captain score
    const calculateCaptainScore = (player: FantasyPlayer): number => {
      const formWeight = 30;
      const pointsWeight = 25;
      const fixtureWeight = 25;
      const ownershipWeight = 20;

      const formScore = (player.form / 10) * formWeight;
      const pointsScore = (player.totalPoints / 200) * pointsWeight;
      
      // Easy fixture = higher score
      const nextFixture = player.nextFixtures[0];
      const fixtureScore = nextFixture 
        ? ((5 - nextFixture.difficulty) / 4) * fixtureWeight 
        : 0;
      
      const ownershipScore = (player.ownership / 100) * ownershipWeight;

      return Math.min(100, formScore + pointsScore + fixtureScore + ownershipScore);
    };

    // Get captain candidates
    const captainCandidates: CaptainCandidate[] = allPlayers
      .filter((p) => p.totalPoints > 50) // Only good players
      .map((player) => {
        const captainScore = calculateCaptainScore(player);
        const nextFixture = player.nextFixtures[0];

        const reasons: string[] = [];
        const risks: string[] = [];

        // Analyze reasons
        if (player.form >= 8) reasons.push("ฟอร์มดีมาก");
        if (player.goalsScored >= 10) reasons.push("ทำประตูเก่ง");
        if (nextFixture && nextFixture.difficulty <= 2) reasons.push("คู่แข่งอ่อน");
        if (player.ownership >= 50) reasons.push("คนเลือกเยอะ (ปลอดภัย)");
        if (nextFixture?.isHome) reasons.push("เล่นเหย้า");

        // Analyze risks
        if (player.form < 5) risks.push("ฟอร์มแย่");
        if (nextFixture && nextFixture.difficulty >= 4) risks.push("คู่แข่งแข็ง");
        if (player.ownership < 10) risks.push("คนเลือกน้อย (เสี่ยง)");
        if (!nextFixture?.isHome) risks.push("เล่นเยือน");

        const expectedPoints = Math.round(player.form * 2); // Simple calculation

        return {
          ...player,
          captainScore,
          reasons,
          risks,
          expectedPoints,
        };
      })
      .sort((a, b) => b.captainScore - a.captainScore);

    // Top captain picks (overall best)
    const topCaptainPicks = captainCandidates.slice(0, 5);

    // Safe captains (high ownership, consistent)
    const safeCaptains = captainCandidates
      .filter((c) => c.ownership >= 30 && c.form >= 6)
      .slice(0, 5);

    // Differential captains (low ownership, high upside)
    const differentialCaptains = captainCandidates
      .filter((c) => c.ownership < 20 && c.form >= 7)
      .slice(0, 5);

    // Calculate differential score
    const calculateDifferentialScore = (player: FantasyPlayer): number => {
      const formWeight = 35;
      const valueWeight = 30;
      const ownershipWeight = 35; // Lower ownership = higher score

      const formScore = (player.form / 10) * formWeight;
      const valueScore = ((player.totalPoints / player.price) / 20) * valueWeight;
      const ownershipScore = ((100 - player.ownership) / 100) * ownershipWeight;

      return Math.min(100, formScore + valueScore + ownershipScore);
    };

    // Differential players (hidden gems)
    const differentialPlayers: DifferentialPlayer[] = allPlayers
      .filter((p) => p.ownership < 15 && p.form >= 6)
      .map((player) => {
        const differentialScore = calculateDifferentialScore(player);
        const avgOwnership = 25; // Template average
        const vsTemplate = player.ownership - avgOwnership;

        const upside: string[] = [];
        const downside: string[] = [];

        if (player.form >= 7) upside.push("ฟอร์มดีมาก");
        if (player.totalPoints / player.price > 15) upside.push("คุ้มค่ามาก");
        if (player.ownership < 5) upside.push("แทบไม่มีคนเลือก");
        
        const nextFixture = player.nextFixtures[0];
        if (nextFixture && nextFixture.difficulty <= 2) {
          upside.push("ตารางแข่งง่าย");
        }

        if (player.minutesPlayed < 500) downside.push("เล่นไม่สม่ำเสมอ");
        if (nextFixture && nextFixture.difficulty >= 4) {
          downside.push("ตารางแข่งยาก");
        }

        return {
          ...player,
          differentialScore,
          upside,
          downside,
          vsTemplate,
        };
      })
      .sort((a, b) => b.differentialScore - a.differentialScore)
      .slice(0, 10);

    // Low ownership gems (< 5% ownership but good stats)
    const lowOwnershipGems = differentialPlayers
      .filter((p) => p.ownership < 5 && p.form >= 7)
      .slice(0, 5);

    // Template players (most owned)
    const templatePlayers = [...allPlayers]
      .sort((a, b) => b.ownership - a.ownership)
      .slice(0, 10);

    return {
      currentGameweek,
      topCaptainPicks,
      safeCaptains,
      differentialCaptains,
      differentialPlayers,
      lowOwnershipGems,
      templatePlayers,
    };
  }
}

// Factory for server-side usage
export class CaptainPickerPresenterFactory {
  static create(): CaptainPickerPresenter {
    return new CaptainPickerPresenter();
  }
}
