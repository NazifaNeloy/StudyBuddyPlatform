import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Upload, 
  Plus, 
  X,
  ExternalLink,
  Download,
  Search,
  MoreVertical
} from 'lucide-react';
import { supabase, storageActions } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Library = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setResources(data);
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setLoading(true);
    const fileExt = uploadFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await storageActions.uploadFile('resources', filePath, uploadFile);

    if (uploadError) {
      alert('Error uploading file: ' + uploadError.message);
      setLoading(false);
      return;
    }

    // 2. Get Public URL
    const url = storageActions.getPublicUrl('resources', filePath);

    // 3. Save reference to DB
    const { error: dbError } = await supabase.from('resources').insert([
      {
        title: title || uploadFile.name,
        type: fileExt.match(/(jpg|jpeg|png|gif)/i) ? 'image' : 'pdf',
        url: url,
        user_id: user.id,
      }
    ]);

    if (!dbError) {
      setTitle('');
      setUploadFile(null);
      setShowUpload(false);
      fetchResources();
    }
    setLoading(false);
  };

  const handleLinkAdd = async (e) => {
    e.preventDefault();
    if (!link) return;

    setLoading(true);
    const { error } = await supabase.from('resources').insert([
      {
        title: title || link,
        type: 'link',
        url: link,
        user_id: user.id,
      }
    ]);

    if (!error) {
      setTitle('');
      setLink('');
      setShowUpload(false);
      fetchResources();
    }
    setLoading(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'link': return LinkIcon;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 italic">Resource Library</h1>
          <p className="text-gray-400">Manage your shared notes, links, and documents.</p>
        </div>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-95"
        >
          {showUpload ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showUpload ? 'Cancel' : 'Add Resource'}
        </button>
      </div>

      {/* Upload Modal/Section */}
      {showUpload && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass rounded-3xl border border-white/10 p-6 overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* File Upload */}
            <form onSubmit={handleFileUpload} className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">Upload Artifact</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Title (Optional)</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Final Exam Notes..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all group flex flex-col items-center gap-3 relative overflow-hidden">
                {uploadFile ? (
                   <div className="flex flex-col items-center">
                    <FileText className="w-10 h-10 text-purple-400 mb-2" />
                    <span className="text-sm font-medium truncate max-w-[200px]">{uploadFile.name}</span>
                    <button onClick={() => setUploadFile(null)} className="text-xs text-red-400 mt-2 hover:underline">Remove</button>
                   </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <span className="text-sm font-bold">Drop file or click to choose</span>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase">PDF, PNG, JPG up to 10MB</p>
                    </div>
                    <input 
                      type="file" 
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </>
                )}
              </div>
              <button 
                type="submit"
                disabled={!uploadFile || loading}
                className="w-full bg-white text-black font-bold py-3 rounded-xl disabled:opacity-50 transition-all hover:bg-gray-200"
              >
                {loading ? 'Manifesting...' : 'Upload To Circle'}
              </button>
            </form>

            <div className="hidden md:block w-px bg-white/10 h-full mx-auto" />

            {/* Link Addition */}
            <form onSubmit={handleLinkAdd} className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">Quick Link</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Label</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Wikipedia, Notion, etc."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase">URL</label>
                <input 
                  type="url" 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
              <button 
                type="submit"
                disabled={!link || loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20"
              >
                Attach Link
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Grid of resources */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res, i) => {
          const Icon = getIcon(res.type);
          return (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass p-5 rounded-[2rem] border border-white/5 group hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  res.type === 'link' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <button className="text-gray-600 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-bold truncate mb-1">{res.title}</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Added {new Date(res.created_at).toLocaleDateString()}</p>
              
              <div className="flex gap-2">
                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-xs font-bold py-2.5 rounded-xl border border-white/5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View
                </a>
                {res.type !== 'link' && (
                  <a 
                    href={res.url} 
                    download
                    className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {resources.length === 0 && !loading && (
        <div className="text-center py-20 opacity-30">
          <BookOpen className="w-16 h-16 mx-auto mb-4" />
          <p className="text-xl font-bold italic tracking-wider">No artifacts materialized yet.</p>
        </div>
      )}
    </div>
  );
};

export default Library;

import { BookOpen } from 'lucide-react';
