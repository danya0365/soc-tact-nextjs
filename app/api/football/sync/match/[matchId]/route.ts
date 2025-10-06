/**
 * Manual Sync Specific Match API Route
 * Endpoint to manually trigger sync for a specific match
 */

import { NextRequest, NextResponse } from "next/server";
import { getFootballSyncService } from "@/src/application/services/football-sync.service";

/**
 * POST /api/football/sync/match/[matchId]
 * Manually sync a specific match
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params;
    const matchIdNum = parseInt(matchId);

    if (isNaN(matchIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid match ID",
        },
        { status: 400 }
      );
    }

    const syncService = getFootballSyncService();
    
    console.log(`🔄 Manual sync: Match ${matchIdNum}...`);
    await syncService.syncMatch(matchIdNum);

    return NextResponse.json({
      success: true,
      message: `Match sync triggered successfully for match ${matchIdNum}`,
      data: {
        matchId: matchIdNum,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error syncing match:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync match",
      },
      { status: 500 }
    );
  }
}
