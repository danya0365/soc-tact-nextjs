/**
 * Supabase Football Repository Implementation
 * Implements FootballRepository interface with caching strategy
 * Data is cached in Supabase DB to avoid API rate limits
 */

import axios, { AxiosInstance } from "axios";
import {
  HeadToHead,
  League,
  Lineup,
  Match,
  MatchEvent,
  MatchStatistics,
  MatchStatus,
  Standing,
  Team,
  TopScorer,
} from "../../domain/entities/football.entity";
import { FootballRepository } from "../../domain/repositories/football.repository";
import { FOOTBALL_API_CONFIG } from "../config/football-api.config";
import { supabaseServer as supabase } from "../config/supabase";

export class SupabaseFootballRepository implements FootballRepository {
  private apiClient: AxiosInstance;
  private readonly API_BASE_URL = FOOTBALL_API_CONFIG.FOOTBALL_DATA.BASE_URL;
  private readonly API_KEY = FOOTBALL_API_CONFIG.FOOTBALL_DATA.API_KEY;

  constructor() {
    // Initialize axios client for football-data.org API
    this.apiClient = axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        "X-Auth-Token": this.API_KEY,
      },
      timeout: 10000,
    });
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Check if cached data is expired
   */
  private isCacheExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return true;
    return new Date(expiresAt) < new Date();
  }

  /**
   * Log API sync operation
   */
  private async logApiSync(
    endpoint: string,
    resourceType: string,
    resourceId: string | null,
    status: "success" | "error" | "rate_limited",
    recordsSynced: number = 0,
    errorMessage: string | null = null,
    durationMs: number = 0
  ): Promise<void> {
    try {
      await supabase.from("football_api_sync_log").insert({
        endpoint,
        resource_type: resourceType,
        resource_id: resourceId,
        status,
        records_synced: recordsSynced,
        error_message: errorMessage,
        duration_ms: durationMs,
      });
    } catch (error) {
      console.error("Failed to log API sync:", error);
    }
  }

  /**
   * Fetch data from API with error handling and logging
   */
  private async fetchFromAPI<T>(
    endpoint: string,
    resourceType: string,
    resourceId: string | null = null
  ): Promise<T | null> {
    const startTime = Date.now();
    try {
      const response = await this.apiClient.get<T>(endpoint);
      const duration = Date.now() - startTime;

      await this.logApiSync(
        endpoint,
        resourceType,
        resourceId,
        "success",
        1,
        null,
        duration
      );

      return response.data;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const errorMessage = error.response?.data?.message || error.message;
      const status = error.response?.status === 429 ? "rate_limited" : "error";

      await this.logApiSync(
        endpoint,
        resourceType,
        resourceId,
        status,
        0,
        errorMessage,
        duration
      );

      console.error(`API Error [${endpoint}]:`, errorMessage);
      return null;
    }
  }
  // ============================================================================
  // LEAGUES
  // ============================================================================

  async getAllLeagues(): Promise<League[]> {
    // Try cache first
    const { data: cachedLeagues, error } = await supabase
      .from("football_leagues")
      .select("*")
      .order("name", { ascending: true });

    if (!error && cachedLeagues && cachedLeagues.length > 0) {
      // Check if cache is still valid
      const validLeagues = cachedLeagues.filter(
        (league) => !this.isCacheExpired(league.expires_at)
      );

      if (validLeagues.length > 0) {
        return validLeagues.map(this.mapLeagueFromDB);
      }
    }

    // Fetch from API if cache is expired or empty
    const apiData = await this.fetchFromAPI<{ competitions: any[] }>(
      "/competitions",
      "leagues"
    );

    if (!apiData || !apiData.competitions) {
      return cachedLeagues ? cachedLeagues.map(this.mapLeagueFromDB) : [];
    }

    // Cache the data
    const leaguesToCache = apiData.competitions.map((comp: any) => ({
      id: comp.id,
      api_id: comp.id,
      api_code: comp.code,
      name: comp.name,
      country: comp.area?.name || "International",
      logo: comp.emblem || "",
      season: comp.currentSeason?.id || new Date().getFullYear(),
      type: comp.type || "LEAGUE",
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      last_synced: new Date().toISOString(),
    }));

    await supabase.from("football_leagues").upsert(leaguesToCache);

    return leaguesToCache.map(this.mapLeagueFromDB);
  }

  async getLeagueById(leagueId: number): Promise<League> {
    // Try cache first
    const { data: cached } = await supabase
      .from("football_leagues")
      .select("*")
      .eq("id", leagueId)
      .single();

    if (cached && !this.isCacheExpired(cached.expires_at)) {
      return this.mapLeagueFromDB(cached);
    }

    // Fetch from API
    const apiData = await this.fetchFromAPI<any>(
      `/competitions/${leagueId}`,
      "leagues",
      leagueId.toString()
    );

    if (!apiData) {
      throw new Error(`League ${leagueId} not found`);
    }

    // Cache the data
    const leagueToCache = {
      id: apiData.id,
      api_id: apiData.id,
      api_code: apiData.code,
      name: apiData.name,
      country: apiData.area?.name || "International",
      logo: apiData.emblem || "",
      season: apiData.currentSeason?.id || new Date().getFullYear(),
      type: apiData.type || "LEAGUE",
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      last_synced: new Date().toISOString(),
    };

    await supabase.from("football_leagues").upsert(leagueToCache);

    return this.mapLeagueFromDB(leagueToCache);
  }

  async getLeaguesByCountry(country: string): Promise<League[]> {
    const { data } = await supabase
      .from("football_leagues")
      .select("*")
      .eq("country", country)
      .order("name");

    return data ? data.map(this.mapLeagueFromDB) : [];
  }

  // ============================================================================
  // MATCHES
  // ============================================================================

  async getLiveMatches(): Promise<Match[]> {
    // Check cache first (30 second cache for live matches)
    const { data: cached } = await supabase
      .from("football_matches")
      .select(
        "*, home_team:football_teams!home_team_id(*), away_team:football_teams!away_team_id(*), league:football_leagues(*)"
      )
      .eq("is_live", true)
      .gt("expires_at", new Date().toISOString());

    if (cached && cached.length > 0) {
      return cached.map(this.mapMatchFromDB);
    }

    // Fetch from API
    const apiData = await this.fetchFromAPI<{ matches: any[] }>(
      "/matches?status=LIVE",
      "matches"
    );

    if (!apiData || !apiData.matches) {
      return [];
    }

    // Cache the matches
    await this.cacheMatches(apiData.matches, true);

    // Return from cache
    const { data: newCached } = await supabase
      .from("football_matches")
      .select(
        "*, home_team:football_teams!home_team_id(*), away_team:football_teams!away_team_id(*), league:football_leagues(*)"
      )
      .eq("is_live", true);

    return newCached ? newCached.map(this.mapMatchFromDB) : [];
  }

  async getMatchesByDate(date: string): Promise<Match[]> {
    const targetDate = new Date(date);
    const { data } = await supabase.rpc("get_matches_by_date", {
      target_date: targetDate.toISOString().split("T")[0],
    });

    return data ? data.map(this.mapMatchFromDB) : [];
  }

  async getMatchesByLeague(
    leagueId: number,
    season?: number
  ): Promise<Match[]> {
    const { data } = await supabase
      .from("football_matches")
      .select(
        "*, home_team:football_teams!home_team_id(*), away_team:football_teams!away_team_id(*), league:football_leagues(*)"
      )
      .eq("league_id", leagueId)
      .order("match_date", { ascending: false });

    return data ? data.map(this.mapMatchFromDB) : [];
  }

  async getMatchById(matchId: number, forceRefresh: boolean = false): Promise<Match> {
    // Try cache first (unless force refresh)
    if (!forceRefresh) {
      const { data: cached } = await supabase
        .from("football_matches")
        .select(
          "*, home_team:football_teams!home_team_id(*), away_team:football_teams!away_team_id(*), league:football_leagues(*)"
        )
        .eq("id", matchId)
        .single();

      // Check if cache is valid
      if (cached && !this.isCacheExpired(cached.expires_at)) {
        console.log(`✅ Using cached data for match ${matchId}`);
        return this.mapMatchFromDB(cached);
      }
    }

    // Fetch from API if cache is expired, empty, or force refresh
    console.log(`🔄 Fetching match ${matchId} from API...`);
    const apiData = await this.fetchFromAPI<any>(
      `/matches/${matchId}`,
      "match",
      matchId.toString()
    );

    if (!apiData) {
      // Fallback to cache if API fails
      const { data: cached } = await supabase
        .from("football_matches")
        .select(
          "*, home_team:football_teams!home_team_id(*), away_team:football_teams!away_team_id(*), league:football_leagues(*)"
        )
        .eq("id", matchId)
        .single();

      if (cached) {
        console.log(`⚠️ API failed, using cached data for match ${matchId}`);
        return this.mapMatchFromDB(cached);
      }
      throw new Error(`Match ${matchId} not found`);
    }

    // Cache the match with detailed data
    console.log(`💾 Caching match ${matchId} with details...`);
    await this.cacheMatchDetails(apiData);

    // Return from cache
    const { data: newCached } = await supabase
      .from("football_matches")
      .select(
        "*, home_team:football_teams!home_team_id(*), away_team:football_teams!away_team_id(*), league:football_leagues(*)"
      )
      .eq("id", matchId)
      .single();

    if (!newCached) {
      throw new Error(`Match ${matchId} not found after caching`);
    }

    return this.mapMatchFromDB(newCached);
  }

  async getUpcomingMatches(leagueId?: number): Promise<Match[]> {
    // Try cache first
    let query = supabase
      .from("football_matches")
      .select(
        "*, home_team:football_teams!home_team_id(*), away_team:football_teams!away_team_id(*), league:football_leagues(*)"
      )
      .eq("status", "scheduled")
      .gt("match_date", new Date().toISOString())
      .order("match_date", { ascending: true })
      .limit(20);

    if (leagueId) {
      query = query.eq("league_id", leagueId);
    }

    const { data: cached } = await query;

    // Check if we have valid cache
    if (cached && cached.length > 0) {
      const validCache = cached.filter(
        (match) => !this.isCacheExpired(match.expires_at)
      );
      if (validCache.length > 0) {
        return validCache.map(this.mapMatchFromDB);
      }
    }

    // Fetch from API if cache is expired or empty
    const endpoint = leagueId
      ? `/competitions/${leagueId}/matches?status=SCHEDULED`
      : "/matches?status=SCHEDULED";

    const apiData = await this.fetchFromAPI<{ matches: any[] }>(
      endpoint,
      "matches",
      leagueId?.toString() || null
    );

    if (!apiData || !apiData.matches) {
      return cached ? cached.map(this.mapMatchFromDB) : [];
    }

    // Cache the matches
    await this.cacheMatches(apiData.matches, false);

    // Return from cache
    const { data: newCached } = await query;
    return newCached ? newCached.map(this.mapMatchFromDB) : [];
  }

  async getFinishedMatches(leagueId?: number): Promise<Match[]> {
    // Try cache first
    let query = supabase
      .from("football_matches")
      .select(
        "*, home_team:football_teams!home_team_id(*), away_team:football_teams!away_team_id(*), league:football_leagues(*)"
      )
      .eq("status", "finished")
      .order("match_date", { ascending: false })
      .limit(20);

    if (leagueId) {
      query = query.eq("league_id", leagueId);
    }

    const { data: cached } = await query;

    // Check if we have valid cache
    if (cached && cached.length > 0) {
      const validCache = cached.filter(
        (match) => !this.isCacheExpired(match.expires_at)
      );
      if (validCache.length > 0) {
        return validCache.map(this.mapMatchFromDB);
      }
    }

    // Fetch from API if cache is expired or empty
    const endpoint = leagueId
      ? `/competitions/${leagueId}/matches?status=FINISHED`
      : "/matches?status=FINISHED";

    const apiData = await this.fetchFromAPI<{ matches: any[] }>(
      endpoint,
      "matches",
      leagueId?.toString() || null
    );

    if (!apiData || !apiData.matches) {
      return cached ? cached.map(this.mapMatchFromDB) : [];
    }

    // Cache the matches
    await this.cacheMatches(apiData.matches, false);

    // Return from cache
    const { data: newCached } = await query;
    return newCached ? newCached.map(this.mapMatchFromDB) : [];
  }

  // ============================================================================
  // STANDINGS
  // ============================================================================

  async getStandingsByLeague(
    leagueId: number,
    season?: number
  ): Promise<Standing[]> {
    const currentSeason = season || new Date().getFullYear();

    // Try cache first
    const { data: cached } = await supabase
      .from("football_standings")
      .select("*, team:football_teams(*)")
      .eq("league_id", leagueId)
      .eq("season", currentSeason)
      .order("position", { ascending: true });

    // Check if cache is valid
    if (cached && cached.length > 0) {
      const firstItem = cached[0];
      if (!this.isCacheExpired(firstItem.expires_at)) {
        return cached.map(this.mapStandingFromDB);
      }
    }

    // Fetch from API if cache is expired or empty
    const apiData = await this.fetchFromAPI<{ standings: any[] }>(
      `/competitions/${leagueId}/standings`,
      "standings",
      leagueId.toString()
    );

    if (!apiData || !apiData.standings || apiData.standings.length === 0) {
      return cached ? cached.map(this.mapStandingFromDB) : [];
    }

    // Extract table data (usually first standings array contains the main table)
    const tableData = apiData.standings[0]?.table || [];

    if (tableData.length === 0) {
      return [];
    }

    // First, cache teams if they don't exist
    const teamsToCache = tableData.map((standing: any) => ({
      id: standing.team.id,
      api_id: standing.team.id,
      name: standing.team.name,
      short_name: standing.team.shortName || standing.team.name,
      tla: standing.team.tla || "",
      logo: standing.team.crest || "",
      country: standing.team.area?.name || "",
      venue: standing.team.venue || null,
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      last_synced: new Date().toISOString(),
    }));

    // Upsert teams
    await supabase.from("football_teams").upsert(teamsToCache);

    // Then cache standings
    const standingsToCache = tableData.map((standing: any) => ({
      league_id: leagueId,
      season: currentSeason,
      team_id: standing.team.id,
      position: standing.position,
      played: standing.playedGames,
      won: standing.won,
      drawn: standing.draw,
      lost: standing.lost,
      goals_for: standing.goalsFor,
      goals_against: standing.goalsAgainst,
      goal_difference: standing.goalDifference,
      points: standing.points,
      form: standing.form ? standing.form.split(",") : null,
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      last_synced: new Date().toISOString(),
    }));

    // Delete old standings for this league/season
    await supabase
      .from("football_standings")
      .delete()
      .eq("league_id", leagueId)
      .eq("season", currentSeason);

    // Insert new standings
    await supabase.from("football_standings").insert(standingsToCache);

    // Return from cache
    const { data: newCached } = await supabase
      .from("football_standings")
      .select("*, team:football_teams(*)")
      .eq("league_id", leagueId)
      .eq("season", currentSeason)
      .order("position", { ascending: true });

    return newCached ? newCached.map(this.mapStandingFromDB) : [];
  }

  // ============================================================================
  // TEAMS
  // ============================================================================

  async getTeamById(teamId: number): Promise<Team> {
    const { data } = await supabase
      .from("football_teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (!data) {
      throw new Error(`Team ${teamId} not found`);
    }

    return this.mapTeamFromDB(data);
  }

  async getTeamsByLeague(leagueId: number): Promise<Team[]> {
    const { data } = await supabase
      .from("football_standings")
      .select("team:football_teams(*)")
      .eq("league_id", leagueId);

    return data ? data.map((item: any) => this.mapTeamFromDB(item.team)) : [];
  }

  async searchTeams(query: string): Promise<Team[]> {
    const { data } = await supabase
      .from("football_teams")
      .select("*")
      .ilike("name", `%${query}%`)
      .limit(10);

    return data ? data.map(this.mapTeamFromDB) : [];
  }

  // ============================================================================
  // MATCH DETAILS (Placeholder implementations)
  // ============================================================================

  async getMatchStatistics(matchId: number): Promise<MatchStatistics> {
    // TODO: Implement match statistics fetching
    throw new Error("Not implemented yet");
  }

  async getMatchEvents(matchId: number): Promise<MatchEvent[]> {
    // TODO: Implement match events fetching
    return [];
  }

  async getMatchLineups(matchId: number): Promise<Lineup> {
    // TODO: Implement match lineups fetching
    throw new Error("Not implemented yet");
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  async getTopScorers(leagueId: number, season?: number): Promise<TopScorer[]> {
    const currentSeason = season || new Date().getFullYear();

    // Try cache first
    const { data: cached } = await supabase
      .from("football_top_scorers")
      .select("*, player:football_players(*), team:football_teams(*)")
      .eq("league_id", leagueId)
      .eq("season", currentSeason)
      .order("goals", { ascending: false })
      .limit(20);

    // Check if cache is valid
    if (cached && cached.length > 0) {
      const firstItem = cached[0];
      if (!this.isCacheExpired(firstItem.expires_at)) {
        return cached.map(this.mapTopScorerFromDB);
      }
    }

    // Fetch from API if cache is expired or empty
    const apiData = await this.fetchFromAPI<{ scorers: any[] }>(
      `/competitions/${leagueId}/scorers`,
      "top_scorers",
      leagueId.toString()
    );

    if (!apiData || !apiData.scorers || apiData.scorers.length === 0) {
      return cached ? cached.map(this.mapTopScorerFromDB) : [];
    }

    // First, cache players and teams
    const playersToCache = apiData.scorers.map((scorer: any) => ({
      id: scorer.player.id,
      api_id: scorer.player.id,
      name: scorer.player.name,
      first_name: scorer.player.firstName || null,
      last_name: scorer.player.lastName || null,
      date_of_birth: scorer.player.dateOfBirth || null,
      nationality: scorer.player.nationality || "",
      position: this.mapPlayerPosition(scorer.player.position),
      shirt_number: scorer.player.shirtNumber || null,
      photo: null,
      team_id: scorer.team.id,
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      last_synced: new Date().toISOString(),
    }));

    const teamsToCache = apiData.scorers.map((scorer: any) => ({
      id: scorer.team.id,
      api_id: scorer.team.id,
      name: scorer.team.name,
      short_name: scorer.team.shortName || scorer.team.name,
      tla: scorer.team.tla || "",
      logo: scorer.team.crest || "",
      country: scorer.team.area?.name || "",
      venue: null,
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      last_synced: new Date().toISOString(),
    }));

    // Upsert players and teams
    await supabase.from("football_players").upsert(playersToCache);
    await supabase.from("football_teams").upsert(teamsToCache);

    // Cache top scorers
    const scorersToCache = apiData.scorers.map((scorer: any) => ({
      league_id: leagueId,
      season: currentSeason,
      player_id: scorer.player.id,
      team_id: scorer.team.id,
      goals: scorer.goals || 0,
      assists: scorer.assists || 0,
      appearances: scorer.playedMatches || 0,
      penalties: scorer.penalties || 0,
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      last_synced: new Date().toISOString(),
    }));

    // Delete old top scorers for this league/season
    await supabase
      .from("football_top_scorers")
      .delete()
      .eq("league_id", leagueId)
      .eq("season", currentSeason);

    // Insert new top scorers
    await supabase.from("football_top_scorers").insert(scorersToCache);

    // Return from cache
    const { data: newCached } = await supabase
      .from("football_top_scorers")
      .select("*, player:football_players(*), team:football_teams(*)")
      .eq("league_id", leagueId)
      .eq("season", currentSeason)
      .order("goals", { ascending: false })
      .limit(20);

    return newCached ? newCached.map(this.mapTopScorerFromDB) : [];
  }

  /**
   * Helper: Map player position from API to enum
   */
  private mapPlayerPosition(
    position: string | null
  ): "Goalkeeper" | "Defender" | "Midfielder" | "Attacker" | null {
    if (!position) return null;

    const positionMap: Record<
      string,
      "Goalkeeper" | "Defender" | "Midfielder" | "Attacker"
    > = {
      Goalkeeper: "Goalkeeper",
      Defence: "Defender",
      Defender: "Defender",
      Midfield: "Midfielder",
      Midfielder: "Midfielder",
      Offence: "Attacker",
      Attacker: "Attacker",
      Forward: "Attacker",
    };

    return positionMap[position] || "Midfielder";
  }

  async getHeadToHead(team1Id: number, team2Id: number): Promise<HeadToHead> {
    // TODO: Implement head-to-head fetching
    throw new Error("Not implemented yet");
  }

  // ============================================================================
  // HELPER METHODS FOR CACHING
  // ============================================================================

  private async cacheMatches(
    matches: any[],
    isLive: boolean = false
  ): Promise<void> {
    const matchesToCache = matches.map((match: any) => ({
      id: match.id,
      api_id: match.id,
      league_id: match.competition?.id,
      season: match.season?.id || new Date().getFullYear(),
      match_date: match.utcDate,
      status: this.mapMatchStatus(match.status),
      minute: match.minute || null,
      home_team_id: match.homeTeam?.id,
      away_team_id: match.awayTeam?.id,
      home_score: match.score?.fullTime?.home,
      away_score: match.score?.fullTime?.away,
      home_score_halftime: match.score?.halfTime?.home,
      away_score_halftime: match.score?.halfTime?.away,
      home_score_fulltime: match.score?.fullTime?.home,
      away_score_fulltime: match.score?.fullTime?.away,
      venue: match.venue || null,
      referee: match.referees?.[0]?.name || null,
      api_matchday: match.matchday || null,
      is_live: isLive,
      cached_at: new Date().toISOString(),
      expires_at: new Date(
        Date.now() + (isLive ? 30 * 1000 : 60 * 60 * 1000)
      ).toISOString(),
      last_synced: new Date().toISOString(),
    }));

    await supabase.from("football_matches").upsert(matchesToCache);
  }

  /**
   * Cache match details including statistics, events, and lineups
   */
  private async cacheMatchDetails(match: any): Promise<void> {
    // 1. Cache basic match data
    await this.cacheMatches([match], match.status === "IN_PLAY");

    const matchId = match.id;

    // Log what data is available
    console.log(`📊 Match ${matchId} data available:`, {
      hasStatistics: !!match.statistics,
      hasGoals: !!match.goals && match.goals.length > 0,
      hasBookings: !!match.bookings && match.bookings.length > 0,
      hasSubstitutions: !!match.substitutions && match.substitutions.length > 0,
      hasLineups: !!match.lineups && match.lineups.length > 0,
    });

    // 2. Cache match statistics (if available)
    if (match.statistics) {
      const homeStats = match.statistics.find(
        (s: any) => s.team.id === match.homeTeam.id
      );
      const awayStats = match.statistics.find(
        (s: any) => s.team.id === match.awayTeam.id
      );

      if (homeStats || awayStats) {
        const statsToCache = {
          match_id: matchId,
          home_possession: homeStats?.possession || null,
          away_possession: awayStats?.possession || null,
          home_shots: homeStats?.shots || null,
          away_shots: awayStats?.shots || null,
          home_shots_on_target: homeStats?.shotsOnTarget || null,
          away_shots_on_target: awayStats?.shotsOnTarget || null,
          home_corners: homeStats?.corners || null,
          away_corners: awayStats?.corners || null,
          home_fouls: homeStats?.fouls || null,
          away_fouls: awayStats?.fouls || null,
          home_yellow_cards: homeStats?.yellowCards || null,
          away_yellow_cards: awayStats?.yellowCards || null,
          home_red_cards: homeStats?.redCards || null,
          away_red_cards: awayStats?.redCards || null,
          home_offsides: homeStats?.offsides || null,
          away_offsides: awayStats?.offsides || null,
          cached_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
          last_synced: new Date().toISOString(),
        };

        await supabase.from("football_match_statistics").upsert(statsToCache);
      }
    }

    // 3. Cache match events (goals, cards, substitutions)
    if (match.goals && match.goals.length > 0) {
      const eventsToCache = match.goals.map((goal: any) => ({
        match_id: matchId,
        event_type: "goal" as const,
        minute: goal.minute,
        extra_time: goal.extraTime || null,
        team_id: goal.team.id,
        player_id: goal.scorer?.id || null,
        player_name: goal.scorer?.name || null,
        assist_player_id: goal.assist?.id || null,
        assist_player_name: goal.assist?.name || null,
        event_data: goal,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 1000).toISOString(), // 30 seconds
        last_synced: new Date().toISOString(),
      }));

      await supabase.from("football_match_events").upsert(eventsToCache);
    }

    // 4. Cache bookings (cards)
    if (match.bookings && match.bookings.length > 0) {
      const bookingsToCache = match.bookings.map((booking: any) => ({
        match_id: matchId,
        event_type:
          booking.card === "YELLOW_CARD"
            ? ("yellow_card" as const)
            : ("red_card" as const),
        minute: booking.minute,
        extra_time: null,
        team_id: booking.team.id,
        player_id: booking.player?.id || null,
        player_name: booking.player?.name || null,
        assist_player_id: null,
        assist_player_name: null,
        event_data: booking,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 1000).toISOString(),
        last_synced: new Date().toISOString(),
      }));

      await supabase.from("football_match_events").upsert(bookingsToCache);
    }

    // 5. Cache substitutions
    if (match.substitutions && match.substitutions.length > 0) {
      const subsToCache = match.substitutions.map((sub: any) => ({
        match_id: matchId,
        event_type: "substitution" as const,
        minute: sub.minute,
        extra_time: null,
        team_id: sub.team.id,
        player_id: sub.playerOut?.id || null,
        player_name: sub.playerOut?.name || null,
        assist_player_id: sub.playerIn?.id || null, // Using assist field for playerIn
        assist_player_name: sub.playerIn?.name || null,
        event_data: sub,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 1000).toISOString(),
        last_synced: new Date().toISOString(),
      }));

      await supabase.from("football_match_events").upsert(subsToCache);
    }

    // 6. Cache lineups (if available)
    if (match.lineups && match.lineups.length > 0) {
      for (const lineup of match.lineups) {
        // Starting XI
        if (lineup.startingEleven) {
          const startingXIToCache = lineup.startingEleven.map(
            (player: any) => ({
              match_id: matchId,
              team_id: lineup.team.id,
              player_id: player.id,
              player_name: player.name,
              position: this.mapPlayerPosition(player.position),
              shirt_number: player.shirtNumber || null,
              is_starter: true,
              cached_at: new Date().toISOString(),
              last_synced: new Date().toISOString(),
            })
          );

          await supabase.from("football_lineups").upsert(startingXIToCache);
        }

        // Substitutes
        if (lineup.substitutes) {
          const substitutesToCache = lineup.substitutes.map((player: any) => ({
            match_id: matchId,
            team_id: lineup.team.id,
            player_id: player.id,
            player_name: player.name,
            position: this.mapPlayerPosition(player.position),
            shirt_number: player.shirtNumber || null,
            is_starter: false,
            cached_at: new Date().toISOString(),
            last_synced: new Date().toISOString(),
          }));

          await supabase.from("football_lineups").upsert(substitutesToCache);
        }
      }
    }
  }

  // ============================================================================
  // MAPPING FUNCTIONS
  // ============================================================================

  private mapLeagueFromDB = (data: any): League => {
    return {
      id: data.id,
      name: data.name,
      country: data.country,
      logo: data.logo || "",
      season: data.season,
      type: data.type,
    };
  };

  private mapTeamFromDB = (data: any): Team => {
    return {
      id: data.id,
      name: data.name,
      shortName: data.short_name || data.name,
      logo: data.logo || "",
      founded: data.founded,
      country: data.country,
      venue: data.venue,
    };
  };

  private mapMatchFromDB = (data: any): Match => {
    return {
      id: data.id,
      date: data.match_date,
      timestamp: new Date(data.match_date).getTime(),
      status: data.status as MatchStatus,
      minute: data.minute,
      homeTeam: this.mapTeamFromDB(data.home_team),
      awayTeam: this.mapTeamFromDB(data.away_team),
      score: {
        home: data.home_score,
        away: data.away_score,
        halftime: {
          home: data.home_score_halftime,
          away: data.away_score_halftime,
        },
        fulltime: {
          home: data.home_score_fulltime,
          away: data.away_score_fulltime,
        },
      },
      league: this.mapLeagueFromDB(data.league),
      venue: data.venue,
    };
  };

  private mapStandingFromDB = (data: any): Standing => {
    return {
      position: data.position,
      team: this.mapTeamFromDB(data.team),
      played: data.played,
      won: data.won,
      drawn: data.drawn,
      lost: data.lost,
      goalsFor: data.goals_for,
      goalsAgainst: data.goals_against,
      goalDifference: data.goal_difference,
      points: data.points,
      form: data.form || [],
      description: data.description,
    };
  };

  private mapTopScorerFromDB = (data: any): TopScorer => {
    return {
      player: {
        id: data.player.id,
        name: data.player.name,
        firstName: data.player.first_name,
        lastName: data.player.last_name,
        nationality: data.player.nationality,
        position: data.player.position,
        photo: data.player.photo,
      },
      team: this.mapTeamFromDB(data.team),
      goals: data.goals,
      assists: data.assists,
      appearances: data.appearances,
    };
  };

  private mapMatchStatus(
    status: string
  ):
    | "scheduled"
    | "live"
    | "in_play"
    | "paused"
    | "finished"
    | "postponed"
    | "cancelled"
    | "suspended" {
    const statusMap: Record<
      string,
      | "scheduled"
      | "live"
      | "in_play"
      | "paused"
      | "finished"
      | "postponed"
      | "cancelled"
      | "suspended"
    > = {
      SCHEDULED: "scheduled",
      TIMED: "scheduled",
      IN_PLAY: "live",
      PAUSED: "paused",
      FINISHED: "finished",
      POSTPONED: "postponed",
      CANCELLED: "cancelled",
      SUSPENDED: "suspended",
    };
    return statusMap[status] || "scheduled";
  }
}
