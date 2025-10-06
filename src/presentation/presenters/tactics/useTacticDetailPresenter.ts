/**
 * Custom hook for Tactic Detail presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  TacticDetailPresenter,
  TacticDetailPresenterFactory,
  type TacticDetailViewModel,
} from "./TacticDetailPresenter";

// State interface
export interface TacticDetailPresenterState {
  viewModel: TacticDetailViewModel | null;
  loading: boolean;
  error: string | null;
}

// Actions interface
export interface TacticDetailPresenterActions {
  refreshData: () => Promise<void>;
  upvotePost: () => Promise<void>;
  addComment: (content: string) => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Tactic Detail presenter
 */
export function useTacticDetailPresenter(
  postId: string,
  initialViewModel: TacticDetailViewModel | null = null
): [TacticDetailPresenterState, TacticDetailPresenterActions] {
  const [presenter] = useState<TacticDetailPresenter>(() =>
    TacticDetailPresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<TacticDetailViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel(postId);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading tactic detail:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter, postId]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Upvote post
   */
  const upvotePost = useCallback(async () => {
    try {
      await presenter.upvotePost(postId);
      // Refresh data to get updated upvote count
      await loadData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหวต";
      setError(errorMessage);
      console.error("Error upvoting post:", err);
    }
  }, [presenter, postId, loadData]);

  /**
   * Add comment
   */
  const addComment = useCallback(
    async (content: string) => {
      try {
        await presenter.addComment(postId, content, "current-user");
        // Refresh data to get updated comments
        await loadData();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการแสดงความคิดเห็น";
        setError(errorMessage);
        console.error("Error adding comment:", err);
      }
    },
    [presenter, postId, loadData]
  );

  /**
   * Load data on mount if no initial data
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // State object
  const state: TacticDetailPresenterState = {
    viewModel,
    loading,
    error,
  };

  // Actions object
  const actions: TacticDetailPresenterActions = {
    refreshData,
    upvotePost,
    addComment,
    setError,
  };

  return [state, actions];
}
