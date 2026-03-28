import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, MessageSquare, Users, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const FocusOrb = () => {
  const { user } = useAuth();
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState([]);
  const scrollRef = useRef(null);
  
  // Realtime Logic for Pomodoro
  useEffect(() => {
    const channel = supabase.channel('shared_timer')
      .on('broadcast', { event: 'timer_update' }, ({ payload }) => {
        setSeconds(payload.seconds);
        setIsActive(payload.isActive);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Timer interval (Sync local state with countdown if active)
  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => {
    const newState = !isActive;
    setIsActive(newState);
    // Broadcast state change
    supabase.channel('shared_timer').send({
      type: 'broadcast',
      event: 'timer_update',
      payload: { seconds, isActive: newState },
    });
  };

  const resetTimer = () => {
    setSeconds(1500);
    setIsActive(false);
    supabase.channel('shared_timer').send({
      type: 'broadcast',
      event: 'timer_update',
      payload: { seconds: 1500, isActive: false },
    });
  };

  // Realtime Logic for Chat & Presence
  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);
      if (data) setMessages(data);
    };
    fetchMessages();

    // Subscribe to new messages & Presence
    const channel = supabase.channel('chat_room')
      .on('postgres_changes', { event: 'INSERT', table: 'messages' }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat();
        setTyping(users.filter(u => u.isTyping && u.user_id !== user.id));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ 
            user_id: user.id, 
            user_name: user.user_metadata?.full_name || 'Anonymous',
            isTyping: false 
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    const channel = supabase.channel('chat_room');
    channel.track({ 
      user_id: user.id, 
      user_name: user.user_metadata?.full_name || 'Anonymous',
      isTyping: e.target.value.length > 0 
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert([
      { 
        content: newMessage, 
        user_id: user.id, 
        user_name: user.user_metadata?.full_name || user.email.split('@')[0]
      }
    ]);

    if (!error) setNewMessage('');
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 min-h-[calc(100vh-160px)]">
      {/* Timer Section */}
      <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-12">
        <div className="relative group">
          {/* Pulsing Back Glow */}
          <motion.div 
            animate={{ 
              scale: isActive ? [1, 1.1, 1] : 1,
              opacity: isActive ? [0.2, 0.4, 0.2] : 0.2
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-purple-500 rounded-full blur-[80px] -z-10" 
          />
          
          {/* The Orb */}
          <motion.div 
            className="w-64 h-64 md:w-80 md:h-80 rounded-full glass border-white/20 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden"
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10" />
            <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter relative z-10">
              {formatTime(seconds)}
            </div>
            <div className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mt-2 relative z-10">
              {isActive ? 'Hyper Focus' : 'Ready'}
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={resetTimer}
            className="w-12 h-12 rounded-2xl glass hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-xl shadow-purple-500/20 active:scale-95 ${
              isActive ? 'bg-white text-black' : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <div className="w-12 h-12 flex items-center justify-center text-gray-500">
            <Timer className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="glass rounded-[2rem] border border-white/10 flex flex-col h-[600px] lg:h-auto overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2">
            Live Chat
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </h2>
          <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-widest font-bold">
            <Users className="w-4 h-4" />
            Active: 12
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth" ref={scrollRef}>
          {messages.map((msg, i) => (
            <motion.div 
              key={msg.id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col ${msg.user_id === user.id ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-gray-500 mb-1 px-1">{msg.user_name}</span>
              <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                msg.user_id === user.id 
                  ? 'bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-500/20' 
                  : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-white/5 border-t border-white/10 relative">
          {typing.length > 0 && (
            <div className="absolute -top-6 left-6 text-[10px] text-purple-400 font-bold animate-pulse">
              {typing.map(u => u.user_name).join(', ')} is typing...
            </div>
          )}
          <input 
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm placeholder:text-gray-600"
          />
          <button 
            type="submit"
            className="absolute right-6 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FocusOrb;
