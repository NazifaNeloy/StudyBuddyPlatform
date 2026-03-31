import React from 'react';
import { motion } from 'framer-motion';

const CircleParticipants = ({ count = 5 }) => {
  return (
    <div className="bg-surface-container-low p-8 rounded-[2.5rem] shadow-ref border border-outline-variant/10 group">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-headline font-black italic text-xl uppercase tracking-tighter text-on-surface flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">group</span>
          Participants <span className="text-primary font-black opacity-40">({count})</span>
        </h3>
      </div>
      
      <div className="flex -space-x-4 overflow-hidden mb-10">
        {[1, 2, 3, 4].map(n => (
          <motion.div 
            key={n}
            whileHover={{ y: -5, scale: 1.1 }}
            className="inline-block relative group"
          >
            <img 
              alt="Avatar" 
              className="h-14 w-14 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-white" 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n+200}`} 
            />
            <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
          </motion.div>
        ))}
        <div className="flex items-center justify-center h-14 w-14 rounded-full ring-4 ring-white shadow-lg bg-primary-container text-on-primary-container text-[10px] font-black italic shadow-inner">
          +1
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="px-5 py-2.5 bg-white text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-sm italic flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
           Alex (Host)
        </span>
        {['Sam', 'Jordan'].map(name => (
          <span key={name} className="px-5 py-2.5 bg-white/50 text-on-surface-variant rounded-xl text-[10px] font-black uppercase tracking-widest border border-outline-variant/10 shadow-sm opacity-60 hover:opacity-100 transition-all cursor-pointer">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CircleParticipants;
