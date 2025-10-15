import {
  getGroupById,
  getMemberById,
  MOCK_COMMUNITY_EVENTS,
  MOCK_COMMUNITY_MEMBERS,
  MOCK_COMMUNITY_POSTS,
  type CommunityEvent,
  type CommunityGroup,
  type CommunityMember,
  type CommunityPost,
} from "@/src/data/mock/community.mock";

import { getGroupTypeById } from "@/src/data/master/community-group-types.master";

// ============= INTERFACES =============

export interface GroupMember extends CommunityMember {
  role: "admin" | "moderator" | "member";
  joinedDate: string;
}

export interface GroupPost extends CommunityPost {
  author: CommunityMember;
}

export interface GroupEvent extends CommunityEvent {
  organizer: CommunityMember;
}

export interface GroupStats {
  totalMembers: number;
  totalPosts: number;
  totalEvents: number;
  postsToday: number;
  postsThisWeek: number;
  activeMembers: number;
}

export interface GroupDetailViewModel {
  group: CommunityGroup;
  groupType: ReturnType<typeof getGroupTypeById>;
  creator: CommunityMember;
  stats: GroupStats;
  members: GroupMember[];
  recentPosts: GroupPost[];
  upcomingEvents: GroupEvent[];
  topContributors: GroupMember[];
}

// ============= PRESENTER =============

/**
 * Presenter for Group Detail Page
 * Manages group info, members, posts, and events
 */
export class GroupDetailPresenter {
  /**
   * Get view model for a specific group
   */
  async getViewModel(groupId: string): Promise<GroupDetailViewModel> {
    try {
      // Get group
      const group = getGroupById(groupId);
      if (!group) {
        throw new Error(`Group not found: ${groupId}`);
      }

      // Get group type
      const groupType = getGroupTypeById(group.type);

      // Get creator
      const creator = getMemberById(group.createdBy);
      if (!creator) {
        throw new Error(`Creator not found: ${group.createdBy}`);
      }

      // Get all data in parallel
      const [stats, members, recentPosts, upcomingEvents, topContributors] =
        await Promise.all([
          this.getStats(groupId),
          this.getMembers(groupId),
          this.getRecentPosts(groupId),
          this.getUpcomingEvents(groupId),
          this.getTopContributors(groupId),
        ]);

      return {
        group,
        groupType,
        creator,
        stats,
        members,
        recentPosts,
        upcomingEvents,
        topContributors,
      };
    } catch (error) {
      console.error("Error fetching group detail:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for the page
   */
  async generateMetadata(groupId: string) {
    try {
      const group = getGroupById(groupId);
      if (!group) {
        return {
          title: "Group Not Found | Community",
          description: "The requested group could not be found",
        };
      }

      return {
        title: `${group.name} | Community Groups`,
        description: group.description,
        keywords: [...group.tags, "football", "soccer", "community", "group"],
        openGraph: {
          title: group.name,
          description: group.description,
          type: "website",
          images: [group.banner],
        },
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      return {
        title: "Community Group",
        description: "Join and engage with football fans",
      };
    }
  }

  /**
   * Get group statistics
   */
  async getStats(groupId: string): Promise<GroupStats> {
    try {
      const group = getGroupById(groupId);
      if (!group) {
        throw new Error(`Group not found: ${groupId}`);
      }

      // Calculate stats
      const groupPosts = MOCK_COMMUNITY_POSTS.filter(
        (post) => post.groupId === groupId
      );

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const postsToday = groupPosts.filter((post) => {
        const postDate = new Date(post.createdDate);
        return postDate >= today;
      }).length;

      const postsThisWeek = groupPosts.filter((post) => {
        const postDate = new Date(post.createdDate);
        return postDate >= weekAgo;
      }).length;

      return {
        totalMembers: group.stats.members,
        totalPosts: groupPosts.length,
        totalEvents: MOCK_COMMUNITY_EVENTS.filter((e) => e.groupId === groupId)
          .length,
        postsToday,
        postsThisWeek,
        activeMembers: Math.floor(group.stats.members * 0.3), // 30% active
      };
    } catch (error) {
      console.error("Error fetching group stats:", error);
      throw error;
    }
  }

  /**
   * Get group members
   */
  async getMembers(groupId: string): Promise<GroupMember[]> {
    try {
      // Get all members and assign roles
      // In real app, this would come from database with actual group membership
      console.log("Getting members for group:", groupId);
      return MOCK_COMMUNITY_MEMBERS.map((member, index) => ({
        ...member,
        role: index === 0 ? "admin" : index === 1 ? "moderator" : "member",
        joinedDate: member.joinedDate,
      }));
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  }

  /**
   * Get recent posts in the group
   */
  async getRecentPosts(groupId: string): Promise<GroupPost[]> {
    try {
      console.log("Getting recent posts for group:", groupId);
      const groupPosts = MOCK_COMMUNITY_POSTS.filter(
        (post) => post.groupId === groupId
      )
        .sort(
          (a, b) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        )
        .slice(0, 10); // Get latest 10 posts

      return groupPosts.map((post) => ({
        ...post,
        author: getMemberById(post.authorId)!,
      }));
    } catch (error) {
      console.error("Error fetching recent posts:", error);
      throw error;
    }
  }

  /**
   * Get upcoming events for the group
   */
  async getUpcomingEvents(groupId: string): Promise<GroupEvent[]> {
    try {
      const now = new Date();

      const groupEvents = MOCK_COMMUNITY_EVENTS.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          event.groupId === groupId &&
          eventDate > now &&
          event.status === "upcoming"
        );
      })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5); // Get next 5 events

      return groupEvents.map((event) => ({
        ...event,
        organizer: getMemberById(event.organizerId)!,
      }));
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  }

  /**
   * Get top contributors in the group
   */
  async getTopContributors(groupId: string): Promise<GroupMember[]> {
    try {
      // Get members who posted in this group
      const groupPosts = MOCK_COMMUNITY_POSTS.filter(
        (post) => post.groupId === groupId
      );

      // Count posts per member
      const postCounts: Record<string, number> = {};
      groupPosts.forEach((post) => {
        postCounts[post.authorId] = (postCounts[post.authorId] || 0) + 1;
      });

      // Sort members by post count
      const topMembers = MOCK_COMMUNITY_MEMBERS.filter(
        (member) => postCounts[member.id]
      )
        .sort((a, b) => postCounts[b.id] - postCounts[a.id])
        .slice(0, 5)
        .map((member) => ({
          ...member,
          role: "member" as const,
          joinedDate: member.joinedDate,
        }));

      return topMembers;
    } catch (error) {
      console.error("Error fetching top contributors:", error);
      throw error;
    }
  }

  // ============= CRUD OPERATIONS (for future implementation) =============

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
   * Leave a group
   */
  async leaveGroup(groupId: string): Promise<boolean> {
    try {
      // TODO: Implement with Supabase
      console.log("Leaving group:", groupId);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error leaving group:", error);
      throw error;
    }
  }

  /**
   * Create a post in the group
   */
  async createPost(
    groupId: string,
    data: Partial<CommunityPost>
  ): Promise<CommunityPost> {
    try {
      // TODO: Implement with Supabase
      console.log("Creating post in group:", groupId, data);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  /**
   * Invite member to group
   */
  async inviteMember(groupId: string, memberId: string): Promise<boolean> {
    try {
      // TODO: Implement with Supabase
      console.log("Inviting member to group:", groupId, memberId);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error inviting member:", error);
      throw error;
    }
  }

  /**
   * Update group settings
   */
  async updateGroup(
    groupId: string,
    data: Partial<CommunityGroup>
  ): Promise<CommunityGroup> {
    try {
      // TODO: Implement with Supabase
      console.log("Updating group:", groupId, data);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error updating group:", error);
      throw error;
    }
  }
}

// ============= FACTORY =============

/**
 * Factory for creating GroupDetailPresenter instances
 */
export class GroupDetailPresenterFactory {
  static async createServer(): Promise<GroupDetailPresenter> {
    return new GroupDetailPresenter();
  }

  static createClient(): GroupDetailPresenter {
    return new GroupDetailPresenter();
  }
}
