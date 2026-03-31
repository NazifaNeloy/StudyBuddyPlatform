import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const AddEventModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:30',
    category: 'primary'
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const dateTimeString = `${formData.date}T${formData.startTime}:00`;
      const dueDateTime = new Date(dateTimeString);
      
      if (isNaN(dueDateTime.getTime())) {
        throw new Error("Invalid temporal synchronization parameters. Please check your date and time input.");
      }

      const { error } = await supabase
        .from('tasks')
        .insert([{
          user_id: user.id,
          title: formData.title,
          due_date: dueDateTime.toISOString(),
          category: formData.category,
          is_completed: false
        }]);

      if (error) throw error;
      
      onSuccess();
      onClose();
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:30',
        category: 'primary'
      });
    } catch (err) {
      console.error('Temporal Materialization Failure:', err);
      alert('Failed to save protocol.');
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
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-110 border border-outline-variant/10"
          >
            <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-outline-variant/10">
              <h3 className="text-2xl font-headline font-extrabold text-on-surface uppercase italic tracking-tighter">New Protocol</h3>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form className="p-8 space-y-6" onSubmit={handleSave}>
              <div className="space-y-2">
                <label className="block text-[10px] font-label font-black text-on-surface-variant uppercase tracking-widest opacity-60">Session Title</label>
                <input 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 font-body text-sm font-bold placeholder:opacity-30" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Physics II Review" 
                  required 
                  type="text"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-label font-black text-on-surface-variant uppercase tracking-widest opacity-60">Date</label>
                  <input 
                    className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 font-body text-sm font-bold" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required 
                    type="date" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-label font-black text-on-surface-variant uppercase tracking-widest opacity-60">Start Time</label>
                  <input 
                    className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 font-body text-sm font-bold" 
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    required 
                    type="time" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-label font-black text-on-surface-variant uppercase tracking-widest opacity-60">End Time</label>
                  <input 
                    className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 font-body text-sm font-bold" 
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    required 
                    type="time" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-label font-black text-on-surface-variant uppercase tracking-widest opacity-60">Category</label>
                <select 
                  className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 font-body text-sm font-bold appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="primary">Study Circle</option>
                  <option value="secondary">Lab/Practice</option>
                  <option value="error">Exam/Deadline</option>
                  <option value="tertiary">Group Session</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-4 border-2 border-outline-variant/30 text-on-surface-variant font-label font-bold rounded-full hover:bg-surface-container-low transition-colors uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-4 bg-primary text-white font-label font-bold rounded-full shadow-lg shadow-primary/20 hover:translate-y-[-2px] active:scale-95 transition-all uppercase tracking-widest text-[10px] disabled:opacity-50"
                >
                  {loading ? 'MATERIALIZING...' : 'Save Protocol'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddEventModal;
