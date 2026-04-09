import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CircleGrid = ({ circles }) => {
  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-2xl font-black font-headline tracking-tighter uppercase italic text-on-background">Active Study Circles</h3>
          <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Your Collaborative Hubs</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/circles" className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">View All</Link>
          <button 
            onClick={() => {
              // This relies on the parent Dashboard having the modal state.
              // Actually, I should probably pass the setter as a prop or use a custom event.
              window.dispatchEvent(new CustomEvent('openCreateCircle'));
            }}
            className="p-3 bg-brand-black text-white rounded-xl shadow-lg hover:bg-brand-purple transition-all flex items-center justify-center"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(circles || []).map((circle, idx) => (
          circle && (
          <div 
            key={circle.id || `fallback-circle-${idx}`}
            className="bg-surface-container-lowest p-6 rounded-lg shadow-ref group hover:-translate-y-1 transition-all border border-black/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-secondary-container/10 p-2.5 rounded-xl border border-secondary-container/20">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {idx % 2 === 0 ? 'science' : 'menu_book'}
                </span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-tertiary bg-tertiary-fixed/30 px-2.5 py-1 rounded-full">
                {idx === 0 ? 'Live Now' : 'Neural Active'}
              </span>
            </div>

            <h4 className="text-lg font-black font-headline tracking-tighter uppercase italic text-on-background mb-1">
              {circle.name}
            </h4>
            <p className="text-[11px] font-medium text-on-surface-variant mb-6 line-clamp-2">
              {circle.description || 'Neural Study Protocol: Focus active for high-level synchronization and learning.'}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2.5">
                {[...Array(3)].map((_, i) => (
                  <img 
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${circle.id + i}`} 
                    alt="Avatar" 
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110" 
                  />
                ))}
                <div className="w-9 h-9 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-black text-on-surface-variant">
                  +{circle.members || 5}
                </div>
              </div>
              
              <Link 
                to={`/focus/${circle.id}`}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20"
              >
                Join Room
              </Link>
            </div>
          </div>
          )
        ))}

        {circles.length === 0 && (
          <div className="col-span-2 py-16 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center opacity-40">
             <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
             <p className="font-black italic uppercase tracking-tighter text-xl">No active protocols detected</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CircleGrid;
