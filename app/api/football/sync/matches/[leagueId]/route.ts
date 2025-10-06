/**
 * Manual Sync League Matches API Route
 * Endpoint to manually trigger matches sync for a specific league
 */

import { NextRequest, NextResponse } from "next/server";
import { getFootballSyncService } from "@/src/application/services/football-sync.service";

/**
 * POST /api/football/sync/matches/[leagueId]
 * Manually sync matches for a specific league
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  try {
    const { leagueId } = await params;
    const leagueIdNum = parseInt(leagueId);

    if (isNaN(leagueIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid league ID",
        },
        { status: 400 }
      );
    }

    const syncService = getFootballSyncService();
    
    console.log(`🔄 Manual sync: Matches for league ${leagueIdNum}...`);
    await syncService.syncLeagueMatches(leagueIdNum);

    return NextResponse.json({
      success: true,
      message: `Matches sync triggered successfully for league ${leagueIdNum}`,
      data: {
        leagueId: leagueIdNum,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error syncing matches:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync matches",
      },
      { status: 500 }
    );
  }
}
