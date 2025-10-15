/**
 * Live Matches API Route
 * Returns live football matches from Supabase cache
 */

import { NextRequest, NextResponse } from "next/server";
import { SupabaseFootballRepository } from "../../../../../src/infrastructure/repositories/supabase-football.repository";

export async function GET(request: NextRequest) {
  try {
    const repository = new SupabaseFootballRepository();
    
    // Get live matches from cache (will fetch from API if cache expired)
    const matches = await repository.getLiveMatches();

    return NextResponse.json({
      success: true,
      data: matches,
      count: matches.length,
      cached: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching live matches:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch live matches",
        data: [],
      },
      { status: 500 }
    );
  }
}
