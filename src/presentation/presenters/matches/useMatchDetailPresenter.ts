/**
 * Custom hook for Match Detail presenter
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MatchDetailViewModel } from "./MatchDetailPresenter";
import { buildMatchDetailViewModel } from "./MatchDetailPresenter";
import { useFootballDataPresenter } from "../../hooks/useFootballDataPresenter";

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
  const [viewModel, setViewModel] = useState<MatchDetailViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const matchIdNumber = useMemo(() => Number.parseInt(matchId, 10), [matchId]);

  const {
    fetchMatchById,
    fetchHeadToHead,
  } = useFootballDataPresenter();

  /**
   * Load data from presenter
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (Number.isNaN(matchIdNumber)) {
        throw new Error("รหัสการแข่งขันไม่ถูกต้อง");
      }

      const match = await fetchMatchById(matchIdNumber);
      const headToHead = await fetchHeadToHead(
        match.homeTeam.id,
        match.awayTeam.id
      ).catch(() => null);

      const newViewModel = buildMatchDetailViewModel(match, headToHead ?? null);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading match detail:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchHeadToHead, fetchMatchById, matchIdNumber]);

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
