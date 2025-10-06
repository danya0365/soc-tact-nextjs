/**
 * Explore Presenter
 * Handles business logic for Explore/Discovery page
 */

import { mockTacticalPosts } from "@/src/data/mock/tactics.mock";
import { mockUsers } from "@/src/data/mock/users.mock";
import { mockLeagues } from "@/src/data/mock/leagues.mock";

// View Model interfaces
export interface TrendingPost {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  formation: string;
  upvotes: number;
  views: number;
  author: {
    name: string;
    avatar: string;
  };
}

export interface FeaturedAnalyst {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  stats: {
    posts: number;
    upvotes: number;
    followers: number;
  };
}

export interface PopularFormation {
  formation: string;
  count: number;
  icon: string;
}

export interface LeagueHighlight {
  id: string;
  name: string;
  logo: string;
  country: string;
}

export interface ExploreViewModel {
  trendingPosts: TrendingPost[];
  featuredAnalysts: FeaturedAnalyst[];
  popularFormations: PopularFormation[];
  leagueHighlights: LeagueHighlight[];
  hotTopics: string[];
}

/**
 * Presenter for Explore page
 */
export class ExplorePresenter {
  /**
   * Get view model for explore page
   */
  async getViewModel(): Promise<ExploreViewModel> {
    try {
      // Get trending posts (sorted by views)
      const trendingPosts = [...mockTacticalPosts]
        .sort((a, b) => b.views - a.views)
        .slice(0, 6)
        .map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          thumbnail: post.thumbnail,
          formation: post.formation,
          upvotes: post.upvotes,
          views: post.views,
          author: {
            name: post.author.name,
            avatar: post.author.avatar,
          },
        }));

      // Get featured analysts (sorted by upvotes)
      const featuredAnalysts = Object.values(mockUsers)
        .sort((a, b) => b.stats.upvotes - a.stats.upvotes)
        .slice(0, 4)
        .map((user) => ({
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          stats: user.stats,
        }));

      // Get popular formations
      const formationCounts = mockTacticalPosts.reduce(
        (acc, post) => {
          const formation = post.formation.split("→")[0].trim(); // Get base formation
          acc[formation] = (acc[formation] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const popularFormations = Object.entries(formationCounts)
        .map(([formation, count]) => ({
          formation,
          count,
          icon: "⚽",
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      // Get league highlights
      const leagueHighlights = mockLeagues.slice(0, 6).map((league) => ({
        id: league.id,
        name: league.name,
        logo: league.logo,
        country: league.country,
      }));

      // Get hot topics (most used tags)
      const allTags = mockTacticalPosts.flatMap((post) => post.tags);
      const tagCounts = allTags.reduce(
        (acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const hotTopics = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag]) => tag);

      return {
        trendingPosts,
        featuredAnalysts,
        popularFormations,
        leagueHighlights,
        hotTopics,
      };
    } catch (error) {
      console.error("Error in ExplorePresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for explore page
   */
  async generateMetadata() {
    return {
      title: "สำรวจ - Explore | Soccer Tactics",
      description:
        "สำรวจบทวิเคราะห์แทคติคยอดนิยม นักวิเคราะห์แนะนำ และหัวข้อที่กำลังฮิต",
      keywords:
        "สำรวจ, explore, trending, popular, นักวิเคราะห์, formations",
      openGraph: {
        title: "สำรวจ | Soccer Tactics",
        description: "ค้นพบบทวิเคราะห์และนักวิเคราะห์ยอดนิยม",
        type: "website",
      },
    };
  }
}

/**
 * Factory for creating ExplorePresenter instances
 */
export class ExplorePresenterFactory {
  static createServer(): ExplorePresenter {
    return new ExplorePresenter();
  }

  static createClient(): ExplorePresenter {
    return new ExplorePresenter();
  }
}
