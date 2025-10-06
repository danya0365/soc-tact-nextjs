/**
 * Manual Sync All Data API Route
 * Endpoint to manually trigger full sync of all football data
 */

import { NextRequest, NextResponse } from "next/server";
import { SupabaseFootballRepository } from "@/src/infrastructure/repositories/supabase-football.repository";
import { LEAGUE_IDS } from "@/src/infrastructure/config/football-api.config";

/**
 * POST /api/football/sync/all
 * Manually sync all football data (leagues, standings, matches)
 */
export async function POST(request: NextRequest) {
  try {
    const repository = new SupabaseFootballRepository();
    const results = {
      leagues: 0,
      standings: {} as Record<number, number>,
      liveMatches: 0,
    };

    console.log("🔄 Manual full sync started...");

    // 1. Sync all leagues
    console.log("📋 Syncing leagues...");
    const leagues = await repository.getAllLeagues();
    results.leagues = leagues.length;
    console.log(`✅ Synced ${leagues.length} leagues`);

    // 2. Sync standings for all major leagues
    console.log("📊 Syncing standings for all leagues...");
    const leagueIds = Object.values(LEAGUE_IDS);
    
    for (const leagueId of leagueIds) {
      try {
        const standings = await repository.getStandingsByLeague(leagueId);
        results.standings[leagueId] = standings.length;
        console.log(`✅ League ${leagueId}: ${standings.length} teams`);
        
        // Wait 6 seconds between requests to respect rate limit
        await new Promise(resolve => setTimeout(resolve, 6000));
      } catch (error) {
        console.error(`❌ Error syncing league ${leagueId}:`, error);
        results.standings[leagueId] = 0;
      }
    }

    // 3. Sync top scorers for all leagues
    console.log("🏆 Syncing top scorers for all leagues...");
    const topScorers: Record<number, number> = {};
    
    for (const leagueId of leagueIds) {
      try {
        const scorers = await repository.getTopScorers(leagueId);
        topScorers[leagueId] = scorers.length;
        console.log(`✅ League ${leagueId}: ${scorers.length} top scorers`);
        
        // Wait 6 seconds between requests
        await new Promise(resolve => setTimeout(resolve, 6000));
      } catch (error) {
        console.error(`❌ Error syncing top scorers for league ${leagueId}:`, error);
        topScorers[leagueId] = 0;
      }
    }

    // 4. Sync upcoming matches for major leagues
    console.log("📅 Syncing upcoming matches...");
    let upcomingMatchesCount = 0;
    
    for (const leagueId of leagueIds.slice(0, 5)) { // Top 5 leagues only
      try {
        const matches = await repository.getUpcomingMatches(leagueId);
        upcomingMatchesCount += matches.length;
        console.log(`✅ League ${leagueId}: ${matches.length} upcoming matches`);
        
        // Wait 6 seconds between requests
        await new Promise(resolve => setTimeout(resolve, 6000));
      } catch (error) {
        console.error(`❌ Error syncing upcoming matches for league ${leagueId}:`, error);
      }
    }

    // 5. Sync finished matches for major leagues
    console.log("✅ Syncing recent finished matches...");
    let finishedMatchesCount = 0;
    
    for (const leagueId of leagueIds.slice(0, 5)) { // Top 5 leagues only
      try {
        const matches = await repository.getFinishedMatches(leagueId);
        finishedMatchesCount += matches.length;
        console.log(`✅ League ${leagueId}: ${matches.length} finished matches`);
        
        // Wait 6 seconds between requests
        await new Promise(resolve => setTimeout(resolve, 6000));
      } catch (error) {
        console.error(`❌ Error syncing finished matches for league ${leagueId}:`, error);
      }
    }

    // 6. Sync live matches
    console.log("⚽ Syncing live matches...");
    const liveMatches = await repository.getLiveMatches();
    results.liveMatches = liveMatches.length;
    console.log(`✅ Synced ${liveMatches.length} live matches`);

    console.log("✅ Manual full sync completed!");

    return NextResponse.json({
      success: true,
      message: "Full sync completed successfully",
      data: {
        ...results,
        topScorers,
        upcomingMatches: upcomingMatchesCount,
        finishedMatches: finishedMatchesCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in full sync:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to complete full sync",
      },
      { status: 500 }
    );
  }
}
