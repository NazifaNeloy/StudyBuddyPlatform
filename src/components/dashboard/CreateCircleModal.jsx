import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Image as ImageIcon, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const CreateCircleModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create the circle
      const { data: circle, error: circleErr } = await supabase
        .from('study_circles')
        .insert([
          {
            name,
            description,
            image_url: imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400',
            created_by: user.id,
          }
        ])
        .select()
        .single();

      if (circleErr) throw circleErr;

      // 2. Add creator as a 'lead' member automatically
      const { error: memberErr } = await supabase
        .from('circle_members')
        .insert([
          {
            circle_id: circle.id,
            user_id: user.id,
            role: 'lead'
          }
        ]);

      if (memberErr) throw memberErr;

      // 3. Cleanup and notify
      onSuccess();
      onClose();
      setName('');
      setDescription('');
      setImageUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white border border-black/5 w-full max-w-lg rounded-[2.5rem] shadow-ref-xl p-10 relative z-10 overflow-hidden"
        >
          {/* Decorative Sparkle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-pastel-yellow border border-black/5 rounded-full shadow-ref-xl flex items-center justify-center -rotate-12 group hover:rotate-12 transition-transform">
             <Sparkles className="w-10 h-10 text-brand-black animate-pulse" />
          </div>

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-heading font-black italic tracking-tighter uppercase leading-none">Manifest <span className="text-brand-purple">Circle</span></h2>
            <button onClick={onClose} className="p-3 bg-white border border-black/10 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
              <X className="w-7 h-7" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-2">Circle Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Quantum Mechanics Squad"
                className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 font-black text-xl italic tracking-tighter focus:bg-white focus:border-brand-purple outline-none transition-all shadow-inner"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-2">Mission Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this circle's primary mission?"
                rows={3}
                className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 font-black text-xl italic tracking-tighter focus:bg-white focus:border-brand-purple outline-none transition-all shadow-inner resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-2">Cover Image URL (Optional)</label>
              <div className="relative group">
                <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-black/20 w-6 h-6 group-focus-within:text-brand-purple" />
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 pl-16 pr-6 font-black text-xl italic tracking-tighter focus:bg-white focus:border-brand-purple outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 p-3 rounded-2xl text-xs font-bold text-red-600">
                {error}
              </div>
            )}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !name}
              className="w-full bg-brand-black text-white py-6 rounded-full font-heading font-black text-2xl italic tracking-tighter shadow-xl shadow-brand-black/10 hover:shadow-brand-purple/40 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Plus className="w-8 h-8" strokeWidth={3} /> INITIALIZE HUB</>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateCircleModal;
