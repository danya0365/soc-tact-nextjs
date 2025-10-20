/**
 * Football Data Presenter Hook
 * Handles API calls and Zustand caching for football data
 * This is the proper layer to integrate infrastructure with state management
 */

import {
  getAllLeaguesClient,
  getFeaturedMatchesClient,
  getFinishedMatchesClient,
  getHeadToHeadClient,
  getLeagueByIdClient,
  getLeagueOverviewClient,
  getLeaguesByCountryClient,
  getLiveMatchesClient,
  getMatchByIdClient,
  getMatchesByDateClient,
  getMatchesByLeagueClient,
  getStandingsByLeagueClient,
  getTeamByIdClient,
  getTeamRecentMatchesClient,
  getTeamsByLeagueClient,
  getTeamUpcomingMatchesClient,
  getTodayMatchesClient,
  getTopScorersClient,
  getUpcomingMatchesClient,
  searchTeamsClient,
} from "@/src/infrastructure/api/football-client.api";
import { useFootballStore } from "@/src/stores/footballStore";
import { useCallback } from "react";

/**
 * Hook for managing football data with caching
 */
export function useFootballDataPresenter() {
  const store = useFootballStore();

  // ============================================================================
  // LEAGUES
  // ============================================================================

  const fetchAllLeagues = useCallback(async () => {
    // Check cache first
    const cached = store.getLeagues();
    if (cached) return cached;

    // Fetch from API
    const data = await getAllLeaguesClient();

    // Save to cache
    store.setLeagues(data);

    return data;
  }, [store]);

  const fetchLeagueById = useCallback(
    async (leagueId: number) => {
      // Check cache first
      const cached = store.getLeagueById(leagueId);
      if (cached) return cached;

      // Fetch from API
      const data = await getLeagueByIdClient(leagueId);

      // Save to cache
      store.setLeagueById(leagueId, data);

      return data;
    },
    [store]
  );

  const fetchLeaguesByCountry = useCallback(
    async (country: string) => {
      // Check cache first
      const cached = store.getLeaguesByCountry(country);
      if (cached) return cached;

      // Fetch from API
      const data = await getLeaguesByCountryClient(country);

      // Save to cache
      store.setLeaguesByCountry(country, data);

      return data;
    },
    [store]
  );

  const fetchLeagueOverview = useCallback(
    async (leagueId: number, season?: number) => {
      // Check cache first
      const cached = store.getLeagueOverview(leagueId, season);
      if (cached) return cached;

      // Fetch from API
      const data = await getLeagueOverviewClient(leagueId, season);

      // Save to cache
      store.setLeagueOverview(leagueId, season, data);

      return data;
    },
    [store]
  );

  // ============================================================================
  // MATCHES
  // ============================================================================

  const fetchLiveMatches = useCallback(async () => {
    // Check cache first
    const cached = store.getLiveMatches();
    if (cached) return cached;

    // Fetch from API (client-side proxy)
    const data = await getLiveMatchesClient();

    // Save to cache
    store.setLiveMatches(data);

    return data;
  }, [store]);

  const fetchTodayMatches = useCallback(async () => {
    return getTodayMatchesClient();
  }, []);

  const fetchMatchesByDate = useCallback(
    async (date: string) => {
      // Check cache first
      const cached = store.getMatchesByDate(date);
      if (cached) return cached;

      // Fetch from API
      const data = await getMatchesByDateClient(date);

      // Save to cache
      store.setMatchesByDate(date, data);

      return data;
    },
    [store]
  );

  const fetchMatchesByLeague = useCallback(
    async (leagueId: number, season?: number) => {
      // Check cache first
      const cached = store.getMatchesByLeague(leagueId, season);
      if (cached) return cached;

      // Fetch from API
      const data = await getMatchesByLeagueClient(leagueId, season);

      // Save to cache
      store.setMatchesByLeague(leagueId, season, data);

      return data;
    },
    [store]
  );

  const fetchMatchById = useCallback(
    async (matchId: number) => {
      // Check cache first
      const cached = store.getMatchById(matchId);
      if (cached) return cached;

      // Fetch from API
      const data = await getMatchByIdClient(matchId);

      // Save to cache
      store.setMatchById(matchId, data);

      return data;
    },
    [store]
  );

  const fetchUpcomingMatches = useCallback(
    async (leagueId?: number) => {
      // Check cache first
      const cached = store.getUpcomingMatches(leagueId);
      if (cached) return cached;

      // Fetch from API
      const data = await getUpcomingMatchesClient(leagueId);

      // Save to cache
      store.setUpcomingMatches(leagueId, data);

      return data;
    },
    [store]
  );

  const fetchFinishedMatches = useCallback(
    async (leagueId?: number) => {
      // Check cache first
      const cached = store.getFinishedMatches(leagueId);
      if (cached) return cached;

      // Fetch from API
      const data = await getFinishedMatchesClient(leagueId);

      // Save to cache
      store.setFinishedMatches(leagueId, data);

      return data;
    },
    [store]
  );

  const fetchFeaturedMatches = useCallback(async () => {
    // Check cache first
    const cached = store.getFeaturedMatches();
    if (cached) return cached;

    // Fetch from API
    const data = await getFeaturedMatchesClient();

    // Save to cache
    store.setFeaturedMatches(data);

    return data;
  }, [store]);

  // ============================================================================
  // STANDINGS
  // ============================================================================

  const fetchStandingsByLeague = useCallback(
    async (leagueId: number, season?: number) => {
      // Check cache first
      const cached = store.getStandingsByLeague(leagueId, season);
      if (cached) return cached;

      // Fetch from API (client-side proxy)
      const data = await getStandingsByLeagueClient(leagueId, season);

      // Save to cache
      store.setStandingsByLeague(leagueId, season, data);

      return data;
    },
    [store]
  );

  // ============================================================================
  // TEAMS
  // ============================================================================

  const fetchTeamById = useCallback(
    async (teamId: number) => {
      // Check cache first
      const cached = store.getTeamById(teamId);
      if (cached) return cached;

      // Fetch from API
      const data = await getTeamByIdClient(teamId);

      // Save to cache
      store.setTeamById(teamId, data);

      return data;
    },
    [store]
  );

  const fetchTeamsByLeague = useCallback(
    async (leagueId: number) => {
      // Check cache first
      const cached = store.getTeamsByLeague(leagueId);
      if (cached) return cached;

      // Fetch from API
      const data = await getTeamsByLeagueClient(leagueId);

      // Save to cache
      store.setTeamsByLeague(leagueId, data);

      return data;
    },
    [store]
  );

  const fetchSearchTeams = useCallback(
    async (query: string) => {
      // Check cache first
      const cached = store.getSearchedTeams(query);
      if (cached) return cached;

      // Fetch from API
      const data = await searchTeamsClient(query);

      // Save to cache
      store.setSearchedTeams(query, data);

      return data;
    },
    [store]
  );

  const fetchTeamRecentMatches = useCallback(
    async (teamId: number, limit: number = 5) => {
      // Check cache first
      const cached = store.getTeamRecentMatches(teamId, limit);
      if (cached) return cached;

      // Fetch from API
      const data = await getTeamRecentMatchesClient(teamId, limit);

      // Save to cache
      store.setTeamRecentMatches(teamId, limit, data);

      return data;
    },
    [store]
  );

  const fetchTeamUpcomingMatches = useCallback(
    async (teamId: number, limit: number = 5) => {
      // Check cache first
      const cached = store.getTeamUpcomingMatches(teamId, limit);
      if (cached) return cached;

      // Fetch from API
      const data = await getTeamUpcomingMatchesClient(teamId, limit);

      // Save to cache
      store.setTeamUpcomingMatches(teamId, limit, data);

      return data;
    },
    [store]
  );

  // ============================================================================
  // STATISTICS
  // ============================================================================

  const fetchTopScorers = useCallback(
    async (leagueId: number, season?: number) => {
      // Check cache first
      const cached = store.getTopScorers(leagueId, season);
      if (cached) return cached;

      // Fetch from API
      const data = await getTopScorersClient(leagueId, season);

      // Save to cache
      store.setTopScorers(leagueId, season, data);

      return data;
    },
    [store]
  );

  const fetchHeadToHead = useCallback(
    async (team1Id: number, team2Id: number) => {
      // Check cache first
      const cached = store.getHeadToHead(team1Id, team2Id);
      if (cached) return cached;

      // Fetch from API
      const data = await getHeadToHeadClient(team1Id, team2Id);

      // Save to cache
      store.setHeadToHead(team1Id, team2Id, data);

      return data;
    },
    [store]
  );

  // ============================================================================
  // UTILITY
  // ============================================================================

  const clearCache = useCallback(() => {
    store.clearCache();
  }, [store]);

  const clearExpiredCache = useCallback(() => {
    store.clearExpiredCache();
  }, [store]);

  return {
    favouriteLeagueIds: store.favouriteLeagueIds,
    toggleFavouriteLeague: store.toggleFavouriteLeague,
    setFavouriteLeagues: store.setFavouriteLeagues,
    isLeagueFavourite: store.isLeagueFavourite,

    // Leagues
    fetchAllLeagues,
    fetchLeagueById,
    fetchLeaguesByCountry,
    fetchLeagueOverview,

    // Matches
    fetchLiveMatches,
    fetchTodayMatches,
    fetchMatchesByDate,
    fetchMatchesByLeague,
    fetchMatchById,
    fetchUpcomingMatches,
    fetchFinishedMatches,
    fetchFeaturedMatches,

    // Standings
    fetchStandingsByLeague,

    // Teams
    fetchTeamById,
    fetchTeamsByLeague,
    fetchSearchTeams,
    fetchTeamRecentMatches,
    fetchTeamUpcomingMatches,

    // Statistics
    fetchTopScorers,
    fetchHeadToHead,

    // Utility
    clearCache,
    clearExpiredCache,
  };
}
