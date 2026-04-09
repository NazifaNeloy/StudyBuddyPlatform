import React from 'react';
import { motion } from 'framer-motion';

const ResourceCard = ({ resource, index }) => {
  const { title, type, created_at, url } = resource;
  
  const getCategoryStyles = (type) => {
    switch (type) {
      case 'image': return { border: 'border-pastel-pink', icon: 'image', color: 'text-red-500', bg: 'bg-pastel-pink' };
      case 'link': return { border: 'border-pastel-yellow', icon: 'link', color: 'text-orange-500', bg: 'bg-pastel-yellow' };
      case 'video': return { border: 'border-secondary-container', icon: 'video_library', color: 'text-secondary', bg: 'bg-secondary-container' };
      default: return { border: 'border-primary', icon: 'picture_as_pdf', color: 'text-primary', bg: 'bg-surface-container-low' };
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-surface-container-lowest p-6 rounded-2xl border-l-[6px] ${styles.border} shadow-ref-sm hover:shadow-ref transition-all group relative h-full flex flex-col`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className={`w-14 h-14 ${styles.bg} rounded-xl flex items-center justify-center ${styles.color} group-hover:scale-110 transition-transform shadow-sm`}>
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{styles.icon}</span>
        </div>
        <button className="text-on-surface-variant hover:text-primary p-2 opacity-40 hover:opacity-100 transition-all">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      <div className="flex-1">
        <h4 className="font-headline font-black text-lg text-on-surface mb-2 group-hover:text-primary transition-colors leading-tight italic tracking-tighter uppercase truncate">
          {title}
        </h4>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`bg-secondary-container/20 text-on-secondary-container text-[8px] px-2 py-1 rounded-md font-black uppercase tracking-wider font-label ${resource.study_circles?.name ? 'opacity-60' : 'opacity-30'}`}>
            {resource.study_circles?.name || 'Personal Artifact'}
          </span>
          <span className="bg-surface-container-highest text-on-surface-variant text-[8px] px-2 py-1 rounded-md font-black uppercase tracking-wider font-label opacity-60">
            {formatSize(resource.file_size)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10 text-[9px] font-label font-bold text-on-surface-variant uppercase tracking-widest opacity-40">
        <span>Uploaded {new Date(created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        <div className="flex -space-x-3">
          {[1, 2].map(n => (
            <div key={n} className="w-8 h-8 rounded-full border-2 border-surface-container-lowest overflow-hidden shadow-sm">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n + index}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          ))}
          {index % 3 === 0 && (
             <div className="w-8 h-8 rounded-full bg-primary-container text-[8px] font-black flex items-center justify-center border-2 border-surface-container-lowest">+4</div>
          )}
        </div>
      </div>
      
      {/* Download Action Hover */}
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute inset-0 z-10 cursor-pointer"
      />
    </motion.div>
  );
};

export default ResourceCard;
