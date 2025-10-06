-- Initial Schema for SoccerTactics App
-- Created: 2025-10-06
-- Author: Marosdee Uma
-- Description: Football data cache schema for storing data from football-data.org API
-- Strategy: Cache API data in database to avoid rate limits (10 req/min free tier)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- FOOTBALL DATA CACHE TABLES
-- ============================================================================
-- All tables prefixed with 'football_' to indicate official football data
-- Data is cached from https://api.football-data.org/v4
-- ============================================================================

-- Create custom types for football data
CREATE TYPE football_match_status AS ENUM (
  'scheduled',
  'live',
  'in_play',
  'paused',
  'finished',
  'postponed',
  'cancelled',
  'suspended'
);

CREATE TYPE football_event_type AS ENUM (
  'goal',
  'penalty',
  'own_goal',
  'yellow_card',
  'red_card',
  'substitution',
  'var'
);

CREATE TYPE football_player_position AS ENUM (
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Attacker'
);

-- ============================================================================
-- 1. FOOTBALL LEAGUES TABLE
-- ============================================================================
-- Stores league/competition information
-- Cache duration: 24 hours (leagues rarely change)
CREATE TABLE IF NOT EXISTS public.football_leagues (
  id INTEGER PRIMARY KEY, -- API league ID (e.g., 2021 for Premier League)
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  logo TEXT,
  season INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'LEAGUE', 'CUP', 'INTERNATIONAL'
  
  -- API metadata
  api_id INTEGER NOT NULL, -- Original API ID
  api_code TEXT, -- League code from API (e.g., 'PL', 'PD')
  
  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_football_leagues_country ON public.football_leagues(country);
CREATE INDEX idx_football_leagues_season ON public.football_leagues(season);
CREATE INDEX idx_football_leagues_expires_at ON public.football_leagues(expires_at);

-- ============================================================================
-- 2. FOOTBALL TEAMS TABLE
-- ============================================================================
-- Stores team information
-- Cache duration: 24 hours (team info rarely changes)
CREATE TABLE IF NOT EXISTS public.football_teams (
  id INTEGER PRIMARY KEY, -- API team ID
  name TEXT NOT NULL,
  short_name TEXT,
  tla TEXT, -- Three Letter Abbreviation (e.g., 'MUN', 'LIV')
  logo TEXT,
  founded INTEGER,
  country TEXT NOT NULL,
  venue TEXT,
  address TEXT,
  website TEXT,
  
  -- API metadata
  api_id INTEGER NOT NULL,
  
  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_football_teams_country ON public.football_teams(country);
CREATE INDEX idx_football_teams_name ON public.football_teams(name);
CREATE INDEX idx_football_teams_expires_at ON public.football_teams(expires_at);

-- ============================================================================
-- 3. FOOTBALL MATCHES TABLE
-- ============================================================================
-- Stores match information
-- Cache duration: 5 minutes for upcoming/live, 1 hour for finished
CREATE TABLE IF NOT EXISTS public.football_matches (
  id INTEGER PRIMARY KEY, -- API match ID
  league_id INTEGER REFERENCES public.football_leagues(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  
  -- Match details
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status football_match_status NOT NULL DEFAULT 'scheduled',
  minute INTEGER, -- Current minute (for live matches)
  
  -- Teams
  home_team_id INTEGER REFERENCES public.football_teams(id) ON DELETE CASCADE,
  away_team_id INTEGER REFERENCES public.football_teams(id) ON DELETE CASCADE,
  
  -- Scores
  home_score INTEGER,
  away_score INTEGER,
  home_score_halftime INTEGER,
  away_score_halftime INTEGER,
  home_score_fulltime INTEGER,
  away_score_fulltime INTEGER,
  
  -- Match info
  venue TEXT,
  referee TEXT,
  
  -- API metadata
  api_id INTEGER NOT NULL,
  api_matchday INTEGER, -- Matchday/round number
  
  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '5 minutes'),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_live BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_football_matches_league ON public.football_matches(league_id);
CREATE INDEX idx_football_matches_date ON public.football_matches(match_date);
CREATE INDEX idx_football_matches_status ON public.football_matches(status);
CREATE INDEX idx_football_matches_home_team ON public.football_matches(home_team_id);
CREATE INDEX idx_football_matches_away_team ON public.football_matches(away_team_id);
CREATE INDEX idx_football_matches_is_live ON public.football_matches(is_live);
CREATE INDEX idx_football_matches_expires_at ON public.football_matches(expires_at);

-- ============================================================================
-- 4. FOOTBALL STANDINGS TABLE
-- ============================================================================
-- Stores league standings/table
-- Cache duration: 1 hour
CREATE TABLE IF NOT EXISTS public.football_standings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id INTEGER REFERENCES public.football_leagues(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  team_id INTEGER REFERENCES public.football_teams(id) ON DELETE CASCADE,
  
  -- Standing details
  position INTEGER NOT NULL,
  played INTEGER NOT NULL DEFAULT 0,
  won INTEGER NOT NULL DEFAULT 0,
  drawn INTEGER NOT NULL DEFAULT 0,
  lost INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  goal_difference INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  
  -- Form (last 5 matches: W, D, L)
  form TEXT[], -- ['W', 'W', 'D', 'L', 'W']
  
  -- Zone description (e.g., 'Champions League', 'Relegation')
  description TEXT,
  
  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(league_id, season, team_id)
);

CREATE INDEX idx_football_standings_league_season ON public.football_standings(league_id, season);
CREATE INDEX idx_football_standings_position ON public.football_standings(position);
CREATE INDEX idx_football_standings_expires_at ON public.football_standings(expires_at);

-- ============================================================================
-- 5. FOOTBALL PLAYERS TABLE
-- ============================================================================
-- Stores player information
-- Cache duration: 24 hours
CREATE TABLE IF NOT EXISTS public.football_players (
  id INTEGER PRIMARY KEY, -- API player ID
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  nationality TEXT,
  position football_player_position,
  shirt_number INTEGER,
  photo TEXT,
  
  -- Current team
  team_id INTEGER REFERENCES public.football_teams(id) ON DELETE SET NULL,
  
  -- API metadata
  api_id INTEGER NOT NULL,
  
  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_football_players_name ON public.football_players(name);
CREATE INDEX idx_football_players_team ON public.football_players(team_id);
CREATE INDEX idx_football_players_position ON public.football_players(position);
CREATE INDEX idx_football_players_expires_at ON public.football_players(expires_at);

-- ============================================================================
-- 6. FOOTBALL MATCH STATISTICS TABLE
-- ============================================================================
-- Stores detailed match statistics
-- Cache duration: 5 minutes for live, permanent for finished
CREATE TABLE IF NOT EXISTS public.football_match_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id INTEGER REFERENCES public.football_matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES public.football_teams(id) ON DELETE CASCADE,
  
  -- Statistics
  possession INTEGER, -- Percentage
  shots INTEGER,
  shots_on_target INTEGER,
  corners INTEGER,
  fouls INTEGER,
  yellow_cards INTEGER,
  red_cards INTEGER,
  offsides INTEGER,
  passes INTEGER,
  pass_accuracy INTEGER, -- Percentage
  
  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '5 minutes'),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(match_id, team_id)
);

CREATE INDEX idx_football_match_stats_match ON public.football_match_statistics(match_id);
CREATE INDEX idx_football_match_stats_expires_at ON public.football_match_statistics(expires_at);

-- ============================================================================
-- 7. FOOTBALL MATCH EVENTS TABLE
-- ============================================================================
-- Stores match events (goals, cards, substitutions)
-- Cache duration: 30 seconds for live, permanent for finished
CREATE TABLE IF NOT EXISTS public.football_match_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id INTEGER REFERENCES public.football_matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES public.football_teams(id) ON DELETE CASCADE,
  
  -- Event details
  minute INTEGER NOT NULL,
  event_type football_event_type NOT NULL,
  player_id INTEGER REFERENCES public.football_players(id) ON DELETE SET NULL,
  assist_player_id INTEGER REFERENCES public.football_players(id) ON DELETE SET NULL,
  detail TEXT, -- Additional details (e.g., 'Penalty', 'Header')
  
  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_football_match_events_match ON public.football_match_events(match_id);
CREATE INDEX idx_football_match_events_type ON public.football_match_events(event_type);
CREATE INDEX idx_football_match_events_minute ON public.football_match_events(minute);

-- ============================================================================
-- 8. FOOTBALL LINEUPS TABLE
-- ============================================================================
-- Stores team lineups for matches
-- Cache duration: Permanent once match starts
CREATE TABLE IF NOT EXISTS public.football_lineups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id INTEGER REFERENCES public.football_matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES public.football_teams(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES public.football_players(id) ON DELETE CASCADE,
  
  -- Lineup details
  formation TEXT, -- e.g., '4-3-3', '4-4-2'
  position TEXT, -- Position in formation
  shirt_number INTEGER,
  is_starting_xi BOOLEAN DEFAULT TRUE,
  is_substitute BOOLEAN DEFAULT FALSE,
  
  -- Substitution info
  substituted_in_minute INTEGER,
  substituted_out_minute INTEGER,
  
  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_football_lineups_match ON public.football_lineups(match_id);
CREATE INDEX idx_football_lineups_team ON public.football_lineups(team_id);
CREATE INDEX idx_football_lineups_player ON public.football_lineups(player_id);
CREATE INDEX idx_football_lineups_starting ON public.football_lineups(is_starting_xi);

-- ============================================================================
-- 9. FOOTBALL TOP SCORERS TABLE
-- ============================================================================
-- Stores top scorers for each league/season
-- Cache duration: 1 hour
CREATE TABLE IF NOT EXISTS public.football_top_scorers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id INTEGER REFERENCES public.football_leagues(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  player_id INTEGER REFERENCES public.football_players(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES public.football_teams(id) ON DELETE CASCADE,
  
  -- Scorer stats
  goals INTEGER NOT NULL DEFAULT 0,
  assists INTEGER DEFAULT 0,
  appearances INTEGER NOT NULL DEFAULT 0,
  penalties INTEGER DEFAULT 0,
  
  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(league_id, season, player_id)
);

CREATE INDEX idx_football_top_scorers_league_season ON public.football_top_scorers(league_id, season);
CREATE INDEX idx_football_top_scorers_goals ON public.football_top_scorers(goals DESC);
CREATE INDEX idx_football_top_scorers_expires_at ON public.football_top_scorers(expires_at);

-- ============================================================================
-- 10. FOOTBALL API SYNC LOG TABLE
-- ============================================================================
-- Tracks API sync operations for monitoring and debugging
CREATE TABLE IF NOT EXISTS public.football_api_sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Sync details
  endpoint TEXT NOT NULL, -- API endpoint called
  resource_type TEXT NOT NULL, -- 'leagues', 'matches', 'standings', etc.
  resource_id TEXT, -- Specific resource ID if applicable
  
  -- Sync result
  status TEXT NOT NULL, -- 'success', 'error', 'rate_limited'
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  
  -- Rate limiting
  requests_remaining INTEGER, -- Remaining API requests
  rate_limit_reset TIMESTAMP WITH TIME ZONE,
  
  -- Timing
  duration_ms INTEGER, -- Sync duration in milliseconds
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_football_api_sync_log_resource ON public.football_api_sync_log(resource_type);
CREATE INDEX idx_football_api_sync_log_status ON public.football_api_sync_log(status);
CREATE INDEX idx_football_api_sync_log_synced_at ON public.football_api_sync_log(synced_at);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all football tables
CREATE TRIGGER update_football_leagues_updated_at
BEFORE UPDATE ON public.football_leagues
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_football_teams_updated_at
BEFORE UPDATE ON public.football_teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_football_matches_updated_at
BEFORE UPDATE ON public.football_matches
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_football_standings_updated_at
BEFORE UPDATE ON public.football_standings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_football_players_updated_at
BEFORE UPDATE ON public.football_players
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_football_match_statistics_updated_at
BEFORE UPDATE ON public.football_match_statistics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_football_top_scorers_updated_at
BEFORE UPDATE ON public.football_top_scorers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if cache is expired
CREATE OR REPLACE FUNCTION is_cache_expired(expires_at TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN expires_at IS NULL OR expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get live matches (cache not expired)
CREATE OR REPLACE FUNCTION get_live_matches()
RETURNS SETOF public.football_matches AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.football_matches
  WHERE is_live = TRUE
  AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY match_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get matches by date
CREATE OR REPLACE FUNCTION get_matches_by_date(target_date DATE)
RETURNS SETOF public.football_matches AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.football_matches
  WHERE DATE(match_date) = target_date
  AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY match_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get standings by league
CREATE OR REPLACE FUNCTION get_standings_by_league(p_league_id INTEGER, p_season INTEGER)
RETURNS SETOF public.football_standings AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.football_standings
  WHERE league_id = p_league_id
  AND season = p_season
  AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY position ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.football_leagues IS 'Cached league/competition data from football-data.org API';
COMMENT ON TABLE public.football_teams IS 'Cached team data from football-data.org API';
COMMENT ON TABLE public.football_matches IS 'Cached match data from football-data.org API. Live matches cached for 30s, finished for 1h';
COMMENT ON TABLE public.football_standings IS 'Cached league standings/table data. Updated every 1 hour';
COMMENT ON TABLE public.football_players IS 'Cached player data from football-data.org API';
COMMENT ON TABLE public.football_match_statistics IS 'Cached match statistics (possession, shots, etc.)';
COMMENT ON TABLE public.football_match_events IS 'Cached match events (goals, cards, substitutions)';
COMMENT ON TABLE public.football_lineups IS 'Cached team lineups for matches';
COMMENT ON TABLE public.football_top_scorers IS 'Cached top scorers for each league/season';
COMMENT ON TABLE public.football_api_sync_log IS 'Log of API sync operations for monitoring and debugging';

-- ============================================================================
-- END OF FOOTBALL DATA CACHE SCHEMA
-- ============================================================================