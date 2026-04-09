import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

// Modular Architecture Imports
import WelcomeHero from '../components/dashboard/WelcomeHero';
import CircleGrid from '../components/dashboard/CircleGrid';
import AchievementVault from '../components/dashboard/AchievementVault';
import StudySchedule from '../components/dashboard/StudySchedule';
import SmartScannerBento from '../components/dashboard/SmartScannerBento';
import CreateCircleModal from '../components/dashboard/CreateCircleModal';
import NeuralNetworkBento from '../components/dashboard/NeuralNetworkBento';
import ActiveFocusHUD from '../components/dashboard/ActiveFocusHUD';

const Dashboard = () => {
  const { user, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [userCircles, setUserCircles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sessionHistory, setSessionHistory] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [resourceCount, setResourceCount] = useState(0);
  const [matchedUsers, setMatchedUsers] = useState([]);

  const filteredCircles = (userCircles || []).filter(c => 
    c && c.name?.toLowerCase().includes((search || '').toLowerCase())
  );

  async function fetchDashboardData() {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1. Profile Retrieval
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfileData(profile);

      // 2. Circle Synchronization
      const { data: circles } = await supabase
        .from('circle_members')
        .select(`
          study_circles (
            id,
            name,
            image_url,
            description,
            created_at
          )
        `)
        .eq('user_id', user.id);
      
      const transformedCircles = (circles || []).map(c => c.study_circles).filter(Boolean);
      setUserCircles(transformedCircles);

      // 3. Task Synchronization (Temporal Intelligence)
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .order('due_date', { ascending: true })
        .limit(3);
      
      setTasks(tasks || []);

      // 4. Session History (Neural Density)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('created_by', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());
      
      const history = [0, 0, 0, 0, 0, 0, 0];
      if (Array.isArray(sessions)) {
        sessions.forEach(session => {
          if (!session || !session.created_at || !session.start_time || !session.end_time) return;
          try {
            const day = new Date(session.created_at).getDay();
            const start = new Date(session.start_time);
            const end = new Date(session.end_time);
            
            if (!isNaN(start) && !isNaN(end)) {
              const diffInMinutes = Math.floor((end - start) / 60000);
              if (!isNaN(diffInMinutes) && diffInMinutes >= 0) {
                history[day] = (history[day] || 0) + diffInMinutes;
              }
            }
          } catch (e) {
            console.warn('Malformed session data encountered:', e);
          }
        });
      }
      setSessionHistory(history);

      // 5. Resource Count (AI Scans)
      // 6. Neural Matching (Interest Overlap)
      if (profile?.interests && profile.interests.length > 0) {
        const { data: matches } = await supabase
          .from('profiles')
          .select('id, full_name, interests')
          .neq('id', user.id)
          .overlaps('interests', profile.interests)
          .limit(4);

        if (matches) {
          const processedMatches = matches.map(m => {
            const overlap = m.interests.find(i => profile.interests.includes(i));
            const strength = m.interests.filter(i => profile.interests.includes(i)).length;
            return {
              ...m,
              shared_interest: overlap,
              strength: strength
            };
          });
          setMatchedUsers(processedMatches);
        }
      }

    } catch (err) {
      console.error('Neural Sync Error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user && isAuthReady) {
       fetchDashboardData();
    }

    const handleOpenModal = () => setIsCreateModalOpen(true);
    window.addEventListener('openCreateCircle', handleOpenModal);
    return () => window.removeEventListener('openCreateCircle', handleOpenModal);
  }, [user?.id, isAuthReady]);

  if (!isAuthReady || loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-brand-white z-[9999]">
        <div className="w-16 h-16 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse italic">Synchronizing Neural Data...</p>
      </div>
    );
  }


  return (
    <Layout>
      {/* TopAppBar (Synergy) */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black font-headline tracking-tighter uppercase italic text-primary">Dashboard</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">Neural Protocol Monitor</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-64 bg-surface-container-high rounded-full px-6 py-3 flex items-center gap-3 border border-black/5 shadow-sm">
            <span className="material-symbols-outlined text-outline text-xl">search</span>
            <input 
              type="text" 
              placeholder="Search Protocols..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-black uppercase tracking-widest w-full outline-none placeholder:opacity-30" 
            />
          </div>
          
          <div className="flex items-center gap-3">
             <button 
              onClick={() => navigate('/notifications')}
              className="p-3 rounded-2xl bg-white border border-black/5 shadow-ref-sm text-primary hover:scale-110 active:scale-95 transition-all"
             >
                <span className="material-symbols-outlined">notifications</span>
             </button>
             <div 
              onClick={() => navigate('/settings')}
              className="w-12 h-12 rounded-full border-2 border-primary-container p-0.5 overflow-hidden shadow-ref-sm cursor-pointer hover:scale-105 transition-all"
             >
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
                  alt="User" 
                  className="w-full h-full object-cover rounded-full" 
                />
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area: Asymmetric Grid */}
      <div className="asymmetric-grid pb-20">
        
        {/* Left Column: Core Focus */}
        <div className="space-y-10">
          <ActiveFocusHUD />
          
          <WelcomeHero 
            userName={profileData?.full_name || user?.email?.split('@')[0] || 'Neural Student'} 
            streak={profileData?.streak || 0}
            focusHours={profileData?.focus_hours || 0}
          />

          <CircleGrid circles={filteredCircles} />

          <NeuralNetworkBento 
            matches={matchedUsers} 
            onAction={fetchDashboardData}
          />

          <AchievementVault 
            totalXp={profileData?.total_xp || 0} 
            userBadges={profileData?.badges || []} 
          />
        </div>

        {/* Right Column: Temporal & AI Intelligence */}
        <div className="space-y-10">
          <section className="bg-white/50 p-6 rounded-2xl border border-black/5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Academic Focus</h3>
            <div className="flex flex-wrap gap-2">
              {profileData?.interests?.map(interest => (
                <span key={interest} className="px-3 py-1.5 bg-pastel-pink rounded-xl text-[10px] font-bold text-brand-black border border-black/5 shadow-sm">
                  {interest}
                </span>
              )) || <p className="text-[10px] opacity-40 italic">No interests detected.</p>}
            </div>
          </section>

          <StudySchedule tasks={tasks} />

          <SmartScannerBento count={resourceCount} />

          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-ref border border-outline-variant/10">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-pastel-blue flex items-center justify-center text-primary shadow-sm">
                   <span className="material-symbols-outlined">analytics</span>
                </div>
                <h3 className="text-xl font-black font-headline tracking-tighter uppercase italic">Neural Density</h3>
             </div>
             <div className="h-32 flex items-end gap-2 px-2">
                {sessionHistory.map((minutes, i) => {
                  const maxMinutes = Math.max(...sessionHistory, 60);
                  const h = (minutes / maxMinutes) * 100;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(h, 5)}%` }}
                      className={`flex-1 rounded-t-lg transition-all ${minutes > 0 ? 'bg-primary' : 'bg-surface-container-highest opacity-40'}`}
                      title={`${minutes} minutes focused`}
                    />
                  );
                })}
             </div>
             <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-center opacity-40">Weekly Activity Log</p>
          </section>
        </div>

      </div>

      <CreateCircleModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </Layout>
  );
};

export default Dashboard;
