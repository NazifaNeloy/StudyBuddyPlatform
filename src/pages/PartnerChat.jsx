import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Calendar as CalendarIcon, User, Loader2, Sparkles, Command, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStats } from '../hooks/useStats';
import SchedulerModal from '../components/calendar/SchedulerModal';

const PartnerChat = () => {
  const { user } = useAuth();
  const { updateFocusStats } = useStats();
  const [connections, setConnections] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (user) fetchConnections();
  }, [user]);

  const fetchConnections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('connections')
      .select(`
        id,
        user_id_1,
        user_id_2,
        status,
        partner:profiles!connections_user_id_2_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
      .eq('status', 'accepted');

    if (!error && data) {
      const processed = data.map(c => ({
        id: c.id,
        partner: c.user_id_1 === user.id ? c.partner : c.partner // This needs careful join handling
      }));
      
      // Re-fetch partner profiles correctly if the join above is ambiguous
      const partners = await Promise.all(data.map(async (c) => {
        const partnerId = c.user_id_1 === user.id ? c.user_id_2 : c.user_id_1;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', partnerId).single();
        return { connectionId: c.id, ...profile };
      }));

      setConnections(partners);
      if (partners.length > 0) setActivePartner(partners[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activePartner) {
      fetchMessages();
      const subscription = subscribeToMessages();
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [activePartner]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activePartner.id}),and(sender_id.eq.${activePartner.id},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (!error) setMessages(data);
  };

  const subscribeToMessages = () => {
    return supabase
      .channel('direct_messages_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `sender_id=eq.${activePartner.id},receiver_id=eq.${user.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartner) return;

    const messageObj = {
      sender_id: user.id,
      receiver_id: activePartner.id,
      message: newMessage,
    };

    const { data, error } = await supabase
      .from('direct_messages')
      .insert([messageObj])
      .select()
      .single();

    if (!error) {
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } else {
      toast.error('Message transmission failed.');
    }
  };

  const handleScheduleSuccess = (sessionData) => {
    // Session already inserted by modal, send system message
    const systemMsg = `A study session for "${sessionData.topic}" has been scheduled for ${new Date(sessionData.scheduled_for).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase()} (Neural Sync Initiated).`;
    
    supabase.from('direct_messages').insert({
      sender_id: user.id,
      receiver_id: activePartner.id,
      message: systemMsg
    }).then(async () => {
      await updateFocusStats(20); // Award small Synergy XP for scheduling
      fetchMessages(); // Refresh chat
      toast.success('Session Synchronized! +20 XP Synergy Gain');
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex gap-6 mt-4">
        {/* Connection Sidebar */}
        <aside className="w-80 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-black/5 shadow-ref-xl flex flex-col overflow-hidden">
          <div className="p-8 border-b border-black/5 bg-primary/5">
            <h2 className="text-2xl font-heading font-black italic tracking-tighter uppercase leading-none">Cognitive <span className="text-primary">Nodes</span></h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 mt-2">Accepted Matches</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {connections.map(p => (
               <motion.div
                 key={p.id}
                 whileHover={{ x: 5 }}
                 onClick={() => setActivePartner(p)}
                 className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${activePartner?.id === p.id ? 'bg-white border-primary shadow-lg scale-[1.02]' : 'bg-transparent border-transparent opacity-60 hover:opacity-100'}`}
               >
                 <div className="relative">
                   <img src={p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`} className="w-12 h-12 rounded-xl object-cover border-2 border-primary/10 shadow-sm" alt="Partner" />
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pastel-green border-2 border-white rounded-full shadow-sm" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="font-heading font-black text-sm text-brand-black truncate">{p.full_name}</p>
                   <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-0.5 italic">Synchronized</p>
                 </div>
               </motion.div>
             ))}
             
             {connections.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-30">
                 <Command className="w-12 h-12 mb-4 opacity-10" />
                 <p className="text-xs font-black uppercase tracking-widest">No Matches Found<br/><span className="text-[10px]">Expand your search matrix</span></p>
               </div>
             )}
          </div>
        </aside>

        {/* Chat Main Area */}
        <main className="flex-1 bg-white rounded-[2.5rem] border border-black/5 shadow-ref-xl flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activePartner ? (
              <motion.div 
                key={activePartner.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col h-full"
              >
                {/* Header */}
                <header className="p-6 border-b border-black/5 flex justify-between items-center bg-[#f5eeff]/20">
                  <div className="flex items-center gap-4">
                    <img src={activePartner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activePartner.id}`} className="w-10 h-10 rounded-full border border-black/5" alt="Partner" />
                    <div>
                      <h3 className="font-heading font-black text-lg text-brand-black italic tracking-tighter uppercase leading-none">{activePartner.full_name}</h3>
                      <p className="text-[9px] font-bold text-pastel-green uppercase tracking-widest mt-1">Direct Link Established</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsSchedulerOpen(true)}
                    className="bg-brand-black text-white px-6 py-3 rounded-full font-heading font-black text-xs italic tracking-tighter uppercase flex items-center gap-2 hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95"
                  >
                    <CalendarIcon size={16} className="text-primary-container" />
                    Schedule Session
                  </button>
                </header>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {messages.map((m, i) => (
                    <div key={m.id || i} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] group`}>
                         <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 opacity-40 ${m.sender_id === user.id ? 'text-right' : 'text-left'}`}>
                           {m.sender_id === user.id ? 'Local Node' : `${activePartner?.full_name?.split(' ')[0] || 'Partner'} Node`}
                         </p>
                         <div className={`p-4 rounded-3xl font-body text-sm font-medium shadow-sm border ${
                           m.sender_id === user.id 
                            ? 'bg-primary text-white border-primary rounded-tr-none' 
                            : 'bg-white border-black/5 text-brand-black rounded-tl-none'
                         } ${m.message.includes('scheduled for') ? 'bg-brand-black text-primary border-primary border-2 animate-pulse italic' : ''}`}>
                           {m.message}
                         </div>
                         <p className={`text-[8px] font-black opacity-20 mt-1 uppercase tracking-tighter ${m.sender_id === user.id ? 'text-right' : 'text-left'}`}>
                           {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-6 border-t border-black/5 bg-[#f5eeff]/20">
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Enter Neural Transmission..."
                      className="w-full bg-white border-2 border-black/10 rounded-2xl py-4 pl-6 pr-16 font-body text-sm font-semibold text-brand-black focus:ring-0 focus:border-primary focus:shadow-[4px_4px_0px_#6B4EFE] outline-none transition-all placeholder:text-brand-black/30 shadow-inner"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-110 active:scale-90 transition-all disabled:opacity-30 disabled:scale-100"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-30">
                <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-8 border border-dashed border-primary/20">
                  <Sparkles size={48} className="text-primary animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <h3 className="text-4xl font-heading font-black italic tracking-tighter uppercase leading-none text-brand-black">Void Channel</h3>
                <p className="text-lg font-bold max-w-sm mx-auto mt-4 leading-relaxed">Select a synchronized node from the sidebar to establish a high-fidelity direct link.</p>
                <div className="mt-8 flex items-center gap-2 px-6 py-2 bg-black/5 rounded-full text-[10px] font-black uppercase tracking-widest italic animate-pulse">
                  <Info size={12} /> Encrypted Transmission Protocol Active
                </div>
              </div>
            )}
          </AnimatePresence>
          
          <SchedulerModal 
            isOpen={isSchedulerOpen} 
            onClose={() => setIsSchedulerOpen(false)}
            partner={activePartner}
            onSuccess={handleScheduleSuccess}
          />
        </main>
      </div>
    </Layout>
  );
};

export default PartnerChat;
