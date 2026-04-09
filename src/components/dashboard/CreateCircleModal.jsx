import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Image as ImageIcon, CheckCircle2, Loader2, Sparkles, Search, UserPlus, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_COVERS = [
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400', // Blue Abstract
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=400', // Purple Mesh
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400', // Pink Wave
  'https://images.unsplash.com/photo-1627163439134-7a8c47ee8020?auto=format&fit=crop&q=80&w=400', // Data Glass
  'https://images.unsplash.com/photo-1635776062127-d379bfcbb9c8?auto=format&fit=crop&q=80&w=400', // 3D Shapes
];

const CreateCircleModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(DEFAULT_COVERS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Recruitment State
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const searchPeers = async () => {
      if (userSearch.length < 2) {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .ilike('full_name', `%${userSearch}%`)
        .neq('id', user.id)
        .limit(5);
      setSearchResults(data || []);
      setSearching(false);
    };

    const timer = setTimeout(searchPeers, 300);
    return () => clearTimeout(timer);
  }, [userSearch, user.id]);

  const toggleMember = (peer) => {
    if (selectedMembers.find(m => m.id === peer.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== peer.id));
    } else {
      setSelectedMembers([...selectedMembers, peer]);
      setUserSearch('');
      setSearchResults([]);
    }
  };

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
            image_url: imageUrl,
            created_by: user.id,
          }
        ])
        .select()
        .single();

      if (circleErr) throw circleErr;

      // 2. Prepare member rows (Creator + Invitations)
      const memberRows = [
        { circle_id: circle.id, user_id: user.id, role: 'lead' },
        ...selectedMembers.map(m => ({ circle_id: circle.id, user_id: m.id, role: 'member' }))
      ];

      const { error: memberErr } = await supabase
        .from('circle_members')
        .insert(memberRows);

      if (memberErr) throw memberErr;

      // 3. Cleanup and notify
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setImageUrl(DEFAULT_COVERS[0]);
    setSelectedMembers([]);
    setUserSearch('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white border border-black/5 w-full max-w-xl rounded-[2.5rem] shadow-ref-xl p-8 md:p-10 relative z-10 overflow-hidden"
        >
          {/* Decorative Sparkle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-pastel-yellow border border-black/5 rounded-full shadow-ref-xl flex items-center justify-center -rotate-12 group hover:rotate-12 transition-transform">
             <Sparkles className="w-10 h-10 text-brand-black animate-pulse" />
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-4xl font-heading font-black italic tracking-tighter uppercase leading-none">Manifest <span className="text-brand-purple">Circle</span></h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40 mt-2">Initialize Collaborative Protocol</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white border border-black/10 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
              <X className="w-7 h-7" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Circle Identity */}
            <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-2">Visual ID</label>
                    <div className="w-full aspect-square bg-gray-100 rounded-3xl overflow-hidden border-2 border-black/5 shadow-inner">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-2">Circle Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Quantum Squad"
                            className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 font-black text-xl italic tracking-tighter focus:bg-white focus:border-brand-purple outline-none transition-all shadow-inner"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-2">Neural Mission</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief mission summary..."
                            rows={2}
                            className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 font-black italic tracking-tighter focus:bg-white focus:border-brand-purple outline-none transition-all shadow-inner resize-none text-base"
                        />
                    </div>
                </div>
            </div>

            {/* Neural Covers */}
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-2 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Select Neural Cover
                </label>
                <div className="flex gap-3 pb-2 overflow-x-auto custom-scrollbar-thin">
                    {DEFAULT_COVERS.map(url => (
                        <button
                            key={url}
                            type="button"
                            onClick={() => setImageUrl(url)}
                            className={`flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-4 transition-all ${imageUrl === url ? 'border-brand-purple scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                        >
                            <img src={url} alt="Cover option" className="w-full h-full object-cover" />
                        </button>
                    ))}
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-100 border-2 border-dashed border-black/10 flex items-center justify-center text-brand-black/20 hover:text-brand-purple italic font-black text-[10px] px-2 text-center leading-tight cursor-pointer hover:bg-white transition-all">
                        Custom URL
                    </div>
                </div>
            </div>

            {/* Recruitment System */}
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 ml-2 flex items-center gap-2">
                    <UserPlus className="w-3 h-3" /> Recruit Scholars
                </label>
                
                {selectedMembers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 bg-pastel-blue/20 p-3 rounded-2xl border border-pastel-blue/30">
                        {selectedMembers.map(m => (
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                key={m.id} 
                                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-black/5 shadow-sm pr-1"
                            >
                                <img src={m.avatar_url} className="w-5 h-5 rounded-full" />
                                <span className="text-[10px] font-black italic">{m.full_name}</span>
                                <button onClick={() => toggleMember(m)} className="p-1 hover:text-red-500 transition-colors">
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="relative group/search">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-black/20 w-5 h-5" />
                    <input 
                        type="text" 
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Search Scholars by Name..."
                        className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 pl-14 pr-6 font-black italic tracking-tighter focus:bg-white focus:border-brand-purple outline-none transition-all shadow-inner"
                    />
                    
                    <AnimatePresence>
                        {searchResults.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/10 rounded-3xl shadow-ref-xl z-20 overflow-hidden"
                            >
                                {searchResults.map(peer => (
                                    <button
                                        key={peer.id}
                                        type="button"
                                        onClick={() => toggleMember(peer)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-black/5 last:border-0 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={peer.avatar_url} className="w-10 h-10 rounded-full bg-gray-100" />
                                            <span className="font-black italic text-lg tracking-tighter uppercase">{peer.full_name}</span>
                                        </div>
                                        {selectedMembers.find(m => m.id === peer.id) ? (
                                            <CheckCircle2 className="text-pastel-green w-6 h-6" />
                                        ) : (
                                            <Plus className="text-brand-purple w-6 h-6" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 p-4 rounded-2xl text-xs font-bold text-red-600 italic">
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
              {loading ? <Loader2 className="animate-spin" /> : <><Users className="w-8 h-8" strokeWidth={3} /> INITIALIZE HUB</>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateCircleModal;
