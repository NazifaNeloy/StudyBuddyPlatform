import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Calendar, Star, Users } from 'lucide-react';

const ProjectCard = ({ circle, index }) => {
  // Theme Synergy: Matching Landing Page Tilted Card Palette
  const bgColors = ['bg-pastel-pink', 'bg-pastel-blue', 'bg-pastel-orange', 'bg-pastel-green'];
  const activeBg = bgColors[index % bgColors.length];

  return (
    <motion.div
      whileHover={{ y: -8, shadow: "0 20px 50px rgba(0,0,0,0.06)" }}
      className={`${activeBg} rounded-[2.5rem] p-8 shadow-ref-xl border border-black/5 relative group transition-all h-[420px] flex flex-col`}
    >
      {/* Top Meta Hub */}
      <div className="flex items-center justify-between mb-8">
        <div className={`px-4 py-1.5 bg-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-black`}>
          {circle.status || 'IN PROGRESS'}
        </div>
        <div className={`px-4 py-1.5 bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-black`}>
          {circle.priority || 'MEDIUM'}
        </div>
      </div>

      {/* Brand & Identity */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center p-2 shadow-sm shrink-0">
            <img 
              src={circle.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${circle.name}`} 
              alt={circle.name} 
              className="w-full h-full object-cover rounded-xl" 
            />
          </div>
          <div>
            <h4 className="font-heading font-black text-2xl tracking-tighter leading-none mb-1">{circle.name}</h4>
            <p className="text-[11px] font-black text-brand-black/40 uppercase tracking-widest truncate max-w-[140px] italic">{circle.description || 'Neural Study Protocol'}</p>
          </div>
        </div>
        <button className="text-black/10 hover:text-brand-black transition-colors">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Progress Metric (SYNced WITH HOME) */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter">
          <span>TASK PROGRESS:</span>
          <span className="bg-white/40 px-2.5 py-1 rounded-full text-[10px]">
            {circle.completedTasks || 0} / {circle.totalTasks || 0}
          </span>
        </div>
        <div className="h-2.5 bg-white/40 rounded-full overflow-hidden relative border border-white/20">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${circle.progress || 0}%` }}
             transition={{ duration: 1.5, ease: "circOut" }}
             className="absolute inset-y-0 left-0 bg-brand-purple rounded-full"
           />
        </div>
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap gap-2 mb-8 mt-auto">
        <span className="px-3.5 py-1.5 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-widest">IOS APP</span>
        <span className="px-3.5 py-1.5 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-widest">UI/UX</span>
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between pt-6 border-t border-black/5">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="w-9 h-9 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center transition-transform hover:scale-110">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n + circle.id}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="w-9 h-9 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center font-black text-[10px] text-brand-black/40">+5</div>
        </div>

        <div className="px-4 py-2 bg-white/30 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 italic">
           DUE: {circle.due_date ? new Date(circle.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '20 JUNE'}
        </div>
      </div>

      {/* Floating Sparkle (Optional Brand Touch) */}
      <div className="absolute top-[-10px] right-[-10px] w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-12 shadow-ref-sm">
         <Star className="text-brand-purple fill-brand-purple" size={18} />
      </div>
    </motion.div>
  );
};

export default ProjectCard;
