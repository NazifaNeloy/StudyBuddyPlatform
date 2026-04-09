import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const FocusContext = createContext({
  isActive: false,
  timeLeft: 25 * 60,
  mode: 'focus',
  sessionsCompleted: 0,
  startSession: () => {},
  pauseSession: () => {},
  resumeSession: () => {},
  resetSession: () => {},
  switchMode: () => {},
  modes: {}
});

export const modes = {
  focus: { label: 'Deep Focus', minutes: 25, color: 'text-brand-purple', bg: 'bg-brand-purple', accent: 'border-brand-purple' },
  short: { label: 'Short Quest', minutes: 5, color: 'text-pastel-blue', bg: 'bg-pastel-blue', accent: 'border-pastel-blue' },
  long: { label: 'Grand Rest', minutes: 15, color: 'text-pastel-green', bg: 'bg-pastel-green', accent: 'border-pastel-green' }
};

export const FocusProvider = ({ children }) => {
  const { user, updateFocusStats } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(modes.focus.minutes * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const timerRef = useRef(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('active_focus_session');
    if (saved) {
      try {
        const { mode: savedMode, timeLeft: savedTime, isActive: savedActive, lastUpdate, sessions } = JSON.parse(saved);
        setMode(savedMode);
        setSessionsCompleted(sessions || 0);
        
        if (savedActive) {
          const now = Date.now();
          const elapsed = Math.floor((now - lastUpdate) / 1000);
          const newTime = Math.max(0, savedTime - elapsed);
          setTimeLeft(newTime);
          if (newTime > 0) setIsActive(true);
          else handleSessionComplete();
        } else {
          setTimeLeft(savedTime);
        }
      } catch (e) {
        console.error('Failed to restore focus session:', e);
      }
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    const sessionState = {
      mode,
      timeLeft,
      isActive,
      sessions: sessionsCompleted,
      lastUpdate: Date.now()
    };
    localStorage.setItem('active_focus_session', JSON.stringify(sessionState));
  }, [mode, timeLeft, isActive, sessionsCompleted]);

  // Timer Logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSessionComplete();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    const completedMinutes = modes[mode].minutes;
    
    if (mode === 'focus') {
      setSessionsCompleted(prev => prev + 1);
      // Update DB
      if (updateFocusStats) {
        await updateFocusStats(completedMinutes);
      }
    }

    // Determine next mode
    let nextMode = 'focus';
    if (mode === 'focus') {
      nextMode = (sessionsCompleted + 1) % 4 === 0 ? 'long' : 'short';
    }
    
    setMode(nextMode);
    setTimeLeft(modes[nextMode].minutes * 60);
    
    // Play sound or notification could go here
    console.log(`Focus session complete: ${mode}`);
  };

  const startSession = (m = mode) => {
    setMode(m);
    setTimeLeft(modes[m].minutes * 60);
    setIsActive(true);
  };

  const pauseSession = () => setIsActive(false);
  const resumeSession = () => setIsActive(true);
  
  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].minutes * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(modes[newMode].minutes * 60);
  };

  const value = {
    isActive,
    timeLeft,
    mode,
    sessionsCompleted,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    switchMode,
    modes
  };

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => useContext(FocusContext);
