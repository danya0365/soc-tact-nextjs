/**
 * Football Client API
 * Client-side API wrapper that calls Next.js API routes (proxy)
 * This avoids CORS issues when calling Football-Data.org from browser
 */

import type { Match, Standing } from "@/src/domain/entities/football.entity";

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

/**
 * Get live matches (client-side)
 */
export async function getLiveMatchesClient(): Promise<Match[]> {
  return fetchAPI<Match[]>(`${API_BASE}/matches/live`);
}

/**
 * Get league standings (client-side)
 */
export async function getStandingsByLeagueClient(
  leagueId: number,
  season?: number
): Promise<Standing[]> {
  const url = season
    ? `${API_BASE}/standings/${leagueId}?season=${season}`
    : `${API_BASE}/standings/${leagueId}`;
  
  return fetchAPI<Standing[]>(url);
}
