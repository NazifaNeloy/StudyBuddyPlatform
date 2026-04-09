import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, MapPin, Loader2, CheckCircle2, Shapes, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import CreateCircleModal from '../components/dashboard/CreateCircleModal';

const Circles = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);
  const [userCircleIds, setUserCircleIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [joiningId, setJoiningId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCircles = async () => {
    setLoading(true);
    try {
      // 1. Fetch all circles
      const { data: allCircles, error: circleErr } = await supabase
        .from('study_circles')
        .select(`
          *,
          member_count:circle_members(count)
        `)
        .order('created_at', { ascending: false });

      if (circleErr) throw circleErr;
      
      setCircles(allCircles || []);

      // 2. Fetch user's current circles to show 'Joined' status
      if (user) {
        const { data: userMemberships, error: memberErr } = await supabase
          .from('circle_members')
          .select('circle_id')
          .eq('user_id', user.id);
        
        if (!memberErr) {
          setUserCircleIds(new Set(userMemberships.map(m => m.circle_id)));
        }
      }
    } catch (error) {
      console.error('Error fetching circles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCircles();
  }, [user]);

  const joinCircle = async (circleId) => {
    setJoiningId(circleId);
    try {
      const { error } = await supabase
        .from('circle_members')
        .insert([{ 
          circle_id: circleId, 
          user_id: user.id,
          role: 'member'
        }]);

      if (error) throw error;
      
      setUserCircleIds(prev => new Set([...prev, circleId]));
      toast.success("Joined Protocol successfully!");
    } catch (error) {
      toast.error('Join Error: ' + error.message);
    } finally {
      setJoiningId(null);
    }
  };

  const leaveCircle = async (circleId) => {
    setJoiningId(circleId);
    try {
      const { error } = await supabase
        .from('circle_members')
        .delete()
        .eq('circle_id', circleId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setUserCircleIds(prev => {
        const next = new Set(prev);
        next.delete(circleId);
        return next;
      });
      toast.success("Terminated Protocol link.");
    } catch (error) {
      toast.error('Leave Error: ' + error.message);
    } finally {
      setJoiningId(null);
    }
  };

  const filteredCircles = circles.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-purple font-black uppercase tracking-[0.2em] text-xs">
              <Globe size={14} />
              Global Discovery
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter italic">
              Explore <span className="text-brand-purple">Circles</span>
            </h1>
            <p className="text-gray-500 font-bold max-w-lg">Find your tribe. Join specialized study groups and scale your knowledge together.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-5 bg-brand-black text-white rounded-full font-heading font-black text-xl italic tracking-tighter shadow-xl hover:shadow-brand-purple/40 transition-all flex items-center justify-center gap-3"
            >
              <Plus strokeWidth={3} />
              Manifest Circle
            </button>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-purple transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by topic, university, or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-black/5 rounded-full py-5 pl-14 pr-8 font-black text-lg italic tracking-tighter shadow-ref-xl focus:shadow-brand-purple/5 outline-none transition-all placeholder:text-gray-200"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-brand-purple" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCircles.map((circle, i) => (
              <motion.div
                key={circle.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10, shadow: "0 20px 50px rgba(0,0,0,0.06)" }}
                className={`${['bg-pastel-pink', 'bg-pastel-blue', 'bg-pastel-orange', 'bg-pastel-green'][i % 4]} rounded-[2.5rem] shadow-ref-xl p-10 group relative transition-all border border-black/5 flex flex-col h-[480px]`}
              >
                <div className="relative z-10 space-y-6 flex flex-col h-full">
                  <div className="w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 overflow-hidden shadow-sm p-2 shrink-0">
                    <img 
                      src={circle.image_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=200'} 
                      alt={circle.name} 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div>
                     <h3 className="text-3xl font-heading font-black italic tracking-tighter leading-tight">{circle.name}</h3>
                     <div className="flex items-center gap-2 mt-2">
                        <Users size={14} className="text-brand-purple" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/40 italic">
                          {circle.member_count?.[0]?.count || 0} Collaborative Peers
                        </span>
                     </div>
                  </div>

                  <p className="text-sm font-bold text-brand-black/50 leading-relaxed italic line-clamp-3 mb-6">
                    {circle.description || "Active Neural Protocol initialized for this study circle."}
                  </p>

                    {userCircleIds.has(circle.id) ? (
                      <div className="flex flex-col gap-3">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/focus/${circle.id}`)}
                          className="w-full py-4 bg-brand-black text-white rounded-2xl font-heading font-black text-xl italic tracking-tighter shadow-lg transition-all border border-black/5 flex items-center justify-center gap-3"
                        >
                          <span className="material-symbols-outlined">rocket_launch</span>
                          Enter Workspace
                        </motion.button>
                        <button 
                          onClick={() => leaveCircle(circle.id)}
                          disabled={joiningId === circle.id}
                          className="text-[10px] text-center font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-red-500 transition-all font-body flex items-center justify-center gap-2"
                        >
                          {joiningId === circle.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[12px]">logout</span>
                              Terminate Protocol Link
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => joinCircle(circle.id)}
                        disabled={joiningId === circle.id}
                        className="w-full py-4 bg-brand-black text-white rounded-2xl font-heading font-black text-xl italic tracking-tighter shadow-lg transition-all border border-black/5 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {joiningId === circle.id ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          'Join Protocol'
                        )}
                      </motion.button>
                    )}
                  </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredCircles.length === 0 && (
          <div className="text-center py-20 space-y-4 opacity-30">
            <Shapes size={60} className="mx-auto" />
            <p className="text-2xl font-heading font-black tracking-tighter uppercase italic">No Circles Detected</p>
          </div>
        )}
      </div>

      <CreateCircleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCircles}
      />
    </Layout>
  );
};

export default Circles;
