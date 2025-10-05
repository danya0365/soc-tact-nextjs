/**
 * Football API Configuration
 * Centralized configuration for football data APIs
 */

export const FOOTBALL_API_CONFIG = {
  // Football-Data.org (Free tier: 10 requests/minute)
  FOOTBALL_DATA: {
    BASE_URL: "https://api.football-data.org/v4",
    API_KEY: process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY || "",
    HEADERS: {
      "X-Auth-Token": process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY || "",
    },
  },

  // API-Football (RapidAPI) - Alternative (Free tier: 100 requests/day)
  API_FOOTBALL: {
    BASE_URL: "https://api-football-v1.p.rapidapi.com/v3",
    API_KEY: process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
    HEADERS: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  },

  // TheSportsDB (Free, no API key required)
  SPORTS_DB: {
    BASE_URL: "https://www.thesportsdb.com/api/v1/json",
    API_KEY: process.env.NEXT_PUBLIC_SPORTSDB_API_KEY || "3", // Free tier key
  },
};

// Default API to use
export const DEFAULT_FOOTBALL_API = "FOOTBALL_DATA";

// League IDs mapping (Football-Data.org)
export const LEAGUE_IDS = {
  PREMIER_LEAGUE: 2021, // England
  LA_LIGA: 2014, // Spain
  SERIE_A: 2019, // Italy
  BUNDESLIGA: 2002, // Germany
  LIGUE_1: 2015, // France
  CHAMPIONS_LEAGUE: 2001,
  EUROPA_LEAGUE: 2146,
  WORLD_CUP: 2000,
  EREDIVISIE: 2003, // Netherlands
  PRIMEIRA_LIGA: 2017, // Portugal
};

// API Rate Limiting
export const RATE_LIMITS = {
  FOOTBALL_DATA: {
    requestsPerMinute: 10,
    requestsPerDay: 10000, // Free tier
  },
  API_FOOTBALL: {
    requestsPerMinute: 30,
    requestsPerDay: 100, // Free tier
  },
  SPORTS_DB: {
    requestsPerMinute: 60,
    requestsPerDay: Infinity, // No limit
  },
};

// Cache configuration
export const CACHE_CONFIG = {
  LIVE_MATCHES: 30, // 30 seconds
  STANDINGS: 3600, // 1 hour
  MATCHES: 300, // 5 minutes
  TEAMS: 86400, // 24 hours
  LEAGUES: 86400, // 24 hours
};
