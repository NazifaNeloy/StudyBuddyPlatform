import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Modular Architecture Imports
import CircleTimer from '../components/circles/CircleTimer';
import CircleWorkspaceContent from '../components/circles/CircleWorkspaceContent';
import CircleParticipants from '../components/circles/CircleParticipants';
import CircleChat from '../components/circles/CircleChat';

const FocusOrb = () => {
  const { user } = useAuth();
  const { circleId } = useParams();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [activeMembers, setActiveMembers] = useState(1);
  const [circleName, setCircleName] = useState('Neural Protocol');
  const scrollRef = useRef(null);

  // Helper: UUID Validation
  const isValidUuid = (uuid) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };
  
  // Realtime Logic for Pomodoro (Scoped to Circle)
  useEffect(() => {
    if (!circleId || !isValidUuid(circleId)) {
      if (circleId) {
        console.warn("Invalid Neural ID detected. Redirecting to Discovery.");
        navigate('/circles');
      }
      return;
    }

    // Presence & Chat channel
    const channel = supabase.channel(`focus:${circleId}`, {
      config: {
        presence: {
          key: user?.id || 'anonymous',
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setActiveMembers(Object.keys(state).length);
      })
      .on('broadcast', { event: 'timer_sync' }, ({ payload }) => {
        setSeconds(payload.seconds);
        setIsActive(payload.isActive);
      })
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `circle_id=eq.${circleId}`
      }, (payload) => {
        const msg = {
          ...payload.new,
          time: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: payload.new.user_id === user?.id
        };
        setMessages(prev => [...prev, msg]);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({
            user_id: user.id,
            user_name: user?.email?.split('@')[0] || 'Neural Student',
            online_at: new Date().toISOString(),
          });
        }
      });

    // Initial Data fetch
    fetchMessages();
    fetchCircleDetails();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [circleId, user, navigate]);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    setShowReward(true);
    
    // Group protocol usually awarded 25 mins of focus
    await updateFocusStats(25);
    
    setTimeout(() => setShowReward(false), 5000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchCircleDetails = async () => {
    if (!isValidUuid(circleId)) return;
    try {
      const { data, error } = await supabase.from('study_circles').select('name').eq('id', circleId).single();
      if (error) throw error;
      if (data) setCircleName(data.name);
    } catch (e) {
      console.error("Circle details fetch failed:", e.message);
      // Fallback or navigate away if not found
      if (e.code === 'PGRST116') {
        navigate('/circles');
      }
    }
  };

  const fetchMessages = async () => {
    if (!isValidUuid(circleId)) return;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('circle_id', circleId)
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (error) throw error;

      if (data && data.length > 0) {
        const formatted = data.map(msg => ({
          ...msg,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: msg.user_id === user?.id
        }));
        setMessages(formatted);
      } else {
         // Placeholder context
         setMessages([
           { content: "Neural Protocol Active. Waiting for transmissions...", user_name: "System", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: false }
         ]);
      }
    } catch (err) {
      console.error("Message sync error:", err.message);
    }
  };

  const toggleTimer = () => {
    if (!isValidUuid(circleId)) return;
    const nextState = !isActive;
    setIsActive(nextState);
    const channel = supabase.channel(`focus:${circleId}`);
    channel.send({
      type: 'broadcast',
      event: 'timer_sync',
      payload: { seconds, isActive: nextState }
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !user || !isValidUuid(circleId)) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          circle_id: circleId,
          user_id: user.id,
          user_name: user?.email?.split('@')[0] || 'Neural Student',
          content: newMessageText
        }]);

      if (!error) setNewMessageText('');
      else throw error;
    } catch (err) {
      console.error("Transmission error:", err.message);
    }
  };

  return (
    <Layout>
      {/* TopAppBar (Synergy) */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-black font-headline tracking-tighter uppercase italic text-primary">Study Circle: {circleName}</h2>
          <span className="px-5 py-2 bg-tertiary-container/30 text-tertiary rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-tertiary/10">
            <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse shadow-[0_0_8px_rgba(154,24,158,0.5)]"></span>
            LIVE SESSION
          </span>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-64 bg-surface-container-high rounded-full px-6 py-3 flex items-center gap-3 border border-black/5 shadow-sm">
            <span className="material-symbols-outlined text-outline text-xl">search</span>
            <input 
              type="text" 
              placeholder="Search Protocols..." 
              className="bg-transparent border-none focus:ring-0 text-xs font-black uppercase tracking-widest w-full outline-none placeholder:opacity-30 font-label" 
            />
          </div>
          
          <div className="flex items-center gap-3">
             <button className="p-3 rounded-2xl bg-white border border-black/5 shadow-ref-sm text-primary hover:scale-110 active:scale-95 transition-all">
                <span className="material-symbols-outlined">notifications</span>
             </button>
             <div className="w-12 h-12 rounded-full border-2 border-primary-container p-0.5 overflow-hidden shadow-ref-sm">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'anon'}`} 
                  alt="User avatar" 
                  className="w-full h-full object-cover rounded-full" 
                />
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1700px] mx-auto pb-20 overflow-hidden h-[calc(100vh-180px)]">
        <div className="grid grid-cols-12 gap-8 h-full">
          
          {/* Left Space: Timer & Shared Content */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8 h-full pr-2 overflow-y-auto scrollbar-hide">
            <CircleTimer 
              seconds={seconds} 
              isActive={isActive} 
              onToggle={toggleTimer} 
              sessionName="Sync Focus I"
              participants={activeMembers}
            />
            
            <CircleWorkspaceContent />
          </div>

          {/* Right Space: Feedback & Synergy */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8 h-full overflow-hidden">
             <CircleParticipants count={activeMembers} />
             
             <div className="flex-1 min-h-0">
                <CircleChat 
                  messages={messages}
                  newMessage={newMessageText}
                  onMessageChange={(e) => setNewMessageText(e.target.value)}
                  onSendMessage={sendMessage}
                  scrollRef={scrollRef}
                />
             </div>
          </div>

        </div>
      </div>

      {/* Level Up Notification */}
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200]"
          >
             <div className="bg-white border border-black/5 rounded-full px-12 py-6 shadow-ref-xl flex items-center gap-8">
                <div className="w-14 h-14 bg-pastel-yellow rounded-full border border-white/40 flex items-center justify-center animate-bounce shadow-md">
                  <span className="material-symbols-outlined text-brand-black text-3xl">trophy</span>
                </div>
                <div>
                  <h4 className="font-heading font-black italic text-2xl tracking-tighter text-brand-black">MISSION COMPLETE</h4>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">+50 XP Materialized</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default FocusOrb;
