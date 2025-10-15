// Fixtures Presenter
// Handles business logic for Fixtures and Player Stats

import {
  GAMEWEEK_FIXTURES,
  getCurrentGameweek,
  type GameweekFixture,
  type Gameweek,
} from "@/src/data/mock/fantasy/gameweeks.mock";
import {
  FANTASY_PLAYERS,
  FANTASY_TEAMS,
  getTopPlayersByPoints,
  getTopPlayersByForm,
  type FantasyPlayer,
} from "@/src/data/mock/fantasy/players.mock";

export interface TeamFixtureDifficulty {
  teamId: string;
  teamName: string;
  nextFixtures: {
    opponent: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    isHome: boolean;
  }[];
  averageDifficulty: number;
}

export interface FixturesViewModel {
  currentGameweek: Gameweek | undefined;
  currentFixtures: GameweekFixture[];
  teamFixtureDifficulty: TeamFixtureDifficulty[];
  topPlayers: {
    byPoints: FantasyPlayer[];
    byForm: FantasyPlayer[];
    byValue: FantasyPlayer[]; // Points per million
  };
  allPlayers: FantasyPlayer[];
}

export class FixturesPresenter {
  async getViewModel(): Promise<FixturesViewModel> {
    const currentGameweek = getCurrentGameweek();
    const currentFixtures = GAMEWEEK_FIXTURES;

    // Calculate fixture difficulty for each team
    const teamFixtureDifficulty: TeamFixtureDifficulty[] = FANTASY_TEAMS.map(
      (team) => {
        // Get next 5 fixtures for this team (mock data)
        const nextFixtures = FANTASY_PLAYERS.filter(
          (p) => p.teamId === team.id
        )[0]?.nextFixtures || [];

        const averageDifficulty =
          nextFixtures.length > 0
            ? nextFixtures.reduce((sum, f) => sum + f.difficulty, 0) /
              nextFixtures.length
            : 3;

        return {
          teamId: team.id,
          teamName: team.name,
          nextFixtures,
          averageDifficulty,
        };
      }
    ).sort((a, b) => a.averageDifficulty - b.averageDifficulty);

    // Top players
    const topByPoints = getTopPlayersByPoints(10);
    const topByForm = getTopPlayersByForm(10);

    // Calculate value (points per million)
    const topByValue = [...FANTASY_PLAYERS]
      .map((p) => ({
        ...p,
        value: p.totalPoints / p.price,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return {
      currentGameweek,
      currentFixtures,
      teamFixtureDifficulty,
      topPlayers: {
        byPoints: topByPoints,
        byForm: topByForm,
        byValue: topByValue,
      },
      allPlayers: FANTASY_PLAYERS,
    };
  }
}

// Factory for server-side usage
export class FixturesPresenterFactory {
  static create(): FixturesPresenter {
    return new FixturesPresenter();
  }
}
