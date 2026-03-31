import React from 'react';
import { motion } from 'framer-motion';

const UploadZone = ({ onFileSelect, selectedFile, previewUrl }) => {
  return (
    <div className="relative group cursor-pointer">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-xl p-12 md:p-20 flex flex-col items-center justify-center text-center transition-all hover:border-primary group-hover:bg-white/50">
        <input 
          type="file" 
          onChange={onFileSelect} 
          className="absolute inset-0 opacity-0 cursor-pointer z-20" 
          accept="image/*,application/pdf"
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
             <div className="w-32 h-32 rounded-2xl bg-white shadow-ref border border-outline-variant/20 flex items-center justify-center overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
             </div>
             <div>
                <h4 className="text-xl font-black font-headline uppercase italic tracking-tighter text-primary">{selectedFile.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mt-1">Artifact Ready for Extraction</p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-primary-container/20 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>add_a_photo</span>
            </div>
            <h4 className="text-2xl font-black font-headline uppercase italic tracking-tighter mb-4">Initialize Artifact</h4>
            <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest opacity-60 mb-8">Drop your notebook photos here <br/> (PNG, JPG, or PDF up to 20MB)</p>
            <button className="bg-surface-container-highest text-primary px-10 py-4 rounded-full font-label font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
              Select from Device
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadZone;
