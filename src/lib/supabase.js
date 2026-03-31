import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing. Neural sync terminated.');
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'studybuddy-auth-v1', // Reset key to clear any stuck locks
      navigatorLock: false // Explicitly disable to avoid multi-tab deadlocks
    }
  });
};

export const supabase = getSupabase();

/**
 * Authentication Wrapper Functions with Timeout Resilience
 */
export const authActions = {
  signUp: async (email, password, metadata = {}) => {
    // Add a local timeout to ensure we don't hang if the client deadlocks
    const signUpPromise = supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    return await Promise.race([
      signUpPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase Auth Timeout (Sign Up)')), 30000)
      )
    ]);
  },

  signIn: async (email, password) => {
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
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },
};

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
