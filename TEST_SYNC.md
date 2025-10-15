# 🧪 Football Sync Testing Guide

## 🎯 Quick Testing Commands

### **Test 1: Sync Everything (Recommended)**
```bash
curl -X POST http://localhost:3000/api/football/sync/all
```
⏱️ **Time:** 3-4 minutes  
📊 **Expected:** Leagues, Standings, Top Scorers, Matches (upcoming + finished)

---

### **Test 2: Individual Sync Tests**

#### **2.1 Test Leagues Sync** (Fast - 1 second)
```bash
curl -X POST http://localhost:3000/api/football/sync/leagues
```
✅ **Expected:** 13 leagues

#### **2.2 Test Standings Sync** (6 seconds per league)
```bash
# Premier League
curl -X POST http://localhost:3000/api/football/sync/standings/2021

# La Liga
curl -X POST http://localhost:3000/api/football/sync/standings/2014
```
✅ **Expected:** 20 teams for Premier League, 20 teams for La Liga

#### **2.3 Test Top Scorers Sync** (6 seconds per league)
```bash
# Premier League top scorers
curl -X POST http://localhost:3000/api/football/sync/scorers/2021

# La Liga top scorers
curl -X POST http://localhost:3000/api/football/sync/scorers/2014
```
✅ **Expected:** 20 scorers + players data

#### **2.4 Test Upcoming Matches** (6 seconds)
```bash
# Premier League upcoming matches
curl -X POST "http://localhost:3000/api/football/sync/matches/upcoming?leagueId=2021"
```
✅ **Expected:** 10-20 upcoming matches

#### **2.5 Test Finished Matches** (6 seconds)
```bash
# Premier League finished matches
curl -X POST "http://localhost:3000/api/football/sync/matches/finished?leagueId=2021"
```
✅ **Expected:** 20 finished matches

---

## 📊 Verification Queries

### **1. Check All Data Counts**
```sql
SELECT 
  'Leagues' as resource,
  COUNT(*) as count
FROM football_leagues
UNION ALL
SELECT 
  'Teams',
  COUNT(*)
FROM football_teams
UNION ALL
SELECT 
  'Standings',
  COUNT(*)
FROM football_standings
UNION ALL
SELECT 
  'Top Scorers',
  COUNT(*)
FROM football_top_scorers
UNION ALL
SELECT 
  'Players',
  COUNT(*)
FROM football_players
UNION ALL
SELECT 
  'Matches',
  COUNT(*)
FROM football_matches
ORDER BY resource;
```

### **2. Check Standings by League**
```sql
SELECT 
  l.id,
  l.name as league_name,
  l.country,
  COUNT(s.id) as teams_count
FROM football_leagues l
LEFT JOIN football_standings s ON s.league_id = l.id
GROUP BY l.id, l.name, l.country
ORDER BY teams_count DESC;
```

### **3. Check Top Scorers by League**
```sql
SELECT 
  l.name as league_name,
  COUNT(ts.id) as scorers_count,
  MAX(ts.goals) as max_goals
FROM football_leagues l
LEFT JOIN football_top_scorers ts ON ts.league_id = l.id
GROUP BY l.id, l.name
ORDER BY scorers_count DESC;
```

### **4. Check Matches by Status**
```sql
SELECT 
  status,
  COUNT(*) as count,
  MIN(match_date) as earliest,
  MAX(match_date) as latest
FROM football_matches
GROUP BY status
ORDER BY count DESC;
```

### **5. Check Sync Logs**
```sql
SELECT 
  resource_type,
  status,
  COUNT(*) as operations,
  SUM(records_synced) as total_records,
  AVG(duration_ms) as avg_duration_ms,
  MAX(synced_at) as last_sync
FROM football_api_sync_log
GROUP BY resource_type, status
ORDER BY resource_type, status;
```

### **6. Check Cache Expiration**
```sql
SELECT 
  'Leagues' as table_name,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE expires_at < NOW()) as expired,
  COUNT(*) FILTER (WHERE expires_at >= NOW()) as valid
FROM football_leagues
UNION ALL
SELECT 
  'Standings',
  COUNT(*),
  COUNT(*) FILTER (WHERE expires_at < NOW()),
  COUNT(*) FILTER (WHERE expires_at >= NOW())
FROM football_standings
UNION ALL
SELECT 
  'Matches',
  COUNT(*),
  COUNT(*) FILTER (WHERE expires_at < NOW()),
  COUNT(*) FILTER (WHERE expires_at >= NOW())
FROM football_matches
UNION ALL
SELECT 
  'Top Scorers',
  COUNT(*),
  COUNT(*) FILTER (WHERE expires_at < NOW()),
  COUNT(*) FILTER (WHERE expires_at >= NOW())
FROM football_top_scorers;
```

---

## 🎯 Expected Results After Full Sync

```
✅ Leagues: 13
✅ Teams: 150+
✅ Standings: 148+ (8 leagues × 18-20 teams)
✅ Top Scorers: 160 (8 leagues × 20 scorers)
✅ Players: 160+ (from top scorers)
✅ Upcoming Matches: 100+ (5 leagues × 20)
✅ Finished Matches: 100+ (5 leagues × 20)
✅ Live Matches: 0-10 (depends on time)
```

---

## 🧪 Testing Scenarios

### **Scenario 1: Fresh Database**
```bash
# 1. Reset database
yarn supabase-migrate

# 2. Full sync
curl -X POST http://localhost:3000/api/football/sync/all

# 3. Verify
# Run verification queries above
```

### **Scenario 2: Test Cache Expiration**
```bash
# 1. Sync data
curl -X POST http://localhost:3000/api/football/sync/standings/2021

# 2. Wait for cache to expire (or manually expire in DB)
UPDATE football_standings 
SET expires_at = NOW() - INTERVAL '1 hour'
WHERE league_id = 2021;

# 3. Sync again (should fetch from API)
curl -X POST http://localhost:3000/api/football/sync/standings/2021

# 4. Check sync logs
SELECT * FROM football_api_sync_log 
WHERE resource_type = 'standings' 
ORDER BY synced_at DESC 
LIMIT 5;
```

### **Scenario 3: Test Rate Limiting**
```bash
# Make 15 requests quickly (should trigger rate limit protection)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/football/sync/leagues
  echo "Request $i completed"
done

# Check for rate limit errors
SELECT * FROM football_api_sync_log 
WHERE status = 'rate_limited' 
ORDER BY synced_at DESC;
```

### **Scenario 4: Test Match Data (When Matches Available)**
```bash
# 1. Sync upcoming matches
curl -X POST "http://localhost:3000/api/football/sync/matches/upcoming?leagueId=2021"

# 2. Get a match ID from database
SELECT id, home_team_id, away_team_id, match_date 
FROM football_matches 
WHERE status = 'scheduled' 
LIMIT 1;

# 3. Sync specific match (replace 12345 with actual ID)
curl -X POST http://localhost:3000/api/football/sync/match/12345

# 4. Check if match data updated
SELECT * FROM football_matches WHERE id = 12345;
```

---

## 🚨 Common Issues & Solutions

### **Issue 1: No data synced**
```bash
# Check API key
echo $NEXT_PUBLIC_FOOTBALL_DATA_API_KEY

# Check sync logs
SELECT * FROM football_api_sync_log 
WHERE status = 'error' 
ORDER BY synced_at DESC 
LIMIT 5;
```

### **Issue 2: Rate limited**
```bash
# Check rate limit logs
SELECT 
  endpoint,
  error_message,
  rate_limit_reset,
  synced_at
FROM football_api_sync_log 
WHERE status = 'rate_limited' 
ORDER BY synced_at DESC;

# Wait for rate limit to reset, then retry
```

### **Issue 3: Stale cache**
```sql
-- Force refresh by deleting expired data
DELETE FROM football_standings WHERE expires_at < NOW();
DELETE FROM football_matches WHERE expires_at < NOW();
DELETE FROM football_top_scorers WHERE expires_at < NOW();

-- Then re-sync
curl -X POST http://localhost:3000/api/football/sync/all
```

---

## ✅ Success Checklist

After running full sync, verify:

- [ ] Leagues table has 13 records
- [ ] Teams table has 150+ records
- [ ] Standings table has 148+ records (8 leagues)
- [ ] Top scorers table has 160 records (8 leagues × 20)
- [ ] Players table has 160+ records
- [ ] Matches table has 200+ records (upcoming + finished)
- [ ] Sync logs show successful operations
- [ ] No rate limit errors in logs
- [ ] Cache expiration times are set correctly

---

**Created:** 2025-10-06
**Author:** Marosdee Uma
**Purpose:** Testing guide for Football Data Sync system
