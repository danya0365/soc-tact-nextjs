import {
  getCommentsByPostId,
  getGroupById,
  getMemberById,
  getPostById,
  MOCK_COMMUNITY_POSTS,
  type Comment,
  type CommunityGroup,
  type CommunityMember,
  type CommunityPost,
} from "@/src/data/mock/community.mock";

import { getCategoryById } from "@/src/data/master/community-categories.master";

// ============= INTERFACES =============

export interface CommentWithAuthor extends Comment {
  author: CommunityMember;
  replies?: CommentWithAuthor[];
}

export interface PostDetailViewModel {
  post: CommunityPost;
  author: CommunityMember;
  group?: CommunityGroup;
  category: ReturnType<typeof getCategoryById>;
  comments: CommentWithAuthor[];
  relatedPosts: Array<{
    post: CommunityPost;
    author: CommunityMember;
  }>;
  stats: {
    totalComments: number;
    totalTopLevelComments: number;
    totalReplies: number;
  };
}

// ============= PRESENTER =============

/**
 * Presenter for Post Detail Page
 * Manages post content, comments, and interactions
 */
export class PostDetailPresenter {
  /**
   * Get view model for a specific post
   */
  async getViewModel(postId: string): Promise<PostDetailViewModel> {
    try {
      // Get post
      const post = getPostById(postId);
      if (!post) {
        throw new Error(`Post not found: ${postId}`);
      }

      // Get author
      const author = getMemberById(post.authorId);
      if (!author) {
        throw new Error(`Author not found: ${post.authorId}`);
      }

      // Get group (if exists)
      const group = post.groupId ? getGroupById(post.groupId) : undefined;

      // Get category
      const category = getCategoryById(post.category);

      // Get comments with nested replies
      const comments = await this.getCommentsWithReplies(postId);

      // Get related posts
      const relatedPosts = await this.getRelatedPosts(post);

      // Calculate stats
      const allComments = getCommentsByPostId(postId);
      const topLevelComments = allComments.filter((c) => !c.parentId);
      const replies = allComments.filter((c) => c.parentId);

      return {
        post,
        author,
        group,
        category,
        comments,
        relatedPosts,
        stats: {
          totalComments: allComments.length,
          totalTopLevelComments: topLevelComments.length,
          totalReplies: replies.length,
        },
      };
    } catch (error) {
      console.error("Error fetching post detail:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for the page
   */
  async generateMetadata(postId: string) {
    try {
      const post = getPostById(postId);
      if (!post) {
        return {
          title: "Post Not Found | Community",
          description: "The requested post could not be found",
        };
      }

      const author = getMemberById(post.authorId);

      return {
        title: `${post.title} | Community`,
        description: post.content.substring(0, 160),
        keywords: [...post.tags, "football", "soccer", "community"],
        authors: author ? [{ name: author.displayName }] : [],
        openGraph: {
          title: post.title,
          description: post.content.substring(0, 160),
          type: "article",
          images: post.media || [],
        },
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      return {
        title: "Community Post",
        description: "Read and discuss football topics",
      };
    }
  }

  /**
   * Get comments with nested replies
   */
  async getCommentsWithReplies(
    postId: string
  ): Promise<CommentWithAuthor[]> {
    try {
      const allComments = getCommentsByPostId(postId);

      // Get only top-level comments (no parent)
      const topLevelComments = allComments.filter((c) => !c.parentId);

      // Map comments with author and replies
      return topLevelComments.map((comment) => {
        const author = getMemberById(comment.authorId)!;
        const replies = this.getNestedReplies(comment.id, allComments);

        return {
          ...comment,
          author,
          replies,
        };
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  }

  /**
   * Get nested replies for a comment
   */
  private getNestedReplies(
    commentId: string,
    allComments: Comment[]
  ): CommentWithAuthor[] {
    const replies = allComments.filter((c) => c.parentId === commentId);

    return replies.map((reply) => {
      const author = getMemberById(reply.authorId)!;
      const nestedReplies = this.getNestedReplies(reply.id, allComments);

      return {
        ...reply,
        author,
        replies: nestedReplies.length > 0 ? nestedReplies : undefined,
      };
    });
  }

  /**
   * Get related posts based on tags and category
   */
  async getRelatedPosts(
    currentPost: CommunityPost
  ): Promise<Array<{ post: CommunityPost; author: CommunityMember }>> {
    try {
      // Find posts with similar tags or same category
      const relatedPosts = MOCK_COMMUNITY_POSTS.filter((post) => {
        if (post.id === currentPost.id) return false;

        // Check if same category
        if (post.category === currentPost.category) return true;

        // Check if has common tags
        const hasCommonTag = post.tags.some((tag) =>
          currentPost.tags.includes(tag)
        );
        return hasCommonTag;
      })
        .slice(0, 3) // Take only 3 related posts
        .map((post) => ({
          post,
          author: getMemberById(post.authorId)!,
        }));

      return relatedPosts;
    } catch (error) {
      console.error("Error fetching related posts:", error);
      return [];
    }
  }

  // ============= CRUD OPERATIONS (for future implementation) =============

  /**
   * Add a comment to a post
   */
  async addComment(
    postId: string,
    content: string,
    parentId?: string
  ): Promise<Comment> {
    try {
      // TODO: Implement with Supabase
      console.log("Adding comment:", { postId, content, parentId });
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }

  /**
   * Update a comment
   */
  async updateComment(commentId: string, content: string): Promise<Comment> {
    try {
      // TODO: Implement with Supabase
      console.log("Updating comment:", { commentId, content });
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<boolean> {
    try {
      // TODO: Implement with Supabase
      console.log("Deleting comment:", commentId);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }

  /**
   * Vote on a comment
   */
  async voteComment(
    commentId: string,
    voteType: "up" | "down"
  ): Promise<Comment> {
    try {
      // TODO: Implement with Supabase
      console.log("Voting on comment:", { commentId, voteType });
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error voting on comment:", error);
      throw error;
    }
  }

  /**
   * Vote on a post
   */
  async votePost(
    postId: string,
    voteType: "up" | "down"
  ): Promise<CommunityPost> {
    try {
      // TODO: Implement with Supabase
      console.log("Voting on post:", { postId, voteType });
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error voting on post:", error);
      throw error;
    }
  }

  /**
   * Share a post
   */
  async sharePost(postId: string): Promise<boolean> {
    try {
      // TODO: Implement with Supabase
      console.log("Sharing post:", postId);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error sharing post:", error);
      throw error;
    }
  }

  /**
   * Bookmark a post
   */
  async bookmarkPost(postId: string): Promise<boolean> {
    try {
      // TODO: Implement with Supabase
      console.log("Bookmarking post:", postId);
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error bookmarking post:", error);
      throw error;
    }
  }

  /**
   * Report a post or comment
   */
  async reportContent(
    contentId: string,
    contentType: "post" | "comment",
    reason: string
  ): Promise<boolean> {
    try {
      // TODO: Implement with Supabase
      console.log("Reporting content:", { contentId, contentType, reason });
      throw new Error("Not implemented yet");
    } catch (error) {
      console.error("Error reporting content:", error);
      throw error;
    }
  }
}

// ============= FACTORY =============

/**
 * Factory for creating PostDetailPresenter instances
 */
export class PostDetailPresenterFactory {
  static async createServer(): Promise<PostDetailPresenter> {
    return new PostDetailPresenter();
  }

  static createClient(): PostDetailPresenter {
    return new PostDetailPresenter();
  }
}
