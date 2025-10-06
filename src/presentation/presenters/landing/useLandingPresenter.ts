import { LEAGUE_IDS } from "@/src/infrastructure/config/football-api.config";
import { useFootballDataPresenter } from "@/src/presentation/hooks/useFootballDataPresenter";
import { useCallback, useEffect, useState } from "react";
import {
  LandingPresenterFactory,
  LandingPresenterMapper,
  LandingViewModel,
} from "./LandingPresenter";

const presenter = LandingPresenterFactory.createClient();

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
 * Provides state management and actions for landing page with caching
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

  // Get football data presenter for caching
  const footballData = useFootballDataPresenter();

  /**
   * Load data from cache or API
   * Check cache first via useFootballDataPresenter, if not found fetch from API
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch data with caching from useFootballDataPresenter
      // This will check cache first, if not found it will call API and save to cache
      const [liveMatches, standings] = await Promise.all([
        footballData.fetchLiveMatches(),
        footballData.fetchStandingsByLeague(LEAGUE_IDS.PREMIER_LEAGUE),
      ]);

      const mappedLiveMatches = liveMatches
        .slice(0, 3)
        .map((match) => LandingPresenterMapper.mapToLiveMatch(match));

      const mappedStandings = standings
        .slice(0, 5)
        .map((standing) => LandingPresenterMapper.mapToLeagueStanding(standing));

      const newViewModel = await presenter.getViewModel();

      // Replace API data with cached/fresh data from footballData
      setViewModel({
        liveMatches: mappedLiveMatches,
        leagueStandings: mappedStandings,
        featuredPosts: newViewModel.featuredPosts,
        stats: {
          totalPosts: newViewModel.stats.totalPosts,
          totalUsers: newViewModel.stats.totalUsers,
          totalMatches: liveMatches.length,
          totalLeagues: mappedStandings.length,
        },
        popularLeagues: newViewModel.popularLeagues,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error loading landing data:", err);
    } finally {
      setLoading(false);
    }
  }, [footballData]);

  /**
   * Load data from cache or API
   * Check cache first via useFootballDataPresenter, if not found fetch from API
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const handleSetSelectedLeague = useCallback((league: string) => {
    setSelectedLeague(league);
  }, []);

  const handleSetError = useCallback((error: string | null) => {
    setError(error);
  }, []);

  useEffect(() => {
    loadData();
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
