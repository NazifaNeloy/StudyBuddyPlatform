import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StudySchedule = ({ tasks = [] }) => {
  const formatTaskTime = (dateStr) => {
    if (!dateStr) return 'No Time Protocol';
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    return `${isToday ? 'Today' : date.toLocaleDateString([], { month: 'short', day: 'numeric' })} • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <section className="bg-surface-container-lowest p-8 rounded-xl shadow-ref border border-outline-variant/10">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-black font-headline tracking-tighter uppercase italic text-on-background">Study Schedule</h3>
        <Link to="/calendar" className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[9px] hover:underline group">
          <span className="opacity-70 group-hover:opacity-100">Neural Log</span>
          <span className="material-symbols-outlined text-sm">calendar_month</span>
        </Link>
      </div>

      <div className="space-y-10 relative before:content-[''] before:absolute before:left-0.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/5">
        {tasks.map((task, i) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-8"
          >
            {/* Dot indicator */}
            <div className={`absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full ${['bg-primary', 'bg-secondary', 'bg-tertiary'][i % 3]} shadow-sm ring-4 ring-white z-10`} />
            
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 mb-1.5">
              {formatTaskTime(task.due_date)}
            </p>
            <h4 className="font-black font-headline tracking-tight uppercase italic text-on-background leading-none mb-1">
              {task.title}
            </h4>
            <p className={`text-[11px] font-medium leading-tight ${new Date(task.due_date) < new Date() ? 'text-error font-black uppercase tracking-tighter' : 'text-on-surface-variant'}`}>
              {new Date(task.due_date) < new Date() ? 'High Priority Event' : 'Neural Protocol Active'}
            </p>
          </motion.div>
        ))}

        {tasks.length === 0 && (
          <div className="py-10 text-center opacity-30">
            <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
            <p className="text-[10px] font-black uppercase tracking-widest">No Active Protocols</p>
          </div>
        )}
      </div>

      <Link to="/calendar" className="block w-full mt-10 py-4 bg-surface-container-high text-primary font-black uppercase tracking-widest text-center text-[10px] rounded-2xl hover:bg-surface-container-highest transition-all active:scale-95 border border-black/5 shadow-sm">
        Add New Protocol
      </Link>
    </section>
  );
};

export default StudySchedule;
