import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import { supabase } from '../lib/supabase';
import { Footer } from '../components/landing/FooterAndReg';
import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, Star, Loader2 } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, total_xp, streak, badges')
      .order('total_xp', { ascending: false })
      .limit(10);
    
    if (!error && data) {
      setLeaderboard(data);
    }
    setLoading(false);
  };
  return (
    <div className="bg-[#FDFCF8] min-h-screen text-black selection:bg-brand-purple selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block bg-brand-purple p-5 rounded-full border border-black/5 shadow-ref-xl mb-6 shadow-brand-purple/20"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-heading font-black tracking-tight uppercase"
          >
            Global Rankings
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-brand-black/70 font-medium max-w-2xl mx-auto"
          >
            See who's putting in the most hours this week. Can you secure your spot in the top 5?
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-black/5 rounded-[2.5rem] shadow-ref-xl overflow-hidden"
        >
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 md:px-10 py-8 border-b border-black/5 bg-pastel-yellow font-heading font-black text-lg md:text-xl uppercase italic tracking-tighter text-brand-black">
            <div className="col-span-2 md:col-span-1 text-center">RANK</div>
            <div className="col-span-6 md:col-span-5">STUDENT</div>
            <div className="hidden md:block col-span-3 text-center">STREAK</div>
            <div className="col-span-4 md:col-span-3 text-right">GLOBAL XP</div>
          </div>

          {/* Leaderboard Rows */}
          <div className="divide-y border-black/5 divide-black/5">
            {loading ? (
              <div className="flex items-center justify-center py-20 bg-white">
                <Loader2 className="w-12 h-12 animate-spin text-brand-purple" />
              </div>
            ) : leaderboard.map((user, idx) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                whileHover={{ backgroundColor: '#F9FAFB', x: 4 }}
                className="grid grid-cols-12 gap-4 items-center px-6 md:px-10 py-5 transition-all group"
              >
                {/* Rank */}
                <div className="col-span-2 md:col-span-1 text-center font-black text-2xl md:text-3xl">
                  {idx === 0 ? (
                    <span className="text-[#FFD700]">#1</span>
                  ) : idx === 1 ? (
                    <span className="text-[#C0C0C0]">#2</span>
                  ) : idx === 2 ? (
                    <span className="text-[#CD7F32]">#3</span>
                  ) : (
                    <span className="text-black/40">#{idx + 1}</span>
                  )}
                </div>

                {/* Profile Info */}
                <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-12 h-12 md:w-16 md:h-16 rounded-2xl border border-black/5 shadow-sm transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl border border-black/5 flex items-center justify-center font-black text-lg shadow-sm bg-pastel-blue text-brand-black group-hover:scale-105 transition-transform">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-brand-purple transition-colors truncate">
                      {user.full_name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <Star size={10} className="text-yellow-500 fill-yellow-500" />
                       <p className="text-xs font-black uppercase text-black/50 tracking-widest">{user.badges || 0} Badges</p>
                    </div>
                  </div>
                </div>

                {/* Streak (desktop only) */}
                <div className="hidden md:flex col-span-3 items-center justify-center gap-2 font-black text-2xl italic tracking-tighter">
                   <Flame className={user.streak > 0 ? "text-orange-500 fill-orange-500" : "text-gray-200"} size={24} />
                   <span className={user.streak > 0 ? "text-brand-black" : "text-gray-300"}>{user.streak || 0}</span>
                </div>

                {/* Score */}
                <div className="col-span-4 md:col-span-3 text-right font-black text-2xl md:text-4xl tracking-tight text-brand-purple">
                  {user.total_xp}<span className="text-xs font-black text-black/50 ml-1 uppercase tracking-widest">XP</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="px-6 md:px-10 py-6 bg-gray-50 text-center font-bold text-black/50 border-t-4 border-brand-black hover:bg-gray-100 transition-colors cursor-pointer">
            View Season Analytics →
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
