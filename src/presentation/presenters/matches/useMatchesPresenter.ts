/**
 * Custom hook for Matches presenter
 * Provides state management and actions for Matches operations
 */

import type { Match as DomainMatch } from "@/src/domain/entities/football.entity";
import { MatchStatus } from "@/src/domain/entities/football.entity";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFootballDataPresenter } from "../../hooks/useFootballDataPresenter";
import {
  MatchesPresenter,
  MatchesPresenterFactory,
  MatchPresenterMapper,
  type MatchesViewModel,
  type MatchFilters,
  type Match as PresenterMatch,
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

  // Get football data presenter for caching
  const footballData = useFootballDataPresenter();

  /**
   * Load initial data from cache or API
   * Check cache first via useFootballDataPresenter, if not found fetch from API
   */
  const perPage = useMemo(() => 10, []);

  const mapStatusToViewStatus = useCallback(
    (status: DomainMatch["status"] | string | undefined) => {
      switch (status) {
        case MatchStatus.LIVE:
        case MatchStatus.IN_PLAY:
        case "live":
        case "in_play":
          return "live" as PresenterMatch["status"];
        case MatchStatus.FINISHED:
        case "finished":
          return "finished" as PresenterMatch["status"];
        case MatchStatus.SCHEDULED:
        case "scheduled":
        case MatchStatus.PAUSED:
          return "upcoming" as PresenterMatch["status"];
        case MatchStatus.POSTPONED:
        case "postponed":
          return "postponed" as PresenterMatch["status"];
        default:
          return "upcoming" as PresenterMatch["status"];
      }
    },
    []
  );

  const mapDomainMatchToPresenterMatch = useCallback(
    (match: DomainMatch): PresenterMatch | null => {
      try {
        const viewStatus = mapStatusToViewStatus(match.status);

        const formatTeam = (team: DomainMatch["homeTeam"]) => ({
          id: team.id.toString(),
          name: team.name,
          logo: team.logo || "⚽",
          shortName: team.shortName || team.name.slice(0, 3).toUpperCase(),
        });

        const kickoffDate = new Date(match.timestamp * 1000 || match.date);
        const hasValidDate = !Number.isNaN(kickoffDate.getTime());

        return {
          id: match.id.toString(),
          homeTeam: formatTeam(match.homeTeam),
          awayTeam: formatTeam(match.awayTeam),
          score: {
            home: match.score?.home ?? null,
            away: match.score?.away ?? null,
            halftime: match.score?.halftime
              ? {
                  home: match.score.halftime.home ?? 0,
                  away: match.score.halftime.away ?? 0,
                }
              : undefined,
          },
          status: viewStatus,
          minute: match.minute ?? null,
          league: {
            id: match.league.id.toString(),
            name: match.league.name,
            logo: match.league.logo || "⚽",
            country: match.league.country,
          },
          venue: {
            name: match.venue || "สนามแข่งขัน",
            city: match.league.country,
          },
          date: hasValidDate ? kickoffDate.toISOString() : match.date,
          time: hasValidDate
            ? kickoffDate.toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          referee: undefined,
        };
      } catch (error) {
        console.warn("Failed to map match", match, error);
        return null;
      }
    },
    [mapStatusToViewStatus]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const statusFilter = filters.status || "all";
      const leagueFilter = filters.league
        ? Number.parseInt(filters.league, 10)
        : undefined;
      const dateFilter = filters.date;

      const fetchMatches = async (): Promise<DomainMatch[]> => {
        if (dateFilter) {
          return footballData.fetchMatchesByDate(dateFilter);
        }

        if (statusFilter === "live") {
          return footballData.fetchLiveMatches();
        }

        if (statusFilter === "finished") {
          return footballData.fetchFinishedMatches(leagueFilter);
        }

        if (statusFilter === "upcoming") {
          return footballData.fetchUpcomingMatches(leagueFilter);
        }

        if (leagueFilter) {
          return footballData.fetchMatchesByLeague(leagueFilter);
        }

        const [live, upcoming, finished] = await Promise.all([
          footballData.fetchLiveMatches(),
          footballData.fetchUpcomingMatches(),
          footballData.fetchFinishedMatches(),
        ]);

        const matchMap = new Map<number, DomainMatch>();

        [...live, ...upcoming, ...finished].forEach((match) => {
          matchMap.set(match.id, match);
        });

        return Array.from(matchMap.values());
      };

      let matches = await fetchMatches();

      if (leagueFilter) {
        matches = matches.filter((match) => match.league.id === leagueFilter);
      }

      if (statusFilter !== "all") {
        matches = matches.filter((match) => {
          const viewStatus = mapStatusToViewStatus(match.status);
          return viewStatus === statusFilter;
        });
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase().trim();
        matches = matches.filter((match) => {
          const home = match.homeTeam.name.toLowerCase();
          const away = match.awayTeam.name.toLowerCase();
          const leagueName = match.league.name.toLowerCase();
          return (
            home.includes(query) ||
            away.includes(query) ||
            leagueName.includes(query)
          );
        });
      }

      const mappedMatches = matches
        .map(mapDomainMatchToPresenterMatch)
        .filter((match): match is PresenterMatch => Boolean(match));

      const totalCount = mappedMatches.length;
      const startIndex = (currentPage - 1) * perPage;
      const paginatedMatches = mappedMatches.slice(
        startIndex,
        startIndex + perPage
      );

      const stats = {
        totalMatches: mappedMatches.length,
        liveMatches: mappedMatches.filter((match) => match.status === "live")
          .length,
        finishedMatches: mappedMatches.filter(
          (match) => match.status === "finished"
        ).length,
        upcomingMatches: mappedMatches.filter(
          (match) => match.status === "upcoming"
        ).length,
      };

      setViewModel({
        matches: paginatedMatches,
        matchesByLeague:
          MatchPresenterMapper.groupMatchesByLeague(paginatedMatches),
        stats,
        filters,
        totalCount,
        page: currentPage,
        perPage,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading matches data:", err);

      try {
        const fallbackViewModel = await presenter.getViewModel(
          filters,
          currentPage,
          perPage
        );
        const mappedMatches = fallbackViewModel.matches.map((match) =>
          MatchPresenterMapper.mapToMatch(match)
        );
        const mappedMatchesByLeague =
          MatchPresenterMapper.groupMatchesByLeague(mappedMatches);

        setViewModel({
          ...fallbackViewModel,
          matches: mappedMatches,
          matchesByLeague: mappedMatchesByLeague,
        });
      } catch (fallbackError) {
        console.error("Fallback matches data failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, perPage]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Set filters and reload data
   */
  const setFilters = useCallback((newFilters: MatchFilters) => {
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
   * Load data
   */
  useEffect(() => {
    loadData();
  }, []);

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
