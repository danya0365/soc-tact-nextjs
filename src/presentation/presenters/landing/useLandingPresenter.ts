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
  loadingStandings: boolean;
  error: string | null;
  selectedLeague: number;
}

export interface LandingPresenterActions {
  refreshData: () => Promise<void>;
  setSelectedLeague: (league: number) => void;
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
  const [loadingStandings, setLoadingStandings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState(
    LEAGUE_IDS.PREMIER_LEAGUE
  );

  // Get football data presenter for caching
  const footballData = useFootballDataPresenter();

  /**
   * Load standings for selected league
   */
  const loadStandingsByLeague = useCallback(
    async (leagueId: number) => {
      setLoadingStandings(true);
      setError(null);

      try {
        const standings = await footballData.fetchStandingsByLeague(leagueId);

        const mappedStandings = standings.map((standing) =>
          LandingPresenterMapper.mapToLeagueStanding(standing)
        );

        // Update only standings, keep other data
        setViewModel((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            leagueStandings: mappedStandings,
          };
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error loading standings:", err);
      } finally {
        setLoadingStandings(false);
      }
    },
    [footballData]
  );

  /**
   * Load initial data from cache or API
   * Check cache first via useFootballDataPresenter, if not found fetch from API
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadingStandings(true);
    setError(null);

    try {
      // Fetch data with caching from useFootballDataPresenter
      // This will check cache first, if not found it will call API and save to cache
      const leagueId = selectedLeague;

      const [liveMatches, standings] = await Promise.all([
        footballData.fetchLiveMatches(),
        footballData.fetchStandingsByLeague(leagueId),
      ]);

      const mappedLiveMatches = liveMatches.map((match) =>
        LandingPresenterMapper.mapToLiveMatch(match)
      );

      const mappedLiveMatchesByLeague =
        LandingPresenterMapper.groupMatchesByLeague(mappedLiveMatches);

      const mappedStandings = standings.map((standing) =>
        LandingPresenterMapper.mapToLeagueStanding(standing)
      );

      const newViewModel = await presenter.getViewModel();

      // Replace API data with cached/fresh data from footballData
      setViewModel({
        ...viewModel,
        liveMatches: mappedLiveMatches,
        liveMatchesByLeague: mappedLiveMatchesByLeague,
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
      setLoadingStandings(false);
    }
  }, [footballData, selectedLeague, viewModel]);

  /**
   * Load data from cache or API
   * Check cache first via useFootballDataPresenter, if not found fetch from API
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const handleSetSelectedLeague = useCallback(
    (leagueId: number) => {
      setSelectedLeague(leagueId);
      // Load standings for the newly selected league
      loadStandingsByLeague(leagueId);
    },
    [loadStandingsByLeague]
  );

  const handleSetError = useCallback((error: string | null) => {
    setError(error);
  }, []);

  // Load initial data on mount
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [
    {
      viewModel,
      loading,
      loadingStandings,
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
