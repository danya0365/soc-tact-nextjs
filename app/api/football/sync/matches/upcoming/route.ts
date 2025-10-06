/**
 * Manual Sync Upcoming Matches API Route
 * Endpoint to manually trigger upcoming matches sync
 */

import { NextRequest, NextResponse } from "next/server";
import { getFootballSyncService } from "@/src/application/services/football-sync.service";

/**
 * POST /api/football/sync/matches/upcoming
 * Manually sync upcoming matches (all leagues or specific league via query param)
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leagueId = searchParams.get("leagueId");
    const leagueIdNum = leagueId ? parseInt(leagueId) : undefined;

    const syncService = getFootballSyncService();
    
    console.log(`🔄 Manual sync: Upcoming matches${leagueIdNum ? ` for league ${leagueIdNum}` : ''}...`);
    const count = await syncService.syncUpcomingMatches(leagueIdNum);
    console.log(`✅ Synced ${count} upcoming matches`);

    return NextResponse.json({
      success: true,
      message: `Upcoming matches synced successfully`,
      data: {
        matchesCount: count,
        leagueId: leagueIdNum || "all",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error syncing upcoming matches:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync upcoming matches",
      },
      { status: 500 }
    );
  }
}
