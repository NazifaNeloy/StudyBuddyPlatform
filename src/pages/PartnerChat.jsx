import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Calendar as CalendarIcon, User, Users, Shapes, Loader2, Sparkles, Command, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStats } from '../hooks/useStats';
import SchedulerModal from '../components/calendar/SchedulerModal';
import InviteToCircleModal from '../components/dashboard/InviteToCircleModal';

const PartnerChat = () => {
  const { user } = useAuth();
  const { updateFocusStats } = useStats();
  const [connections, setConnections] = useState([]);
  const [circles, setCircles] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { type: 'partner' | 'circle', data: {} }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      // 1. Fetch Partners (Connections)
      const { data: rawConnections } = await supabase
        .from('connections')
        .select('*')
        .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
        .eq('status', 'accepted');

      if (rawConnections && rawConnections.length > 0) {
        const processedPartners = await Promise.all(rawConnections.map(async (conn) => {
          const partnerId = conn.user_id_1 === user.id ? conn.user_id_2 : conn.user_id_1;
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', partnerId).single();
          return { ...profile, connectionId: conn.id };
        }));
        const validPartners = processedPartners.filter(Boolean);
        setConnections(validPartners);
      }

      // 2. Fetch Circles (Groups)
      const { data: memberships } = await supabase
        .from('circle_members')
        .select('circle_id')
        .eq('user_id', user.id);

      if (memberships && memberships.length > 0) {
        const circleIds = memberships.map(m => m.circle_id);
        const { data: circlesData } = await supabase
          .from('study_circles')
          .select(`
            *,
            member_count:circle_members(count)
          `)
          .in('id', circleIds);
        setCircles(circlesData || []);
      }

      // 3. Auto-select first interaction if none active
      if (!activeChat) {
        if (rawConnections && rawConnections.length > 0) {
          // Re-fetching first partner for correct data structure
          const partnerId = rawConnections[0].user_id_1 === user.id ? rawConnections[0].user_id_2 : rawConnections[0].user_id_1;
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', partnerId).single();
          setActiveChat({ type: 'partner', data: { ...profile, connectionId: rawConnections[0].id } });
        } else if (memberships && memberships.length > 0) {
          // If no partners, try selecting first circle
          const { data: firstCircle } = await supabase.from('study_circles').select('*, member_count:circle_members(count)').eq('id', memberships[0].circle_id).single();
          if (firstCircle) setActiveChat({ type: 'circle', data: firstCircle });
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
      const subscription = subscribeToMessages();
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [activeChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    if (activeChat.type === 'partner') {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat.data.id}),and(sender_id.eq.${activeChat.data.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      if (!error) setMessages(data);
    } else {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`circle_id.eq.${activeChat.data.id || activeChat.data.circle_id || activeChat.data.group_id},group_id.eq.${activeChat.data.id || activeChat.data.circle_id || activeChat.data.group_id}`)
        .order('created_at', { ascending: true });
      if (!error) setMessages(data);
    }
  };

  const subscribeToMessages = () => {
    const channelName = activeChat.type === 'partner' ? `chat_${activeChat.data.id}` : `circle_${activeChat.data.id}`;
    const tableName = activeChat.type === 'partner' ? 'direct_messages' : 'messages';

    return supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          const msg = payload.new;
          if (activeChat.type === 'partner') {
            if (
              (msg.sender_id === activeChat.data.id && msg.receiver_id === user.id) ||
              (msg.sender_id === user.id && msg.receiver_id === activeChat.data.id)
            ) {
              setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
            }
          } else {
            const currentCircleId = activeChat.data.id || activeChat.data.circle_id || activeChat.data.group_id;
            if (msg.circle_id === currentCircleId || msg.group_id === currentCircleId) {
              setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
            }
          }
        }
      )
      .subscribe();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    if (activeChat.type === 'partner') {
      const messageObj = {
        sender_id: user.id,
        receiver_id: activeChat.data.id,
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
    } else {
      const currentCircleId = activeChat.data.id || activeChat.data.circle_id || activeChat.data.group_id;
      const messageObj = {
        circle_id: currentCircleId,
        group_id: currentCircleId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || 'Neural Student',
        content: newMessage,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([messageObj])
        .select()
        .single();

      if (!error) {
        setMessages(prev => [...prev, data]);
        setNewMessage('');
      } else {
        toast.error(`Group broadcast failed: ${error.message}`);
        console.error('Group chat error:', error);
      }
    }
  };

  const handleScheduleSuccess = (sessionData) => {
    // Session already inserted by modal, send system message
    const systemMsg = `A study session for "${sessionData.topic}" has been scheduled for ${new Date(sessionData.scheduled_for).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase()} (Neural Sync Initiated).`;
    
    supabase.from('direct_messages').insert({
      sender_id: user.id,
      receiver_id: activeChat.data.id,
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
        <aside className="w-80 bg-surface-container/50 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 shadow-ref-xl flex flex-col overflow-hidden">
          <div className="p-8 border-b border-outline-variant/10 bg-primary/5">
            <h2 className="text-2xl font-heading font-black italic tracking-tighter uppercase leading-none">Cognitive <span className="text-primary">Nodes</span></h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 mt-2">Accepted Matches</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-8">
            {/* Partners Section */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/20 px-4 mb-4 italic">Synchronized Nodes</p>
              {connections.map(p => (
                <motion.div
                  key={p.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveChat({ type: 'partner', data: p })}
                  className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${activeChat?.type === 'partner' && activeChat.data.id === p.id ? 'bg-white border-primary shadow-lg scale-[1.02]' : 'bg-transparent border-transparent opacity-60 hover:opacity-100'}`}
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
                <p className="text-[9px] font-bold uppercase tracking-widest text-center opacity-20 py-4 italic">No Active Nodes</p>
              )}
            </div>

            {/* Circles Section */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/20 px-4 mb-4 italic">Active Protocols</p>
              {circles.map(c => (
                <motion.div
                  key={c.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveChat({ type: 'circle', data: c })}
                  className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${activeChat?.type === 'circle' && activeChat.data.id === c.id ? 'bg-white border-primary shadow-lg scale-[1.02]' : 'bg-transparent border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 overflow-hidden">
                    <img src={c.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`} className="w-full h-full object-cover" alt="Circle" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-black text-sm text-brand-black truncate">{c.name}</p>
                    <p className="text-[9px] font-bold text-pastel-pink uppercase tracking-widest mt-0.5 italic">Protocol Active</p>
                  </div>
                </motion.div>
              ))}
              {circles.length === 0 && (
                <p className="text-[9px] font-bold uppercase tracking-widest text-center opacity-20 py-4 italic">No Protocol Links</p>
              )}
            </div>
          </div>
        </aside>

        {/* Chat Main Area */}
        <main className="flex-1 bg-white rounded-[2.5rem] border border-outline-variant/10 shadow-ref-xl flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeChat ? (
              <motion.div 
                key={activeChat.data.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col h-full"
              >
                {/* Header */}
                <header className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-[#f5eeff]/20">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white border border-outline-variant/10 flex items-center justify-center overflow-hidden shadow-sm">
                      <img 
                        src={activeChat.type === 'partner' ? (activeChat.data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.data.id}`) : (activeChat.data.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.data.id}`)} 
                        className="w-full h-full object-cover" 
                        alt="Avatar" 
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-lg text-brand-black italic tracking-tighter uppercase leading-none">
                        {activeChat.type === 'partner' ? activeChat.data.full_name : activeChat.data.name}
                      </h3>
                      <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${activeChat.type === 'partner' ? 'text-pastel-green' : 'text-pastel-pink'}`}>
                        {activeChat.type === 'partner' ? 'Direct Link Established' : `${activeChat.data.member_count?.[0]?.count || 0} Collaborative Peers Active`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {activeChat.type === 'partner' && (
                      <button 
                        onClick={() => setIsInviteModalOpen(true)}
                        className="bg-white border border-outline-variant/10 text-brand-black px-6 py-3 rounded-full font-heading font-black text-xs italic tracking-tighter uppercase flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                      >
                        <Sparkles size={16} className="text-primary" />
                        Invite to Circle
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setIsSchedulerOpen(true)}
                      className="bg-brand-black text-white px-6 py-3 rounded-full font-heading font-black text-xs italic tracking-tighter uppercase flex items-center gap-2 hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                      <CalendarIcon size={16} className={activeChat.type === 'partner' ? 'text-primary-container' : 'text-pastel-pink'} />
                      {activeChat.type === 'partner' ? 'Schedule Session' : 'Sync Focus Session'}
                    </button>
                  </div>
                </header>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {messages.map((m, i) => {
                    const isOwnMessage = activeChat.type === 'partner' ? m.sender_id === user.id : m.user_id === user.id;
                    const senderName = activeChat.type === 'partner' 
                      ? (isOwnMessage ? 'Local Node' : `${activeChat.data.full_name?.split(' ')[0] || 'Partner'} Node`)
                      : (isOwnMessage ? 'Self' : `${m.user_name || 'Neural Student'}`);
                    const content = activeChat.type === 'partner' ? m.message : m.content;
                    
                    return (
                      <div key={m.id || i} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] group`}>
                           <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 opacity-40 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                             {senderName}
                           </p>
                           <div className={`p-4 rounded-3xl font-body text-sm font-medium shadow-sm border ${
                             isOwnMessage 
                              ? 'bg-primary text-white border-primary rounded-tr-none' 
                              : 'bg-white border-outline-variant/10 text-brand-black rounded-tl-none'
                           } ${content.includes('scheduled for') ? 'bg-brand-black text-primary border-primary border-2 animate-pulse italic' : ''}`}>
                             {content}
                           </div>
                           <p className={`text-[8px] font-black opacity-20 mt-1 uppercase tracking-tighter ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                             {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-6 border-t border-outline-variant/10 bg-[#f5eeff]/20">
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Enter Neural Transmission..."
                      className="w-full bg-white border-2 border-outline-variant/10 rounded-2xl py-4 pl-6 pr-16 font-body text-sm font-semibold text-brand-black focus:ring-0 focus:border-primary focus:shadow-[4px_4px_0px_#6B4EFE] outline-none transition-all placeholder:text-brand-black/30 shadow-inner"
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
            partner={activeChat.data}
            onSuccess={handleScheduleSuccess}
          />
          <InviteToCircleModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            partner={activeChat.data}
          />
        </main>
      </div>
    </Layout>
  );
};

export default PartnerChat;
