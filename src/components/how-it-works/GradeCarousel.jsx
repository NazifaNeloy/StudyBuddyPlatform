import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Trophy, Sparkles } from 'lucide-react';

import iphoneImg from '../../assets/iphone_15.png';
import asset_anika from '../../assets/asset_anika.png';
import asset_tanvir from '../../assets/asset_tanvir.png';
import asset_nusrat from '../../assets/asset_nusrat.png';
import asset_boy from '../../assets/asset_hero_boy.png';

const GradeCarousel = () => {
  return (
    <section className="px-6 md:px-12 py-32 bg-white max-w-7xl mx-auto w-full relative overflow-hidden flex flex-col items-center">
      
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-pink-100/40 rounded-full blur-[100px] -z-10" />

      {/* Top Social Proof Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10 z-10">
        
        {/* Built by Pill */}
        <div className="bg-[#FFF5ED] border border-orange-100 rounded-full py-1.5 px-3 flex items-center gap-2 shadow-sm">
          <img src={asset_boy} alt="Creator" className="w-5 h-5 rounded-full object-cover" />
          <span className="text-xs font-medium text-orange-900/70">Built by StudyBuddy Team</span>
        </div>

        {/* Students Love It Pill */}
        <div className="bg-[#F8EFFF] border border-purple-100 rounded-full py-1.5 px-3 flex items-center gap-2 shadow-sm">
          <span className="text-xs font-medium text-purple-900/70">5,000+ students love it!</span>
          <div className="flex -space-x-2">
            <img src={asset_anika} alt="Student" className="w-5 h-5 rounded-full border-2 border-[#F8EFFF] object-cover" />
            <img src={asset_tanvir} alt="Student" className="w-5 h-5 rounded-full border-2 border-[#F8EFFF] object-cover" />
            <img src={asset_nusrat} alt="Student" className="w-5 h-5 rounded-full border-2 border-[#F8EFFF] object-cover" />
          </div>
        </div>

      </div>

      {/* Massive Headline */}
      <div className="text-center z-10 mb-16 relative">
        <h2 className="text-5xl md:text-7xl lg:text-[85px] font-bold font-heading text-black leading-[1.1] tracking-tight">
          Improve your grades in<br/>
          <span className="relative inline-block mt-2">
            <span className="relative z-10">months</span>
            {/* Thick Red Strikethrough Line */}
            <div className="absolute top-1/2 left-[-5%] w-[110%] h-3 md:h-4 bg-[#FF6B6B] -translate-y-[40%] z-20 opacity-90 rounded-full" />
          </span>
          {" "}weeks
        </h2>
      </div>

      {/* CTA Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-black text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] z-20 mb-20"
      >
        Get Instant Access
      </motion.button>

      {/* Bottom Mockup & Floating Cards Area */}
      <div className="relative w-full max-w-5xl mx-auto flex justify-center mt-12 h-[500px]">
        
        {/* Center Phone Mockup */}
        <div className="relative z-20 w-[280px] md:w-[320px] h-[600px]">
          <img src={iphoneImg} alt="App Interface" className="w-full h-full object-cover drop-shadow-2xl" />
          
          {/* Mock Inner Screen (Bar Chart) */}
          <div className="absolute top-[3%] left-[4.5%] right-[4.5%] bottom-[4%] bg-white rounded-[2.5rem] -z-10 overflow-hidden flex flex-col pt-16 px-6">
            <div className="w-full flex items-end justify-between h-48 gap-3 mt-10">
               <div className="w-full bg-pink-200 rounded-t-md h-[40%]" />
               <div className="w-full bg-pink-200 rounded-t-md h-[70%]" />
               <div className="w-full bg-pink-200 rounded-t-md h-[30%]" />
               <div className="w-full bg-pink-200 rounded-t-md h-[80%]" />
               <div className="w-full bg-pink-200 rounded-t-md h-[55%]" />
            </div>
            {/* Chart line overlay */}
            <svg className="absolute top-[30%] left-0 w-full h-[30%] text-pink-400 opacity-70" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10,20 L30,80 L50,60 L70,90 L90,30" />
              <circle cx="10" cy="20" r="2" fill="white" strokeWidth="2"/>
              <circle cx="30" cy="80" r="2" fill="white" strokeWidth="2"/>
              <circle cx="50" cy="60" r="2" fill="white" strokeWidth="2"/>
              <circle cx="70" cy="90" r="2" fill="white" strokeWidth="2"/>
              <circle cx="90" cy="30" r="2" fill="white" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* Floating Pastel Cards */}
        
        {/* Top Left - Green */}
        <motion.div 
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:flex absolute top-10 left-0 w-[240px] bg-[#E8F8E8] border border-[#C5EBCE] rounded-2xl p-5 flex-col shadow-lg z-30"
        >
          <div className="w-8 h-8 bg-[#C5EBCE] rounded flex items-center justify-center text-green-700 mb-3">
             <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-lg text-green-900 mb-1">Day 1</h3>
          <p className="text-green-800 text-sm opacity-80 leading-snug">
            Join your first study circle & set your goals
          </p>
        </motion.div>

        {/* Bottom Left - Pink */}
        <motion.div 
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:flex absolute bottom-20 left-10 w-[240px] bg-[#FFEBEB] border border-[#FFD0D0] rounded-2xl p-5 flex-col shadow-lg z-30"
        >
          <div className="w-8 h-8 bg-[#FFD0D0] rounded flex items-center justify-center text-red-700 mb-3">
             <Target className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-lg text-red-900 mb-1">Day 4</h3>
          <p className="text-red-800 text-sm opacity-80 leading-snug">
            Track your focus sessions perfectly
          </p>
        </motion.div>

        {/* Top Right - Yellow */}
        <motion.div 
          animate={{ y: [-4, 6, -4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:flex absolute top-20 right-0 w-[240px] bg-[#FFF8E1] border border-[#FFE082] rounded-2xl p-5 flex-col shadow-lg z-30"
        >
          <div className="w-8 h-8 bg-[#FFE082] rounded flex items-center justify-center text-yellow-700 mb-3">
             <Trophy className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-lg text-yellow-900 mb-1">Day 9</h3>
          <p className="text-yellow-800 text-sm opacity-80 leading-snug">
            Climb the leaderboard with your friends
          </p>
        </motion.div>

        {/* Bottom Right - Blue */}
        <motion.div 
          animate={{ y: [6, -4, 6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:flex absolute bottom-10 right-10 w-[240px] bg-[#E8EFFF] border border-[#C5D5FB] rounded-2xl p-5 flex-col shadow-lg z-30"
        >
          <div className="w-8 h-8 bg-[#C5D5FB] rounded flex items-center justify-center text-blue-700 mb-3">
             <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-lg text-blue-900 mb-1">Day 14</h3>
          <p className="text-blue-800 text-sm opacity-80 leading-snug">
            Ace your upcoming exams together!
          </p>
        </motion.div>

      </div>

    </section>
  );
};

export default GradeCarousel;
