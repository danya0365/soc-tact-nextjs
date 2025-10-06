/**
 * Football Client API
 * Client-side API wrapper that calls Next.js API routes (proxy)
 * This avoids CORS issues when calling Football-Data.org from browser
 */

import type {
  League,
  Match,
  Standing,
  Team,
  TopScorer,
  HeadToHead,
} from "@/src/domain/entities/football.entity";

const API_BASE = "/api/football";

/**
 * Fetch wrapper with error handling
 */
async function fetchAPI<T>(url: string): Promise<T> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  const json = await response.json();
  
  if (!json.success) {
    throw new Error(json.error || "API request failed");
  }
  
  return json.data;
}

// ============================================================================
// LEAGUES
// ============================================================================

export async function getAllLeaguesClient(): Promise<League[]> {
  return fetchAPI<League[]>(`${API_BASE}/leagues`);
}

export async function getLeagueByIdClient(leagueId: number): Promise<League> {
  return fetchAPI<League>(`${API_BASE}/leagues/${leagueId}`);
}

export async function getLeaguesByCountryClient(country: string): Promise<League[]> {
  return fetchAPI<League[]>(`${API_BASE}/leagues/country/${country}`);
}

export async function getLeagueOverviewClient(
  leagueId: number,
  season?: number
): Promise<{
  league: League;
  standings: Standing[];
  recentMatches: Match[];
  topScorers: TopScorer[];
}> {
  const url = season
    ? `${API_BASE}/leagues/${leagueId}/overview?season=${season}`
    : `${API_BASE}/leagues/${leagueId}/overview`;
  return fetchAPI(url);
}

// ============================================================================
// MATCHES
// ============================================================================

export async function getLiveMatchesClient(): Promise<Match[]> {
  return fetchAPI<Match[]>(`${API_BASE}/matches/live`);
}

export async function getTodayMatchesClient(): Promise<Match[]> {
  return fetchAPI<Match[]>(`${API_BASE}/matches/today`);
}

export async function getMatchesByDateClient(date: string): Promise<Match[]> {
  return fetchAPI<Match[]>(`${API_BASE}/matches/date/${date}`);
}

export async function getMatchesByLeagueClient(
  leagueId: number,
  season?: number
): Promise<Match[]> {
  const url = season
    ? `${API_BASE}/matches/league/${leagueId}?season=${season}`
    : `${API_BASE}/matches/league/${leagueId}`;
  return fetchAPI<Match[]>(url);
}

export async function getMatchByIdClient(matchId: number): Promise<Match> {
  return fetchAPI<Match>(`${API_BASE}/matches/${matchId}`);
}

export async function getUpcomingMatchesClient(leagueId?: number): Promise<Match[]> {
  const url = leagueId
    ? `${API_BASE}/matches/upcoming?leagueId=${leagueId}`
    : `${API_BASE}/matches/upcoming`;
  return fetchAPI<Match[]>(url);
}

export async function getFinishedMatchesClient(leagueId?: number): Promise<Match[]> {
  const url = leagueId
    ? `${API_BASE}/matches/finished?leagueId=${leagueId}`
    : `${API_BASE}/matches/finished`;
  return fetchAPI<Match[]>(url);
}

export async function getFeaturedMatchesClient(): Promise<{
  live: Match[];
  today: Match[];
  upcoming: Match[];
}> {
  return fetchAPI(`${API_BASE}/matches/featured`);
}

// ============================================================================
// STANDINGS
// ============================================================================

export async function getStandingsByLeagueClient(
  leagueId: number,
  season?: number
): Promise<Standing[]> {
  const url = season
    ? `${API_BASE}/standings/${leagueId}?season=${season}`
    : `${API_BASE}/standings/${leagueId}`;
  return fetchAPI<Standing[]>(url);
}

// ============================================================================
// TEAMS
// ============================================================================

export async function getTeamByIdClient(teamId: number): Promise<Team> {
  return fetchAPI<Team>(`${API_BASE}/teams/${teamId}`);
}

export async function getTeamsByLeagueClient(leagueId: number): Promise<Team[]> {
  return fetchAPI<Team[]>(`${API_BASE}/teams/league/${leagueId}`);
}

export async function searchTeamsClient(query: string): Promise<Team[]> {
  return fetchAPI<Team[]>(`${API_BASE}/teams/search?q=${encodeURIComponent(query)}`);
}

export async function getTeamRecentMatchesClient(
  teamId: number,
  limit?: number
): Promise<Match[]> {
  const url = limit
    ? `${API_BASE}/teams/${teamId}/matches/recent?limit=${limit}`
    : `${API_BASE}/teams/${teamId}/matches/recent`;
  return fetchAPI<Match[]>(url);
}

export async function getTeamUpcomingMatchesClient(
  teamId: number,
  limit?: number
): Promise<Match[]> {
  const url = limit
    ? `${API_BASE}/teams/${teamId}/matches/upcoming?limit=${limit}`
    : `${API_BASE}/teams/${teamId}/matches/upcoming`;
  return fetchAPI<Match[]>(url);
}

// ============================================================================
// STATISTICS
// ============================================================================

export async function getTopScorersClient(
  leagueId: number,
  season?: number
): Promise<TopScorer[]> {
  const url = season
    ? `${API_BASE}/statistics/top-scorers/${leagueId}?season=${season}`
    : `${API_BASE}/statistics/top-scorers/${leagueId}`;
  return fetchAPI<TopScorer[]>(url);
}

export async function getHeadToHeadClient(
  team1Id: number,
  team2Id: number
): Promise<HeadToHead> {
  return fetchAPI<HeadToHead>(`${API_BASE}/statistics/h2h/${team1Id}/${team2Id}`);
}
