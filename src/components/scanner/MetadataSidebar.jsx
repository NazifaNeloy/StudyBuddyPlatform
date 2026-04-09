import React from 'react';
import { motion } from 'framer-motion';

const MetadataSidebar = ({ title, keywords, summary, onSave, onManualCorrection, circles = [], isSaving = false }) => {
  const [selectedCircleId, setSelectedCircleId] = React.useState('');
  const [editTitle, setEditTitle] = React.useState(title || '');
  const [localKeywords, setLocalKeywords] = React.useState(keywords || []);
  const [newKeyword, setNewKeyword] = React.useState('');

  React.useEffect(() => {
    if (title) setEditTitle(title);
    if (keywords) setLocalKeywords(keywords);
  }, [title, keywords]);

  React.useEffect(() => {
    // If circles exist but no circle is selected, and it's not currently the 'none' value
    if (circles.length > 0 && selectedCircleId === '') {
      // Default to personal vault or first circle? The user asked for personal data support.
      // We'll leave it as '' which represents Personal Vault.
    }
  }, [circles]);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !localKeywords.includes(newKeyword.trim())) {
      setLocalKeywords([...localKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  return (
    <div className="lg:col-span-4 space-y-8 h-full">
      {/* Metadata Bento Card */}
      <div className="bg-surface-container-low p-8 rounded-xl shadow-ref space-y-8 border border-white/40 group">
        <div>
          <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-3 font-label opacity-60">Target Study Circle</label>
          <select 
            className="w-full bg-white/70 backdrop-blur-sm border border-outline-variant/10 rounded-xl p-4 font-headline font-black text-primary focus:ring-2 focus:ring-primary/40 shadow-sm text-sm italic appearance-none"
            value={selectedCircleId}
            onChange={(e) => setSelectedCircleId(e.target.value)}
          >
            <option value="">None (Personal Vault)</option>
            {circles.map(circle => (
              <option key={circle.id} value={circle.id}>{circle.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-3 font-label opacity-60">Auto-Generated Title</label>
          <input 
            className="w-full bg-white/70 backdrop-blur-sm border border-outline-variant/10 rounded-xl p-4 font-headline font-black text-on-surface focus:ring-2 focus:ring-primary/40 shadow-sm text-sm italic outline-none" 
            type="text" 
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Biology: Cellular Energy Metabolism"
          />
        </div>
        
        <div>
          <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-4 font-label opacity-60">Neural Keywords Identified</label>
          <div className="flex flex-wrap gap-2">
            {localKeywords.map((tag, i) => (
              <span key={i} className="px-3 py-2 bg-secondary-container/20 text-on-secondary-container rounded-lg text-[10px] font-black font-label border border-secondary/10 shadow-sm transition-all hover:bg-secondary/10 cursor-pointer">
                #{tag}
              </span>
            ))}
            
            <div className="flex gap-1">
              <input 
                type="text"
                placeholder="New Term..."
                className="bg-transparent border-b border-dashed border-outline-variant text-[10px] font-bold w-20 outline-none p-1 placeholder:opacity-30"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <button 
                onClick={handleAddKeyword}
                className="px-2 py-1 border border-outline-variant border-dashed text-on-surface-variant rounded-lg text-[10px] font-black hover:bg-white transition-all"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-3 font-label opacity-60">AI Executive Summary</label>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 text-xs text-on-surface-variant italic leading-relaxed font-body border border-outline-variant/10 shadow-inner">
             {summary ? `"${summary}"` : "Neural matrix is ready for summarization."}
          </div>
        </div>
        
        <div className="pt-6 space-y-4">
          <button 
            onClick={() => onSave({ title: editTitle, circleId: selectedCircleId, keywords: localKeywords })}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-full font-headline font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 italic disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isSaving ? 'sync' : 'library_add'}
            </span>
            {isSaving ? 'Materializing...' : 'Save to Library'}
          </button>
          
          <button 
            onClick={onManualCorrection}
            className="w-full bg-surface-container-highest text-on-surface-variant py-4 rounded-full font-label font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-white border border-outline-variant/10"
          >
            <span className="material-symbols-outlined text-lg">edit_note</span>
            Manual Correction
          </button>
        </div>
      </div>

      {/* Smart Tip Card */}
      <div className="bg-tertiary/10 p-6 rounded-xl border border-tertiary/20 flex gap-4 shadow-sm group">
        <div className="text-tertiary">
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
        </div>
        <div>
          <h6 className="font-headline font-black text-on-tertiary-container text-xs uppercase tracking-tighter italic">Smart Tip</h6>
          <p className="text-[10px] text-on-tertiary-container/80 mt-1 font-body leading-relaxed font-medium">Scan two pages at once in landscape mode for faster processing. Gemini will automatically split them into separate digital entries.</p>
        </div>
      </div>

      {/* Collaborative Activity */}
      <div className="flex items-center -space-x-3 pt-4 px-2">
        {[1, 2, 3].map(n => (
          <div key={n} className="relative group">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n+40}`} 
              alt="User" 
              className="w-10 h-10 rounded-full border-4 border-background shadow-sm ring-1 ring-primary/10" 
            />
          </div>
        ))}
        <div className="w-10 h-10 rounded-full border-4 border-background bg-secondary-container flex items-center justify-center text-[10px] font-black text-on-secondary-container shadow-sm">
          +12
        </div>
        <span className="ml-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 italic">Students scanned notes today</span>
      </div>
    </div>
  );
};

export default MetadataSidebar;
