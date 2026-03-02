// ============================================================================
// TAMV Supabase Client - Fixed with error handling for missing credentials
// ============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check if credentials are available
const isConfigured = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY && 
  SUPABASE_URL !== 'your-project.supabase.co' &&
  SUPABASE_PUBLISHABLE_KEY !== 'your-publishable-key';

// Create client only if configured
let supabase: SupabaseClient<Database>;

if (isConfigured) {
  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-client-info': 'tamv-md-x4',
      },
    },
  });
} else {
  // Create a mock client for development/fallback
  // This allows the app to render even without Supabase configured
  console.warn('⚠️ Supabase not configured. Using fallback mode.');
  
  // @ts-ignore - Create minimal mock for development
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      eq: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
    }),
    removeChannel: () => {},
  } as any;
}

export { supabase };

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => isConfigured;
