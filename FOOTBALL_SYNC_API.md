# Football Sync API Endpoints

## 🔗 Manual Sync Endpoints

### 1. **Sync Everything (Comprehensive)**
```bash
curl -X POST http://localhost:3000/api/football/sync/all
```

**What it syncs:**
- ✅ All leagues (13 leagues)
- ✅ Standings for all 10 leagues
- ✅ Top scorers for all 10 leagues
- ✅ Upcoming matches (top 5 leagues, 20 matches each)
- ✅ Finished matches (top 5 leagues, 20 matches each)
- ✅ Live matches

**Estimated time:** 3-4 minutes (respects 10 req/min rate limit)

**Response:**
```json
{
  "success": true,
  "message": "Full sync completed successfully",
  "data": {
    "leagues": 13,
    "standings": {
      "2021": 20,  // Premier League
      "2014": 20,  // La Liga
      "2019": 20,  // Serie A
      "2002": 18,  // Bundesliga
      "2015": 18,  // Ligue 1
      ...
    },
    "topScorers": {
      "2021": 20,
      "2014": 20,
      ...
    },
    "upcomingMatches": 100,
    "finishedMatches": 100,
    "liveMatches": 0
  }
}
```

---

### 2. **Sync Leagues**
```bash
curl -X POST http://localhost:3000/api/football/sync/leagues
```

---

### 3. **Sync Standings (Specific League)**
```bash
# Premier League
curl -X POST http://localhost:3000/api/football/sync/standings/2021

# La Liga
curl -X POST http://localhost:3000/api/football/sync/standings/2014

# Serie A
curl -X POST http://localhost:3000/api/football/sync/standings/2019

# Bundesliga
curl -X POST http://localhost:3000/api/football/sync/standings/2002

# Ligue 1
curl -X POST http://localhost:3000/api/football/sync/standings/2015

# Champions League
curl -X POST http://localhost:3000/api/football/sync/standings/2001

# Eredivisie
curl -X POST http://localhost:3000/api/football/sync/standings/2003

# Primeira Liga
curl -X POST http://localhost:3000/api/football/sync/standings/2017
```

**Response:**
```json
{
  "success": true,
  "message": "Standings synced successfully for league 2021",
  "data": {
    "leagueId": 2021,
    "teamsCount": 20,
    "standings": [...]
  }
}
```

---

### 4. **Sync Top Scorers (Specific League)**
```bash
# Premier League top scorers
curl -X POST http://localhost:3000/api/football/sync/scorers/2021

# La Liga top scorers
curl -X POST http://localhost:3000/api/football/sync/scorers/2014
```

**Response:**
```json
{
  "success": true,
  "message": "Top scorers synced successfully for league 2021",
  "data": {
    "leagueId": 2021,
    "scorersCount": 20,
    "scorers": [...]
  }
}
```

---

### 5. **Sync Upcoming Matches**
```bash
# All leagues
curl -X POST http://localhost:3000/api/football/sync/matches/upcoming

# Specific league (via query param)
curl -X POST "http://localhost:3000/api/football/sync/matches/upcoming?leagueId=2021"
```

---

### 6. **Sync Finished Matches**
```bash
# All leagues
curl -X POST http://localhost:3000/api/football/sync/matches/finished

# Specific league (via query param)
curl -X POST "http://localhost:3000/api/football/sync/matches/finished?leagueId=2021"
```

---

### 7. **Sync Matches (Specific League)**
```bash
# Premier League matches
curl -X POST http://localhost:3000/api/football/sync/matches/2021

# La Liga matches
curl -X POST http://localhost:3000/api/football/sync/matches/2014
```

---

### 8. **Sync Specific Match**
```bash
curl -X POST http://localhost:3000/api/football/sync/match/12345
```

---

## 🎯 Testing Strategy

### **Step 1: Test Basic Sync (Quick Test)**
```bash
# Test leagues sync (fast)
curl -X POST http://localhost:3000/api/football/sync/leagues

# Test standings for one league (6 seconds)
curl -X POST http://localhost:3000/api/football/sync/standings/2021

# Test top scorers for one league (6 seconds)
curl -X POST http://localhost:3000/api/football/sync/scorers/2021
```

### **Step 2: Test Matches Sync**
```bash
# Test upcoming matches for Premier League
curl -X POST "http://localhost:3000/api/football/sync/matches/upcoming?leagueId=2021"

# Test finished matches for Premier League
curl -X POST "http://localhost:3000/api/football/sync/matches/finished?leagueId=2021"
```

### **Step 3: Full Sync (Complete Test)**
```bash
# This will take 3-4 minutes
curl -X POST http://localhost:3000/api/football/sync/all
```

---

## 📊 Verify Data in Database

### **Check Synced Data:**
```sql
-- 1. Check leagues
SELECT COUNT(*) as total_leagues FROM football_leagues;

-- 2. Check teams
SELECT COUNT(*) as total_teams FROM football_teams;

-- 3. Check standings
SELECT 
  l.name as league_name,
  COUNT(s.id) as teams_count
FROM football_leagues l
LEFT JOIN football_standings s ON s.league_id = l.id
GROUP BY l.id, l.name
ORDER BY teams_count DESC;

-- 4. Check top scorers
SELECT 
  l.name as league_name,
  COUNT(ts.id) as scorers_count
FROM football_leagues l
LEFT JOIN football_top_scorers ts ON ts.league_id = l.id
GROUP BY l.id, l.name
ORDER BY scorers_count DESC;

-- 5. Check players
SELECT COUNT(*) as total_players FROM football_players;

-- 6. Check matches
SELECT 
  status,
  COUNT(*) as count
FROM football_matches
GROUP BY status
ORDER BY count DESC;

-- 7. Check sync logs
SELECT 
  resource_type,
  status,
  COUNT(*) as count,
  SUM(records_synced) as total_records
FROM football_api_sync_log
GROUP BY resource_type, status
ORDER BY resource_type, status;
```

---

## 🎯 Expected Results After Full Sync

| Resource | Expected Count | Notes |
|----------|---------------|-------|
| Leagues | 13 | All available leagues |
| Teams | 150+ | From standings + matches |
| Standings | 8 leagues × ~18-20 teams = 150+ | Excludes restricted leagues |
| Top Scorers | 8 leagues × 20 = 160 | Top 20 per league |
| Players | 160+ | From top scorers |
| Upcoming Matches | 100+ | 5 leagues × 20 = 100 |
| Finished Matches | 100+ | 5 leagues × 20 = 100 |
| Live Matches | 0-10 | Depends on time |

---

## 🚨 Rate Limit Protection

**Free Tier Limits:**
- 10 requests per minute
- 10 calls per day (some sources say 10,000)

**Our Protection:**
- 6 seconds delay between requests = 10 req/min max
- Comprehensive logging in `football_api_sync_log`
- Graceful error handling for rate limit errors

---

## 🔍 Troubleshooting

### **No data synced:**
```bash
# Check sync logs for errors
SELECT * FROM football_api_sync_log 
WHERE status = 'error' 
ORDER BY synced_at DESC 
LIMIT 10;
```

### **Rate limited:**
```bash
# Check rate limit logs
SELECT * FROM football_api_sync_log 
WHERE status = 'rate_limited' 
ORDER BY synced_at DESC 
LIMIT 10;
```

### **Force refresh:**
```sql
-- Delete all cached data
TRUNCATE football_standings CASCADE;
TRUNCATE football_top_scorers CASCADE;
TRUNCATE football_matches CASCADE;

-- Then re-sync
curl -X POST http://localhost:3000/api/football/sync/all
```

---

**Created:** 2025-10-06
**Author:** Marosdee Uma
