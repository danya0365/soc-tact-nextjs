/**
 * Manual Sync League Standings API Route
 * Endpoint to manually trigger standings sync for a specific league
 */

import { NextRequest, NextResponse } from "next/server";
import { SupabaseFootballRepository } from "@/src/infrastructure/repositories/supabase-football.repository";

/**
 * POST /api/football/sync/standings/[leagueId]
 * Manually sync standings for a specific league
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

    const repository = new SupabaseFootballRepository();
    
    console.log(`🔄 Manual sync: Standings for league ${leagueIdNum}...`);
    const standings = await repository.getStandingsByLeague(leagueIdNum);
    console.log(`✅ Synced ${standings.length} teams for league ${leagueIdNum}`);

    return NextResponse.json({
      success: true,
      message: `Standings synced successfully for league ${leagueIdNum}`,
      data: {
        leagueId: leagueIdNum,
        teamsCount: standings.length,
        standings: standings,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error syncing standings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync standings",
      },
      { status: 500 }
    );
  }
}
