/**
 * Custom hook for Matches presenter
 * Provides state management and actions for Matches operations
 */

import { useCallback, useEffect, useState } from "react";
import {
  MatchesPresenter,
  MatchesPresenterFactory,
  type MatchesViewModel,
  type MatchFilters,
} from "./MatchesPresenter";

// State interface
export interface MatchesPresenterState {
  viewModel: MatchesViewModel | null;
  loading: boolean;
  error: string | null;
  filters: MatchFilters;
  currentPage: number;
}

// Actions interface
export interface MatchesPresenterActions {
  refreshData: () => Promise<void>;
  setFilters: (filters: MatchFilters) => void;
  setCurrentPage: (page: number) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Matches presenter
 * Returns [state, actions] tuple following the established pattern
 */
export function useMatchesPresenter(
  initialViewModel: MatchesViewModel | null = null
): [MatchesPresenterState, MatchesPresenterActions] {
  const [presenter] = useState<MatchesPresenter>(() =>
    MatchesPresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<MatchesViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<MatchFilters>(
    initialViewModel?.filters || {}
  );
  const [currentPage, setCurrentPageState] = useState(
    initialViewModel?.page || 1
  );

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel(
        filters,
        currentPage,
        10
      );
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading matches data:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter, filters, currentPage]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Set filters and reload data
   */
  const setFilters = useCallback(
    (newFilters: MatchFilters) => {
      setFiltersState(newFilters);
      setCurrentPageState(1); // Reset to first page when filters change
    },
    []
  );

  /**
   * Set current page
   */
  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(page);
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setFiltersState({});
    setCurrentPageState(1);
    setViewModel(null);
  }, []);

  /**
   * Load data when filters or page changes
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  // State object
  const state: MatchesPresenterState = {
    viewModel,
    loading,
    error,
    filters,
    currentPage,
  };

  // Actions object
  const actions: MatchesPresenterActions = {
    refreshData,
    setFilters,
    setCurrentPage,
    reset,
    setError,
  };

  return [state, actions];
}
