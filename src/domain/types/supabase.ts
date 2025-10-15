export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      football_api_sync_log: {
        Row: {
          created_at: string | null
          duration_ms: number | null
          endpoint: string
          error_message: string | null
          id: string
          rate_limit_reset: string | null
          records_synced: number | null
          requests_remaining: number | null
          resource_id: string | null
          resource_type: string
          status: string
          synced_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_ms?: number | null
          endpoint: string
          error_message?: string | null
          id?: string
          rate_limit_reset?: string | null
          records_synced?: number | null
          requests_remaining?: number | null
          resource_id?: string | null
          resource_type: string
          status: string
          synced_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_ms?: number | null
          endpoint?: string
          error_message?: string | null
          id?: string
          rate_limit_reset?: string | null
          records_synced?: number | null
          requests_remaining?: number | null
          resource_id?: string | null
          resource_type?: string
          status?: string
          synced_at?: string | null
        }
        Relationships: []
      }
      football_leagues: {
        Row: {
          api_code: string | null
          api_id: number
          cached_at: string | null
          country: string
          created_at: string | null
          expires_at: string | null
          id: number
          last_synced: string | null
          logo: string | null
          name: string
          season: number
          type: string
          updated_at: string | null
        }
        Insert: {
          api_code?: string | null
          api_id: number
          cached_at?: string | null
          country: string
          created_at?: string | null
          expires_at?: string | null
          id: number
          last_synced?: string | null
          logo?: string | null
          name: string
          season: number
          type: string
          updated_at?: string | null
        }
        Update: {
          api_code?: string | null
          api_id?: number
          cached_at?: string | null
          country?: string
          created_at?: string | null
          expires_at?: string | null
          id?: number
          last_synced?: string | null
          logo?: string | null
          name?: string
          season?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      football_lineups: {
        Row: {
          cached_at: string | null
          created_at: string | null
          formation: string | null
          id: string
          is_starting_xi: boolean | null
          is_substitute: boolean | null
          last_synced: string | null
          match_id: number | null
          player_id: number | null
          position: string | null
          shirt_number: number | null
          substituted_in_minute: number | null
          substituted_out_minute: number | null
          team_id: number | null
        }
        Insert: {
          cached_at?: string | null
          created_at?: string | null
          formation?: string | null
          id?: string
          is_starting_xi?: boolean | null
          is_substitute?: boolean | null
          last_synced?: string | null
          match_id?: number | null
          player_id?: number | null
          position?: string | null
          shirt_number?: number | null
          substituted_in_minute?: number | null
          substituted_out_minute?: number | null
          team_id?: number | null
        }
        Update: {
          cached_at?: string | null
          created_at?: string | null
          formation?: string | null
          id?: string
          is_starting_xi?: boolean | null
          is_substitute?: boolean | null
          last_synced?: string | null
          match_id?: number | null
          player_id?: number | null
          position?: string | null
          shirt_number?: number | null
          substituted_in_minute?: number | null
          substituted_out_minute?: number | null
          team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "football_lineups_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "football_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_lineups_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_lineups_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "football_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      football_match_events: {
        Row: {
          assist_player_id: number | null
          cached_at: string | null
          created_at: string | null
          detail: string | null
          event_type: Database["public"]["Enums"]["football_event_type"]
          id: string
          last_synced: string | null
          match_id: number | null
          minute: number
          player_id: number | null
          team_id: number | null
        }
        Insert: {
          assist_player_id?: number | null
          cached_at?: string | null
          created_at?: string | null
          detail?: string | null
          event_type: Database["public"]["Enums"]["football_event_type"]
          id?: string
          last_synced?: string | null
          match_id?: number | null
          minute: number
          player_id?: number | null
          team_id?: number | null
        }
        Update: {
          assist_player_id?: number | null
          cached_at?: string | null
          created_at?: string | null
          detail?: string | null
          event_type?: Database["public"]["Enums"]["football_event_type"]
          id?: string
          last_synced?: string | null
          match_id?: number | null
          minute?: number
          player_id?: number | null
          team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "football_match_events_assist_player_id_fkey"
            columns: ["assist_player_id"]
            isOneToOne: false
            referencedRelation: "football_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "football_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_match_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_match_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "football_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      football_match_statistics: {
        Row: {
          cached_at: string | null
          corners: number | null
          created_at: string | null
          expires_at: string | null
          fouls: number | null
          id: string
          last_synced: string | null
          match_id: number | null
          offsides: number | null
          pass_accuracy: number | null
          passes: number | null
          possession: number | null
          red_cards: number | null
          shots: number | null
          shots_on_target: number | null
          team_id: number | null
          updated_at: string | null
          yellow_cards: number | null
        }
        Insert: {
          cached_at?: string | null
          corners?: number | null
          created_at?: string | null
          expires_at?: string | null
          fouls?: number | null
          id?: string
          last_synced?: string | null
          match_id?: number | null
          offsides?: number | null
          pass_accuracy?: number | null
          passes?: number | null
          possession?: number | null
          red_cards?: number | null
          shots?: number | null
          shots_on_target?: number | null
          team_id?: number | null
          updated_at?: string | null
          yellow_cards?: number | null
        }
        Update: {
          cached_at?: string | null
          corners?: number | null
          created_at?: string | null
          expires_at?: string | null
          fouls?: number | null
          id?: string
          last_synced?: string | null
          match_id?: number | null
          offsides?: number | null
          pass_accuracy?: number | null
          passes?: number | null
          possession?: number | null
          red_cards?: number | null
          shots?: number | null
          shots_on_target?: number | null
          team_id?: number | null
          updated_at?: string | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "football_match_statistics_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "football_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_match_statistics_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "football_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      football_matches: {
        Row: {
          api_id: number
          api_matchday: number | null
          away_score: number | null
          away_score_fulltime: number | null
          away_score_halftime: number | null
          away_team_id: number | null
          cached_at: string | null
          created_at: string | null
          expires_at: string | null
          home_score: number | null
          home_score_fulltime: number | null
          home_score_halftime: number | null
          home_team_id: number | null
          id: number
          is_live: boolean | null
          last_synced: string | null
          league_id: number | null
          match_date: string
          minute: number | null
          referee: string | null
          season: number
          status: Database["public"]["Enums"]["football_match_status"]
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          api_id: number
          api_matchday?: number | null
          away_score?: number | null
          away_score_fulltime?: number | null
          away_score_halftime?: number | null
          away_team_id?: number | null
          cached_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          home_score?: number | null
          home_score_fulltime?: number | null
          home_score_halftime?: number | null
          home_team_id?: number | null
          id: number
          is_live?: boolean | null
          last_synced?: string | null
          league_id?: number | null
          match_date: string
          minute?: number | null
          referee?: string | null
          season: number
          status?: Database["public"]["Enums"]["football_match_status"]
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          api_id?: number
          api_matchday?: number | null
          away_score?: number | null
          away_score_fulltime?: number | null
          away_score_halftime?: number | null
          away_team_id?: number | null
          cached_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          home_score?: number | null
          home_score_fulltime?: number | null
          home_score_halftime?: number | null
          home_team_id?: number | null
          id?: number
          is_live?: boolean | null
          last_synced?: string | null
          league_id?: number | null
          match_date?: string
          minute?: number | null
          referee?: string | null
          season?: number
          status?: Database["public"]["Enums"]["football_match_status"]
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "football_matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "football_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "football_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "football_leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      football_players: {
        Row: {
          api_id: number
          cached_at: string | null
          created_at: string | null
          date_of_birth: string | null
          expires_at: string | null
          first_name: string | null
          id: number
          last_name: string | null
          last_synced: string | null
          name: string
          nationality: string | null
          photo: string | null
          position:
            | Database["public"]["Enums"]["football_player_position"]
            | null
          shirt_number: number | null
          team_id: number | null
          updated_at: string | null
        }
        Insert: {
          api_id: number
          cached_at?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          expires_at?: string | null
          first_name?: string | null
          id: number
          last_name?: string | null
          last_synced?: string | null
          name: string
          nationality?: string | null
          photo?: string | null
          position?:
            | Database["public"]["Enums"]["football_player_position"]
            | null
          shirt_number?: number | null
          team_id?: number | null
          updated_at?: string | null
        }
        Update: {
          api_id?: number
          cached_at?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          expires_at?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          last_synced?: string | null
          name?: string
          nationality?: string | null
          photo?: string | null
          position?:
            | Database["public"]["Enums"]["football_player_position"]
            | null
          shirt_number?: number | null
          team_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "football_players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "football_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      football_standings: {
        Row: {
          cached_at: string | null
          created_at: string | null
          description: string | null
          drawn: number
          expires_at: string | null
          form: string[] | null
          goal_difference: number
          goals_against: number
          goals_for: number
          id: string
          last_synced: string | null
          league_id: number | null
          lost: number
          played: number
          points: number
          position: number
          season: number
          team_id: number | null
          updated_at: string | null
          won: number
        }
        Insert: {
          cached_at?: string | null
          created_at?: string | null
          description?: string | null
          drawn?: number
          expires_at?: string | null
          form?: string[] | null
          goal_difference?: number
          goals_against?: number
          goals_for?: number
          id?: string
          last_synced?: string | null
          league_id?: number | null
          lost?: number
          played?: number
          points?: number
          position: number
          season: number
          team_id?: number | null
          updated_at?: string | null
          won?: number
        }
        Update: {
          cached_at?: string | null
          created_at?: string | null
          description?: string | null
          drawn?: number
          expires_at?: string | null
          form?: string[] | null
          goal_difference?: number
          goals_against?: number
          goals_for?: number
          id?: string
          last_synced?: string | null
          league_id?: number | null
          lost?: number
          played?: number
          points?: number
          position?: number
          season?: number
          team_id?: number | null
          updated_at?: string | null
          won?: number
        }
        Relationships: [
          {
            foreignKeyName: "football_standings_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "football_leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "football_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      football_teams: {
        Row: {
          address: string | null
          api_id: number
          cached_at: string | null
          country: string
          created_at: string | null
          expires_at: string | null
          founded: number | null
          id: number
          last_synced: string | null
          logo: string | null
          name: string
          short_name: string | null
          tla: string | null
          updated_at: string | null
          venue: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          api_id: number
          cached_at?: string | null
          country: string
          created_at?: string | null
          expires_at?: string | null
          founded?: number | null
          id: number
          last_synced?: string | null
          logo?: string | null
          name: string
          short_name?: string | null
          tla?: string | null
          updated_at?: string | null
          venue?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          api_id?: number
          cached_at?: string | null
          country?: string
          created_at?: string | null
          expires_at?: string | null
          founded?: number | null
          id?: number
          last_synced?: string | null
          logo?: string | null
          name?: string
          short_name?: string | null
          tla?: string | null
          updated_at?: string | null
          venue?: string | null
          website?: string | null
        }
        Relationships: []
      }
      football_top_scorers: {
        Row: {
          appearances: number
          assists: number | null
          cached_at: string | null
          created_at: string | null
          expires_at: string | null
          goals: number
          id: string
          last_synced: string | null
          league_id: number | null
          penalties: number | null
          player_id: number | null
          season: number
          team_id: number | null
          updated_at: string | null
        }
        Insert: {
          appearances?: number
          assists?: number | null
          cached_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          goals?: number
          id?: string
          last_synced?: string | null
          league_id?: number | null
          penalties?: number | null
          player_id?: number | null
          season: number
          team_id?: number | null
          updated_at?: string | null
        }
        Update: {
          appearances?: number
          assists?: number | null
          cached_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          goals?: number
          id?: string
          last_synced?: string | null
          league_id?: number | null
          penalties?: number | null
          player_id?: number | null
          season?: number
          team_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "football_top_scorers_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "football_leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_top_scorers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_top_scorers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "football_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["profile_role"]
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          profile_id: string
          role?: Database["public"]["Enums"]["profile_role"]
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["profile_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profile_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }
        Insert: {
          address?: string | null
          auth_id: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number
          phone?: string | null
          preferences?: Json
          privacy_settings?: Json
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          verification_status?: string
        }
        Update: {
          address?: string | null
          auth_id?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number
          phone?: string | null
          preferences?: Json
          privacy_settings?: Json
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          verification_status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_profile: {
        Args: { username: string; full_name?: string; avatar_url?: string }
        Returns: string
      }
      get_active_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }[]
      }
      get_active_profile_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_active_profile_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      get_auth_user_by_id: {
        Args: { p_id: string }
        Returns: Json
      }
      get_live_matches: {
        Args: Record<PropertyKey, never>
        Returns: {
          api_id: number
          api_matchday: number | null
          away_score: number | null
          away_score_fulltime: number | null
          away_score_halftime: number | null
          away_team_id: number | null
          cached_at: string | null
          created_at: string | null
          expires_at: string | null
          home_score: number | null
          home_score_fulltime: number | null
          home_score_halftime: number | null
          home_team_id: number | null
          id: number
          is_live: boolean | null
          last_synced: string | null
          league_id: number | null
          match_date: string
          minute: number | null
          referee: string | null
          season: number
          status: Database["public"]["Enums"]["football_match_status"]
          updated_at: string | null
          venue: string | null
        }[]
      }
      get_matches_by_date: {
        Args: { target_date: string }
        Returns: {
          api_id: number
          api_matchday: number | null
          away_score: number | null
          away_score_fulltime: number | null
          away_score_halftime: number | null
          away_team_id: number | null
          cached_at: string | null
          created_at: string | null
          expires_at: string | null
          home_score: number | null
          home_score_fulltime: number | null
          home_score_halftime: number | null
          home_team_id: number | null
          id: number
          is_live: boolean | null
          last_synced: string | null
          league_id: number | null
          match_date: string
          minute: number | null
          referee: string | null
          season: number
          status: Database["public"]["Enums"]["football_match_status"]
          updated_at: string | null
          venue: string | null
        }[]
      }
      get_paginated_users: {
        Args: { p_page?: number; p_limit?: number }
        Returns: Json
      }
      get_profile_role: {
        Args: { profile_id: string }
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      get_standings_by_league: {
        Args: { p_league_id: number; p_season: number }
        Returns: {
          cached_at: string | null
          created_at: string | null
          description: string | null
          drawn: number
          expires_at: string | null
          form: string[] | null
          goal_difference: number
          goals_against: number
          goals_for: number
          id: string
          last_synced: string | null
          league_id: number | null
          lost: number
          played: number
          points: number
          position: number
          season: number
          team_id: number | null
          updated_at: string | null
          won: number
        }[]
      }
      get_user_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_cache_expired: {
        Args: { expires_at: string }
        Returns: boolean
      }
      is_moderator_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_service_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      migrate_profile_roles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      set_profile_active: {
        Args: { profile_id: string }
        Returns: boolean
      }
      set_profile_role: {
        Args: {
          target_profile_id: string
          new_role: Database["public"]["Enums"]["profile_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      football_event_type:
        | "goal"
        | "penalty"
        | "own_goal"
        | "yellow_card"
        | "red_card"
        | "substitution"
        | "var"
      football_match_status:
        | "scheduled"
        | "live"
        | "in_play"
        | "paused"
        | "finished"
        | "postponed"
        | "cancelled"
        | "suspended"
      football_player_position:
        | "Goalkeeper"
        | "Defender"
        | "Midfielder"
        | "Attacker"
      profile_role: "user" | "moderator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      football_event_type: [
        "goal",
        "penalty",
        "own_goal",
        "yellow_card",
        "red_card",
        "substitution",
        "var",
      ],
      football_match_status: [
        "scheduled",
        "live",
        "in_play",
        "paused",
        "finished",
        "postponed",
        "cancelled",
        "suspended",
      ],
      football_player_position: [
        "Goalkeeper",
        "Defender",
        "Midfielder",
        "Attacker",
      ],
      profile_role: ["user", "moderator", "admin"],
    },
  },
} as const

