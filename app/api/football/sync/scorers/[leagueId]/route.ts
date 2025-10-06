/**
 * Manual Sync Top Scorers API Route
 * Endpoint to manually trigger top scorers sync for a specific league
 */

import { NextRequest, NextResponse } from "next/server";
import { SupabaseFootballRepository } from "@/src/infrastructure/repositories/supabase-football.repository";

/**
 * POST /api/football/sync/scorers/[leagueId]
 * Manually sync top scorers for a specific league
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
    
    console.log(`🔄 Manual sync: Top scorers for league ${leagueIdNum}...`);
    const scorers = await repository.getTopScorers(leagueIdNum);
    console.log(`✅ Synced ${scorers.length} top scorers for league ${leagueIdNum}`);

    return NextResponse.json({
      success: true,
      message: `Top scorers synced successfully for league ${leagueIdNum}`,
      data: {
        leagueId: leagueIdNum,
        scorersCount: scorers.length,
        scorers: scorers,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error syncing top scorers:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync top scorers",
      },
      { status: 500 }
    );
  }
}
