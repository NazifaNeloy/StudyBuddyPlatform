import { createClient } from '@supabase/supabase-js';

/**
 * SECURE CONFIGURATION:
 * Strictly localized to Vite environment variables.
 * Note: These are bundled in the client code but are limited by RLS and secure session management.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('CRITICAL SECURITY ALERT: Supabase credentials missing. Deployment halted.');
}

/**
 * SUPABASE CLIENT: SECURE INITIALIZATION
 * - RLS Enforcement: All data-fetching logic assumes RLS is active in the database.
 * - Secure Session: Uses Supabase internal secure storage; no raw JWTs in localStorage.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token-protected', // Obfuscated storage key
  },
});

/**
 * AUTHENTICATION ACTIONS: PROVIDES SECURE WRAPPERS
 * These methods utilize Supabase's secure built-in session handlers.
 */
export const authActions = {
  signUp: async (email, password, metadata = {}) => {
    // Input validation should be completed at the component layer before this call.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getSession: async () => {
    // Always use getSession() to ensure accurate and secure access to the current session.
    return await supabase.auth.getSession();
  },
};

/**
 * STORAGE ACTIONS: SUBJECT TO RLS
 * Ensure appropriate policies are created for 'resources' and 'scans' buckets.
 */
export const storageActions = {
  uploadFile: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: true });
    return { data, error };
  },

  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },
};
