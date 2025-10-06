/**
 * User Profile Presenter
 * Handles business logic for User Profile page
 */

import {
  getUserByUsername,
  getUserPosts,
  type MockUser,
  type MockUserPost,
} from "@/src/data/mock/users.mock";

// View Model interfaces
export interface UserProfileViewModel {
  user: MockUser | null;
  posts: MockUserPost[];
  isOwnProfile: boolean;
}

/**
 * Presenter for User Profile page
 */
export class UserProfilePresenter {
  /**
   * Get view model for user profile page
   */
  async getViewModel(
    username: string,
    currentUserId?: string
  ): Promise<UserProfileViewModel> {
    try {
      const user = getUserByUsername(username);
      const posts = user ? getUserPosts(user.id) : [];
      const isOwnProfile = user?.id === currentUserId;

      return {
        user: user || null,
        posts,
        isOwnProfile,
      };
    } catch (error) {
      console.error("Error in UserProfilePresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for user profile page
   */
  async generateMetadata(username: string) {
    try {
      const user = getUserByUsername(username);

      if (!user) {
        return {
          title: "ไม่พบผู้ใช้ | Soccer Tactics",
          description: "ไม่พบผู้ใช้ที่คุณต้องการ",
        };
      }

      return {
        title: `${user.displayName} (@${user.username}) | Soccer Tactics`,
        description: user.bio,
        keywords: `${user.displayName}, ${user.username}, นักวิเคราะห์, tactical analyst`,
        openGraph: {
          title: `${user.displayName} - Soccer Tactics`,
          description: user.bio,
          type: "profile",
        },
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      return {
        title: "โปรไฟล์ผู้ใช้ | Soccer Tactics",
        description: "ดูโปรไฟล์และบทวิเคราะห์ของนักวิเคราะห์",
      };
    }
  }

  /**
   * Follow user
   */
  async followUser(userId: string): Promise<boolean> {
    try {
      // In real implementation, this would call an API
      console.log("Following user:", userId);
      return true;
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  }

  /**
   * Unfollow user
   */
  async unfollowUser(userId: string): Promise<boolean> {
    try {
      // In real implementation, this would call an API
      console.log("Unfollowing user:", userId);
      return true;
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw error;
    }
  }
}

/**
 * Factory for creating UserProfilePresenter instances
 */
export class UserProfilePresenterFactory {
  static createServer(): UserProfilePresenter {
    return new UserProfilePresenter();
  }

  static createClient(): UserProfilePresenter {
    return new UserProfilePresenter();
  }
}
