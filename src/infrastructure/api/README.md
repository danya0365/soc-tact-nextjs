# Football API Documentation

## 📚 Overview

This Football API follows **Clean Architecture** and **SOLID principles**, providing a clean and maintainable way to access football data from multiple sources.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (Components, Pages, Hooks)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│         football.api.ts (Public API Interface)           │
│         FootballService (Business Logic)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Domain Layer                          │
│    Entities (Team, Match, League, Standing, etc.)       │
│    Repository Interface (FootballRepository)             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                     │
│    FootballDataRepository (Implementation)               │
│    FootballDataDatasource (HTTP Client)                  │
│    FootballDataMapper (Data Transformation)              │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Setup Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_FOOTBALL_DATA_API_KEY=your_api_key_here
```

Get your free API key from: https://www.football-data.org/client/register

### 2. Import and Use

```typescript
import {
  getLiveMatches,
  getStandingsByLeague,
  getTodayMatches,
} from "@/src/infrastructure/api/football.api";

// Get live matches
const liveMatches = await getLiveMatches();

// Get Premier League standings
const standings = await getStandingsByLeague(2021);

// Get today's matches
const todayMatches = await getTodayMatches();
```

## 📖 API Reference

### Leagues

#### `getAllLeagues()`
Get all available leagues.

```typescript
const leagues = await getAllLeagues();
// Returns: League[]
```

#### `getLeagueById(leagueId: number)`
Get league details by ID.

```typescript
const league = await getLeagueById(2021); // Premier League
// Returns: League
```

#### `getLeaguesByCountry(country: string)`
Get leagues by country name.

```typescript
const leagues = await getLeaguesByCountry("England");
// Returns: League[]
```

#### `getLeagueOverview(leagueId: number, season?: number)`
Get complete league overview (standings + matches + top scorers).

```typescript
const overview = await getLeagueOverview(2021);
// Returns: { league, standings, recentMatches, topScorers }
```

### Matches

#### `getLiveMatches()`
Get all currently live matches.

```typescript
const liveMatches = await getLiveMatches();
// Returns: Match[]
```

#### `getTodayMatches()`
Get all matches for today.

```typescript
const todayMatches = await getTodayMatches();
// Returns: Match[]
```

#### `getMatchesByDate(date: string)`
Get matches for a specific date (format: YYYY-MM-DD).

```typescript
const matches = await getMatchesByDate("2024-03-15");
// Returns: Match[]
```

#### `getMatchesByLeague(leagueId: number, season?: number)`
Get all matches for a specific league.

```typescript
const matches = await getMatchesByLeague(2021, 2024);
// Returns: Match[]
```

#### `getMatchById(matchId: number)`
Get match details by ID.

```typescript
const match = await getMatchById(12345);
// Returns: Match
```

#### `getUpcomingMatches(leagueId?: number)`
Get upcoming matches (next 7 days).

```typescript
const upcoming = await getUpcomingMatches();
// or for specific league
const upcomingPL = await getUpcomingMatches(2021);
// Returns: Match[]
```

#### `getFinishedMatches(leagueId?: number)`
Get finished matches (last 7 days).

```typescript
const finished = await getFinishedMatches();
// Returns: Match[]
```

#### `getFeaturedMatches()`
Get featured matches (live + today + upcoming).

```typescript
const featured = await getFeaturedMatches();
// Returns: { live: Match[], today: Match[], upcoming: Match[] }
```

### Standings

#### `getStandingsByLeague(leagueId: number, season?: number)`
Get league table/standings.

```typescript
const standings = await getStandingsByLeague(2021);
// Returns: Standing[]
```

### Teams

#### `getTeamById(teamId: number)`
Get team details by ID.

```typescript
const team = await getTeamById(65); // Manchester City
// Returns: Team
```

#### `getTeamsByLeague(leagueId: number)`
Get all teams in a league.

```typescript
const teams = await getTeamsByLeague(2021);
// Returns: Team[]
```

#### `searchTeams(query: string)`
Search teams by name.

```typescript
const teams = await searchTeams("Manchester");
// Returns: Team[]
```

#### `getTeamRecentMatches(teamId: number, limit?: number)`
Get team's recent matches.

```typescript
const matches = await getTeamRecentMatches(65, 5);
// Returns: Match[]
```

#### `getTeamUpcomingMatches(teamId: number, limit?: number)`
Get team's upcoming matches.

```typescript
const matches = await getTeamUpcomingMatches(65, 5);
// Returns: Match[]
```

### Statistics

#### `getTopScorers(leagueId: number, season?: number)`
Get top scorers for a league.

```typescript
const scorers = await getTopScorers(2021);
// Returns: TopScorer[]
```

#### `getHeadToHead(team1Id: number, team2Id: number)`
Get head-to-head statistics between two teams.

```typescript
const h2h = await getHeadToHead(65, 66); // Man City vs Man United
// Returns: HeadToHead
```

## 🎯 Common League IDs

```typescript
import { LEAGUE_IDS } from "@/src/infrastructure/config/football-api.config";

LEAGUE_IDS.PREMIER_LEAGUE    // 2021 - England
LEAGUE_IDS.LA_LIGA           // 2014 - Spain
LEAGUE_IDS.SERIE_A           // 2019 - Italy
LEAGUE_IDS.BUNDESLIGA        // 2002 - Germany
LEAGUE_IDS.LIGUE_1           // 2015 - France
LEAGUE_IDS.CHAMPIONS_LEAGUE  // 2001
LEAGUE_IDS.EUROPA_LEAGUE     // 2146
```

## 📊 Data Types

### Team
```typescript
interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  founded?: number;
  country: string;
  venue?: string;
}
```

### Match
```typescript
interface Match {
  id: number;
  date: string;
  timestamp: number;
  status: MatchStatus;
  minute?: number;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  league: League;
  venue?: string;
}
```

### Standing
```typescript
interface Standing {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string[];
  description?: string;
}
```

## 🔧 Utility Functions

### `formatDate(date: Date): string`
Format date to YYYY-MM-DD.

```typescript
const formatted = formatDate(new Date());
// Returns: "2024-03-15"
```

### `getDateRange(daysOffset: number)`
Get date range from today.

```typescript
const nextWeek = getDateRange(7);
// Returns: { from: "2024-03-15", to: "2024-03-22" }

const lastWeek = getDateRange(-7);
// Returns: { from: "2024-03-08", to: "2024-03-15" }
```

### `isMatchLive(match: Match): boolean`
Check if match is currently live.

```typescript
if (isMatchLive(match)) {
  console.log("Match is live!");
}
```

### `getMatchResult(match: Match, teamId: number)`
Get match result (W/D/L) for a specific team.

```typescript
const result = getMatchResult(match, 65);
// Returns: "W" | "D" | "L" | null
```

## ⚠️ Rate Limits

### Football-Data.org (Free Tier)
- **10 requests per minute**
- 10,000 requests per day
- Automatic rate limiting built-in

### Best Practices
1. Cache data when possible
2. Use batch requests (e.g., `getLeagueOverview`)
3. Avoid polling live matches too frequently (30 seconds minimum)
4. Handle rate limit errors gracefully

## 🎨 Example Usage in Components

### Get Live Matches
```typescript
"use client";

import { useEffect, useState } from "react";
import { getLiveMatches } from "@/src/infrastructure/api/football.api";
import type { Match } from "@/src/domain/entities/football.entity";

export function LiveMatchesWidget() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const data = await getLiveMatches();
        setMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {matches.map((match) => (
        <div key={match.id}>
          {match.homeTeam.name} {match.score.home} - {match.score.away}{" "}
          {match.awayTeam.name}
        </div>
      ))}
    </div>
  );
}
```

### Get League Standings
```typescript
import { getStandingsByLeague } from "@/src/infrastructure/api/football.api";
import { LEAGUE_IDS } from "@/src/infrastructure/config/football-api.config";

export async function StandingsTable() {
  const standings = await getStandingsByLeague(LEAGUE_IDS.PREMIER_LEAGUE);

  return (
    <table>
      <thead>
        <tr>
          <th>Pos</th>
          <th>Team</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GD</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((standing) => (
          <tr key={standing.team.id}>
            <td>{standing.position}</td>
            <td>{standing.team.name}</td>
            <td>{standing.played}</td>
            <td>{standing.won}</td>
            <td>{standing.drawn}</td>
            <td>{standing.lost}</td>
            <td>{standing.goalDifference}</td>
            <td>{standing.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## 🐛 Error Handling

All API functions throw errors that should be caught:

```typescript
try {
  const matches = await getLiveMatches();
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
    // Handle specific errors
    if (error.message.includes("rate limit")) {
      // Handle rate limit
    } else if (error.message.includes("not found")) {
      // Handle not found
    }
  }
}
```

## 📝 Notes

- All dates are in ISO 8601 format (YYYY-MM-DD)
- Timestamps are in milliseconds since Unix epoch
- Team IDs and League IDs are consistent across the API
- Match status follows the MatchStatus enum
- Free tier has limitations on detailed statistics

## 🔗 Resources

- [Football-Data.org Documentation](https://www.football-data.org/documentation/quickstart)
- [API-Football Documentation](https://www.api-football.com/documentation-v3)
- [Clean Architecture Guide](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
