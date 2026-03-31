import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Zap, Flame, Trophy, Star, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const SoloFocus = () => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, short, long
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showReward, setShowReward] = useState(false);
  
  const timerRef = useRef(null);

  const modes = {
    focus: { label: 'Deep Focus', minutes: 25, color: 'text-brand-purple', bg: 'bg-brand-purple' },
    short: { label: 'Short Quest', minutes: 5, color: 'text-pastel-blue', bg: 'bg-pastel-blue' },
    long: { label: 'Grand Rest', minutes: 15, color: 'text-pastel-green', bg: 'bg-pastel-green' }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    setSessionsCompleted(prev => prev + 1);
    setShowReward(true);
    
    // Default back to focus or next break
    if (mode === 'focus') {
      const nextMode = (sessionsCompleted + 1) % 4 === 0 ? 'long' : 'short';
      setMode(nextMode);
      setTimeLeft(modes[nextMode].minutes * 60);
      
      // Update DB with XP/Hours/Streak using the unified hook
      await updateFocusStats(25);
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
    
    setTimeout(() => setShowReward(false), 5000);
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].minutes * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(modes[newMode].minutes * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / (modes[mode].minutes * 60));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <div className="flex items-center justify-between">
          <Link to="/focus" className="flex items-center gap-3 text-gray-400 hover:text-brand-purple transition-all font-black uppercase italic tracking-tighter group">
            <div className="p-3 rounded-2xl border border-black/5 bg-white group-hover:scale-110 transition-all shadow-ref text-brand-black">
              <ChevronLeft size={22} />
            </div>
            Leave Protocol
          </Link>
          <div className="px-6 py-3 bg-brand-black text-white rounded-full border border-black/5 shadow-xl shadow-brand-black/10 font-heading font-black italic text-xs uppercase tracking-widest">
            Solo Protocol: Active
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Timer Column */}
          <div className="space-y-8 flex flex-col items-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="160" cy="160" r="150"
                  className="stroke-black/5 fill-none"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="160" cy="160" r="150"
                  className={`fill-none ${modes[mode].color} transition-colors duration-500`}
                  strokeWidth="10"
                  strokeDasharray="942"
                  animate={{ strokeDashoffset: 942 * (1 - progress) }}
                  strokeLinecap="round"
                />
              </svg>

              <div className="text-center z-10">
                <motion.div 
                  key={timeLeft}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl font-heading font-black tabular-nums tracking-tighter italic"
                >
                  {formatTime(timeLeft)}
                </motion.div>
                <div className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mt-2">{modes[mode].label}</div>
              </div>

              {/* Orbital Elements */}
              {isActive && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className={`absolute top-0 left-1/2 -ml-3 -mt-3 w-7 h-7 ${modes[mode].bg} border-4 border-white rounded-full shadow-lg`} />
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetTimer}
                className="w-20 h-20 rounded-full border border-black/5 bg-white shadow-ref flex items-center justify-center hover:bg-gray-50 transition-all text-brand-black"
              >
                <RotateCcw size={32} />
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTimer}
                className={`w-32 h-32 rounded-full border border-black/5 shadow-ref-xl flex items-center justify-center transition-all ${
                  isActive ? 'bg-white text-brand-black' : 'bg-brand-black text-white'
                }`}
              >
                {isActive ? <Pause size={56} fill="currentColor" /> : <Play size={56} fill="currentColor" className="ml-2" />}
              </motion.button>

              <div className="w-14" /> {/* Spacer */}
            </div>
          </div>

          {/* Settings/Stats Column */}
          <div className="space-y-6">
            <div className="bg-white border border-black/5 rounded-[2.5rem] shadow-ref-xl p-10 space-y-8">
              <h3 className="text-3xl font-heading font-black italic tracking-tighter uppercase text-brand-black">Mission Control</h3>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(modes).map(([key, m]) => (
                  <button
                    key={key}
                    onClick={() => switchMode(key)}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all font-black italic tracking-tighter text-lg uppercase ${
                      mode === key 
                        ? 'border-brand-purple bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                        : 'border-black/5 hover:border-brand-purple bg-gray-50/50'
                    }`}
                  >
                    <span>{m.label}</span>
                    <div className={`px-4 py-1.5 rounded-full text-[12px] font-black uppercase ${mode === key ? 'bg-white/20' : 'bg-white shadow-sm text-brand-purple'}`}>
                      {m.minutes}m
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-pastel-yellow border border-black/5 rounded-[2rem] shadow-ref-xl p-8 text-center">
                 <Flame className="mx-auto mb-3 text-orange-600" size={32} />
                 <div className="text-4xl font-heading font-black italic tracking-tighter">{sessionsCompleted}</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 mt-1">Sessions Today</div>
              </div>
              <div className="bg-pastel-pink border border-black/5 rounded-[2rem] shadow-ref-xl p-8 text-center">
                 <Star className="mx-auto mb-3 text-pink-600" size={32} />
                 <div className="text-4xl font-heading font-black italic tracking-tighter">{sessionsCompleted * 50}</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 mt-1">Global XP</div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Up Notification */}
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200]"
          >
             <div className="bg-white border border-black/5 rounded-full px-12 py-6 shadow-ref-xl flex items-center gap-8">
                <div className="w-14 h-14 bg-pastel-yellow rounded-full border border-white/40 flex items-center justify-center animate-bounce shadow-md">
                  <Trophy size={28} className="text-brand-black" />
                </div>
                <div>
                  <h4 className="font-heading font-black italic text-2xl tracking-tighter text-brand-black">MISSION COMPLETE</h4>
                  <p className="text-[10px] font-black text-brand-purple uppercase tracking-[0.2em]">+50 XP Materialized</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default SoloFocus;
