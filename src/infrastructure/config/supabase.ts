/**
 * Supabase Client Configuration
 * Centralized Supabase client for server and client-side usage
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '../../domain/types/supabase';

// Supabase URL and Keys from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

/**
 * Supabase Client for Client-Side Usage
 * Use this in React components and client-side code
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'SoccerTactics',
    },
  },
});

/**
 * Supabase Client for Server-Side Usage
 * Use this in API routes and server components
 */
export const supabaseServer = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
  }
);

/**
 * Helper function to check Supabase connection
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('football_leagues').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

/**
 * Type exports for convenience
 */
export type { Database };
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
