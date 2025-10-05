import { useCallback, useEffect, useState } from "react";
import {
  LandingViewModel,
  LandingPresenter,
  LandingPresenterFactory,
} from "./LandingPresenter";

export interface LandingPresenterState {
  viewModel: LandingViewModel | null;
  loading: boolean;
  error: string | null;
  selectedLeague: string;
}

export interface LandingPresenterActions {
  refreshData: () => Promise<void>;
  setSelectedLeague: (league: string) => void;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for Landing presenter
 * Provides state management and actions for landing page
 */
export function useLandingPresenter(
  initialViewModel: LandingViewModel | null = null
): [LandingPresenterState, LandingPresenterActions] {
  const [viewModel, setViewModel] = useState<LandingViewModel | null>(
    initialViewModel
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState("Premier League");
  const [presenter, setPresenter] = useState<LandingPresenter | null>(null);

  // Initialize presenter
  useEffect(() => {
    const initPresenter = async () => {
      const newPresenter = await LandingPresenterFactory.create();
      setPresenter(newPresenter);
    };
    initPresenter();
  }, []);

  /**
   * Load data from presenter
   */
  const refreshData = useCallback(async () => {
    if (!presenter) return;

    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading landing data:", err);
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  // Load initial data if not provided
  useEffect(() => {
    if (!initialViewModel && presenter) {
      refreshData();
    }
  }, [initialViewModel, presenter, refreshData]);

  const handleSetSelectedLeague = useCallback((league: string) => {
    setSelectedLeague(league);
  }, []);

  const handleSetError = useCallback((error: string | null) => {
    setError(error);
  }, []);

  return [
    {
      viewModel,
      loading,
      error,
      selectedLeague,
    },
    {
      refreshData,
      setSelectedLeague: handleSetSelectedLeague,
      setError: handleSetError,
    },
  ];
}
