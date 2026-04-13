import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, UserCheck, UserX, MessageSquare, Calendar as CalendarIcon, CheckCircle2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationCenter = () => {
  const { user } = useAuth();
  // ... (rest of state and effects)
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // 1. Initial Fetch
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };

    fetchNotifications();

    // 2. Realtime Subscription
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleConnectionAction = async (notification, action) => {
    if (!notification?.metadata) {
      console.warn('Notification metadata missing for action:', action);
      return;
    }
    const { connection_id, sender_id, matched_user_id } = notification.metadata;

    if (notification.type === 'match_found' && action === 'connect') {
      // 1. Create connection record
      const { data: connData, error: connError } = await supabase
        .from('connections')
        .insert({
          user_id_1: user.id,
          user_id_2: matched_user_id,
          status: 'pending'
        })
        .select()
        .single();

      if (connError) {
        toast.error('Connection initialization failed.');
        return;
      }

      // 2. Notify the other user
      await supabase.from('notifications').insert({
        user_id: matched_user_id,
        type: 'connection_request',
        content: `Neural Match: ${user.user_metadata?.full_name || 'Someone'} wants to synchronize protocols with you!`,
        metadata: { connection_id: connData.id, sender_id: user.id }
      });

      toast.success('Connection request transmitted!', { icon: '📡' });
      await markAsRead(notification.id);
      return;
    }

    if (action === 'accept') {
      const { error: connError } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connection_id);

      if (connError) {
        console.error('Error accepting connection:', connError.message);
        toast.error('Synthesis failed. Please retry.');
        return;
      }

      await supabase.from('notifications').insert({
        user_id: sender_id,
        type: 'connection_accepted',
        content: `${user.user_metadata?.full_name || 'Someone'} accepted your connection request!`,
        metadata: { partner_id: user.id }
      });

      toast.success('Cognitive Connection Established!', {
        icon: '🧠',
        style: {
          borderRadius: '1rem',
          background: '#32294f',
          color: '#fff',
          fontFamily: 'Inter, sans-serif'
        }
      });
    } else {
      await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', connection_id);
      
      toast('Request Dismissed', { icon: '🫥' });
    }

    await markAsRead(notification.id);
  };

  const handleJoinRequestAction = async (notification, action) => {
    if (!notification?.metadata) return;
    const { circle_id, matched_user_id, circle_name } = notification.metadata;

    if (action === 'approve') {
      try {
        // 1. Add user to circle_members
        const { error: joinError } = await supabase
          .from('circle_members')
          .insert({
            circle_id,
            user_id: matched_user_id,
            role: 'member'
          });

        if (joinError) throw joinError;

        // 2. Update join request status
        await supabase
          .from('circle_join_requests')
          .update({ status: 'accepted' })
          .eq('circle_id', circle_id)
          .eq('user_id', matched_user_id);

        // 3. Notify the user they were added
        await supabase.from('notifications').insert({
          user_id: matched_user_id,
          type: 'group_invite_accepted',
          content: `Joint Protocol Accepted: You are now a member of "${circle_name}"!`,
          metadata: { circle_id }
        });

        toast.success('Cognitive Synthesis Approved!');
      } catch (err) {
        console.error('Approval error:', err);
        toast.error('Synthesis failed. Please retry.');
      }
    } else {
      await supabase
        .from('circle_join_requests')
        .update({ status: 'rejected' })
        .eq('circle_id', circle_id)
        .eq('user_id', matched_user_id);
      
      toast('Access Request Denied', { icon: '🫥' });
    }

    await markAsRead(notification.id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-white/50 hover:bg-white rounded-xl transition-all shadow-sm border border-black/5 group"
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-primary animate-pulse' : 'text-brand-black/60'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-3 w-80 bg-white rounded-3xl shadow-ref-xl border border-black/5 overflow-hidden z-[60]"
          >
            <div className="p-4 border-b border-black/5 bg-[#f5eeff]/30 flex justify-between items-center">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider italic">Neural Alerts</h3>
              {unreadCount > 0 && (
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                   {unreadCount} New
                 </span>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center opacity-30">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">System Quiet<br/>No active triggers</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-black/5 last:border-0 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        n.type === 'connection_request' ? 'bg-pastel-pink' : 
                        n.type === 'message' ? 'bg-pastel-blue' : 'bg-pastel-green'
                      } border border-black/5 shadow-sm`}>
                         {n.type === 'connection_request' && <UserCheck className="w-5 h-5 text-brand-black" />}
                         {n.type === 'message' && <MessageSquare className="w-5 h-5 text-brand-black" />}
                         {n.type === 'session_scheduled' && <CalendarIcon className="w-5 h-5 text-brand-black" />}
                         {n.type === 'connection_accepted' && <CheckCircle2 className="w-5 h-5 text-brand-black" />}
                         {n.type === 'match_found' && <Zap className="w-5 h-5 text-brand-black" />}
                         {n.type === 'group_invite' && <UsersIcon className="w-5 h-5 text-brand-black" />}
                         {n.type === 'circle_join_request' && <Zap className="w-5 h-5 text-primary" />}
                         {n.type === 'group_invite_accepted' && <CheckCircle2 className="w-5 h-5 text-pastel-green" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-black uppercase tracking-tight mb-1 ${!n.is_read ? 'text-primary' : 'text-brand-black/70'}`}>
                          {n.content}
                        </p>
                        
                        {n.type === 'connection_request' && !n.is_read && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleConnectionAction(n, 'accept')}
                              className="bg-brand-purple text-white px-4 py-2 rounded-full font-black text-[10px] uppercase italic tracking-[0.05em] shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                            >
                              Connect
                            </button>
                            <button
                              onClick={() => handleConnectionAction(n, 'decline')}
                              className="bg-white border border-black/10 text-brand-black/60 px-4 py-2 rounded-full font-black text-[10px] uppercase italic tracking-[0.05em] hover:bg-gray-50 active:scale-95 transition-all"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}

                        {n.type === 'match_found' && !n.is_read && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleConnectionAction(n, 'connect')}
                              className="bg-primary text-white px-4 py-2 rounded-full font-black text-[10px] uppercase italic tracking-[0.05em] shadow-lg shadow-primary/20 active:scale-95 transition-all"
                            >
                              Initialize Link
                            </button>
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="bg-white border border-black/10 text-brand-black/60 px-4 py-2 rounded-full font-black text-[10px] uppercase italic tracking-[0.05em] hover:bg-gray-50 active:scale-95 transition-all"
                            >
                              Ignore
                            </button>
                          </div>
                        )}

                         {n.type === 'group_invite' && !n.is_read && (
                           <div className="flex gap-2 mt-3">
                             <button
                               onClick={() => {
                                 const circleId = n.metadata?.circle_id;
                                 if (circleId) {
                                   markAsRead(n.id);
                                   window.location.href = `/circles/${circleId}`;
                                 }
                               }}
                               className="bg-primary text-white px-4 py-2 rounded-full font-black text-[10px] uppercase italic tracking-[0.05em] shadow-lg shadow-primary/20 active:scale-95 transition-all"
                             >
                               View Circle
                             </button>
                             <button
                               onClick={() => markAsRead(n.id)}
                               className="bg-white border border-black/10 text-brand-black/60 px-4 py-2 rounded-full font-black text-[10px] uppercase italic tracking-[0.05em] hover:bg-gray-50 active:scale-95 transition-all"
                             >
                               Dismiss
                             </button>
                           </div>
                         )}

                         {n.type === 'circle_join_request' && !n.is_read && (
                           <div className="flex gap-2 mt-3">
                             <button
                               onClick={() => handleJoinRequestAction(n, 'approve')}
                               className="bg-primary text-white px-4 py-2 rounded-full font-black text-[10px] uppercase italic tracking-[0.05em] shadow-lg shadow-primary/20 active:scale-95 transition-all"
                             >
                               Approve
                             </button>
                             <button
                               onClick={() => handleJoinRequestAction(n, 'deny')}
                               className="bg-white border border-black/10 text-brand-black/60 px-4 py-2 rounded-full font-black text-[10px] uppercase italic tracking-[0.05em] hover:bg-gray-50 active:scale-95 transition-all"
                             >
                               Deny
                             </button>
                           </div>
                         )}

                         {n.type === 'group_invite_accepted' && !n.is_read && (
                           <div className="flex gap-2 mt-3">
                             <button
                               onClick={() => {
                                 const circleId = n.metadata?.circle_id;
                                 if (circleId) {
                                   markAsRead(n.id);
                                   window.location.href = `/circles/${circleId}`;
                                 }
                               }}
                               className="bg-primary text-white px-4 py-2 rounded-full font-black text-[10px] uppercase italic tracking-[0.05em] shadow-lg shadow-primary/20 active:scale-95 transition-all"
                             >
                               Enter Group
                             </button>
                           </div>
                         )}
                        
                        <p className="text-[9px] font-bold text-brand-black/30 uppercase tracking-[0.1em] mt-2">
                          {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just Now'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
