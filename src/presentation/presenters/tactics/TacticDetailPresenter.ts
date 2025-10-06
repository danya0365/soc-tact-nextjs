/**
 * Tactic Detail Presenter
 * Handles business logic for Tactical Post detail page
 */

import {
  getTacticalPostById,
  getTacticalPostBySlug,
  getCommentsByPostId,
  mockTacticalPosts,
  type MockTacticalPost,
  type MockComment,
} from "@/src/data/mock/tactics.mock";

// View Model interfaces
export interface TacticDetailViewModel {
  post: MockTacticalPost | null;
  comments: MockComment[];
  relatedPosts: MockTacticalPost[];
}

/**
 * Presenter for Tactic Detail page
 */
export class TacticDetailPresenter {
  /**
   * Get view model for tactic detail page
   */
  async getViewModel(postId: string): Promise<TacticDetailViewModel> {
    try {
      const post = getTacticalPostById(postId);
      const comments = post ? getCommentsByPostId(postId) : [];

      // Get related posts (same formation or same team)
      const relatedPosts = post
        ? mockTacticalPosts
            .filter(
              (p) =>
                p.id !== post.id &&
                (p.formation === post.formation || p.team === post.team)
            )
            .slice(0, 3)
        : [];

      return {
        post: post || null,
        comments,
        relatedPosts,
      };
    } catch (error) {
      console.error("Error in TacticDetailPresenter.getViewModel:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for tactic detail page
   */
  async generateMetadata(postId: string) {
    try {
      const post = getTacticalPostById(postId);

      if (!post) {
        return {
          title: "ไม่พบบทความ | Soccer Tactics",
          description: "ไม่พบบทความที่คุณต้องการ",
        };
      }

      return {
        title: `${post.title} | Soccer Tactics`,
        description: post.excerpt,
        keywords: `${post.formation}, ${post.league}, ${post.tags.join(", ")}, แทคติคฟุตบอล`,
        openGraph: {
          title: post.title,
          description: post.excerpt,
          type: "article",
        },
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      return {
        title: "วิเคราะห์แทคติคฟุตบอล | Soccer Tactics",
        description: "อ่านบทวิเคราะห์แทคติคฟุตบอล",
      };
    }
  }

  /**
   * Upvote a post
   */
  async upvotePost(postId: string): Promise<boolean> {
    try {
      // In real implementation, this would call an API
      console.log("Upvote post:", postId);
      return true;
    } catch (error) {
      console.error("Error upvoting post:", error);
      throw error;
    }
  }

  /**
   * Add a comment
   */
  async addComment(
    postId: string,
    content: string,
    authorId: string
  ): Promise<MockComment> {
    try {
      // In real implementation, this would call an API
      const newComment: MockComment = {
        id: `comment-${Date.now()}`,
        postId,
        author: {
          id: authorId,
          name: "Current User",
          avatar: "👤",
        },
        content,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date().toISOString(),
      };
      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }
}

/**
 * Factory for creating TacticDetailPresenter instances
 */
export class TacticDetailPresenterFactory {
  static createServer(): TacticDetailPresenter {
    return new TacticDetailPresenter();
  }

  static createClient(): TacticDetailPresenter {
    return new TacticDetailPresenter();
  }
}
