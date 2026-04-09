import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Check, ChevronDown, Users, Sparkles, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const NeuralNetworkBento = ({ matches, onAction }) => {
  const { user } = useAuth();
  const [connectingId, setConnectingId] = useState(null);
  const [userCircles, setUserCircles] = useState([]);
  const [activeInviteId, setActiveInviteId] = useState(null);

  useEffect(() => {
    if (user) fetchOwnedCircles();
  }, [user]);

  const fetchOwnedCircles = async () => {
    const { data } = await supabase
      .from('circle_members')
      .select('study_circles(id, name)')
      .eq('user_id', user.id)
      .eq('role', 'lead');
    
    setUserCircles(data?.map(d => d.study_circles) || []);
  };

  const handleConnect = async (targetUserId) => {
    if (!user) return;
    setConnectingId(targetUserId);
    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          user_id_1: user.id,
          user_id_2: targetUserId,
          status: 'pending'
        });

      if (error) throw error;
      toast.success('Neural Link Initialized');
      if (onAction) onAction();
    } catch (err) {
      toast.error('Connection failure');
    } finally {
      setConnectingId(null);
    }
  };

  const handleInviteToCircle = async (targetUserId, circleId, circleName) => {
    try {
      const { error } = await supabase
        .from('circle_members')
        .insert({
          circle_id: circleId,
          user_id: targetUserId,
          role: 'member'
        });

      if (error) throw error;
      toast.success(`Scholarly invitation sent for ${circleName}`);
      setActiveInviteId(null);
    } catch (err) {
      if (err.code === '23505') {
        toast.error('Scholar is already in this circle');
      } else {
        toast.error('Recruitment failed');
      }
    }
  };

  return (
    <section className="bg-surface-container-highest/30 p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-ref relative overflow-hidden group">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined">hub</span>
          </div>
          <div>
            <h3 className="text-xl font-black font-headline tracking-tighter uppercase italic">Neural Network</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Synchronized Scholars</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-pastel-green rounded-full border border-black/5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {matches.length > 0 ? (
            matches.map((match, idx) => (
              <motion.div 
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-black/5 p-4 rounded-2xl flex flex-col gap-4 hover:shadow-ref-sm hover:border-primary/20 transition-all group/card overflow-visible"
              >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${match.id}`} 
                            alt={match.full_name} 
                            className="w-12 h-12 rounded-full border border-black/5"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-brand-black">{match.full_name}</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold text-primary italic uppercase tracking-widest">
                                Match: {match.shared_interest}
                            </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handleConnect(match.id)}
                            disabled={connectingId === match.id}
                            className="bg-brand-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50"
                        >
                            {connectingId === match.id ? 'Syncing...' : 'Link'}
                        </button>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setActiveInviteId(activeInviteId === match.id ? null : match.id)}
                                className="p-2 rounded-xl border border-black/5 text-on-surface-variant hover:bg-surface-container-high transition-all"
                                title="Invite to Circle"
                            >
                                <UserPlus size={16} />
                            </button>

                            <AnimatePresence>
                                {activeInviteId === match.id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                        className="absolute top-full right-0 mt-2 w-56 bg-white border border-black/10 rounded-2xl shadow-ref-xl z-[100] p-2 overflow-hidden"
                                    >
                                        <div className="text-[9px] font-black uppercase tracking-widest p-2 opacity-40 border-b border-black/5 mb-2">My Circles</div>
                                        {userCircles.length > 0 ? (
                                            userCircles.map(circle => (
                                                <button
                                                    key={circle.id}
                                                    onClick={() => handleInviteToCircle(match.id, circle.id, circle.name)}
                                                    className="w-full text-left p-3 rounded-xl hover:bg-pastel-blue/20 transition-all flex items-center justify-between group/opt"
                                                >
                                                    <span className="text-xs font-black tracking-tighter italic truncate">{circle.name}</span>
                                                    <ChevronDown size={14} className="opacity-0 group-hover/opt:opacity-100 -rotate-90 transition-all" />
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-[9px] font-bold p-2 text-center opacity-40 italic">No led circles found</p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/5">
                    <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1">
                            {[1, 2, 3].map(i => (
                                <div 
                                    key={i} 
                                    className={`w-1 h-3 rounded-full ${i <= match.strength ? 'bg-primary' : 'bg-outline-variant/20'}`} 
                                />
                            ))}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Sync Strength</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-black uppercase text-brand-purple">
                        <Sparkles size={10} />
                        <span>Highly Compatible</span>
                    </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-outline-variant/10 rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
                    <span className="material-symbols-outlined text-3xl">sensors_off</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-relaxed">
                    No immediate cognitive overlaps detected.<br />Expanding signal range...
                </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={() => window.dispatchEvent(new CustomEvent('openCreateCircle'))}
        className="w-full mt-6 py-4 bg-white/50 border border-dashed border-outline-variant/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-3 hover:bg-brand-purple hover:text-white hover:border-brand-purple transition-all group"
      >
        <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
        Manifest New Prototype
      </button>
    </section>
  );
};

export default NeuralNetworkBento;
