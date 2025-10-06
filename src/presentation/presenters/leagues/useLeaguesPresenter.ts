/**
 * Custom hook for Leagues presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  LeaguesPresenter,
  LeaguesPresenterFactory,
  type LeaguesViewModel,
} from "./LeaguesPresenter";

// State interface
export interface LeaguesPresenterState {
  viewModel: LeaguesViewModel | null;
  loading: boolean;
  error: string | null;
}

// Actions interface
export interface LeaguesPresenterActions {
  refreshData: () => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Leagues presenter
 */
export function useLeaguesPresenter(
  initialViewModel: LeaguesViewModel | null = null
): [LeaguesPresenterState, LeaguesPresenterActions] {
  const [presenter] = useState<LeaguesPresenter>(() =>
    LeaguesPresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<LeaguesViewModel | null>(
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
      const newViewModel = await presenter.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading leagues data:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Load data on mount if no initial data
   */
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  // State object
  const state: LeaguesPresenterState = {
    viewModel,
    loading,
    error,
  };

  // Actions object
  const actions: LeaguesPresenterActions = {
    refreshData,
    setError,
  };

  return [state, actions];
}
