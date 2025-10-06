/**
 * Football Store
 * Zustand store with localforage persistence for caching football data
 * Helps reduce API rate limit (10 requests/minute)
 */

import type {
  HeadToHead,
  League,
  Match,
  Standing,
  Team,
  TopScorer,
} from "@/src/domain/entities/football.entity";
import localforage from "localforage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Initialize localforage instance
localforage.config({
  name: "soc-tact",
  storeName: "football",
});

// Cache duration in milliseconds
const CACHE_DURATION = {
  LIVE_MATCHES: 30 * 1000, // 30 seconds
  STANDINGS: 60 * 60 * 1000, // 1 hour
  MATCHES: 5 * 60 * 1000, // 5 minutes
  TEAMS: 24 * 60 * 60 * 1000, // 24 hours
  LEAGUES: 24 * 60 * 60 * 1000, // 24 hours
  TOP_SCORERS: 60 * 60 * 1000, // 1 hour
  HEAD_TO_HEAD: 24 * 60 * 60 * 1000, // 24 hours
};

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  lastUpdate: number;
}

// Store state interface
interface FootballStoreState {
  // Leagues
  leagues: CacheEntry<League[]> | null;
  leagueById: Record<number, CacheEntry<League>>;
  leaguesByCountry: Record<string, CacheEntry<League[]>>;

  // Matches
  liveMatches: CacheEntry<Match[]> | null;
  matchesByDate: Record<string, CacheEntry<Match[]>>;
  matchesByLeague: Record<string, CacheEntry<Match[]>>; // key: leagueId-season
  matchById: Record<number, CacheEntry<Match>>;
  upcomingMatches: Record<string, CacheEntry<Match[]>>; // key: leagueId or "all"
  finishedMatches: Record<string, CacheEntry<Match[]>>; // key: leagueId or "all"
  featuredMatches: CacheEntry<{
    live: Match[];
    today: Match[];
    upcoming: Match[];
  }> | null;

  // Standings
  standingsByLeague: Record<string, CacheEntry<Standing[]>>; // key: leagueId-season

  // Teams
  teamById: Record<number, CacheEntry<Team>>;
  teamsByLeague: Record<number, CacheEntry<Team[]>>;
  searchedTeams: Record<string, CacheEntry<Team[]>>; // key: search query
  teamRecentMatches: Record<string, CacheEntry<Match[]>>; // key: teamId-limit
  teamUpcomingMatches: Record<string, CacheEntry<Match[]>>; // key: teamId-limit

  // Statistics
  topScorers: Record<string, CacheEntry<TopScorer[]>>; // key: leagueId-season
  headToHead: Record<string, CacheEntry<HeadToHead>>; // key: team1Id-team2Id

  // League Overview
  leagueOverview: Record<
    string,
    CacheEntry<{
      league: League;
      standings: Standing[];
      recentMatches: Match[];
      topScorers: TopScorer[];
    }>
  >; // key: leagueId-season

  // Actions
  setLeagues: (data: League[]) => void;
  setLeagueById: (id: number, data: League) => void;
  setLeaguesByCountry: (country: string, data: League[]) => void;

  setLiveMatches: (data: Match[]) => void;
  setMatchesByDate: (date: string, data: Match[]) => void;
  setMatchesByLeague: (
    leagueId: number,
    season: number | undefined,
    data: Match[]
  ) => void;
  setMatchById: (id: number, data: Match) => void;
  setUpcomingMatches: (leagueId: number | undefined, data: Match[]) => void;
  setFinishedMatches: (leagueId: number | undefined, data: Match[]) => void;
  setFeaturedMatches: (data: {
    live: Match[];
    today: Match[];
    upcoming: Match[];
  }) => void;

  setStandingsByLeague: (
    leagueId: number,
    season: number | undefined,
    data: Standing[]
  ) => void;

  setTeamById: (id: number, data: Team) => void;
  setTeamsByLeague: (leagueId: number, data: Team[]) => void;
  setSearchedTeams: (query: string, data: Team[]) => void;
  setTeamRecentMatches: (teamId: number, limit: number, data: Match[]) => void;
  setTeamUpcomingMatches: (
    teamId: number,
    limit: number,
    data: Match[]
  ) => void;

  setTopScorers: (
    leagueId: number,
    season: number | undefined,
    data: TopScorer[]
  ) => void;
  setHeadToHead: (team1Id: number, team2Id: number, data: HeadToHead) => void;

  setLeagueOverview: (
    leagueId: number,
    season: number | undefined,
    data: {
      league: League;
      standings: Standing[];
      recentMatches: Match[];
      topScorers: TopScorer[];
    }
  ) => void;

  // Getters with cache validation
  getLeagues: () => League[] | null;
  getLeagueById: (id: number) => League | null;
  getLeaguesByCountry: (country: string) => League[] | null;

  getLiveMatches: () => Match[] | null;
  getMatchesByDate: (date: string) => Match[] | null;
  getMatchesByLeague: (leagueId: number, season?: number) => Match[] | null;
  getMatchById: (id: number) => Match | null;
  getUpcomingMatches: (leagueId?: number) => Match[] | null;
  getFinishedMatches: (leagueId?: number) => Match[] | null;
  getFeaturedMatches: () => {
    live: Match[];
    today: Match[];
    upcoming: Match[];
  } | null;

  getStandingsByLeague: (
    leagueId: number,
    season?: number
  ) => Standing[] | null;

  getTeamById: (id: number) => Team | null;
  getTeamsByLeague: (leagueId: number) => Team[] | null;
  getSearchedTeams: (query: string) => Team[] | null;
  getTeamRecentMatches: (teamId: number, limit: number) => Match[] | null;
  getTeamUpcomingMatches: (teamId: number, limit: number) => Match[] | null;

  getTopScorers: (leagueId: number, season?: number) => TopScorer[] | null;
  getHeadToHead: (team1Id: number, team2Id: number) => HeadToHead | null;

  getLeagueOverview: (
    leagueId: number,
    season?: number
  ) => {
    league: League;
    standings: Standing[];
    recentMatches: Match[];
    topScorers: TopScorer[];
  } | null;

  // Utility
  clearCache: () => void;
  clearExpiredCache: () => void;
}

// Helper function to check if cache is valid
function isCacheValid(lastUpdate: number, duration: number): boolean {
  return Date.now() - lastUpdate < duration;
}

// Helper function to create cache entry
function createCacheEntry<T>(data: T): CacheEntry<T> {
  return {
    data,
    lastUpdate: Date.now(),
  };
}

// Create store
export const useFootballStore = create<FootballStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      leagues: null,
      leagueById: {},
      leaguesByCountry: {},
      liveMatches: null,
      matchesByDate: {},
      matchesByLeague: {},
      matchById: {},
      upcomingMatches: {},
      finishedMatches: {},
      featuredMatches: null,
      standingsByLeague: {},
      teamById: {},
      teamsByLeague: {},
      searchedTeams: {},
      teamRecentMatches: {},
      teamUpcomingMatches: {},
      topScorers: {},
      headToHead: {},
      leagueOverview: {},

      // Setters
      setLeagues: (data) => set({ leagues: createCacheEntry(data) }),

      setLeagueById: (id, data) =>
        set((state) => ({
          leagueById: { ...state.leagueById, [id]: createCacheEntry(data) },
        })),

      setLeaguesByCountry: (country, data) =>
        set((state) => ({
          leaguesByCountry: {
            ...state.leaguesByCountry,
            [country]: createCacheEntry(data),
          },
        })),

      setLiveMatches: (data) => set({ liveMatches: createCacheEntry(data) }),

      setMatchesByDate: (date, data) =>
        set((state) => ({
          matchesByDate: {
            ...state.matchesByDate,
            [date]: createCacheEntry(data),
          },
        })),

      setMatchesByLeague: (leagueId, season, data) =>
        set((state) => ({
          matchesByLeague: {
            ...state.matchesByLeague,
            [`${leagueId}-${season || "current"}`]: createCacheEntry(data),
          },
        })),

      setMatchById: (id, data) =>
        set((state) => ({
          matchById: { ...state.matchById, [id]: createCacheEntry(data) },
        })),

      setUpcomingMatches: (leagueId, data) =>
        set((state) => ({
          upcomingMatches: {
            ...state.upcomingMatches,
            [leagueId || "all"]: createCacheEntry(data),
          },
        })),

      setFinishedMatches: (leagueId, data) =>
        set((state) => ({
          finishedMatches: {
            ...state.finishedMatches,
            [leagueId || "all"]: createCacheEntry(data),
          },
        })),

      setFeaturedMatches: (data) =>
        set({ featuredMatches: createCacheEntry(data) }),

      setStandingsByLeague: (leagueId, season, data) =>
        set((state) => ({
          standingsByLeague: {
            ...state.standingsByLeague,
            [`${leagueId}-${season || "current"}`]: createCacheEntry(data),
          },
        })),

      setTeamById: (id, data) =>
        set((state) => ({
          teamById: { ...state.teamById, [id]: createCacheEntry(data) },
        })),

      setTeamsByLeague: (leagueId, data) =>
        set((state) => ({
          teamsByLeague: {
            ...state.teamsByLeague,
            [leagueId]: createCacheEntry(data),
          },
        })),

      setSearchedTeams: (query, data) =>
        set((state) => ({
          searchedTeams: {
            ...state.searchedTeams,
            [query]: createCacheEntry(data),
          },
        })),

      setTeamRecentMatches: (teamId, limit, data) =>
        set((state) => ({
          teamRecentMatches: {
            ...state.teamRecentMatches,
            [`${teamId}-${limit}`]: createCacheEntry(data),
          },
        })),

      setTeamUpcomingMatches: (teamId, limit, data) =>
        set((state) => ({
          teamUpcomingMatches: {
            ...state.teamUpcomingMatches,
            [`${teamId}-${limit}`]: createCacheEntry(data),
          },
        })),

      setTopScorers: (leagueId, season, data) =>
        set((state) => ({
          topScorers: {
            ...state.topScorers,
            [`${leagueId}-${season || "current"}`]: createCacheEntry(data),
          },
        })),

      setHeadToHead: (team1Id, team2Id, data) =>
        set((state) => ({
          headToHead: {
            ...state.headToHead,
            [`${team1Id}-${team2Id}`]: createCacheEntry(data),
          },
        })),

      setLeagueOverview: (leagueId, season, data) =>
        set((state) => ({
          leagueOverview: {
            ...state.leagueOverview,
            [`${leagueId}-${season || "current"}`]: createCacheEntry(data),
          },
        })),

      // Getters with cache validation
      getLeagues: () => {
        const cache = get().leagues;
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.LEAGUES)) {
          return cache.data;
        }
        return null;
      },

      getLeagueById: (id) => {
        const cache = get().leagueById[id];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.LEAGUES)) {
          return cache.data;
        }
        return null;
      },

      getLeaguesByCountry: (country) => {
        const cache = get().leaguesByCountry[country];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.LEAGUES)) {
          return cache.data;
        }
        return null;
      },

      getLiveMatches: () => {
        const cache = get().liveMatches;
        if (
          cache &&
          isCacheValid(cache.lastUpdate, CACHE_DURATION.LIVE_MATCHES)
        ) {
          return cache.data;
        }
        return null;
      },

      getMatchesByDate: (date) => {
        const cache = get().matchesByDate[date];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.MATCHES)) {
          return cache.data;
        }
        return null;
      },

      getMatchesByLeague: (leagueId, season) => {
        const cache =
          get().matchesByLeague[`${leagueId}-${season || "current"}`];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.MATCHES)) {
          return cache.data;
        }
        return null;
      },

      getMatchById: (id) => {
        const cache = get().matchById[id];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.MATCHES)) {
          return cache.data;
        }
        return null;
      },

      getUpcomingMatches: (leagueId) => {
        const cache = get().upcomingMatches[leagueId || "all"];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.MATCHES)) {
          return cache.data;
        }
        return null;
      },

      getFinishedMatches: (leagueId) => {
        const cache = get().finishedMatches[leagueId || "all"];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.MATCHES)) {
          return cache.data;
        }
        return null;
      },

      getFeaturedMatches: () => {
        const cache = get().featuredMatches;
        if (
          cache &&
          isCacheValid(cache.lastUpdate, CACHE_DURATION.LIVE_MATCHES)
        ) {
          return cache.data;
        }
        return null;
      },

      getStandingsByLeague: (leagueId, season) => {
        const cache =
          get().standingsByLeague[`${leagueId}-${season || "current"}`];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.STANDINGS)) {
          return cache.data;
        }
        return null;
      },

      getTeamById: (id) => {
        const cache = get().teamById[id];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.TEAMS)) {
          return cache.data;
        }
        return null;
      },

      getTeamsByLeague: (leagueId) => {
        const cache = get().teamsByLeague[leagueId];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.TEAMS)) {
          return cache.data;
        }
        return null;
      },

      getSearchedTeams: (query) => {
        const cache = get().searchedTeams[query];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.TEAMS)) {
          return cache.data;
        }
        return null;
      },

      getTeamRecentMatches: (teamId, limit) => {
        const cache = get().teamRecentMatches[`${teamId}-${limit}`];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.MATCHES)) {
          return cache.data;
        }
        return null;
      },

      getTeamUpcomingMatches: (teamId, limit) => {
        const cache = get().teamUpcomingMatches[`${teamId}-${limit}`];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.MATCHES)) {
          return cache.data;
        }
        return null;
      },

      getTopScorers: (leagueId, season) => {
        const cache = get().topScorers[`${leagueId}-${season || "current"}`];
        if (
          cache &&
          isCacheValid(cache.lastUpdate, CACHE_DURATION.TOP_SCORERS)
        ) {
          return cache.data;
        }
        return null;
      },

      getHeadToHead: (team1Id, team2Id) => {
        const cache = get().headToHead[`${team1Id}-${team2Id}`];
        if (
          cache &&
          isCacheValid(cache.lastUpdate, CACHE_DURATION.HEAD_TO_HEAD)
        ) {
          return cache.data;
        }
        return null;
      },

      getLeagueOverview: (leagueId, season) => {
        const cache =
          get().leagueOverview[`${leagueId}-${season || "current"}`];
        if (cache && isCacheValid(cache.lastUpdate, CACHE_DURATION.STANDINGS)) {
          return cache.data;
        }
        return null;
      },

      // Utility
      clearCache: () =>
        set({
          leagues: null,
          leagueById: {},
          leaguesByCountry: {},
          liveMatches: null,
          matchesByDate: {},
          matchesByLeague: {},
          matchById: {},
          upcomingMatches: {},
          finishedMatches: {},
          featuredMatches: null,
          standingsByLeague: {},
          teamById: {},
          teamsByLeague: {},
          searchedTeams: {},
          teamRecentMatches: {},
          teamUpcomingMatches: {},
          topScorers: {},
          headToHead: {},
          leagueOverview: {},
        }),

      clearExpiredCache: () => {
        const state = get();

        // Clear expired leagues
        if (
          state.leagues &&
          !isCacheValid(state.leagues.lastUpdate, CACHE_DURATION.LEAGUES)
        ) {
          set({ leagues: null });
        }

        // Clear expired live matches
        if (
          state.liveMatches &&
          !isCacheValid(
            state.liveMatches.lastUpdate,
            CACHE_DURATION.LIVE_MATCHES
          )
        ) {
          set({ liveMatches: null });
        }

        // Add more cleanup logic as needed
      },
    }),
    {
      name: "football-storage",
      storage: createJSONStorage(() => localforage),
    }
  )
);
