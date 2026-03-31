import React from 'react';
import { motion } from 'framer-motion';
import { format, isAfter, isToday } from 'date-fns';

const CalendarSidebar = ({ events = [] }) => {
  const upcomingEvents = events
    .filter(e => !e.is_completed && isAfter(new Date(e.due_date), new Date()))
    .slice(0, 5)
    .map(e => ({
      date: format(new Date(e.due_date), 'MMM dd'),
      day: format(new Date(e.due_date), 'dd'),
      month: format(new Date(e.due_date), 'MMM'),
      title: e.title,
      time: format(new Date(e.due_date), 'hh:mm a'),
      color: e.category === 'error' ? 'bg-error-container/20' : 
             e.category === 'secondary' ? 'bg-secondary-container/30' : 
             'bg-primary-container/20',
      text: e.category === 'error' ? 'text-error' : 
            e.category === 'secondary' ? 'text-secondary' : 
            'text-primary',
      isPriority: e.category === 'error'
    }));

  const todayFocus = events.find(e => isToday(new Date(e.due_date)));

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Today's Focus Card */}
      <section className="bg-surface-container-lowest rounded-xl p-6 shadow-ref border border-outline-variant/10 relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-headline font-extrabold text-xl text-on-surface uppercase italic tracking-tighter">Today's Focus</h4>
          <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>center_focus_strong</span>
        </div>

        {todayFocus ? (
          <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg border-l-4 border-tertiary shadow-sm group/item">
            <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>event</span>
            </div>
            <div className="flex-1">
              <p className="font-headline font-black text-sm text-on-surface uppercase italic truncate">{todayFocus.title}</p>
              <p className="font-label font-bold text-[10px] text-on-surface-variant opacity-60 uppercase tracking-widest mt-0.5">
                {format(new Date(todayFocus.due_date), 'hh:mm a')}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-widest">No Events Today</p>
          </div>
        )}
        
        <button className="w-full mt-4 py-3 bg-primary text-on-primary font-label font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-[10px] uppercase tracking-widest">
            Protocol Overview
        </button>
      </section>

      {/* Upcoming Events */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="font-headline font-extrabold text-xl text-on-surface uppercase italic tracking-tighter">Upcoming</h4>
          <span className="text-[10px] font-label font-black text-primary uppercase tracking-widest">Neural Log</span>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((ev, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 5 }}
              className={`bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 border border-outline-variant/10 shadow-sm transition-all ${ev.isPriority ? 'border-error/20 bg-error/5' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl ${ev.color} flex flex-col items-center justify-center shrink-0 border border-black/5`}>
                <span className={`text-[9px] font-label font-bold uppercase tracking-widest leading-none mb-1 opacity-60 ${ev.text}`}>{ev.month}</span>
                <span className={`text-lg font-headline font-black leading-none ${ev.text}`}>{ev.day}</span>
              </div>
              <div className="flex-1">
                <p className="font-headline font-black text-sm text-on-surface uppercase italic tracking-tighter truncate">{ev.title}</p>
                <p className="text-[10px] text-on-surface-variant font-medium opacity-60 mt-0.5">{ev.time}</p>
              </div>
              {ev.isPriority ? (
                <span className="material-symbols-outlined text-error text-xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
              ) : (
                <span className="material-symbols-outlined text-outline-variant text-lg">more_vert</span>
              )}
            </motion.div>
          ))}
          {upcomingEvents.length === 0 && (
            <div className="py-10 text-center opacity-30">
              <p className="text-[10px] font-black uppercase tracking-widest">Nothing Scheduled</p>
            </div>
          )}
        </div>
      </section>

      {/* Study Streak Card */}
      <section className="bg-gradient-to-br from-brand-black to-secondary p-8 rounded-xl relative overflow-hidden text-white mt-auto shadow-xl group">
        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-9xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
        </div>
        <div className="relative z-10 flex flex-col items-start h-full">
          <h4 className="font-headline font-black text-xl uppercase italic tracking-tighter mb-4">Neural Streak</h4>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-6xl font-headline font-black tracking-tighter leading-none italic">12</span>
            <span className="font-label font-bold text-sm pb-2 opacity-50 uppercase tracking-widest">Days</span>
          </div>
          <div className="w-full space-y-3">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                className="h-full bg-pastel-green shadow-[0_0_15px_#D6FFE4]"
              />
            </div>
            <p className="text-[9px] font-label font-black uppercase tracking-[0.2em] opacity-60">Next Reward Protocol: 15 Days</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalendarSidebar;
