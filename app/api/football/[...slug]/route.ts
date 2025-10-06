/**
 * Generic Football API Route Handler
 * Handles all football API requests as a proxy to avoid CORS
 */

import { NextResponse } from "next/server";
import * as footballAPI from "@/src/infrastructure/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug: path } = await params;
    const { searchParams } = new URL(request.url);
    
    // Parse path segments
    const [category, ...rest] = path;
    
    let data;
    
    // Route based on category
    switch (category) {
      // LEAGUES
      case "leagues": {
        if (rest.length === 0) {
          data = await footballAPI.getAllLeagues();
        } else if (rest.length === 1) {
          data = await footballAPI.getLeagueById(parseInt(rest[0]));
        } else if (rest[0] === "country" && rest[1]) {
          data = await footballAPI.getLeaguesByCountry(rest[1]);
        } else if (rest[1] === "overview") {
          const leagueId = parseInt(rest[0]);
          const season = searchParams.get("season");
          data = await footballAPI.getLeagueOverview(
            leagueId,
            season ? parseInt(season) : undefined
          );
        }
        break;
      }
      
      // MATCHES
      case "matches": {
        if (rest[0] === "live") {
          data = await footballAPI.getLiveMatches();
        } else if (rest[0] === "today") {
          data = await footballAPI.getTodayMatches();
        } else if (rest[0] === "date" && rest[1]) {
          data = await footballAPI.getMatchesByDate(rest[1]);
        } else if (rest[0] === "league" && rest[1]) {
          const leagueId = parseInt(rest[1]);
          const season = searchParams.get("season");
          data = await footballAPI.getMatchesByLeague(
            leagueId,
            season ? parseInt(season) : undefined
          );
        } else if (rest[0] === "upcoming") {
          const leagueId = searchParams.get("leagueId");
          data = await footballAPI.getUpcomingMatches(
            leagueId ? parseInt(leagueId) : undefined
          );
        } else if (rest[0] === "finished") {
          const leagueId = searchParams.get("leagueId");
          data = await footballAPI.getFinishedMatches(
            leagueId ? parseInt(leagueId) : undefined
          );
        } else if (rest[0] === "featured") {
          data = await footballAPI.getFeaturedMatches();
        } else if (rest.length === 1) {
          data = await footballAPI.getMatchById(parseInt(rest[0]));
        }
        break;
      }
      
      // STANDINGS
      case "standings": {
        if (rest.length === 1) {
          const leagueId = parseInt(rest[0]);
          const season = searchParams.get("season");
          data = await footballAPI.getStandingsByLeague(
            leagueId,
            season ? parseInt(season) : undefined
          );
        }
        break;
      }
      
      // TEAMS
      case "teams": {
        if (rest[0] === "league" && rest[1]) {
          data = await footballAPI.getTeamsByLeague(parseInt(rest[1]));
        } else if (rest[0] === "search") {
          const query = searchParams.get("q");
          if (query) {
            data = await footballAPI.searchTeams(query);
          }
        } else if (rest.length === 1) {
          data = await footballAPI.getTeamById(parseInt(rest[0]));
        } else if (rest[1] === "matches") {
          const teamId = parseInt(rest[0]);
          const limit = searchParams.get("limit");
          
          if (rest[2] === "recent") {
            data = await footballAPI.getTeamRecentMatches(
              teamId,
              limit ? parseInt(limit) : undefined
            );
          } else if (rest[2] === "upcoming") {
            data = await footballAPI.getTeamUpcomingMatches(
              teamId,
              limit ? parseInt(limit) : undefined
            );
          }
        }
        break;
      }
      
      // STATISTICS
      case "statistics": {
        if (rest[0] === "top-scorers" && rest[1]) {
          const leagueId = parseInt(rest[1]);
          const season = searchParams.get("season");
          data = await footballAPI.getTopScorers(
            leagueId,
            season ? parseInt(season) : undefined
          );
        } else if (rest[0] === "h2h" && rest[1] && rest[2]) {
          data = await footballAPI.getHeadToHead(
            parseInt(rest[1]),
            parseInt(rest[2])
          );
        }
        break;
      }
      
      default:
        return NextResponse.json(
          { success: false, error: "Invalid endpoint" },
          { status: 404 }
        );
    }
    
    if (data === undefined) {
      return NextResponse.json(
        { success: false, error: "Endpoint not found or invalid parameters" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data,
    });
    
  } catch (error) {
    console.error("Football API error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
