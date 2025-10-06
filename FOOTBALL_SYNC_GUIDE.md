# Football Data Sync Guide

## 📋 Overview

This guide explains how the Football Data Sync system works in the SoccerTactics application.

## 🎯 Strategy

**Problem:** Football-Data.org API has a rate limit of **10 requests/minute** on the free tier.

**Solution:** Cache all football data in Supabase database with smart expiration times.

## 🗄️ Database Schema

All football data is stored in tables with prefix `football_`:

### Core Tables
- `football_leagues` - League/competition data (cache: 24h)
- `football_teams` - Team information (cache: 24h)
- `football_matches` - Match data (cache: 30s for live, 1h for finished)
- `football_standings` - League tables (cache: 1h)
- `football_players` - Player information (cache: 24h)
- `football_match_statistics` - Match stats (cache: 5min)
- `football_match_events` - Goals, cards, etc. (cache: 30s)
- `football_lineups` - Team lineups (permanent)
- `football_top_scorers` - Top scorers (cache: 1h)
- `football_api_sync_log` - Sync operation logs

## 🔄 Sync Service

### Automatic Sync Jobs

The `FootballSyncService` runs background jobs:

1. **Live Matches** - Every 30 seconds
2. **League Standings** - Every 1 hour
3. **Leagues** - Every 24 hours

### Starting the Sync Service

#### Option 1: API Endpoint
```bash
# Start sync service
curl -X POST http://localhost:3000/api/football/sync

# Stop sync service
curl -X DELETE http://localhost:3000/api/football/sync

# Check status
curl http://localhost:3000/api/football/sync/status
```

#### Option 2: Programmatically
```typescript
import { getFootballSyncService } from '@/application/services/football-sync.service';

const syncService = getFootballSyncService();
syncService.startAllSyncs();
```

## 📡 API Endpoints

### Get Live Matches
```bash
GET /api/football/matches/live
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123456,
      "homeTeam": { "name": "Manchester United", "logo": "..." },
      "awayTeam": { "name": "Liverpool", "logo": "..." },
      "score": { "home": 2, "away": 1 },
      "status": "live",
      "minute": 67
    }
  ],
  "count": 5,
  "cached": true,
  "timestamp": "2025-10-06T10:00:00Z"
}
```

## 🔧 Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update with your values:
```env
# Supabase (Local Development)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key

# Football API
NEXT_PUBLIC_FOOTBALL_DATA_API_KEY=your-api-key-from-football-data.org
```

### 2. Get Football-Data.org API Key

1. Go to https://www.football-data.org/
2. Sign up for free account
3. Get your API key from dashboard
4. Free tier: 10 requests/minute, 10 calls/day

### 3. Start Supabase

```bash
# Start local Supabase
yarn supabase-start

# Run migrations
yarn supabase-migrate

# Generate TypeScript types
yarn supabase-generate
```

### 4. Start Development Server

```bash
yarn dev
```

### 5. Initialize Data Sync

```bash
# Start sync service
curl -X POST http://localhost:3000/api/football/sync
```

## 📊 Cache Strategy

| Resource | Cache Duration | Reason |
|----------|---------------|--------|
| Leagues | 24 hours | Rarely changes |
| Teams | 24 hours | Rarely changes |
| Players | 24 hours | Rarely changes |
| Live Matches | 30 seconds | Need real-time updates |
| Finished Matches | 1 hour | Won't change |
| Standings | 1 hour | Updates after matches |
| Match Stats | 5 minutes | Updates during match |
| Top Scorers | 1 hour | Updates after matches |

## 🔍 Monitoring

### Check Sync Logs

```sql
-- View recent sync operations
SELECT * FROM football_api_sync_log
ORDER BY synced_at DESC
LIMIT 20;

-- Check for errors
SELECT * FROM football_api_sync_log
WHERE status = 'error'
ORDER BY synced_at DESC;

-- Check rate limiting
SELECT * FROM football_api_sync_log
WHERE status = 'rate_limited'
ORDER BY synced_at DESC;
```

### Check Cache Status

```sql
-- Check expired caches
SELECT 
  'leagues' as table_name,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE expires_at < NOW()) as expired
FROM football_leagues
UNION ALL
SELECT 
  'matches',
  COUNT(*),
  COUNT(*) FILTER (WHERE expires_at < NOW())
FROM football_matches;
```

## 🚀 Usage in Components

### Example: Display Live Matches

```typescript
import { useEffect, useState } from 'react';
import { Match } from '@/domain/entities/football.entity';

export function LiveMatchesWidget() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/football/matches/live');
        const data = await response.json();
        setMatches(data.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Live Matches ({matches.length})</h2>
      {matches.map(match => (
        <div key={match.id}>
          {match.homeTeam.name} {match.score.home} - {match.score.away} {match.awayTeam.name}
          <span className="live-indicator">LIVE {match.minute}'</span>
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Best Practices

1. **Always use cached data** - Never call API directly from frontend
2. **Respect rate limits** - Wait 6 seconds between API calls (10 req/min)
3. **Monitor sync logs** - Check for errors and rate limiting
4. **Adjust cache times** - Based on your needs and API quota
5. **Use RPC functions** - For complex queries (see helper functions in migration)

## 🐛 Troubleshooting

### Problem: No data in database

**Solution:**
```bash
# Check if sync service is running
curl http://localhost:3000/api/football/sync/status

# Start sync service
curl -X POST http://localhost:3000/api/football/sync

# Check logs
SELECT * FROM football_api_sync_log ORDER BY synced_at DESC LIMIT 10;
```

### Problem: Rate limit exceeded

**Solution:**
- Wait for rate limit to reset (check `rate_limit_reset` in sync logs)
- Increase delay between API calls in sync service
- Consider upgrading to paid API tier

### Problem: Stale data

**Solution:**
```sql
-- Force refresh by deleting expired caches
DELETE FROM football_matches WHERE expires_at < NOW();
DELETE FROM football_standings WHERE expires_at < NOW();

-- Restart sync service
curl -X DELETE http://localhost:3000/api/football/sync
curl -X POST http://localhost:3000/api/football/sync
```

## 📚 Additional Resources

- [Football-Data.org API Docs](https://www.football-data.org/documentation/quickstart)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 🎉 Next Steps

1. ✅ Database schema created
2. ✅ Supabase client configured
3. ✅ Repository implementation done
4. ✅ Sync service created
5. ✅ API endpoints ready
6. 🔄 **Next:** Start using football data in your components!

---

**Created:** 2025-10-06
**Author:** Marosdee Uma
**Version:** 1.0.0
