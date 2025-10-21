/**
 * Leagues Presenter
 * Handles business logic for the Leagues list page
 */

import type { League as DomainLeague } from "@/src/domain/entities/football.entity";
import { getAllLeagues } from "@/src/infrastructure/api/football.api";

// View Model interfaces
export interface LeagueSummary {
  id: string;
  name: string;
  logo: string;
  country: string;
  season: string;
  competitionType: string;
  totalTeams: number | null;
  currentMatchday: number | null;
  totalMatchdays: number | null;
}

export interface LeaguesViewModel {
  leagues: LeagueSummary[];
  totalCount: number;
}

/**
 * Presenter for Leagues list page
 */
export class LeaguesPresenter {
  /**
   * Get view model for leagues page
   */
  async getViewModel(): Promise<LeaguesViewModel> {
    try {
      const leagues = await getAllLeagues();
      const mapped = leagues.map(mapLeagueSummary).sort((a, b) =>
        a.name.localeCompare(b.name, "th-TH")
      );

      return {
        leagues: mapped,
        totalCount: mapped.length,
      };
    } catch (error) {
      console.error("Error in LeaguesPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for leagues page
   */
  async generateMetadata() {
    return {
      title: "ตารางคะแนนลีก - League Tables | Soccer Tactics",
      description:
        "ดูตารางคะแนนจากลีกชั้นนำทั่วโลก Premier League, La Liga, Serie A, Bundesliga และอื่นๆ",
      keywords:
        "ตารางคะแนน, league table, Premier League, La Liga, Serie A, Bundesliga, standings",
      openGraph: {
        title: "ตารางคะแนนลีก | Soccer Tactics",
        description: "ดูตารางคะแนนจากลีกชั้นนำทั่วโลก",
        type: "website",
      },
    };
  }

  /**
   * Get league by ID
   */
  async getLeagueById(id: string): Promise<LeagueSummary | null> {
    try {
      const leagues = await getAllLeagues();
      const league = leagues.find((l) => l.id.toString() === id);
      return league ? mapLeagueSummary(league) : null;
    } catch (error) {
      console.error("Error in LeaguesPresenter.getLeagueById:", error);
      throw error;
    }
  }
}

/**
 * Factory for creating LeaguesPresenter instances
 */
export class LeaguesPresenterFactory {
  static createServer(): LeaguesPresenter {
    return new LeaguesPresenter();
  }

  static createClient(): LeaguesPresenter {
    return new LeaguesPresenter();
  }
}

function mapLeagueSummary(league: DomainLeague): LeagueSummary {
  return {
    id: league.id.toString(),
    name: league.name,
    logo: getLeagueLogoSymbol(league.logo, league.name),
    country: league.country,
    season: formatSeasonLabel(league.season),
    competitionType: league.type,
    totalTeams: null,
    currentMatchday: null,
    totalMatchdays: null,
  };
}

function formatSeasonLabel(season?: number): string {
  if (!season) {
    return "-";
  }

  const nextSeason = season + 1;
  return `${season}/${nextSeason.toString().slice(-2)}`;
}

function getLeagueLogoSymbol(logo: string | undefined, name: string): string {
  if (logo && !logo.startsWith("http")) {
    return logo;
  }

  const initial = name.trim().charAt(0);
  return initial ? initial.toUpperCase() : "🏆";
}
