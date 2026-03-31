import React from 'react';
import { motion } from 'framer-motion';

const CircleWorkspaceContent = () => {
  const concepts = [
    { id: 1, title: 'Wave-Particle Duality' },
    { id: 2, title: 'Heisenberg Uncertainty' },
    { id: 3, title: 'Quantum Entanglement' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
      {/* Shared Whiteboard Bento */}
      <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-ref border border-outline-variant/10 group h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-headline font-black italic text-xl uppercase tracking-tighter text-on-surface flex items-center gap-3">
             <span className="material-symbols-outlined text-primary">draw</span>
             Shared Whiteboard
          </h3>
          <button className="text-primary opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-gray-50 rounded-xl">
            <span className="material-symbols-outlined">open_in_full</span>
          </button>
        </div>
        <div className="flex-1 bg-surface-container rounded-[2rem] flex items-center justify-center border-2 border-dashed border-outline-variant/30 overflow-hidden relative group/canvas">
          <img 
            className="w-full h-full object-cover opacity-70 group-hover/canvas:opacity-90 transition-opacity" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuANoLu5WcsNDqD-YztO20T0qDsDHYyHCs0M8S7eSVKP7UY0-rYwHtdhtXkQTGKmStXi1ywC4LX9gbmw8IEA4fm8eOEvsKItorz5hVxuM6sHgntC2Mf82oF9FHFkNXiy4Iv9QNtTJkUmUY4ymP_PfPfeqQgx3cbjv0xjKKPKO4ys9jrFnL54lHZ5HInGrclOrnUXdYUzUpQiU5adWufwEDIQzDDaldcfC2opycazvfVZsk8hBTPIX7VvFLQqwSeTyqSWmU6_87OMgtI" 
            alt="Collaborative whiteboard" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-6 left-6 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(71,59,228,0.5)]"></span>
             <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Live Sync...</span>
          </div>
        </div>
      </div>

      {/* Key Concepts Bento */}
      <div className="bg-brand-black text-white p-8 rounded-[2.5rem] shadow-ref-xl border border-black relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-primary group-hover:scale-110 transition-transform duration-1000">
          <span className="material-symbols-outlined text-9xl">psychology</span>
        </div>
        
        <div className="flex justify-between items-start mb-10 relative z-10">
          <h3 className="font-headline font-black italic text-xl uppercase tracking-tighter flex items-center gap-3">
             <span className="material-symbols-outlined text-primary">edit</span>
             Key Concepts
          </h3>
        </div>
        
        <ul className="space-y-4 relative z-10">
          {concepts.map((concept, i) => (
            <motion.li 
               key={concept.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary transition-all group/item cursor-pointer"
            >
              <div className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center text-xs font-black italic shadow-lg shadow-primary/20">
                {concept.id}
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-white/80 group-hover/item:text-white group-hover/item:italic transition-all">
                {concept.title}
              </span>
              <span className="material-symbols-outlined ml-auto text-primary opacity-0 group-hover/item:opacity-100 transition-opacity">chevron_right</span>
            </motion.li>
          ))}
        </ul>
        
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
           <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline italic">Initialize New Synthesis</button>
        </div>
      </div>
    </div>
  );
};

export default CircleWorkspaceContent;
