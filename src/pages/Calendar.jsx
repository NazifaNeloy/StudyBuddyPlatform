import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { format, addMonths, subMonths } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Modular Architecture Imports
import CalendarGrid from '../components/calendar/CalendarGrid';
import CalendarSidebar from '../components/calendar/CalendarSidebar';
import AddEventModal from '../components/calendar/AddEventModal';

const CalendarPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePrevMonth = () => setViewDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setViewDate(prev => addMonths(prev, 1));

  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Neural Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* TopAppBar (Synergy) */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-black font-headline tracking-tighter uppercase italic text-primary">Calendar</h2>
          <div className="hidden lg:flex items-center gap-4">
             {['Dashboard', 'Circles', 'Library'].map((link) => (
               <a 
                 key={link} 
                 href={`/${link.toLowerCase()}`} 
                 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 hover:opacity-100 transition-all"
               >
                 {link}
               </a>
             ))}
             <span className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1 italic">Calendar</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-64 bg-surface-container-high rounded-full px-6 py-3 flex items-center gap-3 border border-black/5 shadow-sm">
            <span className="material-symbols-outlined text-outline text-xl">search</span>
            <input 
              type="text" 
              placeholder="Search Schedule..." 
              className="bg-transparent border-none focus:ring-0 text-xs font-black uppercase tracking-widest w-full outline-none placeholder:opacity-30" 
            />
          </div>
          
          <div className="flex items-center gap-3">
             <button className="p-3 rounded-2xl bg-white border border-black/5 shadow-ref-sm text-primary hover:scale-110 active:scale-95 transition-all">
                <span className="material-symbols-outlined">notifications</span>
             </button>
             <div className="w-12 h-12 rounded-full border-2 border-primary-container p-0.5 overflow-hidden shadow-ref-sm">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover rounded-full" 
                />
             </div>
          </div>
        </div>
      </header>

      {/* Main Calendar Space */}
      <div className="grid grid-cols-12 gap-10 pb-20 items-start">
        
        {/* Left: Main Schedule Canvas */}
        <div className="col-span-12 xl:col-span-9 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-label font-bold text-primary uppercase tracking-[0.2em] text-[10px]">Academic Schedule</span>
              <h3 className="text-4xl md:text-5xl font-headline font-black text-on-surface mt-1 tracking-tighter uppercase italic">
                {format(viewDate, 'MMMM yyyy')}
              </h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant/10">
                {['Day', 'Week', 'Month'].map(view => (
                  <button 
                    key={view} 
                    className={`px-5 py-2 text-[10px] font-label font-black uppercase tracking-widest transition-all rounded-full ${view === 'Month' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant opacity-40 hover:opacity-100'}`}
                  >
                    {view}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="w-10 h-10 flex items-center justify-center bg-surface-container-low rounded-xl hover:bg-surface-container-high border border-outline-variant/10 shadow-sm transition-all text-primary"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="w-10 h-10 flex items-center justify-center bg-surface-container-low rounded-xl hover:bg-surface-container-high border border-outline-variant/10 shadow-sm transition-all text-primary"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-label font-bold rounded-full shadow-lg shadow-primary/20 hover:translate-y-[-2px] active:scale-95 transition-all text-[10px] uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Add Event
              </button>
            </div>
          </div>

          <CalendarGrid events={events} viewDate={viewDate} />
        </div>

        {/* Right: Temporal Intelligence Sidebar */}
        <div className="col-span-12 xl:col-span-3">
          <CalendarSidebar events={events} />
        </div>

      </div>

      <AddEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
      />
    </Layout>
  );
};

export default CalendarPage;
