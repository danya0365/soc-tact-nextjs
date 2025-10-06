/**
 * Custom hook for Team Detail presenter
 */

import { useCallback, useEffect, useState } from "react";
import {
  TeamDetailPresenter,
  TeamDetailPresenterFactory,
  type TeamDetailViewModel,
} from "./TeamDetailPresenter";

// State interface
export interface TeamDetailPresenterState {
  viewModel: TeamDetailViewModel | null;
  loading: boolean;
  error: string | null;
}

// Actions interface
export interface TeamDetailPresenterActions {
  refreshData: () => Promise<void>;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Team Detail presenter
 */
export function useTeamDetailPresenter(
  teamId: string,
  initialViewModel: TeamDetailViewModel | null = null
): [TeamDetailPresenterState, TeamDetailPresenterActions] {
  const [presenter] = useState<TeamDetailPresenter>(() =>
    TeamDetailPresenterFactory.createClient()
  );
  const [viewModel, setViewModel] = useState<TeamDetailViewModel | null>(
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
      const newViewModel = await presenter.getViewModel(teamId);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading team detail:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter, teamId]);

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
  const state: TeamDetailPresenterState = {
    viewModel,
    loading,
    error,
  };

  // Actions object
  const actions: TeamDetailPresenterActions = {
    refreshData,
    setError,
  };

  return [state, actions];
}
