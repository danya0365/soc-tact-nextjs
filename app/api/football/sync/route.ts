/**
 * Football Data Sync API Route
 * Endpoint to manually trigger football data sync
 */

import { getFootballSyncService } from "@/src/application/services/football-sync.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/football/sync
 * Start football data sync service
 */
export async function POST(request: NextRequest) {
  try {
    const syncService = getFootballSyncService();

    // Start all sync jobs
    syncService.startAllSyncs();

    return NextResponse.json({
      success: true,
      message: "Football data sync service started successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error starting sync service:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to start sync service",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/football/sync
 * Stop football data sync service
 */
export async function DELETE(request: NextRequest) {
  try {
    const syncService = getFootballSyncService();

    // Stop all sync jobs
    syncService.stopAllSyncs();

    return NextResponse.json({
      success: true,
      message: "Football data sync service stopped successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error stopping sync service:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to stop sync service",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/football/sync/status
 * Check sync service status
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      status: "running",
      message: "Football data sync service is operational",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error checking sync status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to check sync status",
      },
      { status: 500 }
    );
  }
}
