import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Users, Library, Timer, ChevronRight, Shapes, Loader2, Sparkles, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const CircleSelection = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Type can be 'library' or 'focus'
  const type = location.pathname.includes('library') ? 'library' : 'focus';

  useEffect(() => {
    if (user) fetchUserCircles();
  }, [user]);

  const fetchUserCircles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('circle_members')
      .select(`
        study_circles (
          id,
          name,
          image_url,
          description
        )
      `)
      .eq('user_id', user.id);
    
    if (!error && data) {
      setCircles(data.map(m => m.study_circles).filter(Boolean));
    }
    setLoading(false);
  };

  const config = {
    library: {
      title: 'Knowledge Vaults',
      subtitle: 'Which circle\'s archive are you entering?',
      icon: Library,
      color: 'bg-pastel-blue',
      badge: 'Archive Access'
    },
    focus: {
      title: 'Study Rooms',
      subtitle: 'Where are we focusing today?',
      icon: Timer,
      color: 'bg-brand-purple text-white shadow-purple-500/20',
      badge: 'Deep Focus'
    }
  }[type];

  return (
    <Layout>
      <div className="space-y-10 pb-20 max-w-5xl mx-auto">
         <div className="text-center space-y-6">
            <div className={`mx-auto w-24 h-24 rounded-full border border-black/5 flex items-center justify-center shadow-ref-xl mb-6 ${config.color.split(' shadow-')[0]}`}>
               <config.icon size={36} />
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter italic leading-none">
               Manifest <span className="text-brand-purple">{config.title}</span>
            </h1>
            <p className="text-gray-400 font-bold text-xl">{config.subtitle}</p>
         </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-brand-purple" />
          </div>
        ) : (
          <div className="space-y-12 mt-12">
            {/* Solo Protocol Option (Only for Focus) */}
            {type === 'focus' && (
             <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/focus/solo')}
                className="bg-brand-black text-white rounded-[2.5rem] shadow-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-45 transition-transform duration-1000">
                  <Zap size={200} />
                </div>
                
                <div className="flex items-center gap-8 relative z-10">
                  <div className="w-24 h-24 bg-brand-purple rounded-3xl flex items-center justify-center shadow-xl">
                    <Timer size={48} className="text-white animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-heading font-black italic tracking-tighter uppercase leading-tight">Enter <span className="text-brand-purple">Solo Protocol</span></h2>
                    <p className="text-gray-400 font-bold text-lg max-w-sm mt-1">A private, distraction-free Pomodoro room for deep work missions.</p>
                  </div>
                </div>

                <div className="bg-white text-black px-10 py-5 rounded-full font-heading font-black text-xl shadow-lg hover:shadow-brand-purple/40 transition-all uppercase italic tracking-tighter">
                  Initiate Solo Session →
                </div>
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
            {circles.map((circle, i) => (
              <motion.div
                key={circle.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10 }}
                className={`${['bg-pastel-pink', 'bg-pastel-blue', 'bg-pastel-orange', 'bg-pastel-green'][i % 4]} border border-black/5 rounded-[2.5rem] shadow-ref-xl p-8 group flex items-center gap-8 cursor-pointer relative overflow-hidden`}
                onClick={() => navigate(`/${type}/${circle.id}`)}
              >
                {/* Visual Flair */}
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />

                <div className="w-24 h-24 rounded-3xl border border-white/40 overflow-hidden shadow-md shrink-0 bg-white/20 backdrop-blur-sm p-1">
                  <img 
                    src={circle.image_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=200'} 
                    alt={circle.name} 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/40 mb-1.5">{config.badge}</div>
                  <h3 className="text-3xl font-heading font-black italic truncate tracking-tighter text-brand-black">{circle.name}</h3>
                  <div className="flex items-center gap-2 mt-3 font-black text-xs text-brand-purple italic uppercase tracking-tighter">
                    <span>Protocol Established →</span>
                  </div>
                </div>

                <div className="w-16 h-16 bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl flex items-center justify-center group-hover:bg-brand-black group-hover:text-white group-hover:border-brand-black transition-all shadow-sm">
                  <ChevronRight size={32} strokeWidth={3} />
                </div>
              </motion.div>
            ))}

            {circles.length === 0 && (
              <div className="col-span-2 py-32 text-center bg-gray-50/50 rounded-[3rem] border border-dashed border-black/10 flex flex-col items-center gap-8 shadow-inner">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-ref-xl">
                  <Users size={48} className="text-gray-200" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-heading font-black italic tracking-tighter uppercase leading-none">No Artifacts Detected</h3>
                  <p className="text-gray-400 font-bold text-lg max-w-sm mx-auto">You need to join or create a circle before accessing this cognitive sector.</p>
                </div>
                <Link to="/circles">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-brand-purple text-white px-12 py-5 rounded-full font-heading font-black text-xl italic tracking-tighter shadow-xl shadow-brand-purple/20 flex items-center gap-4 active:scale-95 transition-all"
                  >
                    <Sparkles size={24} />
                    EXPLORE GLOBAL CIRCLES
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </Layout>
  );
};

export default CircleSelection;
