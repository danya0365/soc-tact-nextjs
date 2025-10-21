/**
 * Custom hook for League Detail presenter
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFootballDataPresenter } from "../../hooks/useFootballDataPresenter";
import {
  buildLeagueDetailViewModel,
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
  const [viewModel, setViewModel] = useState<LeagueDetailViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<"overall" | "home" | "away">(
    initialViewModel?.filter || "overall"
  );

  const { fetchLeagueOverview, fetchMatchesByLeague } =
    useFootballDataPresenter();
  const leagueIdNumber = useMemo(
    () => Number.parseInt(leagueId, 10),
    [leagueId]
  );

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (Number.isNaN(leagueIdNumber)) {
        throw new Error("รหัสลีกไม่ถูกต้อง");
      }

      const [overview, matches] = await Promise.all([
        fetchLeagueOverview(leagueIdNumber),
        fetchMatchesByLeague(leagueIdNumber),
      ]);

      const newViewModel = buildLeagueDetailViewModel(
        overview,
        matches,
        filter
      );
      setViewModel(newViewModel);
    } catch (err) {
      console.error("Error loading league detail:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchLeagueOverview, fetchMatchesByLeague, filter, leagueIdNumber]);

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
    //loadData();
  }, []);

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
