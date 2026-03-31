import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, MoreVertical, Timer } from 'lucide-react';

const ProjectActivity = ({ circles }) => {
  const rowColors = ['bg-pastel-yellow', 'bg-pastel-blue', 'bg-pastel-pink'];

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-ref-xl h-full flex flex-col transition-all border border-black/5">
      <div className="space-y-10">
        {circles.slice(0, 2).map((circle, i) => (
          <div key={circle.id} className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                  <h4 className="font-heading font-black text-xl italic uppercase tracking-tighter">{circle.name}</h4>
               </div>
               <button className="text-gray-200 hover:text-brand-purple transition-all">
                  <Play size={24} className="fill-current" />
               </button>
            </div>

            <div className={`rounded-[2rem] p-6 border border-black/5 flex items-center justify-between group hover:shadow-sm transition-all ${rowColors[i % 3]}`}>
               <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/40 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-sm shrink-0">
                     <img 
                       src={circle.image_url || 'https://api.dicebear.com/7.x/shapes/svg?seed=G'} 
                       alt="L" 
                       className="w-7 h-7 object-contain"
                     />
                  </div>
                  <span className="font-black italic uppercase text-[10px] tracking-widest text-brand-black/40">Neural Session</span>
               </div>
               
               <div className="flex items-center gap-6">
                  <div className="text-2xl font-black italic tracking-tighter text-brand-black">
                    {30 + (i * 15)}m {20 - (i * 10)}s
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-black flex items-center justify-center border border-black/5 shadow-sm">
                     <Pause size={18} className="fill-white text-white" />
                  </div>
                  <MoreVertical size={24} className="text-black/10" />
               </div>
            </div>

            {/* Sub-metas */}
            <div className="grid grid-cols-1 gap-3 pl-4">
               {['Main Logic Layer', 'Interface Synthesis'].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between text-[11px] font-black uppercase text-gray-400 group-hover:text-brand-black transition-colors italic">
                    <div className="flex items-center gap-4">
                       <Timer size={14} className="text-brand-purple" />
                       {item}
                    </div>
                    <span>{15 + idx}m 00s</span>
                 </div>
               ))}
            </div>
          </div>
        ))}
        
        {circles.length === 0 && (
          <div className="py-20 opacity-10 text-center">
             <Timer size={48} className="mx-auto border-[3px] border-brand-black rounded-full p-2" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectActivity;
