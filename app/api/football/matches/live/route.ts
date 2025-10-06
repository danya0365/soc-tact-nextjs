/**
 * API Route: Get Live Matches
 * Proxy for Football-Data.org API to avoid CORS issues
 */

import { getLiveMatches } from "@/src/infrastructure/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const matches = await getLiveMatches();
    
    return NextResponse.json({
      success: true,
      data: matches,
    });
  } catch (error) {
    console.error("Error fetching live matches:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch live matches",
      },
      { status: 500 }
    );
  }
}
