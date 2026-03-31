import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
  session: null,
  user: null,
  signOut: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileFetcherRef = React.useRef(null);

  const fetchProfile = async (sessionUser) => {
    if (!sessionUser) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();
      
      if (error) {
        console.error('Error fetching neural profile:', error.message);
        return sessionUser;
      }
      return { ...sessionUser, ...data };
    } catch (err) {
      console.error('fetchProfile: unexpected error:', err);
      return sessionUser;
    }
  };

  useEffect(() => {
    let active = true;
    
    // Safety timeout: Only force render if sync hasn't resolved within 5s
    const timeoutId = setTimeout(() => {
      if (active && loading) {
        console.warn('AuthProvider: Sync timeout. Continuing with current local heartbeat.');
        setLoading(false);
      }
    }, 10000);

    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Establishing neural link...');
        
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (initialSession?.user) {
          console.log('AuthProvider: Identity found. Fetching neural profile...');
          setSession(initialSession);
          const fullUser = await fetchProfile(initialSession.user);
          if (active) {
            setUser(fullUser);
          }
        }
      } catch (err) {
        console.error('AuthProvider: Sync bottleneck:', err.message);
      } finally {
        if (active) {
          setLoading(false);
          clearTimeout(timeoutId);
          console.log('AuthProvider: Global sync complete.');
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!active) return;
        
        setSession(session);
        if (session?.user) {
          const fullUser = await fetchProfile(session.user);
          if (active) setUser(fullUser);
        } else {
          if (active) setUser(null);
        }
        
        if (active) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const value = {
    session,
    user,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
