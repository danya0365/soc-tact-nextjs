/**
 * Custom hook for Explore presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  ExplorePresenter,
  ExplorePresenterFactory,
  type ExploreViewModel,
} from "./ExplorePresenter";

// State interface
export interface ExplorePresenterState {
  viewModel: ExploreViewModel | null;
  loading: boolean;
  error: string | null;
}

// Actions interface
export interface ExplorePresenterActions {
  refreshData: () => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Explore presenter
 */
export function useExplorePresenter(
  initialViewModel: ExploreViewModel | null = null
): [ExplorePresenterState, ExplorePresenterActions] {
  const [presenter] = useState<ExplorePresenter>(() =>
    ExplorePresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<ExploreViewModel | null>(
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
      console.error("Error loading explore data:", err);
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
  const state: ExplorePresenterState = {
    viewModel,
    loading,
    error,
  };

  // Actions object
  const actions: ExplorePresenterActions = {
    refreshData,
    setError,
  };

  return [state, actions];
}
