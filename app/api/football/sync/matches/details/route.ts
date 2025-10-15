/**
 * Sync Match Details API Route
 * Syncs detailed match data (statistics, events, lineups) for finished matches
 */

import { NextRequest, NextResponse } from "next/server";
import { getFootballSyncService } from "@/src/application/services/football-sync.service";
import { supabaseServer } from "@/src/infrastructure/config/supabase";

/**
 * POST /api/football/sync/matches/details
 * Sync detailed data for recent finished matches
 * 
 * Query params:
 * - matchIds: comma-separated match IDs (manual mode)
 * - limit: number of matches to sync (auto mode, default: 10)
 * - leagueId: filter by league (optional, for auto mode)
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const matchIdsParam = searchParams.get("matchIds");
    const limit = parseInt(searchParams.get("limit") || "10");
    const leagueId = searchParams.get("leagueId");

    let matchIds: number[];

    // Mode 1: Manual - matchIds provided
    if (matchIdsParam) {
      matchIds = matchIdsParam.split(",").map(id => parseInt(id));
    } 
    // Mode 2: Auto - fetch from database
    else {
      console.log(`🔄 Fetching finished matches from database (limit: ${limit})...`);
      
      let query = supabaseServer
        .from("football_matches")
        .select("id")
        .eq("status", "finished")
        .order("match_date", { ascending: false })
        .limit(limit);

      if (leagueId) {
        query = query.eq("league_id", parseInt(leagueId));
      }

      const { data: matches, error } = await query;

      if (error || !matches || matches.length === 0) {
        return NextResponse.json({
          success: true,
          message: "No finished matches found to sync",
          data: {
            matchesProcessed: 0,
          },
        });
      }

      matchIds = matches.map(m => m.id);
      console.log(`✅ Found ${matchIds.length} finished matches to sync`);
    }

    const syncService = getFootballSyncService();
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    console.log(`🔄 Syncing details for ${matchIds.length} matches...`);

    // Sync each match with 6 second delay
    for (const matchId of matchIds) {
      try {
        console.log(`🔄 Syncing details for match ${matchId}...`);
        await syncService.syncMatch(matchId);
        results.success++;
        console.log(`✅ Match ${matchId} details synced`);
        
        // Wait 6 seconds between requests to respect rate limit
        if (matchId !== matchIds[matchIds.length - 1]) {
          await new Promise(resolve => setTimeout(resolve, 6000));
        }
      } catch (error: any) {
        console.error(`❌ Error syncing match ${matchId}:`, error);
        results.failed++;
        results.errors.push(`Match ${matchId}: ${error.message}`);
      }
    }

    console.log(`✅ Match details sync completed: ${results.success} success, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      message: "Match details sync completed",
      data: {
        matchesProcessed: matchIds.length,
        successful: results.success,
        failed: results.failed,
        errors: results.errors,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error syncing match details:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync match details",
      },
      { status: 500 }
    );
  }
}
