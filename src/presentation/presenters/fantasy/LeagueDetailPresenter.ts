// League Detail Presenter
// Detailed view of a specific league

import {
  FANTASY_LEAGUES,
  type FantasyLeague,
  type LeagueStanding,
} from "@/src/data/mock/fantasy/leagues.mock";
import { MY_FANTASY_TEAM } from "@/src/data/mock/fantasy/teams.mock";

export interface LeagueStats {
  totalManagers: number;
  averagePoints: number;
  highestPoints: number;
  lowestPoints: number;
  averageGameweekPoints: number;
  mostTransfers: number;
  leastTransfers: number;
}

export interface GameweekHistory {
  gameweek: number;
  topScorer: {
    teamName: string;
    managerName: string;
    points: number;
  };
  averagePoints: number;
  myRank: number;
  myPoints: number;
}

export interface LeagueDetailViewModel {
  league: FantasyLeague;
  standings: LeagueStanding[];
  myPosition: LeagueStanding | null;
  stats: LeagueStats;
  gameweekHistory: GameweekHistory[];
  topRisers: (LeagueStanding & { rankChange: number })[]; // Biggest rank improvements
  topFallers: (LeagueStanding & { rankChange: number })[]; // Biggest rank drops
}

export class LeagueDetailPresenter {
  async getViewModel(leagueId: string): Promise<LeagueDetailViewModel> {
    // Find league
    const league = FANTASY_LEAGUES.find((l: FantasyLeague) => l.id === leagueId);
    if (!league) {
      throw new Error("League not found");
    }

    // Mock standings - in real app, fetch from database
    const { FRIENDS_FAMILY_STANDINGS } = await import("@/src/data/mock/fantasy/leagues.mock");
    const standings = FRIENDS_FAMILY_STANDINGS;

    // Find my position
    const myPosition =
      standings.find((s: LeagueStanding) => s.teamId === MY_FANTASY_TEAM.id) || null;

    // Calculate stats
    const totalPoints = standings.reduce((sum: number, s: LeagueStanding) => sum + s.totalPoints, 0);
    const totalGWPoints = standings.reduce(
      (sum: number, s: LeagueStanding) => sum + s.gameweekPoints,
      0
    );

    const stats: LeagueStats = {
      totalManagers: standings.length,
      averagePoints: Math.round(totalPoints / standings.length),
      highestPoints: Math.max(...standings.map((s: LeagueStanding) => s.totalPoints)),
      lowestPoints: Math.min(...standings.map((s: LeagueStanding) => s.totalPoints)),
      averageGameweekPoints: Math.round(totalGWPoints / standings.length),
      mostTransfers: 15, // Mock
      leastTransfers: 2, // Mock
    };

    // Mock gameweek history
    const gameweekHistory: GameweekHistory[] = Array.from(
      { length: 9 },
      (_, i) => {
        const gw = i + 1;
        return {
          gameweek: gw,
          topScorer: {
            teamName: standings[Math.floor(Math.random() * 3)].teamName,
            managerName: standings[Math.floor(Math.random() * 3)].managerName,
            points: 80 + Math.floor(Math.random() * 40),
          },
          averagePoints: 55 + Math.floor(Math.random() * 20),
          myRank: myPosition
            ? myPosition.rank + Math.floor(Math.random() * 5) - 2
            : 0,
          myPoints: 50 + Math.floor(Math.random() * 30),
        };
      }
    );

    // Calculate rank changes (mock)
    const topRisers = [...standings]
      .map((s) => ({
        ...s,
        rankChange: Math.floor(Math.random() * 10) + 5, // +5 to +15
      }))
      .sort((a, b) => b.rankChange - a.rankChange)
      .slice(0, 5);

    const topFallers = [...standings]
      .map((s) => ({
        ...s,
        rankChange: -(Math.floor(Math.random() * 10) + 5), // -5 to -15
      }))
      .sort((a, b) => a.rankChange - b.rankChange)
      .slice(0, 5);

    return {
      league,
      standings,
      myPosition,
      stats,
      gameweekHistory,
      topRisers,
      topFallers,
    };
  }
}

export class LeagueDetailPresenterFactory {
  static create(): LeagueDetailPresenter {
    return new LeagueDetailPresenter();
  }
}
