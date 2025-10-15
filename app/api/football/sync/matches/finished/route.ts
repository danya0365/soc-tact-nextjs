/**
 * Manual Sync Finished Matches API Route
 * Endpoint to manually trigger finished matches sync
 */

import { NextRequest, NextResponse } from "next/server";
import { getFootballSyncService } from "@/src/application/services/football-sync.service";

/**
 * POST /api/football/sync/matches/finished
 * Manually sync finished matches (all leagues or specific league via query param)
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leagueId = searchParams.get("leagueId");
    const leagueIdNum = leagueId ? parseInt(leagueId) : undefined;

    const syncService = getFootballSyncService();
    
    console.log(`🔄 Manual sync: Finished matches${leagueIdNum ? ` for league ${leagueIdNum}` : ''}...`);
    const count = await syncService.syncFinishedMatches(leagueIdNum);
    console.log(`✅ Synced ${count} finished matches`);

    return NextResponse.json({
      success: true,
      message: `Finished matches synced successfully`,
      data: {
        matchesCount: count,
        leagueId: leagueIdNum || "all",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error syncing finished matches:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync finished matches",
      },
      { status: 500 }
    );
  }
}
