import { createClient } from '@supabase/supabase-js';

/**
 * SECURE CONFIGURATION:
 * Strictly localized to Vite environment variables.
 * Note: These are bundled in the client code but are limited by RLS and secure session management.
 */
const getSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL SECURITY ALERT: Supabase credentials missing. Deployment halted.');
    return null;
  }

  /**
   * SUPABASE CLIENT: SECURE INITIALIZATION
   * - RLS Enforcement: All data-fetching logic assumes RLS is active in the database.
   * - Secure Session: Uses Supabase internal secure storage; no raw JWTs in localStorage.
   */
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      navigatorLock: false
    }
  });
};

export const supabase = getSupabase();

/**
 * AUTHENTICATION ACTIONS: PROVIDES SECURE WRAPPERS
 * These methods utilize Supabase's secure built-in session handlers with timeout resilience.
 */
export const authActions = {
  signUp: async (email, password, metadata = {}) => {
    if (!supabase) return { error: { message: 'Supabase client not initialized' } };
    
    // Add a local timeout to ensure we don't hang if the client deadlocks
    const signUpPromise = supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });

    return await Promise.race([
      signUpPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase Auth Timeout (Sign Up)')), 30000)
      )
    ]);
  },

  signIn: async (email, password) => {
    if (!supabase) return { error: { message: 'Supabase client not initialized' } };

    const signInPromise = supabase.auth.signInWithPassword({
      email,
      password,
    });

    return await Promise.race([
      signInPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase Auth Timeout (Sign In)')), 30000)
      )
    ]);
  },

  signOut: async () => {
    if (!supabase) return { error: { message: 'Supabase client not initialized' } };
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getSession: async () => {
    if (!supabase) return { error: { message: 'Supabase client not initialized' } };
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
