import React from 'react';
import { motion } from 'framer-motion';
import { Book, Calculator, Video, Smile, Zap } from 'lucide-react';
import asset_adnan from '../../assets/asset_adnan.png';
import asset_nusrat from '../../assets/asset_nusrat.png';
import asset_tanvir from '../../assets/asset_tanvir.png';

const CommunityHero = () => {
  return (
    <div className="bg-white pt-10 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Modern Copy with Coral Highlight */}
        <div className="lg:col-span-5 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-[72px] font-black font-heading leading-[1.05] mb-8 tracking-tight text-black">
              Study session<br/>more fun<br/>
              with{' '}
              <span className="relative inline-block mt-2">
                StudyBuddy
                {/* Hand-drawn Coral Loop SVG */}
                <motion.svg 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                  className="absolute -inset-x-8 -inset-y-4 w-[calc(100%+64px)] h-[calc(100%+32px)] text-[#FF5A36] opacity-90 pointer-events-none" 
                  viewBox="0 0 100 100" 
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M5,50 C5,20 95,20 95,50 C95,80 5,80 5,50 Z" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeDasharray="300" 
                  />
                  <path 
                    d="M10,45 C15,25 85,25 90,45 C95,65 15,75 10,50" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    opacity="0.6"
                  />
                </motion.svg>
              </span>
            </h1>
            
            <p className="text-[#555555] text-lg md:text-xl mb-12 leading-relaxed font-medium max-w-[480px] font-body">
              Connect with fellow students across Bangladesh. Join live study rooms, sync your Pomodoro timers, and ace your exams together.
            </p>
            
            <button className="bg-[#6C5CE7] text-white px-12 py-5 rounded-full font-black text-xl shadow-2xl hover:shadow-purple-500/30 transition-all active:scale-95 hover:-translate-y-1">
              Get Started
            </button>
          </motion.div>
        </div>

        {/* Right Side: High-Fidelity Mosaic Bubble Grid */}
        <div className="lg:col-span-7 relative h-[600px] mt-12 lg:mt-0 px-4">
          
          {/* Background Patterns (Grey Circles) */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-[10%] left-[20%] w-32 h-32 rounded-full bg-gray-200" />
            <div className="absolute top-[40%] left-[10%] w-48 h-48 rounded-full bg-gray-100" />
            <div className="absolute top-[60%] right-[10%] w-40 h-40 rounded-full bg-gray-200" />
            <div className="absolute bottom-[10%] left-[30%] w-24 h-24 rounded-full bg-gray-100" />
          </div>

          <div className="relative h-full w-full max-w-[600px] mx-auto">
            
            {/* Top-Left: Adnan (Laughing/Headphones) */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute top-[5%] left-[5%] z-20"
            >
              <div className="relative group">
                <div className="absolute -top-10 -right-4 z-30 transform hover:-rotate-12 transition-transform cursor-default">
                  <div className="bg-black text-white px-4 py-2 rounded-2xl shadow-xl font-black text-xs tracking-widest uppercase flex items-center gap-2">
                    LOL!! <Smile size={14} className="text-yellow-400" />
                  </div>
                </div>
                <div className="absolute -left-16 bottom-[10%] z-30 transform hover:rotate-6 transition-transform cursor-default">
                  <div className="bg-white border-2 border-gray-100 px-4 py-2 rounded-2xl shadow-lg font-black text-[#6C5CE7] text-xs tracking-tighter uppercase flex items-center gap-2">
                    🎧 BUET PREP?
                  </div>
                </div>
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-[6px] border-white shadow-2xl overflow-hidden">
                  <img src={asset_adnan} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Adnan" />
                </div>
              </div>
            </motion.div>

            {/* Top-Right: Nusrat (Focused/Laptop) */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute top-[10%] right-[5%] z-20"
            >
              <div className="relative group">
                <div className="absolute -top-6 -left-10 z-30 transform hover:rotate-12 transition-transform cursor-default">
                  <div className="bg-black text-white px-5 py-2 rounded-2xl shadow-xl font-black text-xs tracking-widest uppercase">
                    HAHA!
                  </div>
                </div>
                <div className="absolute -right-8 bottom-[20%] z-30">
                  <div className="w-16 h-16 bg-[#B8E1FF] rounded-[1.5rem] flex items-center justify-center shadow-lg border-2 border-white rotate-12">
                     <Zap size={24} className="text-[#6C5CE7]" />
                  </div>
                </div>
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-[6px] border-white shadow-2xl overflow-hidden">
                  <img src={asset_nusrat} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Nusrat" />
                </div>
              </div>
            </motion.div>

            {/* Bottom-Center: Tanvir (Thumbs Up) */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-[5%] left-[25%] z-20"
            >
              <div className="relative group">
                <div className="absolute -left-12 top-[10%] z-30">
                   <div className="w-16 h-16 bg-[#FFEADB] rounded-[1.5rem] flex items-center justify-center shadow-lg border-2 border-white -rotate-12">
                      <Calculator size={24} className="text-[#FF5A36]" />
                   </div>
                </div>
                <div className="absolute -right-16 top-[40%] z-30 transform hover:rotate-6 transition-transform cursor-default">
                  <div className="bg-black text-white px-5 py-2 rounded-2xl shadow-xl font-black text-xs tracking-widest uppercase">
                    NICE!
                  </div>
                </div>
                <div className="w-36 h-36 md:w-52 md:h-52 rounded-full border-[6px] border-white shadow-2xl overflow-hidden">
                  <img src={asset_tanvir} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Tanvir" />
                </div>
              </div>
            </motion.div>

            {/* Floating Pastel Elements & Icons */}
            <div className="absolute top-[45%] left-0 z-10 w-24 h-24 bg-[#FFF8D6] rounded-full opacity-60" />
            <div className="absolute top-[25%] right-[25%] z-10 w-32 h-32 bg-[#E0DAFF] rounded-full opacity-40" />
            
            {/* Book Icon Grid Element */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[40%] right-[10%] z-20"
            >
              <div className="w-20 h-20 bg-[#D6EFFF] rounded-[2rem] flex items-center justify-center shadow-xl border-4 border-white rotate-6">
                <Book className="text-[#6C5CE7] w-10 h-10" />
              </div>
            </motion.div>

            {/* "I WIN" Circle */}
            <div className="absolute bottom-[35%] right-[5%] z-20 transform -rotate-12">
              <div className="bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                 <span className="text-xs font-black uppercase tracking-widest">I SOLVED IT! 🧠</span>
              </div>
            </div>

            {/* "CHILL VIBES" Circle */}
            <div className="absolute top-[50%] left-[20%] z-20 transform rotate-12">
              <div className="bg-white border-2 border-gray-100 text-black px-6 py-3 rounded-full shadow-xl flex items-center gap-3 translate-y-10">
                 <span className="text-xs font-black uppercase tracking-widest text-[#555555]">CHILL VIBES</span>
                 <Video size={14} className="text-[#6C5CE7]" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHero;
