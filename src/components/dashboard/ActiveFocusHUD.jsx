import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFocus } from '../../context/FocusContext';
import { Timer, Zap, ArrowRight } from 'lucide-react';

const ActiveFocusHUD = () => {
  const { isActive, timeLeft, mode, modes } = useFocus();
  const navigate = useNavigate();

  if (!isActive) return null;

  const currentMode = modes[mode];
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = currentMode.minutes * 60;
  const progress = (timeLeft / totalSeconds) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 relative overflow-hidden bg-brand-black rounded-[2.5rem] p-8 shadow-2xl shadow-brand-purple/20 border border-white/5"
    >
      {/* Dynamic Background Pulse */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] ${currentMode.bg}`}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
             <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="48" cy="48" r="44"
                  className="stroke-white/10 fill-none"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="48" cy="48" r="44"
                  className={`fill-none ${currentMode.color}`}
                  strokeWidth="6"
                  strokeDasharray="276"
                  animate={{ strokeDashoffset: 276 * (1 - timeLeft / totalSeconds) }}
                  strokeLinecap="round"
                />
             </svg>
             <Timer className="text-white w-8 h-8 opacity-50" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${currentMode.bg} animate-pulse`} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Active Protocol</h3>
            </div>
            <h2 className="text-3xl font-heading font-black italic tracking-tighter text-white uppercase">{currentMode.label}</h2>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="text-6xl font-heading font-black italic tabular-nums tracking-tighter text-white">
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => navigate('/focus/solo')}
            className="group flex items-center gap-3 bg-white/10 hover:bg-white text-white hover:text-brand-black px-6 py-3 rounded-full border border-white/10 transition-all font-black uppercase italic tracking-widest text-[10px]"
          >
            Return to Mission
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Progress Bar (Bottom Edge) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${100 - progress}%` }}
          className={`h-full ${currentMode.bg}`}
        />
      </div>
    </motion.div>
  );
};

export default ActiveFocusHUD;
