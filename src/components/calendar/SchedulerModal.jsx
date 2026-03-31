import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { X, Calendar as CalendarIcon, Clock, BookOpen, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SchedulerModal = ({ isOpen, onClose, partner, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00'
  });

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!user || !partner) return;

    setLoading(true);
    try {
      const scheduledAt = new Date(`${formData.date}T${formData.time}:00`);
      
      if (isNaN(scheduledAt.getTime())) {
        throw new Error("Neural timeline mismatch. Please verify date/time parameters.");
      }

      const { data, error } = await supabase
        .from('study_sessions')
        .insert([{
          creator_id: user.id,
          partner_id: partner.id,
          topic: formData.topic,
          scheduled_for: scheduledAt.toISOString(),
          status: 'scheduled'
        }])
        .select()
        .single();

      if (error) throw error;

      // Notify the partner via notifications table as well
      await supabase.from('notifications').insert({
        user_id: partner.id,
        type: 'session_scheduled',
        content: `${user.user_metadata?.full_name || 'Your partner'} scheduled a study session: ${formData.topic}`,
        metadata: { session_id: data.id, creator_id: user.id }
      });

      onSuccess(data);
      onClose();
      setFormData({ topic: '', date: new Date().toISOString().split('T')[0], time: '14:00' });
    } catch (err) {
      console.error('Session Materialization Error:', err);
      toast.error(err.message || 'Failed to synchronize session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-ref-xl overflow-hidden relative z-110 border border-black/5"
          >
            {/* Header */}
            <div className="p-8 border-b border-black/5 flex justify-between items-center bg-[#f5eeff]/30">
              <div>
                <h3 className="text-3xl font-heading font-black italic tracking-tighter uppercase leading-none">Schedule <span className="text-primary">Sync</span></h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 mt-1">1-on-1 Study Protocol</p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-black/5 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <X size={24} className="text-brand-black/40" />
              </button>
            </div>

            <form className="p-8 space-y-8" onSubmit={handleSchedule}>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1">
                  <BookOpen size={12} className="text-primary" /> Cognitive Topic
                </label>
                <input 
                  className="w-full px-6 py-4 bg-[#f5eeff]/20 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all font-body text-sm font-semibold text-brand-black placeholder:opacity-30 shadow-inner" 
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  placeholder="e.g. Advanced Quantum Field Theory" 
                  required 
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1">
                    <CalendarIcon size={12} className="text-primary" /> Target Date
                  </label>
                  <input 
                    className="w-full px-6 py-4 bg-[#f5eeff]/20 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all font-body text-sm font-semibold" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required 
                    type="date" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-1">
                    <Clock size={12} className="text-primary" /> Target Time
                  </label>
                  <input 
                    className="w-full px-6 py-4 bg-[#f5eeff]/20 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all font-body text-sm font-semibold" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required 
                    type="time" 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-5 bg-brand-black text-white font-heading font-black text-lg italic tracking-tighter uppercase rounded-full shadow-ref-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Materialize Session
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Footer Tip */}
            <div className="px-8 py-6 bg-brand-black text-primary border-t border-primary/20 flex items-center gap-4">
              <Sparkles size={20} className="animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                A system transmission will be sent to your partner<br/>to confirm the neural synchronization.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SchedulerModal;
