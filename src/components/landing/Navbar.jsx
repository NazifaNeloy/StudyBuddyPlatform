import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-6 bg-transparent border-b border-gray-100 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-purple rounded-xl transform rotate-12 flex items-center justify-center">
          <span className="text-white font-black text-xl md:text-2xl font-heading -rotate-12 italic">SB</span>
        </div>
        <span className="text-xl md:text-2xl font-black font-heading tracking-tight italic">StudyBuddy</span>
      </div>

      <div className="hidden md:flex items-center gap-10">
        {['About', 'Features', 'Leaderboard', 'Groups'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold hover:text-brand-purple transition-colors">
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-sm font-bold hover:opacity-70">Log in</button>
        <button className="bg-brand-purple text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-black text-sm md:text-base hover:shadow-lg hover:shadow-brand-purple/20 transition-all active:scale-95 shadow-brutal">
          Join for Free
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
