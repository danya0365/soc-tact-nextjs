"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PostDetailPresenterFactory,
  type PostDetailViewModel,
} from "./PostDetailPresenter";

// Initialize presenter instance once (singleton pattern)
const presenter = PostDetailPresenterFactory.createClient();

export interface PostDetailPresenterState {
  viewModel: PostDetailViewModel | null;
  loading: boolean;
  error: string | null;
  isCommentFormOpen: boolean;
  replyToCommentId: string | null;
  isShareModalOpen: boolean;
  isReportModalOpen: boolean;
  commentSortBy: "newest" | "oldest" | "popular";
}

export interface PostDetailPresenterActions {
  loadData: (postId: string) => Promise<void>;
  addComment: (content: string, parentId?: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  voteComment: (commentId: string, voteType: "up" | "down") => Promise<void>;
  votePost: (voteType: "up" | "down") => Promise<void>;
  sharePost: () => Promise<void>;
  bookmarkPost: () => Promise<void>;
  reportContent: (
    contentId: string,
    contentType: "post" | "comment",
    reason: string
  ) => Promise<void>;
  openCommentForm: () => void;
  closeCommentForm: () => void;
  setReplyTo: (commentId: string | null) => void;
  openShareModal: () => void;
  closeShareModal: () => void;
  openReportModal: () => void;
  closeReportModal: () => void;
  setSortBy: (sortBy: PostDetailPresenterState["commentSortBy"]) => void;
  setError: (error: string | null) => void;
  refreshData: (postId: string) => Promise<void>;
}

/**
 * Custom hook for Post Detail presenter
 * Provides state management and actions for Post Detail operations
 */
export function usePostDetailPresenter(
  postId: string,
  initialViewModel?: PostDetailViewModel
): [PostDetailPresenterState, PostDetailPresenterActions] {
  const [viewModel, setViewModel] = useState<PostDetailViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [commentSortBy, setCommentSortBy] =
    useState<PostDetailPresenterState["commentSortBy"]>("popular");

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async (postId: string) => {
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel(postId);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading post detail:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a new comment
   */
  const addComment = useCallback(
    async (content: string, parentId?: string) => {
      if (!viewModel) return;

      setLoading(true);
      setError(null);

      try {
        await presenter.addComment(viewModel.post.id, content, parentId);
        setIsCommentFormOpen(false);
        setReplyToCommentId(null);
        await loadData(viewModel.post.id); // Refresh data
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error adding comment:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [viewModel, loadData]
  );

  /**
   * Update an existing comment
   */
  const updateComment = useCallback(
    async (commentId: string, content: string) => {
      if (!viewModel) return;

      setLoading(true);
      setError(null);

      try {
        await presenter.updateComment(commentId, content);
        await loadData(viewModel.post.id); // Refresh data
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error updating comment:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [viewModel, loadData]
  );

  /**
   * Delete a comment
   */
  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!viewModel) return;

      setLoading(true);
      setError(null);

      try {
        await presenter.deleteComment(commentId);
        await loadData(viewModel.post.id); // Refresh data
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error deleting comment:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [viewModel, loadData]
  );

  /**
   * Vote on a comment
   */
  const voteComment = useCallback(
    async (commentId: string, voteType: "up" | "down") => {
      if (!viewModel) return;

      setLoading(true);
      setError(null);

      try {
        await presenter.voteComment(commentId, voteType);
        await loadData(viewModel.post.id); // Refresh data
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error voting on comment:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [viewModel, loadData]
  );

  /**
   * Vote on the post
   */
  const votePost = useCallback(
    async (voteType: "up" | "down") => {
      if (!viewModel) return;

      setLoading(true);
      setError(null);

      try {
        await presenter.votePost(viewModel.post.id, voteType);
        await loadData(viewModel.post.id); // Refresh data
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error voting on post:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [viewModel, loadData]
  );

  /**
   * Share the post
   */
  const sharePost = useCallback(async () => {
    if (!viewModel) return;

    setError(null);

    try {
      await presenter.sharePost(viewModel.post.id);
      setIsShareModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error sharing post:", err);
      throw err;
    }
  }, [viewModel]);

  /**
   * Bookmark the post
   */
  const bookmarkPost = useCallback(async () => {
    if (!viewModel) return;

    setError(null);

    try {
      await presenter.bookmarkPost(viewModel.post.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error bookmarking post:", err);
      throw err;
    }
  }, [viewModel]);

  /**
   * Report content
   */
  const reportContent = useCallback(
    async (
      contentId: string,
      contentType: "post" | "comment",
      reason: string
    ) => {
      setError(null);

      try {
        await presenter.reportContent(contentId, contentType, reason);
        setIsReportModalOpen(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error reporting content:", err);
        throw err;
      }
    },
    []
  );

  /**
   * Refresh data
   */
  const refreshData = useCallback(
    async (postId: string) => {
      await loadData(postId);
    },
    [loadData]
  );

  // Modal/Form actions
  const openCommentForm = useCallback(() => {
    setIsCommentFormOpen(true);
    setError(null);
  }, []);

  const closeCommentForm = useCallback(() => {
    setIsCommentFormOpen(false);
    setReplyToCommentId(null);
    setError(null);
  }, []);

  const setReplyTo = useCallback((commentId: string | null) => {
    setReplyToCommentId(commentId);
    if (commentId) {
      setIsCommentFormOpen(true);
    }
  }, []);

  const openShareModal = useCallback(() => {
    setIsShareModalOpen(true);
    setError(null);
  }, []);

  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false);
    setError(null);
  }, []);

  const openReportModal = useCallback(() => {
    setIsReportModalOpen(true);
    setError(null);
  }, []);

  const closeReportModal = useCallback(() => {
    setIsReportModalOpen(false);
    setError(null);
  }, []);

  const setSortBy = useCallback(
    (sortBy: PostDetailPresenterState["commentSortBy"]) => {
      setCommentSortBy(sortBy);
    },
    []
  );

  // Load data on mount if no initial data
  useEffect(() => {
    if (!initialViewModel) {
      loadData(postId);
    }
  }, [postId, initialViewModel, loadData]);

  return [
    {
      viewModel,
      loading,
      error,
      isCommentFormOpen,
      replyToCommentId,
      isShareModalOpen,
      isReportModalOpen,
      commentSortBy,
    },
    {
      loadData,
      addComment,
      updateComment,
      deleteComment,
      voteComment,
      votePost,
      sharePost,
      bookmarkPost,
      reportContent,
      openCommentForm,
      closeCommentForm,
      setReplyTo,
      openShareModal,
      closeShareModal,
      openReportModal,
      closeReportModal,
      setSortBy,
      setError,
      refreshData,
    },
  ];
}
