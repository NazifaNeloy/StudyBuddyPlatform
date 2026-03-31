import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SmartScannerBento = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-secondary to-secondary-dim p-8 rounded-xl text-on-secondary shadow-xl relative overflow-hidden group">
      <div className="relative z-10">
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-16 h-16 bg-secondary-container/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/10"
        >
          <span className="material-symbols-outlined text-secondary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
        </motion.div>
        
        <h3 className="text-2xl font-black font-headline tracking-tighter mb-2 leading-tight uppercase italic">AI Insights: "Smart Scanner"</h3>
        <p className="text-on-secondary/80 text-[11px] font-medium mb-8 leading-relaxed max-w-[240px]">
          We've identified 3 key topics from your chemistry notes that might appear on tomorrow's quiz. Want a custom flashcard deck?
        </p>
        
        <button 
          onClick={() => navigate('/scanner')}
          className="bg-white text-secondary px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-secondary-container transition-all active:scale-95"
        >
          Generate Flashcards
        </button>
      </div>

      <div className="absolute -bottom-6 -right-6 text-[140px] text-white/5 select-none rotate-12 transition-transform group-hover:rotate-0 duration-700">
        <span className="material-symbols-outlined" style={{ fontSize: 'inherit', fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
      </div>
    </section>
  );
};

export default SmartScannerBento;
