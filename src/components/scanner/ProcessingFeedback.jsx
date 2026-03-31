import React from 'react';
import { motion } from 'framer-motion';

const ProcessingFeedback = ({ progress = 68, filename = "Artifact_Lec_04.jpg" }) => {
  return (
    <div className="bg-surface-container-low rounded-xl p-10 border border-white/40 shadow-ref relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-surface-container">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-primary shadow-[0_0_15px_rgba(71,59,228,0.5)]"
        />
      </div>
      
      <div className="flex items-start gap-8">
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-outline-variant/10 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-4xl text-primary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
               <h5 className="font-headline font-black text-xl text-on-surface uppercase italic tracking-tighter">Gemini AI Extracting Text...</h5>
               <p className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest opacity-60 mt-1">Identifying handwriting patterns and structural hierarchy</p>
            </div>
            <span className="text-xs font-black text-primary px-3 py-1.5 bg-primary-container/20 rounded-full border border-primary/10">{progress}% Complete</span>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-outline-variant/10 flex items-center gap-4">
             <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center opacity-40">
                <span className="material-symbols-outlined text-sm">attachment</span>
             </div>
             <p className="text-xs font-label font-bold text-on-surface-variant italic opacity-50 uppercase tracking-widest">Processing: "{filename}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingFeedback;
