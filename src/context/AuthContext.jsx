import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
  session: null,
  user: null,
  signOut: () => {},
  refreshProfile: async () => {},
  updateFocusStats: async (minutes) => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

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

  const refreshProfile = async () => {
    if (session?.user) {
      const fullUser = await fetchProfile(session.user);
      setUser(fullUser);
    }
  };

  const updateFocusStats = async (minutes) => {
    if (!user) return;
    
    // XP Logic: 2 XP per focused minute
    const xpGain = minutes * 2;
    const hoursGain = Number((minutes / 60).toFixed(2));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          focus_hours: (user.focus_hours || 0) + hoursGain,
          total_xp: (user.total_xp || 0) + xpGain,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;

      // Log to session history
      const now = new Date();
      const startTime = new Date(now.getTime() - minutes * 60000);
      
      await supabase.from('study_sessions').insert([{
        created_by: user.id,
        start_time: startTime.toISOString(),
        end_time: now.toISOString(),
        created_at: now.toISOString()
      }]);
      
      // Refresh local state
      await refreshProfile();
      console.log(`Neural Stats Synchronized: +${minutes}m (${xpGain} XP)`);
    } catch (err) {
      console.error('Failed to update neural stats:', err.message);
    }
  };

  // 1. Session Management
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (active) {
        setSession(s);
        setIsAuthReady(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      console.log(`AuthProvider: Neural Event ${event}`);
      if (active) {
        setSession(s);
        setIsAuthReady(true);
        if (!s) setUser(null);
      }
    });

    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  // 2. Profile Synchronization
  useEffect(() => {
    if (!session?.user?.id) return;
    let active = true;
    
    fetchProfile(session.user).then(full => {
      if (active) setUser(full);
    });
    
    return () => { active = false; };
  }, [session?.user?.id]);

  const value = {
    session,
    user,
    signOut: () => supabase.auth.signOut(),
    refreshProfile,
    updateFocusStats,
    isAuthReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {isAuthReady ? children : (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-brand-white">
          <div className="w-16 h-16 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse italic">Materializing Neural Link...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
