import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

// Modular Architecture Imports
import LibraryHero from '../components/library/LibraryHero';
import LibraryUploadZone from '../components/library/LibraryUploadZone';
import ResourceCard from '../components/library/ResourceCard';
import RecentCollaborations from '../components/library/RecentCollaborations';

const Library = ({ circleId: propCircleId }) => {
  const { circleId: paramCircleId } = useParams();
  const circleId = propCircleId || paramCircleId;
  const { user } = useAuth();
  
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Resources');
  const [usedStorage, setUsedStorage] = useState(0);

  useEffect(() => {
    fetchResources();
  }, [circleId, user]);

  const handleArchiveArtifact = async (id) => {
    if (!window.confirm("Archive this neural artifact? It will be removed from the collective memory.")) return;
    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Archive Failure:', err.message);
    }
  };

  const fetchResources = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase
        .from('resources')
        .select('*, study_circles(name)')
        .order('created_at', { ascending: false });
      
      if (circleId) {
        query = query.eq('circle_id', circleId);
      } else {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) {
        setResources(data);
        // Calculate real storage in GB (Total bytes -> GB)
        const totalBytes = data.reduce((acc, curr) => acc + (Number(curr.file_size) || 0), 0);
        setUsedStorage(Number((totalBytes / (1024 * 1024 * 1024)).toFixed(3)));
      }
    } catch (err) {
      console.error('Neural Repository Sync Failure:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const uploadFile = e.target.files[0];
    if (!uploadFile || !user) return;
    
    setLoading(true);
    try {
      const fileName = `${user.id}/${Date.now()}_${uploadFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(fileName, uploadFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('resources')
        .insert([{
          circle_id: circleId || null, // Allow personal storage if no circle context
          user_id: user.id,
          title: uploadFile.name.split('.')[0],
          type: uploadFile.type.split('/')[0] || 'document',
          url: publicUrl,
          file_path: fileName,
          file_size: uploadFile.size // Record real file size
        }]);

      if (dbError) throw dbError;
      fetchResources();
      toast.success("Neural Artifact uploaded successfully!");
    } catch (err) {
      console.error('Transmission Error:', err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeFilter === 'All Resources') return true;
    if (activeFilter === 'Documents') return ['application', 'pdf', 'text'].includes(res.type);
    if (activeFilter === 'Media') return ['image', 'video', 'audio'].includes(res.type);
    if (activeFilter === 'Links') return res.type === 'link';
    return true;
  });

  return (
    <Layout>
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-black font-headline tracking-tighter uppercase italic text-primary">Resource Library</h2>
          <div className="hidden lg:flex gap-6">
             {['Dashboard', 'Circles', 'Scanner', 'Calendar'].map((link) => (
               <Link 
                 key={link} 
                 to={`/${link.toLowerCase()}`} 
                 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 hover:opacity-100 transition-all font-label"
               >
                 {link}
               </Link>
             ))}
             <span className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1 italic font-label">Library</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-64 bg-surface-container-high rounded-full px-6 py-3 flex items-center gap-3 border border-black/5 shadow-sm">
            <span className="material-symbols-outlined text-outline text-xl">search</span>
            <input 
              type="text" 
              placeholder="Search Protocols..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs font-black uppercase tracking-widest w-full outline-none placeholder:opacity-30" 
            />
          </div>
          
          <div className="flex items-center gap-3">
             <button className="p-3 rounded-2xl bg-white border border-black/5 shadow-ref-sm text-primary hover:scale-110 active:scale-95 transition-all">
                <span className="material-symbols-outlined">notifications</span>
             </button>
             <div className="w-12 h-12 rounded-full border-2 border-primary-container p-0.5 overflow-hidden shadow-ref-sm">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
                  alt="User avatar" 
                  className="w-full h-full object-cover rounded-full" 
                />
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto pb-20">
        <LibraryHero usedStorage={usedStorage} totalStorage={5.0} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Left: Input Bento Zone */}
          <LibraryUploadZone onFileSelect={handleFileSelect} isUploading={loading} />

          {/* Right: Repository Management */}
          <div className="lg:col-span-8 space-y-8 h-full flex flex-col">
            {/* Filters Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-6 pb-2">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {['All Resources', 'Documents', 'Media', 'Links'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl white-space-nowrap ${activeFilter === tab ? 'bg-primary text-white shadow-xl shadow-primary/20 italic' : 'bg-surface-container-low text-on-surface-variant opacity-40 hover:opacity-100 hover:bg-surface-container-high'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/10">
                <button className="p-2 rounded-lg bg-white text-primary shadow-sm">
                  <span className="material-symbols-outlined text-xl">grid_view</span>
                </button>
                <button className="p-2 rounded-lg text-on-surface-variant opacity-40 hover:opacity-100 transition-all">
                  <span className="material-symbols-outlined text-xl">list</span>
                </button>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
              <AnimatePresence mode="popLayout">
                {filteredResources.map((res, index) => (
                  <ResourceCard key={res.id} resource={res} index={index} />
                ))}
              </AnimatePresence>
              
              {filteredResources.length === 0 && !loading && (
                <div className="col-span-full py-32 text-center bg-surface-container-low rounded-[3rem] border-4 border-dashed border-outline-variant/10 flex flex-col items-center justify-center space-y-6">
                   <div className="w-16 h-16 bg-white/50 rounded-3xl flex items-center justify-center text-outline-variant opacity-30">
                      <span className="material-symbols-outlined text-4xl">folder_off</span>
                   </div>
                   <div>
                      <h4 className="text-2xl font-black font-headline uppercase italic tracking-tighter opacity-20">The Vault is Silent</h4>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40 mt-2">No neural artifacts detected in this protocol.</p>
                   </div>
                </div>
              )}
            </div>

            {/* View More Protocol */}
            {resources.length > 0 && (
              <div className="flex justify-center pt-8">
                <button className="flex items-center gap-3 text-primary font-black uppercase text-[10px] tracking-widest hover:-translate-y-1 transition-transform group">
                    <span>View All {resources.length} Protocols</span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-y-1 transition-transform">expand_more</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <RecentCollaborations />
      </div>
    </Layout>
  );
};

export default Library;
