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
    <section className="px-6 md:px-12 py-12 md:py-16 bg-white max-w-7xl mx-auto w-full relative overflow-hidden flex flex-col items-center">
      
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
        className="bg-black text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] z-20 mb-8"
      >
        Get Instant Access
      </motion.button>

      {/* Bottom Mockup & Floating Cards Area */}
      <div className="relative w-full max-w-5xl mx-auto flex justify-center mt-4 h-[500px]">
        
        {/* Center Descriptive Anchor Card */}
        <div className="relative z-20 w-[280px] md:w-[320px] h-[500px] mt-10">
          <div className="w-full h-full bg-white border border-gray-100 rounded-[3rem] shadow-2xl p-8 flex flex-col items-center justify-between relative overflow-hidden">
             
             {/* Decorative Background Ring */}
             <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[250px] h-[250px] border-[30px] border-pink-50 rounded-full -z-10" />

             <div className="text-center mt-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner border border-white">
                  🔥
                </div>
                <h3 className="text-2xl font-black font-heading text-gray-800">Your 30-Day<br/>Masterplan</h3>
                <p className="text-gray-400 text-sm mt-3 font-medium">Build an unbreakable focus streak</p>
             </div>

             {/* Mock Progress UI */}
             <div className="w-full bg-gray-50 rounded-3xl p-6 mt-8 flex-1 flex flex-col justify-center border border-gray-100">
                <div className="flex justify-between items-end mb-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Target</span>
                      <span className="text-xl font-black">100 hrs</span>
                   </div>
                   <div className="w-12 h-12 rounded-full border-4 border-black/5 flex items-center justify-center text-xs font-bold text-gray-400">
                      80%
                   </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '80%' }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full bg-black rounded-full"
                   />
                </div>
             </div>

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
