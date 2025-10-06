/**
 * API Route: Get League Standings
 * Proxy for Football-Data.org API to avoid CORS issues
 */

import { getStandingsByLeague } from "@/src/infrastructure/api";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  try {
    const { leagueId } = await params;
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season");
    
    const standings = await getStandingsByLeague(
      parseInt(leagueId),
      season ? parseInt(season) : undefined
    );
    
    return NextResponse.json({
      success: true,
      data: standings,
    });
  } catch (error) {
    console.error("Error fetching standings:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch standings",
      },
      { status: 500 }
    );
  }
}
