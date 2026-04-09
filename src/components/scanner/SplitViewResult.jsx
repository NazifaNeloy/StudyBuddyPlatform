import React from 'react';
import { motion } from 'framer-motion';

const SplitViewResult = ({ previewUrl, extractedText, confidence = 98.4, isEditing = false, editedText = '', onTextChange }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ref-xl border border-outline-variant/10 group mb-10 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        {/* Original Image Side */}
        <div className="relative border-r border-outline-variant/10 overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-black/5 flex items-center justify-center p-6"
          >
            <img 
              src={previewUrl} 
              alt="Original Scan" 
              className="w-full h-full object-contain shadow-2xl rounded-lg" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
               <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
               <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-white/20">Original Scan</span>
            </div>
          </motion.div>
        </div>

        {/* Extracted Text Side */}
        <div className="p-10 flex flex-col h-full bg-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-primary pointer-events-none">
             <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>draw</span>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${isEditing ? 'bg-primary' : 'bg-tertiary'} shadow-[0_0_10px_rgba(154,24,158,0.4)]`}></span>
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-label opacity-60 italic">
                {isEditing ? 'Neural Protocol: Manual Override' : 'Extracted Digital Insight'}
              </span>
            </div>
            {!isEditing && (
              <div className="bg-pastel-green px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-green-700 italic border border-green-200 shadow-sm">
                {confidence}% Confidence
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col font-body text-base leading-relaxed text-on-surface italic">
            {isEditing ? (
              <textarea
                value={editedText}
                onChange={(e) => onTextChange(e.target.value)}
                className="w-full h-full min-h-[400px] bg-surface-container-low/30 border border-outline-variant/10 rounded-2xl p-6 font-body text-sm italic focus:ring-2 focus:ring-primary/20 outline-none resize-none scrollbar-hide"
                placeholder="Synchronize neural data manually..."
              />
            ) : extractedText ? (
              <div className="overflow-y-auto max-h-[500px] pr-4 scrollbar-hide">
                <div dangerouslySetInnerHTML={{ __html: extractedText }} className="prose prose-sm prose-primary max-w-none" />
              </div>
            ) : (
              <div className="shimmer h-96 w-full rounded-2xl opacity-20" />
            )}
          </div>
          
          <div className="pt-8 border-t border-outline-variant/10 flex items-center justify-between mt-auto">
             <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Gemini Neural Matrix v4.2</p>
             <button 
              onClick={() => navigator.clipboard.writeText(isEditing ? editedText : extractedText)}
              className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest hover:underline transition-all active:scale-95"
             >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Copy Protocol
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitViewResult;
