import React from 'react';
import { motion } from 'framer-motion';

const LibraryHero = ({ usedStorage = 4.1, totalStorage = 5.0 }) => {
  const percentage = Math.round((usedStorage / totalStorage) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-12">
      <div className="lg:col-span-2">
        <h1 className="text-4xl md:text-6xl font-extrabold text-on-surface tracking-tighter mb-4 italic uppercase">
          Your Knowledge <span className="text-primary underline decoration-primary/20 underline-offset-8">Hub</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl font-body leading-relaxed opacity-70">
          Manage, organize, and share your academic assets. Drag and drop to instantly sync across your Study Circles.
        </p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-surface-container-low rounded-xl p-8 flex flex-col gap-5 border border-outline-variant/10 shadow-ref-sm relative overflow-hidden group"
      >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">Cloud Storage Protocol</span>
          <span className="text-xs font-black text-primary">{percentage}% Used</span>
        </div>
        
        <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden border border-black/5 p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full shadow-sm"
          />
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <p className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-wider">
            {usedStorage} GB of {totalStorage} GB used
          </p>
          <button className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer italic">
            Upgrade Capacity
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LibraryHero;
