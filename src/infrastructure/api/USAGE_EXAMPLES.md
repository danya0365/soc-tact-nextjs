# Football API - Usage Examples

## 🎯 Real-World Examples

### Example 1: Live Scores Dashboard

```typescript
// app/live-scores/page.tsx
import { getLiveMatches, getTodayMatches } from "@/src/infrastructure/api/football.api";

export default async function LiveScoresPage() {
  const [liveMatches, todayMatches] = await Promise.all([
    getLiveMatches(),
    getTodayMatches(),
  ]);

  return (
    <div>
      <h1>Live Scores</h1>
      
      {/* Live Matches */}
      <section>
        <h2>🔴 Live Now ({liveMatches.length})</h2>
        {liveMatches.map((match) => (
          <div key={match.id}>
            <span>{match.homeTeam.name}</span>
            <span>{match.score.home} - {match.score.away}</span>
            <span>{match.awayTeam.name}</span>
            <span>{match.minute}'</span>
          </div>
        ))}
      </section>

      {/* Today's Matches */}
      <section>
        <h2>📅 Today's Matches</h2>
        {todayMatches.map((match) => (
          <div key={match.id}>
            <span>{new Date(match.date).toLocaleTimeString()}</span>
            <span>{match.homeTeam.name} vs {match.awayTeam.name}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
```

### Example 2: League Standings Table

```typescript
// app/league/[leagueId]/standings/page.tsx
import { getStandingsByLeague, getLeagueById } from "@/src/infrastructure/api/football.api";
import { LEAGUE_IDS } from "@/src/infrastructure/config/football-api.config";

interface PageProps {
  params: Promise<{ leagueId: string }>;
}

export default async function StandingsPage({ params }: PageProps) {
  const { leagueId } = await params;
  const id = parseInt(leagueId);

  const [league, standings] = await Promise.all([
    getLeagueById(id),
    getStandingsByLeague(id),
  ]);

  return (
    <div>
      <h1>{league.name} - Standings</h1>
      
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
            <th>Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr key={standing.team.id}>
              <td>{standing.position}</td>
              <td>
                <img src={standing.team.logo} alt="" width={20} />
                {standing.team.name}
              </td>
              <td>{standing.played}</td>
              <td>{standing.won}</td>
              <td>{standing.drawn}</td>
              <td>{standing.lost}</td>
              <td>{standing.goalsFor}</td>
              <td>{standing.goalsAgainst}</td>
              <td>{standing.goalDifference}</td>
              <td><strong>{standing.points}</strong></td>
              <td>
                {standing.form?.map((result, i) => (
                  <span key={i} className={`form-${result}`}>
                    {result}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Example 3: Team Profile Page

```typescript
// app/team/[teamId]/page.tsx
import {
  getTeamById,
  getTeamRecentMatches,
  getTeamUpcomingMatches,
} from "@/src/infrastructure/api/football.api";

interface PageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamPage({ params }: PageProps) {
  const { teamId } = await params;
  const id = parseInt(teamId);

  const [team, recentMatches, upcomingMatches] = await Promise.all([
    getTeamById(id),
    getTeamRecentMatches(id, 5),
    getTeamUpcomingMatches(id, 5),
  ]);

  return (
    <div>
      {/* Team Header */}
      <header>
        <img src={team.logo} alt={team.name} width={100} />
        <h1>{team.name}</h1>
        <p>{team.country}</p>
        {team.founded && <p>Founded: {team.founded}</p>}
        {team.venue && <p>Venue: {team.venue}</p>}
      </header>

      {/* Recent Matches */}
      <section>
        <h2>Recent Matches</h2>
        {recentMatches.map((match) => {
          const isHome = match.homeTeam.id === id;
          const opponent = isHome ? match.awayTeam : match.homeTeam;
          const teamScore = isHome ? match.score.home : match.score.away;
          const opponentScore = isHome ? match.score.away : match.score.home;
          
          return (
            <div key={match.id}>
              <span>{new Date(match.date).toLocaleDateString()}</span>
              <span>{isHome ? "vs" : "@"} {opponent.name}</span>
              <span>{teamScore} - {opponentScore}</span>
            </div>
          );
        })}
      </section>

      {/* Upcoming Matches */}
      <section>
        <h2>Upcoming Matches</h2>
        {upcomingMatches.map((match) => {
          const isHome = match.homeTeam.id === id;
          const opponent = isHome ? match.awayTeam : match.homeTeam;
          
          return (
            <div key={match.id}>
              <span>{new Date(match.date).toLocaleDateString()}</span>
              <span>{isHome ? "vs" : "@"} {opponent.name}</span>
              <span>{match.league.name}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
}
```

### Example 4: Match Detail Page

```typescript
// app/match/[matchId]/page.tsx
import { getMatchById, getHeadToHead } from "@/src/infrastructure/api/football.api";

interface PageProps {
  params: Promise<{ matchId: string }>;
}

export default async function MatchPage({ params }: PageProps) {
  const { matchId } = await params;
  const id = parseInt(matchId);

  const match = await getMatchById(id);
  
  // Get head to head (optional)
  let h2h = null;
  try {
    h2h = await getHeadToHead(match.homeTeam.id, match.awayTeam.id);
  } catch (error) {
    console.log("H2H not available");
  }

  return (
    <div>
      {/* Match Header */}
      <header>
        <h1>{match.league.name}</h1>
        <p>{new Date(match.date).toLocaleString()}</p>
        {match.venue && <p>📍 {match.venue}</p>}
      </header>

      {/* Score */}
      <section>
        <div className="match-score">
          <div className="team">
            <img src={match.homeTeam.logo} alt="" />
            <h2>{match.homeTeam.name}</h2>
          </div>
          
          <div className="score">
            {match.status === "live" && <span className="live">LIVE {match.minute}'</span>}
            <h1>{match.score.home ?? "-"} : {match.score.away ?? "-"}</h1>
            {match.score.halftime && (
              <p>HT: {match.score.halftime.home} - {match.score.halftime.away}</p>
            )}
          </div>
          
          <div className="team">
            <img src={match.awayTeam.logo} alt="" />
            <h2>{match.awayTeam.name}</h2>
          </div>
        </div>
      </section>

      {/* Head to Head */}
      {h2h && (
        <section>
          <h2>Head to Head</h2>
          <div className="h2h-stats">
            <div>{match.homeTeam.name}: {h2h.statistics.team1Wins} wins</div>
            <div>Draws: {h2h.statistics.draws}</div>
            <div>{match.awayTeam.name}: {h2h.statistics.team2Wins} wins</div>
          </div>
          
          <h3>Recent Meetings</h3>
          {h2h.matches.slice(0, 5).map((m) => (
            <div key={m.id}>
              <span>{new Date(m.date).toLocaleDateString()}</span>
              <span>{m.homeTeam.name} {m.score.home} - {m.score.away} {m.awayTeam.name}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
```

### Example 5: Top Scorers Widget

```typescript
// components/TopScorersWidget.tsx
import { getTopScorers } from "@/src/infrastructure/api/football.api";
import { LEAGUE_IDS } from "@/src/infrastructure/config/football-api.config";

interface TopScorersWidgetProps {
  leagueId: number;
  limit?: number;
}

export async function TopScorersWidget({ 
  leagueId, 
  limit = 10 
}: TopScorersWidgetProps) {
  const scorers = await getTopScorers(leagueId);
  const topScorers = scorers.slice(0, limit);

  return (
    <div className="top-scorers-widget">
      <h3>⚽ Top Scorers</h3>
      <ol>
        {topScorers.map((scorer, index) => (
          <li key={scorer.player.id}>
            <span className="rank">{index + 1}</span>
            <div className="player-info">
              <span className="name">{scorer.player.name}</span>
              <span className="team">{scorer.team.name}</span>
            </div>
            <span className="goals">{scorer.goals}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Usage in page
export default function HomePage() {
  return (
    <div>
      <TopScorersWidget leagueId={LEAGUE_IDS.PREMIER_LEAGUE} limit={5} />
    </div>
  );
}
```

### Example 6: Live Match Ticker (Client Component)

```typescript
// components/LiveMatchTicker.tsx
"use client";

import { useEffect, useState } from "react";
import { getLiveMatches } from "@/src/infrastructure/api/football.api";
import type { Match } from "@/src/domain/entities/football.entity";

export function LiveMatchTicker() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveMatches() {
      try {
        const data = await getLiveMatches();
        setMatches(data);
      } catch (error) {
        console.error("Error fetching live matches:", error);
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchLiveMatches();

    // Refresh every 30 seconds
    const interval = setInterval(fetchLiveMatches, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="ticker">Loading live matches...</div>;
  }

  if (matches.length === 0) {
    return <div className="ticker">No live matches at the moment</div>;
  }

  return (
    <div className="ticker">
      <span className="live-indicator">🔴 LIVE</span>
      <div className="ticker-content">
        {matches.map((match) => (
          <span key={match.id} className="match-item">
            {match.homeTeam.shortName} {match.score.home}-{match.score.away}{" "}
            {match.awayTeam.shortName} ({match.minute}')
          </span>
        ))}
      </div>
    </div>
  );
}
```

### Example 7: League Selector

```typescript
// components/LeagueSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { getAllLeagues } from "@/src/infrastructure/api/football.api";
import type { League } from "@/src/domain/entities/football.entity";

interface LeagueSelectorProps {
  onSelect: (leagueId: number) => void;
  selectedLeagueId?: number;
}

export function LeagueSelector({ onSelect, selectedLeagueId }: LeagueSelectorProps) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeagues() {
      try {
        const data = await getAllLeagues();
        // Filter major leagues
        const majorLeagues = data.filter((league) =>
          ["England", "Spain", "Italy", "Germany", "France"].includes(league.country)
        );
        setLeagues(majorLeagues);
      } catch (error) {
        console.error("Error fetching leagues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeagues();
  }, []);

  if (loading) {
    return <select disabled><option>Loading...</option></select>;
  }

  return (
    <select
      value={selectedLeagueId}
      onChange={(e) => onSelect(parseInt(e.target.value))}
      className="league-selector"
    >
      <option value="">Select League</option>
      {leagues.map((league) => (
        <option key={league.id} value={league.id}>
          {league.name} ({league.country})
        </option>
      ))}
    </select>
  );
}
```

### Example 8: Match Calendar

```typescript
// app/calendar/page.tsx
import { getMatchesByDate, formatDate } from "@/src/infrastructure/api/football.api";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date || formatDate(new Date());
  const matches = await getMatchesByDate(date);

  // Group matches by league
  const matchesByLeague = matches.reduce((acc, match) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) {
      acc[leagueName] = [];
    }
    acc[leagueName].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <div>
      <h1>Matches on {new Date(date).toLocaleDateString()}</h1>
      
      {/* Date Picker */}
      <input type="date" defaultValue={date} />

      {/* Matches by League */}
      {Object.entries(matchesByLeague).map(([leagueName, leagueMatches]) => (
        <section key={leagueName}>
          <h2>{leagueName}</h2>
          {leagueMatches.map((match) => (
            <div key={match.id}>
              <span>{new Date(match.date).toLocaleTimeString()}</span>
              <span>{match.homeTeam.name} vs {match.awayTeam.name}</span>
              <span>{match.status}</span>
            </div>
          ))}
        </section>
      ))}

      {matches.length === 0 && (
        <p>No matches scheduled for this date.</p>
      )}
    </div>
  );
}
```

### Example 9: Team Search

```typescript
// components/TeamSearch.tsx
"use client";

import { useState } from "react";
import { searchTeams } from "@/src/infrastructure/api/football.api";
import type { Team } from "@/src/domain/entities/football.entity";

export function TeamSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const teams = await searchTeams(searchQuery);
      setResults(teams);
    } catch (error) {
      console.error("Error searching teams:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-search">
      <input
        type="text"
        placeholder="Search teams..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {loading && <div>Searching...</div>}

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((team) => (
            <li key={team.id}>
              <a href={`/team/${team.id}`}>
                <img src={team.logo} alt="" width={30} />
                <span>{team.name}</span>
                <span className="country">{team.country}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {query.length >= 2 && results.length === 0 && !loading && (
        <div>No teams found</div>
      )}
    </div>
  );
}
```

### Example 10: Featured Matches Dashboard

```typescript
// app/dashboard/page.tsx
import { getFeaturedMatches } from "@/src/infrastructure/api/football.api";

export default async function DashboardPage() {
  const { live, today, upcoming } = await getFeaturedMatches();

  return (
    <div className="dashboard">
      {/* Live Matches */}
      {live.length > 0 && (
        <section className="live-section">
          <h2>🔴 Live Now</h2>
          <div className="matches-grid">
            {live.map((match) => (
              <div key={match.id} className="match-card live">
                <div className="league">{match.league.name}</div>
                <div className="teams">
                  <div className="team">
                    <img src={match.homeTeam.logo} alt="" />
                    <span>{match.homeTeam.name}</span>
                  </div>
                  <div className="score">
                    <span>{match.score.home}</span>
                    <span>-</span>
                    <span>{match.score.away}</span>
                    <div className="minute">{match.minute}'</div>
                  </div>
                  <div className="team">
                    <img src={match.awayTeam.logo} alt="" />
                    <span>{match.awayTeam.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Today's Matches */}
      <section>
        <h2>📅 Today's Matches</h2>
        <div className="matches-list">
          {today.map((match) => (
            <div key={match.id} className="match-row">
              <span className="time">
                {new Date(match.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="teams">
                {match.homeTeam.name} vs {match.awayTeam.name}
              </span>
              <span className="league">{match.league.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section>
        <h2>📆 Upcoming Matches</h2>
        <div className="matches-list">
          {upcoming.map((match) => (
            <div key={match.id} className="match-row">
              <span className="date">
                {new Date(match.date).toLocaleDateString()}
              </span>
              <span className="teams">
                {match.homeTeam.name} vs {match.awayTeam.name}
              </span>
              <span className="league">{match.league.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

## 🎨 Styling Tips

```css
/* Live indicator animation */
.live-indicator {
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Form indicators */
.form-W { background: #10b981; color: white; }
.form-D { background: #fbbf24; color: white; }
.form-L { background: #ef4444; color: white; }
```

## 🚀 Performance Tips

1. **Use Server Components** when possible for better SEO
2. **Cache API responses** with Next.js caching
3. **Implement loading states** for better UX
4. **Handle errors gracefully** with try-catch
5. **Respect rate limits** - don't poll too frequently
6. **Use Promise.all()** for parallel requests
7. **Implement pagination** for large datasets

## 📝 Notes

- All examples use TypeScript for type safety
- Server Components are used for SEO optimization
- Client Components are used for interactivity
- Error handling is included in all examples
- Rate limiting is respected automatically
