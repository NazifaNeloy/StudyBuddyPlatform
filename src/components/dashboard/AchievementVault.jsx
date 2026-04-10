import React from 'react';
import { motion } from 'framer-motion';

const AchievementVault = ({ totalXp = 0, userBadges = [] }) => {
  const currentLevel = Math.floor(totalXp / 1000) || 1;
  const nextLevelXp = (currentLevel + 1) * 1000;
  const progress = totalXp > 0 ? ((totalXp % 1000) / 1000) * 100 : 0;

  // Real-world badge library mappings
  const badgeLibrary = {
    'Focus Master': { icon: 'workspace_premium', color: 'text-primary' },
    'Collaborator': { icon: 'groups', color: 'text-secondary' },
    'Librarian': { icon: 'local_library', color: 'text-tertiary' },
    'Early Bird': { icon: 'wb_sunny', color: 'text-yellow-500' },
    'Night Owl': { icon: 'bedtime', color: 'text-brand-purple' },
    'Streak King': { icon: 'auto_awesome', color: 'text-orange-500' }
  };

  return (
    <section className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
             <div className="bg-white p-2 rounded-xl shadow-sm border border-black/5">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
             </div>
             <h3 className="text-2xl font-black font-headline tracking-tighter uppercase italic text-on-background">Achievement Vault</h3>
          </div>
          
          <p className="text-on-surface-variant text-[11px] font-black uppercase tracking-widest leading-none">
            Next Milestone: <span className="text-primary font-black ml-1">SCHOLAR OF THE ATHENEUM</span>
          </p>

          <div className="w-full h-4 bg-white rounded-full overflow-hidden shadow-inner border border-black/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 2, ease: "circOut" }}
              className="h-full bg-gradient-to-r from-primary-container to-tertiary-fixed-dim" 
            />
          </div>

          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
            <span>Level {currentLevel}: Sage</span>
            <span>Level {currentLevel + 1}: Scholar</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 shrink-0">
          {userBadges.length > 0 ? (
            userBadges.slice(0, 3).map((badgeName) => {
              const badge = badgeLibrary[badgeName] || { icon: 'verified', color: 'text-gray-400' };
              return (
                <motion.div 
                  key={badgeName}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="w-20 h-20 bg-white rounded-2xl shadow-ref-sm flex flex-col items-center justify-center p-2 text-center border border-black/5"
                >
                  <span className={`material-symbols-outlined ${badge.color} text-3xl mb-1.5`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {badge.icon}
                  </span>
                  <span className="text-[8px] font-black font-label leading-tight uppercase tracking-tighter opacity-70">
                    {badgeName.toUpperCase()}
                  </span>
                </motion.div>
              );
            })
          ) : (
            // Empty Slots Visual
            [1, 2, 3].map((i) => (
              <div 
                key={i}
                className="w-20 h-20 bg-white/40 rounded-2xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center p-2 text-center"
              >
                <span className="material-symbols-outlined text-black/10 text-2xl mb-1.5">lock</span>
                <span className="text-[7px] font-bold uppercase tracking-tighter opacity-20">Locked</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default AchievementVault;
