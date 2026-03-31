import React from 'react';
import { motion } from 'framer-motion';

const RecentCollaborations = () => {
  const collaborators = [
    { name: "Maya's Notes", color: 'bg-primary-container', active: true },
    { name: "Leo's Sketch", color: 'bg-secondary-container', active: true },
    { name: "Study Group B", isStatic: true, color: 'bg-surface-container-highest' },
    { name: "James' PDF", color: 'bg-primary-container', active: false },
  ];

  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Recent Collaborations</h2>
        <span className="h-[1px] flex-1 mx-8 bg-outline-variant/30 hidden md:block opacity-40"></span>
        <button className="text-on-surface-variant hover:text-primary font-label font-black text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">Clear Protocol History</button>
      </div>

      <div className="flex flex-wrap gap-8 justify-center md:justify-start">
        {collaborators.map((collab, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center gap-4 group cursor-pointer"
          >
            <div className="relative">
              <div className={`w-20 h-20 rounded-full border-4 ${collab.color} p-1.5 shadow-ref group-hover:shadow-ref-xl transition-all`}>
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white/50 flex items-center justify-center">
                   {collab.isStatic ? (
                     <span className="material-symbols-outlined text-outline text-3xl">groups</span>
                   ) : (
                     <img 
                       src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+100}`} 
                       alt="Collaborator" 
                       className="w-full h-full object-cover" 
                     />
                   )}
                </div>
              </div>
              {collab.active && (
                <div className="absolute top-0 right-0 bg-tertiary w-5 h-5 rounded-full border-[3px] border-white shadow-sm ring-2 ring-tertiary/20"></div>
              )}
            </div>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity">
              {collab.name}
            </span>
          </motion.div>
        ))}
        
        {/* Connection Pulse Shell */}
        <div className="flex flex-col items-center gap-4 group opacity-20">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-outline/30 p-2 flex items-center justify-center">
             <span className="material-symbols-outlined text-outline">add</span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant italic">Add Peer</span>
        </div>
      </div>
    </section>
  );
};

export default RecentCollaborations;
