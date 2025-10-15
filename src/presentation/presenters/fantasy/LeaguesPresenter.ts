// Leagues Presenter
// Handles business logic for Leagues

import {
  FANTASY_LEAGUES,
  FRIENDS_FAMILY_STANDINGS,
  GLOBAL_STANDINGS,
  getMyLeagues,
  getLeagueById,
  type FantasyLeague,
  type LeagueStanding,
} from "@/src/data/mock/fantasy/leagues.mock";
import { MY_FANTASY_TEAM } from "@/src/data/mock/fantasy/teams.mock";

export interface LeaguesViewModel {
  myLeagues: {
    league: FantasyLeague;
    myRank: LeagueStanding | undefined;
    standings: LeagueStanding[];
  }[];
  allLeagues: FantasyLeague[];
  myTeamId: string;
}

export class LeaguesPresenter {
  async getViewModel(): Promise<LeaguesViewModel> {
    const myTeamId = MY_FANTASY_TEAM.id;
    const leagues = getMyLeagues();

    // Get standings for each league
    const myLeagues = leagues.map((league) => {
      let standings: LeagueStanding[] = [];

      if (league.id === "league1") {
        standings = FRIENDS_FAMILY_STANDINGS;
      } else if (league.id === "global") {
        standings = GLOBAL_STANDINGS.slice(0, 20); // Top 20 + my rank
      }

      const myRank = standings.find((s) => s.teamId === myTeamId);

      return {
        league,
        myRank,
        standings,
      };
    });

    return {
      myLeagues,
      allLeagues: FANTASY_LEAGUES,
      myTeamId,
    };
  }
}

// Factory for server-side usage
export class LeaguesPresenterFactory {
  static create(): LeaguesPresenter {
    return new LeaguesPresenter();
  }
}
