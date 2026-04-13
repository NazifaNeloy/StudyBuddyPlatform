import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const LibraryUploadZone = ({ onFileSelect, isUploading }) => {
  const fileInputRef = useRef(null);

  const handleBrowseClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const syntheticEvent = { target: { files } };
      onFileSelect(syntheticEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="md:col-span-12 lg:col-span-4 h-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="bg-white rounded-xl border-4 border-dashed border-primary-container/30 p-10 h-full flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all relative overflow-hidden"
      >
        {/* Hidden real file input - only triggered programmatically */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileSelect}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3,.txt"
          className="hidden"
        />

        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-ref-sm">
          {isUploading ? (
            <span className="material-symbols-outlined text-primary text-5xl animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
          )}
        </div>

        <h3 className="text-2xl font-black text-on-surface mb-3 italic uppercase tracking-tighter">
          {isUploading ? 'Uploading...' : 'Manifest Protocols'}
        </h3>
        <p className="text-[10px] text-on-surface-variant font-label font-bold uppercase tracking-widest opacity-60 mb-8 max-w-[200px]">
          Drop your files here <br/> or click below (PDF, JPG, PNG & DOCX up to 100MB)
        </p>

        <button
          type="button"
          onClick={handleBrowseClick}
          disabled={isUploading}
          className="bg-primary text-white font-label font-black py-4 px-10 rounded-full hover:bg-primary-dim transition-all shadow-sm text-[10px] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed z-10 relative"
        >
          {isUploading ? 'Uploading...' : 'Browse Files'}
        </button>

        <div className="mt-10 pt-10 border-t border-outline-variant/10 w-full grid grid-cols-3 gap-4 relative z-10">
          <button
            type="button"
            className="flex flex-col items-center gap-2 p-3 hover:bg-surface-container-low rounded-xl transition-all group/btn"
          >
            <span className="material-symbols-outlined text-secondary text-2xl group-hover/btn:scale-110 transition-transform">link</span>
            <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 group-hover/btn:opacity-100 transition-opacity">Link</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-2 p-3 hover:bg-surface-container-low rounded-xl transition-all group/btn"
          >
            <span className="material-symbols-outlined text-tertiary text-2xl group-hover/btn:scale-110 transition-transform">description</span>
            <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 group-hover/btn:opacity-100 transition-opacity">Note</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-2 p-3 hover:bg-surface-container-low rounded-xl transition-all group/btn"
          >
            <span className="material-symbols-outlined text-primary text-2xl group-hover/btn:scale-110 transition-transform">add_to_drive</span>
            <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 group-hover/btn:opacity-100 transition-opacity">Drive</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryUploadZone;
