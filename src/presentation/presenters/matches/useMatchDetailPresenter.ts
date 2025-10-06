/**
 * Custom hook for Match Detail presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  MatchDetailPresenter,
  MatchDetailPresenterFactory,
  type MatchDetailViewModel,
} from "./MatchDetailPresenter";

// State interface
export interface MatchDetailPresenterState {
  viewModel: MatchDetailViewModel | null;
  loading: boolean;
  error: string | null;
}

// Actions interface
export interface MatchDetailPresenterActions {
  refreshData: () => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Match Detail presenter
 */
export function useMatchDetailPresenter(
  matchId: string,
  initialViewModel: MatchDetailViewModel | null = null
): [MatchDetailPresenterState, MatchDetailPresenterActions] {
  const [presenter] = useState<MatchDetailPresenter>(() =>
    MatchDetailPresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<MatchDetailViewModel | null>(
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
      const newViewModel = await presenter.getViewModel(matchId);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading match detail:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter, matchId]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Load data on mount
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // State object
  const state: MatchDetailPresenterState = {
    viewModel,
    loading,
    error,
  };

  // Actions object
  const actions: MatchDetailPresenterActions = {
    refreshData,
    setError,
  };

  return [state, actions];
}
