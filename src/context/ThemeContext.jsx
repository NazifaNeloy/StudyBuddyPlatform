import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, profile } = useAuth();
  const [theme, setTheme] = useState(() => {
    // Initial sync with localStorage
    return localStorage.getItem('study_buddy_theme') || 'light';
  });

  // Apply theme to document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('study_buddy_theme', theme);
  }, [theme]);

  // Sync with user profile if available
  useEffect(() => {
    if (profile?.interface_mode) {
      setTheme(profile.interface_mode);
    }
  }, [profile]);

  const toggleTheme = async (newTheme) => {
    setTheme(newTheme);
    
    // Optional: Persist to Supabase if logged in
    if (user) {
      await supabase
        .from('profiles')
        .update({ interface_mode: newTheme })
        .eq('id', user.id);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
