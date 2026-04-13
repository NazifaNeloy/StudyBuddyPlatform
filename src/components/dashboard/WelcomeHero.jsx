import React from 'react';
import { motion } from 'framer-motion';

const WelcomeHero = ({ userName, streak, focusHours }) => {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary-dim rounded-xl p-8 md:p-12 overflow-hidden shadow-2xl">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white font-headline tracking-tighter mb-4 leading-tight">
            Hey {userName || 'Scholar'}! Ready to crush your <span className="text-brand-lime underline decoration-brand-lime/30 underline-offset-8">Neural Protocols</span> today?
          </h2>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20 hover:scale-105 transition-transform">
              <p className="text-xs font-label uppercase text-white/70 tracking-widest font-bold">Study Streak</p>
              <p className="text-2xl font-headline font-black text-brand-lime">{streak || 0} Days</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20 hover:scale-105 transition-transform">
              <p className="text-xs font-label uppercase text-white/70 tracking-widest font-bold">Focus Hours</p>
              <p className="text-2xl font-headline font-black text-brand-skyblue">{focusHours || 0}h</p>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block relative group">
          <div className="w-48 h-48 rounded-full bg-primary-container flex items-center justify-center border-8 border-white/10 shadow-inner overflow-hidden transform rotate-6 group-hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://api.dicebear.com/7.x/shapes/svg?seed=atheneum" 
              alt="Decorative Shape" 
              className="w-[80%] h-[80%] opacity-40 animate-float" 
            />
          </div>
          <div className="absolute -top-4 -right-4 bg-brand-lime text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-bounce">
            Active Now
          </div>
        </div>
      </div>

      {/* Abstract Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-container/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
    </section>
  );
};

export default WelcomeHero;
