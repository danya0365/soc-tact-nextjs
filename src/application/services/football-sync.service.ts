/**
 * Football Data Sync Service
 * Background service to sync football data from API to Supabase cache
 * Respects rate limits: 10 requests/minute for free tier
 */

import { SupabaseFootballRepository } from "../../infrastructure/repositories/supabase-football.repository";
import { LEAGUE_IDS } from "../../infrastructure/config/football-api.config";

export class FootballSyncService {
  private repository: SupabaseFootballRepository;
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.repository = new SupabaseFootballRepository();
  }

  /**
   * Start all sync jobs
   */
  startAllSyncs(): void {
    console.log("🚀 Starting Football Data Sync Service...");
    
    // Sync live matches every 30 seconds
    this.startLiveMatchesSync();
    
    // Sync standings every 1 hour
    this.startStandingsSync();
    
    // Sync leagues every 24 hours
    this.startLeaguesSync();
    
    console.log("✅ All sync jobs started successfully");
  }

  /**
   * Stop all sync jobs
   */
  stopAllSyncs(): void {
    console.log("🛑 Stopping all sync jobs...");
    this.syncIntervals.forEach((interval) => clearInterval(interval));
    this.syncIntervals.clear();
    console.log("✅ All sync jobs stopped");
  }

  /**
   * Sync live matches every 30 seconds
   */
  private startLiveMatchesSync(): void {
    const syncLiveMatches = async () => {
      try {
        console.log("🔄 Syncing live matches...");
        const matches = await this.repository.getLiveMatches();
        console.log(`✅ Synced ${matches.length} live matches`);
      } catch (error) {
        console.error("❌ Error syncing live matches:", error);
      }
    };

    // Run immediately
    syncLiveMatches();

    // Then run every 30 seconds
    const interval = setInterval(syncLiveMatches, 30 * 1000);
    this.syncIntervals.set("liveMatches", interval);
  }

  /**
   * Sync standings for all major leagues every 1 hour
   */
  private startStandingsSync(): void {
    const syncStandings = async () => {
      try {
        console.log("🔄 Syncing league standings...");
        const leagueIds = Object.values(LEAGUE_IDS);
        
        for (const leagueId of leagueIds) {
          try {
            const standings = await this.repository.getStandingsByLeague(leagueId);
            console.log(`✅ Synced standings for league ${leagueId}: ${standings.length} teams`);
            
            // Wait 6 seconds between requests to respect rate limit (10 req/min)
            await this.sleep(6000);
          } catch (error) {
            console.error(`❌ Error syncing standings for league ${leagueId}:`, error);
          }
        }
      } catch (error) {
        console.error("❌ Error syncing standings:", error);
      }
    };

    // Run immediately
    syncStandings();

    // Then run every 1 hour
    const interval = setInterval(syncStandings, 60 * 60 * 1000);
    this.syncIntervals.set("standings", interval);
  }

  /**
   * Sync all leagues every 24 hours
   */
  private startLeaguesSync(): void {
    const syncLeagues = async () => {
      try {
        console.log("🔄 Syncing leagues...");
        const leagues = await this.repository.getAllLeagues();
        console.log(`✅ Synced ${leagues.length} leagues`);
      } catch (error) {
        console.error("❌ Error syncing leagues:", error);
      }
    };

    // Run immediately
    syncLeagues();

    // Then run every 24 hours
    const interval = setInterval(syncLeagues, 24 * 60 * 60 * 1000);
    this.syncIntervals.set("leagues", interval);
  }

  /**
   * Manual sync for specific league matches
   */
  async syncLeagueMatches(leagueId: number): Promise<number> {
    try {
      console.log(`🔄 Syncing matches for league ${leagueId}...`);
      const matches = await this.repository.getMatchesByLeague(leagueId);
      console.log(`✅ Synced ${matches.length} matches for league ${leagueId}`);
      return matches.length;
    } catch (error) {
      console.error(`❌ Error syncing matches for league ${leagueId}:`, error);
      throw error;
    }
  }

  /**
   * Manual sync for upcoming matches
   */
  async syncUpcomingMatches(leagueId?: number): Promise<number> {
    try {
      console.log(`🔄 Syncing upcoming matches${leagueId ? ` for league ${leagueId}` : ''}...`);
      const matches = await this.repository.getUpcomingMatches(leagueId);
      console.log(`✅ Synced ${matches.length} upcoming matches`);
      return matches.length;
    } catch (error) {
      console.error("❌ Error syncing upcoming matches:", error);
      throw error;
    }
  }

  /**
   * Manual sync for finished matches
   */
  async syncFinishedMatches(leagueId?: number): Promise<number> {
    try {
      console.log(`🔄 Syncing finished matches${leagueId ? ` for league ${leagueId}` : ''}...`);
      const matches = await this.repository.getFinishedMatches(leagueId);
      console.log(`✅ Synced ${matches.length} finished matches`);
      return matches.length;
    } catch (error) {
      console.error("❌ Error syncing finished matches:", error);
      throw error;
    }
  }

  /**
   * Manual sync for top scorers
   */
  async syncTopScorers(leagueId: number): Promise<number> {
    try {
      console.log(`🔄 Syncing top scorers for league ${leagueId}...`);
      const scorers = await this.repository.getTopScorers(leagueId);
      console.log(`✅ Synced ${scorers.length} top scorers for league ${leagueId}`);
      return scorers.length;
    } catch (error) {
      console.error(`❌ Error syncing top scorers for league ${leagueId}:`, error);
      throw error;
    }
  }

  /**
   * Manual sync for specific match
   * @param matchId - Match ID to sync
   * @param forceRefresh - Force fetch from API even if cache is valid
   */
  async syncMatch(matchId: number, forceRefresh: boolean = true): Promise<void> {
    try {
      console.log(`🔄 Syncing match ${matchId}${forceRefresh ? ' (force refresh)' : ''}...`);
      const match = await this.repository.getMatchById(matchId, forceRefresh);
      console.log(`✅ Synced match ${matchId}: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
    } catch (error) {
      console.error(`❌ Error syncing match ${matchId}:`, error);
      throw error;
    }
  }

  /**
   * Helper: Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
let syncServiceInstance: FootballSyncService | null = null;

/**
 * Get or create singleton instance of FootballSyncService
 */
export function getFootballSyncService(): FootballSyncService {
  if (!syncServiceInstance) {
    syncServiceInstance = new FootballSyncService();
  }
  return syncServiceInstance;
}
