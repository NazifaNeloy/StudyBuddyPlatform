import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Loader2, Search, CheckCircle2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const InviteToCircleModal = ({ isOpen, onClose, partner }) => {
  const { user } = useAuth();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchMyCircles();
    }
  }, [isOpen, user]);

  const fetchMyCircles = async () => {
    setLoading(true);
    // Fetch circles where current user is a member
    const { data: memberships, error: memError } = await supabase
      .from('circle_members')
      .select('circle_id')
      .eq('user_id', user.id);

    if (memError) {
      toast.error('Failed to fetch your study circles.');
      setLoading(false);
      return;
    }

    if (memberships.length > 0) {
      const circleIds = memberships.map(m => m.circle_id);
      const { data: circlesData, error: circlesError } = await supabase
        .from('study_circles')
        .select('*')
        .in('id', circleIds);

      if (!circlesError) {
        // Also check if partner is already in these circles OR has a pending request
        const { data: partnerMems } = await supabase
          .from('circle_members')
          .select('circle_id')
          .eq('user_id', partner.id)
          .in('circle_id', circleIds);

        const { data: pendingReqs } = await supabase
          .from('circle_join_requests')
          .select('circle_id')
          .eq('user_id', partner.id)
          .eq('status', 'pending')
          .in('circle_id', circleIds);

        const partnerCircleIds = partnerMems?.map(m => m.circle_id) || [];
        const pendingCircleIds = pendingReqs?.map(m => m.circle_id) || [];
        
        const enrichedCircles = circlesData.map(c => ({
          ...c,
          isPartnerMember: partnerCircleIds.includes(c.id),
          isPending: pendingCircleIds.includes(c.id)
        }));

        setCircles(enrichedCircles);
      }
    }
    setLoading(false);
  };

  const handleInvite = async (circle) => {
    if (circle.isPartnerMember || circle.isPending) return;
    setInviting(circle.id);
    
    try {
      // 1. Create a join request instead of immediate membership
      const { error: reqError } = await supabase
        .from('circle_join_requests')
        .insert({
          circle_id: circle.id,
          user_id: partner.id,
          inviter_id: user.id,
          status: 'pending'
        });

      if (reqError) throw reqError;

      // 2. Notify the Circle Owner (The creator)
      if (circle.created_by) {
        await supabase.from('notifications').insert({
          user_id: circle.created_by,
          type: 'circle_join_request',
          content: `Joint Protocol Requested: ${user.user_metadata?.full_name || 'Someone'} invited ${partner.full_name?.split(' ')[0]} to join "${circle.name}".`,
          metadata: { 
            circle_id: circle.id, 
            matched_user_id: partner.id,
            inviter_id: user.id,
            circle_name: circle.name
          }
        });
      }

      toast.success(`Access Request transmitted for "${circle.name}"!`);
      
      // Update local state
      setCircles(prev => prev.map(c => c.id === circle.id ? { ...c, isPending: true } : c));
    } catch (err) {
      console.error('Invite error:', err);
      toast.error('Neural binding failed. Please retry.');
    } finally {
      setInviting(null);
    }
  };

  if (!isOpen) return null;

  const filteredCircles = circles.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-black/5 overflow-hidden flex flex-col max-h-[80vh]"
      >
        <header className="p-8 border-b border-black/5 flex justify-between items-center bg-primary/5">
          <div>
            <h3 className="text-2xl font-heading font-black italic tracking-tighter uppercase leading-none">Circle <span className="text-primary">Sync</span></h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 mt-1">Invite {partner.full_name?.split(' ')[0]}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X size={20} className="text-brand-black/40" />
          </button>
        </header>

        <div className="p-6">
           <div className="relative mb-6">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" size={18} />
             <input 
               type="text"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search protocol hubs..."
               className="w-full bg-[#fcfcfc] border-2 border-black/5 rounded-2xl py-4 pl-12 pr-6 font-body text-sm font-semibold outline-none focus:border-primary transition-all shadow-inner"
             />
           </div>

           <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]">
             {loading ? (
               <div className="flex flex-col items-center justify-center py-20 opacity-20">
                 <Loader2 className="w-10 h-10 animate-spin mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">Accessing Matrix...</p>
               </div>
             ) : filteredCircles.length === 0 ? (
               <div className="text-center py-20 opacity-30">
                 <Users className="w-10 h-10 mx-auto mb-4 opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-widest">No Study Circles Found</p>
               </div>
             ) : (
               filteredCircles.map(circle => (
                 <div 
                   key={circle.id}
                   className="p-4 rounded-2xl border border-black/5 bg-[#fcfcfc] flex items-center justify-between group hover:border-primary/20 transition-all"
                 >
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                       <Zap size={18} className="text-primary" />
                     </div>
                     <div>
                       <h4 className="font-heading font-black text-sm uppercase tracking-tight">{circle.name}</h4>
                       <p className="text-[9px] font-bold text-brand-black/30 uppercase tracking-widest mt-0.5">Neural Hub Active</p>
                     </div>
                   </div>

                   <button
                     disabled={circle.isPartnerMember || circle.isPending || inviting === circle.id}
                     onClick={() => handleInvite(circle)}
                     className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                       circle.isPartnerMember 
                        ? 'bg-pastel-green/20 text-pastel-green border border-pastel-green/20' 
                        : circle.isPending
                        ? 'bg-pastel-yellow/20 text-pastel-yellow border border-pastel-yellow/20'
                        : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50'
                     }`}
                   >
                     {inviting === circle.id ? (
                       <Loader2 size={14} className="animate-spin" />
                     ) : circle.isPartnerMember ? (
                       <div className="flex items-center gap-1.5">
                         <CheckCircle2 size={12} /> Sync'd
                       </div>
                     ) : circle.isPending ? (
                       'Pending'
                     ) : (
                       'Invite'
                     )}
                   </button>
                 </div>
               ))
             )}
           </div>
        </div>

        <div className="p-8 bg-[#fcfcfc] border-t border-black/5 text-center">
           <p className="text-[9px] font-bold text-brand-black/30 leading-relaxed uppercase tracking-[0.05em]">
             Adding a partner to a circle allows them to participate in live chat, access shared resources, and synchronize study timers instantly.
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default InviteToCircleModal;
