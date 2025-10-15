/**
 * Manual Sync Leagues API Route
 * Endpoint to manually trigger leagues sync
 */

import { NextRequest, NextResponse } from "next/server";
import { getFootballSyncService } from "@/src/application/services/football-sync.service";

/**
 * POST /api/football/sync/leagues
 * Manually sync all leagues
 */
export async function POST(request: NextRequest) {
  try {
    const syncService = getFootballSyncService();
    
    console.log("🔄 Manual sync: Leagues...");
    // This will trigger the leagues sync
    await syncService.syncLeagueMatches(2021); // Trigger any league to start sync

    return NextResponse.json({
      success: true,
      message: "Leagues sync triggered successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error syncing leagues:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync leagues",
      },
      { status: 500 }
    );
  }
}
