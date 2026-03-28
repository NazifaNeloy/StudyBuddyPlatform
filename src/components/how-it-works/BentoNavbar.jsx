import React from 'react';
import { motion } from 'framer-motion';

const BentoNavbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-8 bg-[#FDFCF8] max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
        <div className="w-10 h-10 md:w-12 md:h-12 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110">
          <img src="/src/assets/logo.png" alt="StudyBuddy Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-xl md:text-2xl font-black font-heading tracking-tight italic text-black">StudyBuddy</span>
      </div>

      <div className="hidden md:flex items-center gap-12 text-sm font-bold opacity-60">
        <a href="/how-it-works" className="hover:opacity-100 transition-opacity">How it works</a>
        <a href="#about" className="hover:opacity-100 transition-opacity">About</a>
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-transparent border border-gray-200 text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-50 transition-all">
          Login
        </button>
        <button className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95">
          Sign up
        </button>
      </div>
    </nav>
  );
};

export default BentoNavbar;
