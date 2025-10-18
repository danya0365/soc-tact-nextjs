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

const INITIAL_BATCH_SIZE = 100;
const LOAD_MORE_STEP = 30;

// State interface
export interface MatchesPresenterState {
  viewModel: MatchesViewModel | null;
  loading: boolean;
  error: string | null;
  filters: MatchFilters;
  visibleCount: number;
  hasMore: boolean;
}

// Actions interface
export interface MatchesPresenterActions {
  refreshData: () => Promise<void>;
  setFilters: (filters: MatchFilters) => void;
  loadMore: () => void;
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
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [filters, setFiltersState] = useState<MatchFilters>(() => {
    const base = initialViewModel?.filters
      ? { ...initialViewModel.filters }
      : {};
    if (!base.date) {
      base.date = today;
    }
    return base;
  });
  const [allMatches, setAllMatches] = useState<PresenterMatch[]>(
    initialViewModel?.matches ?? []
  );
  const [visibleCount, setVisibleCount] = useState(() =>
    initialViewModel?.perPage && initialViewModel.perPage > 0
      ? initialViewModel.perPage
      : Math.min(
          INITIAL_BATCH_SIZE,
          initialViewModel?.matches.length ?? INITIAL_BATCH_SIZE
        )
  );

  // Get football data presenter for caching
  const footballData = useFootballDataPresenter();

  /**
   * Load initial data from cache or API
   * Check cache first via useFootballDataPresenter, if not found fetch from API
   */
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

        const rawTimestamp = match.timestamp;
        const isMillis =
          typeof rawTimestamp === "number" && rawTimestamp > 1e12;
        const sourceDate = isMillis
          ? new Date(rawTimestamp)
          : rawTimestamp
          ? new Date(rawTimestamp * 1000)
          : new Date(match.date);
        const hasValidDate = !Number.isNaN(sourceDate.getTime());

        const kickoffDate = hasValidDate ? sourceDate : new Date();

        const formattedDate = kickoffDate.toISOString();
        const formattedTime = kickoffDate.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Bangkok",
        });

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
          date: hasValidDate ? formattedDate : match.date,
          time: hasValidDate ? formattedTime : "",
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
      const dateFilter =
        filters.date && filters.date.trim() !== "" ? filters.date : today;

      if (!filters.date || filters.date.trim() === "") {
        setFiltersState((prev) => ({ ...prev, date: dateFilter }));
      }

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

      const initialVisible = Math.min(mappedMatches.length, INITIAL_BATCH_SIZE);
      const limitedMatches = mappedMatches.slice(0, initialVisible);

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

      setAllMatches(mappedMatches);
      setVisibleCount(initialVisible);
      setViewModel({
        matches: limitedMatches,
        matchesByLeague:
          MatchPresenterMapper.groupMatchesByLeague(limitedMatches),
        stats,
        filters: { ...filters, date: dateFilter },
        totalCount: mappedMatches.length,
        page: 1,
        perPage: initialVisible,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      setError(errorMessage);
      console.error("Error loading matches data:", err);

      try {
        const fallbackViewModel = await presenter.getViewModel(
          filters,
          1,
          INITIAL_BATCH_SIZE
        );
        const mappedMatches = fallbackViewModel.matches.map((match) =>
          MatchPresenterMapper.mapToMatch(match)
        );
        const mappedMatchesByLeague =
          MatchPresenterMapper.groupMatchesByLeague(mappedMatches);

        setAllMatches(mappedMatches);
        setVisibleCount(Math.min(mappedMatches.length, INITIAL_BATCH_SIZE));
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
  }, [filters, mapDomainMatchToPresenterMatch, mapStatusToViewStatus, today]);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Set filters and reload data
   */
  const setFilters = useCallback(
    (newFilters: MatchFilters) => {
      const nextFilters = { ...newFilters };
      if (!nextFilters.date || nextFilters.date.trim() === "") {
        nextFilters.date = today;
      }
      setFiltersState(nextFilters);
      setVisibleCount(INITIAL_BATCH_SIZE);
    },
    [today]
  );

  /**
   * Load more matches
   */
  const loadMore = useCallback(() => {
    setVisibleCount((prevVisible) => {
      const total = allMatches.length;
      if (total === 0) {
        return prevVisible;
      }

      const nextVisible = Math.min(prevVisible + LOAD_MORE_STEP, total);
      if (nextVisible === prevVisible) {
        return prevVisible;
      }

      setViewModel((prev) => {
        if (!prev) return prev;
        const limitedMatches = allMatches.slice(0, nextVisible);
        return {
          ...prev,
          matches: limitedMatches,
          matchesByLeague:
            MatchPresenterMapper.groupMatchesByLeague(limitedMatches),
          perPage: nextVisible,
        };
      });

      return nextVisible;
    });
  }, [allMatches]);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setFiltersState({ date: today });
    setVisibleCount(INITIAL_BATCH_SIZE);
    setAllMatches([]);
    setViewModel(null);
  }, [today]);

  /**
   * Load data
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  // State object
  const state: MatchesPresenterState = {
    viewModel,
    loading,
    error,
    filters,
    visibleCount,
    hasMore: viewModel ? visibleCount < (viewModel.totalCount || 0) : false,
  };

  // Actions object
  const actions: MatchesPresenterActions = {
    refreshData,
    setFilters,
    loadMore,
    reset,
    setError,
  };

  return [state, actions];
}
