import React from 'react';
import { motion } from 'framer-motion';

const CircleTimer = ({ seconds, isActive, onToggle, sessionName = "Focus I", participants = 12 }) => {
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (seconds / 1500) * 360;

  return (
    <div className="bg-surface-container-low p-10 md:p-16 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden group shadow-ref-xl border border-white/40">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <span className="material-symbols-outlined text-[15rem]">timer</span>
      </div>
      
      <div className="relative flex flex-col items-center z-10 w-full">
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[12px] border-surface-container-highest flex items-center justify-center relative bg-white shadow-inner">
          {/* Progress Ring (Conic Gradient) */}
          <div 
            className="absolute inset-[-12px] rounded-full border-[12px] transition-all duration-1000"
            style={{ 
              background: `conic-gradient(from 0deg, var(--color-primary) 0%, var(--color-primary-container) ${360 - progress}deg, transparent ${360 - progress}deg)`,
              maskImage: 'radial-gradient(transparent 65%, black 66%)',
              WebkitMaskImage: 'radial-gradient(transparent 65%, black 66%)'
            }}
          ></div>
          
          <div className="text-center relative z-20">
            <span className="text-6xl md:text-7xl font-black text-on-background font-headline tracking-tighter italic">
              {formatTime(seconds)}
            </span>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-outline-variant'}`}></span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-label italic opacity-60">
                {isActive ? 'Neural Sync Active' : 'Protocol Idle'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-12 w-full max-w-md">
          <button 
            onClick={onToggle}
            className={`flex-1 py-5 rounded-2xl font-headline font-black text-lg italic tracking-tighter flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
              isActive 
                ? 'bg-pastel-pink text-red-600 border border-red-100/50 shadow-red-100/20' 
                : 'bg-primary text-white border border-primary shadow-primary/20 hover:bg-primary-dim'
            }`}
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isActive ? 'pause' : 'play_arrow'}
            </span>
            {isActive ? 'PAUSE PROTOCOL' : 'INITIATE FOCUS'}
          </button>
        </div>
      </div>

      <div className="mt-10 flex gap-4 relative z-10">
        <div className="px-6 py-3 bg-white/60 backdrop-blur-md rounded-full border border-outline-variant/10 flex items-center gap-3 shadow-sm">
          <span className="text-[10px] font-black text-on-surface-variant font-label uppercase tracking-widest opacity-60 italic">Session: {sessionName}</span>
        </div>
        <div className="px-6 py-3 bg-white/60 backdrop-blur-md rounded-full border border-outline-variant/10 flex items-center gap-3 shadow-sm">
          <span className="text-[10px] font-black text-on-surface-variant font-label uppercase tracking-widest opacity-60 italic">Participants: {participants}</span>
        </div>
      </div>
    </div>
  );
};

export default CircleTimer;
