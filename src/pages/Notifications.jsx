import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Inbox, Search, Sparkles, User, Brain, Cpu, MessageSquare, ChevronRight, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Neural Sync Error:', err);
      toast.error('Failed to sync notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success('Notification purged');
    } catch (err) {
      toast.error('Purge failed');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'match_found': return <Sparkles size={20} className="text-brand-purple" />;
      case 'message': return <MessageSquare size={20} className="text-pastel-blue" />;
      case 'system': return <Cpu size={20} className="text-pastel-pink" />;
      default: return <Bell size={20} />;
    }
  };

  return (
    <Layout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black font-headline tracking-tighter uppercase italic text-primary">Neural Alerts</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">System Transmission Log</p>
        </div>
        
        <div className="flex bg-surface-container-high rounded-2xl p-1 gap-1 border border-black/5 shadow-sm">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant opacity-60 hover:opacity-100'}`}
          >
            All Logs
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant opacity-60 hover:opacity-100'}`}
          >
            Unread
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest italic">Syncing Neural Streams...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-[2.5rem] p-12"
          >
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox size={40} className="text-outline opacity-30" />
            </div>
            <h3 className="text-2xl font-black font-headline tracking-tight uppercase italic opacity-40">Static Detected</h3>
            <p className="text-sm font-bold opacity-30 mt-2">No active transmissions in the current neural sector.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative overflow-hidden bg-white border border-black/5 rounded-[2rem] p-6 shadow-ref-sm hover:shadow-ref transition-all ${!notification.is_read ? 'border-l-4 border-l-brand-purple' : ''}`}
              >
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-2xl ${notification.is_read ? 'bg-surface-container-high' : 'bg-brand-purple/10'} transition-colors`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                        {new Date(notification.created_at).toLocaleDateString()} • {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.is_read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 hover:bg-pastel-green/20 text-pastel-green rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                          title="Purge log"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className={`text-lg font-black font-headline tracking-tight leading-none mb-2 ${!notification.is_read ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {notification.content}
                    </h4>
                    
                    {notification.metadata?.match_name && (
                      <div className="mt-4 flex items-center gap-3 bg-surface-container-lowest p-3 rounded-xl border border-black/5">
                        <div className="w-8 h-8 rounded-full bg-pastel-yellow border border-black/5 flex items-center justify-center font-black text-[10px]">
                          {notification.metadata.match_name[0]}
                        </div>
                        <p className="text-[10px] font-bold text-brand-black/70">
                          Matched with <span className="text-primary">{notification.metadata.match_name}</span> via shared interests
                        </p>
                        <ChevronRight size={14} className="ml-auto opacity-30" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
