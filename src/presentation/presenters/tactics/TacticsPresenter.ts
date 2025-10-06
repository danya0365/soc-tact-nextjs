/**
 * Tactics Presenter
 * Handles business logic for Tactical Analysis feed page
 */

import {
  mockTacticalPosts,
  searchTacticalPosts,
  getTacticalPostsByFormation,
  getTacticalPostsByLeague,
  getTacticalPostsByTag,
  type MockTacticalPost,
} from "@/src/data/mock/tactics.mock";

// View Model interfaces
export interface TacticalPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  formation: string;
  league: string;
  team?: string;
  tags: string[];
  upvotes: number;
  comments: number;
  views: number;
  createdAt: string;
}

export interface TacticsFilters {
  searchQuery?: string;
  formation?: string;
  league?: string;
  tag?: string;
  sortBy?: "latest" | "popular" | "trending";
}

export interface TacticsStats {
  totalPosts: number;
  totalAuthors: number;
  totalViews: number;
  totalComments: number;
}

export interface TacticsViewModel {
  posts: TacticalPost[];
  stats: TacticsStats;
  filters: TacticsFilters;
  totalCount: number;
  page: number;
  perPage: number;
  availableFormations: string[];
  availableLeagues: string[];
  availableTags: string[];
}

/**
 * Presenter for Tactics feed page
 */
export class TacticsPresenter {
  /**
   * Get view model for tactics page
   */
  async getViewModel(
    filters: TacticsFilters = {},
    page: number = 1,
    perPage: number = 9
  ): Promise<TacticsViewModel> {
    try {
      // Get filtered posts
      let filteredPosts = [...mockTacticalPosts];

      // Apply search filter
      if (filters.searchQuery) {
        filteredPosts = searchTacticalPosts(filters.searchQuery);
      }

      // Apply formation filter
      if (filters.formation) {
        filteredPosts = filteredPosts.filter((post) =>
          post.formation.includes(filters.formation!)
        );
      }

      // Apply league filter
      if (filters.league) {
        filteredPosts = filteredPosts.filter(
          (post) => post.league === filters.league
        );
      }

      // Apply tag filter
      if (filters.tag) {
        filteredPosts = filteredPosts.filter((post) =>
          post.tags.includes(filters.tag!)
        );
      }

      // Apply sorting
      switch (filters.sortBy) {
        case "popular":
          filteredPosts.sort((a, b) => b.upvotes - a.upvotes);
          break;
        case "trending":
          filteredPosts.sort((a, b) => b.views - a.views);
          break;
        case "latest":
        default:
          filteredPosts.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }

      // Calculate stats
      const stats: TacticsStats = {
        totalPosts: mockTacticalPosts.length,
        totalAuthors: new Set(mockTacticalPosts.map((p) => p.author.id)).size,
        totalViews: mockTacticalPosts.reduce((sum, p) => sum + p.views, 0),
        totalComments: mockTacticalPosts.reduce(
          (sum, p) => sum + p.comments,
          0
        ),
      };

      // Get available filters
      const availableFormations = [
        ...new Set(mockTacticalPosts.map((p) => p.formation)),
      ];
      const availableLeagues = [
        ...new Set(mockTacticalPosts.map((p) => p.league)),
      ];
      const availableTags = [
        ...new Set(mockTacticalPosts.flatMap((p) => p.tags)),
      ];

      // Pagination
      const totalCount = filteredPosts.length;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      // Map to view model
      const posts: TacticalPost[] = paginatedPosts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        thumbnail: post.thumbnail,
        author: {
          id: post.author.id,
          name: post.author.name,
          avatar: post.author.avatar,
        },
        formation: post.formation,
        league: post.league,
        team: post.team,
        tags: post.tags,
        upvotes: post.upvotes,
        comments: post.comments,
        views: post.views,
        createdAt: post.createdAt,
      }));

      return {
        posts,
        stats,
        filters,
        totalCount,
        page,
        perPage,
        availableFormations,
        availableLeagues,
        availableTags,
      };
    } catch (error) {
      console.error("Error in TacticsPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for tactics page
   */
  async generateMetadata() {
    return {
      title: "วิเคราะห์แทคติคฟุตบอล - Tactical Analysis | Soccer Tactics",
      description:
        "อ่านบทวิเคราะห์แทคติคฟุตบอลจากนักวิเคราะห์มืออาชีพ เรียนรู้รูปแบบการเล่น ฟอร์เมชั่น และกลยุทธ์ของทีมชั้นนำ",
      keywords:
        "แทคติคฟุตบอล, tactical analysis, formation, ฟอร์เมชั่น, กลยุทธ์, วิเคราะห์บอล",
      openGraph: {
        title: "วิเคราะห์แทคติคฟุตบอล | Soccer Tactics",
        description: "อ่านบทวิเคราะห์แทคติคจากนักวิเคราะห์มืออาชีพ",
        type: "website",
      },
    };
  }
}

/**
 * Factory for creating TacticsPresenter instances
 */
export class TacticsPresenterFactory {
  static createServer(): TacticsPresenter {
    return new TacticsPresenter();
  }

  static createClient(): TacticsPresenter {
    return new TacticsPresenter();
  }
}
