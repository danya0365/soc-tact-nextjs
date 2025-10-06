/**
 * Custom hook for Tactics presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  TacticsPresenter,
  TacticsPresenterFactory,
  type TacticsViewModel,
  type TacticsFilters,
} from "./TacticsPresenter";

// State interface
export interface TacticsPresenterState {
  viewModel: TacticsViewModel | null;
  loading: boolean;
  error: string | null;
  filters: TacticsFilters;
  currentPage: number;
}

// Actions interface
export interface TacticsPresenterActions {
  refreshData: () => Promise<void>;
  setFilters: (filters: TacticsFilters) => void;
  setCurrentPage: (page: number) => void;
  reset: () => void;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Tactics presenter
 */
export function useTacticsPresenter(
  initialViewModel: TacticsViewModel | null = null
): [TacticsPresenterState, TacticsPresenterActions] {
  const [presenter] = useState<TacticsPresenter>(() =>
    TacticsPresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<TacticsViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<TacticsFilters>(
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
        9
      );
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading tactics data:", err);
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
  const setFilters = useCallback((newFilters: TacticsFilters) => {
    setFiltersState(newFilters);
    setCurrentPageState(1); // Reset to first page when filters change
  }, []);

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
  const state: TacticsPresenterState = {
    viewModel,
    loading,
    error,
    filters,
    currentPage,
  };

  // Actions object
  const actions: TacticsPresenterActions = {
    refreshData,
    setFilters,
    setCurrentPage,
    reset,
    setError,
  };

  return [state, actions];
}
