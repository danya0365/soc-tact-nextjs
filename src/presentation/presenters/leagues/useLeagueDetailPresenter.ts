/**
 * Custom hook for League Detail presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  LeagueDetailPresenter,
  LeagueDetailPresenterFactory,
  type LeagueDetailViewModel,
} from "./LeagueDetailPresenter";

// State interface
export interface LeagueDetailPresenterState {
  viewModel: LeagueDetailViewModel | null;
  loading: boolean;
  error: string | null;
  filter: "overall" | "home" | "away";
}

// Actions interface
export interface LeagueDetailPresenterActions {
  refreshData: () => Promise<void>;
  setFilter: (filter: "overall" | "home" | "away") => void;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for League Detail presenter
 */
export function useLeagueDetailPresenter(
  leagueId: string,
  initialViewModel: LeagueDetailViewModel | null = null
): [LeagueDetailPresenterState, LeagueDetailPresenterActions] {
  const [presenter] = useState<LeagueDetailPresenter>(() =>
    LeagueDetailPresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<LeagueDetailViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<"overall" | "home" | "away">(
    initialViewModel?.filter || "overall"
  );

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel(leagueId, filter);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading league detail:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter, leagueId, filter]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Set filter and reload data
   */
  const setFilter = useCallback((newFilter: "overall" | "home" | "away") => {
    setFilterState(newFilter);
  }, []);

  /**
   * Load data when filter changes
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  // State object
  const state: LeagueDetailPresenterState = {
    viewModel,
    loading,
    error,
    filter,
  };

  // Actions object
  const actions: LeagueDetailPresenterActions = {
    refreshData,
    setFilter,
    setError,
  };

  return [state, actions];
}
