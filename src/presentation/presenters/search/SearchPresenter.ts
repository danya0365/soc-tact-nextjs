/**
 * Search Presenter
 * Handles business logic for Search page
 */

import { searchTacticalPosts } from "@/src/data/mock/tactics.mock";
import { mockTeams } from "@/src/data/mock/teams.mock";
import { mockMatches } from "@/src/data/mock/matches.mock";

// View Model interfaces
export interface SearchResultPost {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  formation: string;
  upvotes: number;
  comments: number;
}

export interface SearchResultTeam {
  id: string;
  name: string;
  logo: string;
  league: string;
}

export interface SearchResultMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: string;
  score?: { home: number | null; away: number | null };
}

export interface SearchViewModel {
  query: string;
  posts: SearchResultPost[];
  teams: SearchResultTeam[];
  matches: SearchResultMatch[];
  activeTab: "all" | "posts" | "teams" | "matches";
  totalResults: number;
}

/**
 * Presenter for Search page
 */
export class SearchPresenter {
  /**
   * Get view model for search page
   */
  async getViewModel(
    query: string = "",
    activeTab: "all" | "posts" | "teams" | "matches" = "all"
  ): Promise<SearchViewModel> {
    try {
      // Search posts
      const posts = query
        ? searchTacticalPosts(query).map((post) => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            thumbnail: post.thumbnail,
            formation: post.formation,
            upvotes: post.upvotes,
            comments: post.comments,
          }))
        : [];

      // Search teams
      const teams = query
        ? Object.values(mockTeams)
            .filter((team) =>
              team.name.toLowerCase().includes(query.toLowerCase())
            )
            .map((team) => ({
              id: team.id,
              name: team.name,
              logo: team.logo,
              league: team.league.name,
            }))
        : [];

      // Search matches
      const matches = query
        ? mockMatches
            .filter(
              (match) =>
                match.homeTeam.name
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
                match.awayTeam.name.toLowerCase().includes(query.toLowerCase())
            )
            .map((match) => ({
              id: match.id,
              homeTeam: match.homeTeam.name,
              awayTeam: match.awayTeam.name,
              date: match.date,
              status: match.status,
              score: match.score,
            }))
        : [];

      const totalResults = posts.length + teams.length + matches.length;

      return {
        query,
        posts,
        teams,
        matches,
        activeTab,
        totalResults,
      };
    } catch (error) {
      console.error("Error in SearchPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for search page
   */
  async generateMetadata(query?: string) {
    return {
      title: query
        ? `ค้นหา "${query}" | Soccer Tactics`
        : "ค้นหา | Soccer Tactics",
      description: "ค้นหาบทวิเคราะห์แทคติค ทีม และการแข่งขัน",
      keywords: "ค้นหา, search, บทความ, ทีม, การแข่งขัน",
    };
  }
}

/**
 * Factory for creating SearchPresenter instances
 */
export class SearchPresenterFactory {
  static createServer(): SearchPresenter {
    return new SearchPresenter();
  }

  static createClient(): SearchPresenter {
    return new SearchPresenter();
  }
}
