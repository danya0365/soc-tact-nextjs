import { LEAGUE_IDS } from "@/src/infrastructure/config/football-api.config";
import { useFootballDataPresenter } from "@/src/presentation/hooks/useFootballDataPresenter";
import { useCallback, useEffect, useState } from "react";
import {
  LandingPresenterFactory,
  LandingPresenterMapper,
  LandingViewModel,
} from "./LandingPresenter";

// Mapping league names to league IDs
const LEAGUE_NAME_TO_ID: Record<string, number> = {
  "Premier League": LEAGUE_IDS.PREMIER_LEAGUE,
  "La Liga": LEAGUE_IDS.LA_LIGA,
  "Serie A": LEAGUE_IDS.SERIE_A,
  "Bundesliga": LEAGUE_IDS.BUNDESLIGA,
  "Ligue 1": LEAGUE_IDS.LIGUE_1,
  "Thai Premier League": LEAGUE_IDS.PREMIER_LEAGUE, // Fallback to Premier League
};

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
   * Load standings for selected league
   */
  const loadStandingsByLeague = useCallback(
    async (leagueName: string) => {
      setLoading(true);
      setError(null);

      try {
        const leagueId = LEAGUE_NAME_TO_ID[leagueName] || LEAGUE_IDS.PREMIER_LEAGUE;
        const standings = await footballData.fetchStandingsByLeague(leagueId);

        const mappedStandings = standings
          .slice(0, 5)
          .map((standing) => LandingPresenterMapper.mapToLeagueStanding(standing));

        // Update only standings, keep other data
        setViewModel((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            leagueStandings: mappedStandings,
          };
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Error loading standings:", err);
      } finally {
        setLoading(false);
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
    setError(null);

    try {
      // Fetch data with caching from useFootballDataPresenter
      // This will check cache first, if not found it will call API and save to cache
      const leagueId = LEAGUE_NAME_TO_ID[selectedLeague] || LEAGUE_IDS.PREMIER_LEAGUE;
      
      const [liveMatches, standings] = await Promise.all([
        footballData.fetchLiveMatches(),
        footballData.fetchStandingsByLeague(leagueId),
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
  }, [footballData, selectedLeague]);

  /**
   * Load data from cache or API
   * Check cache first via useFootballDataPresenter, if not found fetch from API
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const handleSetSelectedLeague = useCallback(
    (league: string) => {
      setSelectedLeague(league);
      // Load standings for the newly selected league
      loadStandingsByLeague(league);
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
