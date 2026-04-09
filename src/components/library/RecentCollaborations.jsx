import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RecentCollaborations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCollaborators();
  }, [user]);

  const fetchCollaborators = async () => {
    try {
      // Fetch members from circles the user belongs to
      const { data: memberCircles } = await supabase
        .from('circle_members')
        .select('circle_id')
        .eq('user_id', user.id);
      
      const circleIds = memberCircles?.map(c => c.circle_id) || [];
      
      if (circleIds.length === 0) {
        setCollaborators([]);
        return;
      }

      const { data: uniqueMembers } = await supabase
        .from('circle_members')
        .select(`
          profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .in('circle_id', circleIds)
        .neq('user_id', user.id)
        .limit(6);

      const processed = uniqueMembers?.map(m => m.profiles).filter(Boolean) || [];
      // Deduplicate by profile id
      const deduplicated = Array.from(new Map(processed.map(item => [item.id, item])).values());
      setCollaborators(deduplicated);
    } catch (err) {
      console.error('Collaboration Sync Failure:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Scholarly Connections</h2>
        <span className="h-[1px] flex-1 mx-8 bg-outline-variant/30 hidden md:block opacity-40"></span>
        <button 
          onClick={() => navigate('/circles')}
          className="text-on-surface-variant hover:text-primary font-label font-black text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-all font-label"
        >
          Explore Protocol
        </button>
      </div>

      <div className="flex flex-wrap gap-8 justify-center md:justify-start">
        {collaborators.map((collab, i) => (
          <motion.div 
            key={collab.id}
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center gap-4 group cursor-pointer"
            onClick={() => navigate(`/circles`)}
          >
            <div className="relative">
              <div className={`w-20 h-20 rounded-full border-4 border-primary/20 p-1.5 shadow-ref group-hover:shadow-ref-xl transition-all`}>
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white/50 flex items-center justify-center">
                   <img 
                    src={collab.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${collab.id}`} 
                    alt={collab.full_name} 
                    className="w-full h-full object-cover" 
                   />
                </div>
              </div>
              <div className="absolute top-0 right-0 bg-pastel-green w-5 h-5 rounded-full border-[3px] border-white shadow-sm"></div>
            </div>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity">
              {collab.full_name?.split(' ')[0]}'s Portal
            </span>
          </motion.div>
        ))}
        
        {/* Connection Pulse Shell */}
        <div 
          onClick={() => navigate('/circles')}
          className="flex flex-col items-center gap-4 group cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-outline/30 p-2 flex items-center justify-center hover:border-primary/50 transition-all">
             <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">add</span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant italic opacity-40">Add Peer</span>
        </div>
      </div>
    </section>
  );
};

export default RecentCollaborations;
