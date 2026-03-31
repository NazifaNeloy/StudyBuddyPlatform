import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, MoreVertical, Send, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const RecentMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalMessages();
    
    // Real-time subscription
    const channel = supabase.channel('global-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => [payload.new, ...prev.slice(0, 4)]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchGlobalMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (data) setMessages(data);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-ref-xl h-full flex flex-col transition-all border border-black/5">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-2xl font-heading font-black italic uppercase tracking-tighter text-brand-black">Transmissions</h3>
        <button className="text-gray-300 hover:text-brand-black">
          <MoreVertical size={24} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-5 group cursor-pointer border border-transparent hover:border-black/5 hover:bg-gray-50 rounded-2xl p-4 transition-all"
          >
            <div className="w-14 h-14 rounded-full border border-black/5 shadow-sm overflow-hidden shrink-0 group-hover:scale-105 transition-transform bg-pastel-blue">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user_id}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between mb-1">
                  <h4 className="font-heading font-black text-base truncate pr-2 italic tracking-tighter text-brand-black">{msg.user_name || 'Protocol Admin'}</h4>
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded-full">
                    {formatTime(msg.created_at)}
                  </span>
               </div>
               <p className="text-xs font-bold text-gray-400 line-clamp-1 leading-relaxed italic">
                  {msg.content}
               </p>
            </div>
          </motion.div>
        ))}

        {!loading && messages.length === 0 && (
           <div className="flex flex-col items-center justify-center py-10 opacity-20 italic">
              <MessageSquare size={32} className="mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest text-center">Awaiting Signals...</p>
           </div>
        )}
      </div>

      {/* Broadcast System */}
      <button className="mt-8 w-full bg-pastel-pink border border-black/5 py-4 rounded-2xl font-heading font-black italic tracking-tighter text-lg shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 active:scale-95">
         <Zap size={20} className="fill-brand-black text-brand-black" />
         Broadcast Signal
      </button>
    </div>
  );
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60); // minutes
  if (diff < 1) return 'now';
  if (diff < 60) return `${diff}m`;
  return `${Math.floor(diff / 60)}h`;
};

export default RecentMessages;
