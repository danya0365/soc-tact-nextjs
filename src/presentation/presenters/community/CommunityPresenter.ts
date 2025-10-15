// Import mock data
import {
  getGroupById,
  getMemberById,
  MOCK_COMMUNITY_EVENTS,
  MOCK_COMMUNITY_GROUPS,
  MOCK_COMMUNITY_MEMBERS,
  MOCK_COMMUNITY_POSTS,
  MOCK_DISCUSSIONS,
  MOCK_POLLS,
  type CommunityEvent,
  type CommunityGroup,
  type CommunityMember,
  type CommunityPost,
  type Discussion,
  type Poll,
} from "@/src/data/mock/community.mock";

import { COMMUNITY_BADGES } from "@/src/data/master/community-badges.master";
import { COMMUNITY_CATEGORIES } from "@/src/data/master/community-categories.master";
import { GROUP_TYPES } from "@/src/data/master/community-group-types.master";

// ============= INTERFACES =============

export interface CommunityStats {
  totalMembers: number;
  totalGroups: number;
  totalPosts: number;
  totalEvents: number;
  activeToday: number;
  postsToday: number;
}

export interface TopMember {
  member: CommunityMember;
  rank: number;
}

export interface TrendingPost extends CommunityPost {
  author: CommunityMember;
  group?: CommunityGroup;
}

export interface UpcomingEvent extends CommunityEvent {
  organizer: CommunityMember;
  group?: CommunityGroup;
}

export interface ActiveDiscussion extends Discussion {
  author: CommunityMember;
  group?: CommunityGroup;
}

export interface CommunityViewModel {
  stats: CommunityStats;
  featuredPosts: TrendingPost[];
  popularGroups: CommunityGroup[];
  topMembers: TopMember[];
  upcomingEvents: UpcomingEvent[];
  activePolls: Poll[];
  trendingDiscussions: ActiveDiscussion[];
  categories: typeof COMMUNITY_CATEGORIES;
  badges: typeof COMMUNITY_BADGES;
  groupTypes: typeof GROUP_TYPES;
}

// ============= PRESENTER =============

/**
 * Presenter for Community Hub
 * Manages community feed, groups, events, and interactions
 */
export class CommunityPresenter {
  /**
   * Get view model for the community page
   */
  async getViewModel(): Promise<CommunityViewModel> {
    try {
      // Get all data in parallel
      const [
        stats,
        featuredPosts,
        popularGroups,
        topMembers,
        upcomingEvents,
        activePolls,
        trendingDiscussions,
      ] = await Promise.all([
        this.getStats(),
        this.getFeaturedPosts(),
        this.getPopularGroups(),
        this.getTopMembers(),
        this.getUpcomingEvents(),
        this.getActivePolls(),
        this.getTrendingDiscussions(),
      ]);

      return {
        stats,
        featuredPosts,
        popularGroups,
        topMembers,
        upcomingEvents,
        activePolls,
        trendingDiscussions,
        categories: COMMUNITY_CATEGORIES,
        badges: COMMUNITY_BADGES,
        groupTypes: GROUP_TYPES,
      };
    } catch (error) {
      console.error("Error fetching community data:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for the page
   */
  async generateMetadata() {
    try {
      const stats = await this.getStats();

      return {
        title: "Community Hub | Soccer Tactics - ชุมชนคอมมูนิตี้ฟุตบอล",
        description: `Join our football community with ${stats.totalMembers}+ members, ${stats.totalGroups}+ groups, and ${stats.totalPosts}+ discussions. Share tactics, discuss matches, and connect with fans worldwide.`,
        keywords: [
          "football community",
          "soccer forum",
          "tactical discussions",
          "fan groups",
          "football polls",
          "match discussions",
        ],
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      return {
        title: "Community Hub | Soccer Tactics",
        description:
          "Join our football community and connect with fans worldwide",
      };
    }
  }

  /**
   * Get community statistics
   */
  async getStats(): Promise<CommunityStats> {
    try {
      // Calculate from mock data
      return {
        totalMembers: MOCK_COMMUNITY_MEMBERS.length,
        totalGroups: MOCK_COMMUNITY_GROUPS.length,
        totalPosts: MOCK_COMMUNITY_POSTS.length,
        totalEvents: MOCK_COMMUNITY_EVENTS.length,
        activeToday: Math.floor(MOCK_COMMUNITY_MEMBERS.length * 0.3), // 30% active today
        postsToday: MOCK_COMMUNITY_POSTS.filter((post) => {
          const today = new Date().toISOString().split("T")[0];
          return post.createdDate.startsWith(today);
        }).length,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  }

  /**
   * Get featured/trending posts
   */
  async getFeaturedPosts(): Promise<TrendingPost[]> {
    try {
      // Sort by upvotes and views
      const sortedPosts = [...MOCK_COMMUNITY_POSTS].sort(
        (a, b) =>
          b.stats.upvotes + b.stats.views - (a.stats.upvotes + a.stats.views)
      );

      // Get top 6 posts
      return sortedPosts.slice(0, 6).map((post) => ({
        ...post,
        author: getMemberById(post.authorId)!,
        group: post.groupId ? getGroupById(post.groupId) : undefined,
      }));
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      throw error;
    }
  }

  /**
   * Get popular groups
   */
  async getPopularGroups(): Promise<CommunityGroup[]> {
    try {
      // Sort by member count
      return [...MOCK_COMMUNITY_GROUPS]
        .sort((a, b) => b.stats.members - a.stats.members)
        .slice(0, 6);
    } catch (error) {
      console.error("Error fetching popular groups:", error);
      throw error;
    }
  }

  /**
   * Get top members by reputation
   */
  async getTopMembers(): Promise<TopMember[]> {
    try {
      const sortedMembers = [...MOCK_COMMUNITY_MEMBERS].sort(
        (a, b) => b.reputation - a.reputation
      );

      return sortedMembers.slice(0, 10).map((member, index) => ({
        member,
        rank: index + 1,
      }));
    } catch (error) {
      console.error("Error fetching top members:", error);
      throw error;
    }
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(): Promise<UpcomingEvent[]> {
    try {
      const now = new Date();

      const upcomingEvents = MOCK_COMMUNITY_EVENTS.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate > now && event.status === "upcoming";
      }).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return upcomingEvents.slice(0, 4).map((event) => ({
        ...event,
        organizer: getMemberById(event.organizerId)!,
        group: event.groupId ? getGroupById(event.groupId) : undefined,
      }));
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  }

  /**
   * Get active polls
   */
  async getActivePolls(): Promise<Poll[]> {
    try {
      const now = new Date();

      return MOCK_POLLS.filter((poll) => {
        const endDate = new Date(poll.endDate);
        return endDate > now;
      }).slice(0, 3);
    } catch (error) {
      console.error("Error fetching active polls:", error);
      throw error;
    }
  }

  /**
   * Get trending discussions
   */
  async getTrendingDiscussions(): Promise<ActiveDiscussion[]> {
    try {
      // Sort by recent activity and replies
      const sortedDiscussions = [...MOCK_DISCUSSIONS].sort((a, b) => {
        const scoreA = a.stats.replies * 2 + a.stats.views;
        const scoreB = b.stats.replies * 2 + b.stats.views;
        return scoreB - scoreA;
      });

      return sortedDiscussions.slice(0, 5).map((discussion) => ({
        ...discussion,
        author: getMemberById(discussion.authorId)!,
        group: discussion.groupId
          ? getGroupById(discussion.groupId)
          : undefined,
      }));
    } catch (error) {
      console.error("Error fetching trending discussions:", error);
      throw error;
    }
  }

  // ============= CRUD OPERATIONS (for future implementation) =============

  /**
   * Create a new post
   */
  async createPost(data: Partial<CommunityPost>): Promise<CommunityPost> {
    try {
      // TODO: Implement with Supabase
      console.log("Creating post:", data);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  /**
   * Join a group
   */
  async joinGroup(groupId: string): Promise<boolean> {
    try {
      // TODO: Implement with Supabase
      console.log("Joining group:", groupId);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error joining group:", error);
      throw error;
    }
  }

  /**
   * Vote on a poll
   */
  async votePoll(pollId: string, optionId: string): Promise<Poll> {
    try {
      // TODO: Implement with Supabase
      console.log("Voting on poll:", pollId, optionId);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error voting on poll:", error);
      throw error;
    }
  }

  /**
   * RSVP to an event
   */
  async rsvpEvent(eventId: string): Promise<boolean> {
    try {
      // TODO: Implement with Supabase
      console.log("RSVP to event:", eventId);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error RSVP to event:", error);
      throw error;
    }
  }
}

// ============= FACTORY =============

/**
 * Factory for creating CommunityPresenter instances
 */
export class CommunityPresenterFactory {
  static async createServer(): Promise<CommunityPresenter> {
    return new CommunityPresenter();
  }

  static createClient(): CommunityPresenter {
    return new CommunityPresenter();
  }
}
