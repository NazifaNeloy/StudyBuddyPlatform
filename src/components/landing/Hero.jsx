import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Book, Heart, Search, MousePointer2 } from 'lucide-react';
import iphoneImg from '../../assets/iphone_15.png';

const Hero = () => {
  const stickers = [
    { type: 'circle', color: 'bg-[#C1FF72]', text: 'STUDY HARD', pos: 'top-[8%] left-[12%]', rotate: -15, delay: 0 },
    { type: 'circle', color: 'bg-[#FFD6F3]', text: 'FOCUS NOW', pos: 'top-[15%] right-[10%]', rotate: 20, delay: 0.2 },
    { type: 'circle', color: 'bg-[#FFF8D6]', text: 'ACE EXAMS', pos: 'bottom-[15%] left-[8%]', rotate: 12, delay: 0.4 },
    { type: 'pill', icon: <Heart size={18} />, label: 'Group Study', pos: 'top-[45%] right-[15%]', rotate: -12, delay: 0.6, color: 'bg-white' },
    { type: 'pill', icon: <Coffee size={18} />, label: 'Coffee Break', pos: 'bottom-[25%] right-[12%]', rotate: 10, delay: 0.8, color: 'bg-white' },
    { type: 'pill', icon: <Book size={18} />, label: 'Exam Prep', pos: 'bottom-[40%] left-[15%]', rotate: -8, delay: 1.0, color: 'bg-white' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-lime">
      {/* 1. The Hero "Sticker" Section (Top) */}
      <section className="relative w-full h-[85vh] bg-[#F2EFE9] flex items-center justify-center overflow-hidden px-6">
        {/* Floating Stickers Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {stickers.map((s, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotate: s.rotate,
                y: [0, -10, 0] 
              }}
              transition={{ 
                type: 'spring', 
                delay: 0.2 + s.delay,
                y: {
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className={`absolute ${s.pos} z-10`}
            >
              {s.type === 'circle' ? (
                <div className={`w-36 h-36 rounded-full border-2 border-black sticker-shadow ${s.color} flex items-center justify-center relative`}>
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow">
                    <path id={`circlePath-${i}`} d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                    <text className="text-[9px] uppercase font-black tracking-[0.15em] fill-black">
                      <textPath xlinkHref={`#circlePath-${i}`}>{s.text} • {s.text} • {s.text} • </textPath>
                    </text>
                  </svg>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-black/10">
                    <div className="w-6 h-6 bg-black/10 rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-black rounded-full px-6 py-3 flex items-center gap-3 sticker-shadow">
                  {s.icon}
                  <span className="text-xs font-black uppercase tracking-widest">{s.label}</span>
                </div>
              )}
            </motion.div>
          ))}

          {/* Hand-drawn flourish (SVG Swirl Simple Loop) */}
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="absolute top-[20%] left-[25%] w-64 h-64 text-black opacity-30 -rotate-12 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M10,60 C25,20 60,30 50,55 C40,80 80,60 90,40"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </motion.svg>
        </div>

        {/* Central iPhone Mockup */}
        <div className="relative z-20 w-full max-w-[320px] aspect-[9/19.5]">
          <img src={iphoneImg} alt="iPhone 15 Pro mockup" className="w-full h-full object-contain pointer-events-none drop-shadow-2xl" />
          
          {/* App Screen Content Overlay */}
          <div className="absolute inset-[3.5%] top-[2.5%] bottom-[2.5%] rounded-[3rem] overflow-hidden bg-white px-5 pt-12">
             <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-lavender border-2 border-black flex items-center justify-center font-black text-xs uppercase shadow-sm">SB</div>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border border-black/10" />
             </div>

             {/* Lime Green Card */}
             <div className="bg-[#C1FF72] p-5 rounded-[2.5rem] mb-4 border-2 border-black sticker-shadow">
                <h3 className="text-xl font-black leading-[1.1] mb-2 tracking-tight">What are we<br/>studying next?</h3>
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white border-2 border-white/20">
                  <Search size={16} />
                </div>
             </div>

             {/* Search Bar */}
             <div className="bg-gray-50 border border-black/5 rounded-full py-4 px-5 flex items-center gap-3 mb-6 shadow-inner">
                <Search size={14} className="text-gray-300" />
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Search a subject...</span>
             </div>

             {/* Upcoming Sessions Cards */}
             <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 opacity-40 px-1">Upcoming Focus</h4>
             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
                {[
                  { color: 'bg-[#E0DAFF]', title: 'CSE342 Recap' },
                  { color: 'bg-[#B8E1FF]', title: 'IELTS Prep' },
                  { color: 'bg-[#FFF8D6]', title: 'SQL Queries' },
                ].map((card, idx) => (
                  <div key={idx} className={`${card.color} min-w-[130px] h-36 rounded-3xl p-5 border-2 border-black sticker-shadow flex flex-col justify-between transition-transform hover:scale-105 active:scale-95 cursor-pointer`}>
                    <div className="w-7 h-7 rounded-lg bg-white/40 border border-black/10 shadow-sm" />
                    <span className="text-[10px] font-black leading-tight uppercase tracking-tight">{card.title}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 2. The Brand Identity Section (Middle Branding Layout) */}
      <section className="bg-white pt-8 pb-32 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start gap-8 relative overflow-visible">
        <div className="flex-1 relative flex flex-col items-start">
           <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] mb-4 block opacity-40 text-left">Your new study friend,</span>
           
          <div className="relative inline-block mt-4">
             <h1 className="text-fluid-huge leading-[0.75] font-black font-sans tracking-[-0.06em] text-black">
               buddy
             </h1>
             {/* Underline on 'y' - Thick Black Horizontal Bar */}
             <div className="absolute right-[0.04em] bottom-[0.12em] w-[0.42em] h-[15px] md:h-[30px] bg-black rounded-sm" />
             
             {/* App Icon Square - Overlapping bottom right with better offset */}
             <motion.div 
               whileHover={{ scale: 1.05, rotate: 2 }}
               className="absolute bottom-[-15px] right-[-15px] md:bottom-[-60px] md:right-[-50px] w-20 h-20 md:w-56 md:h-56 bg-brand-lavender rounded-[1.5rem] md:rounded-[4rem] flex items-center justify-center border-4 md:border-[12px] border-white shadow-2xl z-30"
             >
               <span className="text-xl md:text-6xl font-black text-white lowercase">buddy</span>
             </motion.div>
           </div>
        </div>

        {/* 3. Technical Metadata Column (Right Side) */}
        <div className="w-full md:w-72 pt-12 md:pt-48 text-left border-black/5">
           <div className="space-y-4 mb-24">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-40">Project Overview</div>
              {[
                { label: 'Location', val: 'Bangladesh' },
                { label: 'Project', val: 'StudyBuddy' },
                { label: 'Release', val: 'Spring 2026' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] md:text-xs font-bold uppercase tracking-widest border-b border-black/5 pb-2">
                  <span className="opacity-30">{item.label}</span>
                  <span className="text-black">{item.val}</span>
                </div>
              ))}
           </div>

           <div className="max-w-[240px] border-l-2 border-brand-lime pl-6 py-2">
             <p className="text-sm md:text-base font-bold leading-snug text-black/40 italic tracking-tight">
               "Empowering collaborative growth through localized toolsets."
             </p>
           </div>
        </div>
      </section>

      {/* 4. The Footer Description (Bottom) */}
      <section className="bg-white pb-64 px-6 md:px-12 max-w-7xl mx-auto w-full">
         <p className="text-2xl md:text-[52px] leading-[1.05] font-black text-left text-black/10 tracking-[-0.03em] max-w-4xl hover:text-black/80 transition-colors duration-700">
            Streamline your academic journey with our app, offering seamless session booking, personalized resource recommendations, and real-time updates for hassle-free learning across the country.
         </p>
      </section>
    </div>
  );
};

export default Hero;
