import React from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, MousePointer2, Share2, Timer } from 'lucide-react';

const BentoHero = () => {
  return (
    <section className="px-6 md:px-12 pt-16 pb-32 max-w-7xl mx-auto w-full bg-[#FDFCF8]">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[10px] md:text-xs uppercase font-black tracking-[0.2em] text-gray-400 mb-6 block">
          Collaborative studying in minutes
        </span>
        <h1 className="text-5xl md:text-8xl font-black font-heading leading-tight tracking-tighter max-w-4xl mx-auto">
          One group is all it takes to excel.
        </h1>
        
        {/* Search Bar (Pill in Pill) */}
        <div className="relative w-full max-w-2xl mx-auto mt-12 bg-white rounded-full p-2 shadow-xl border border-gray-100 flex items-center">
          <div className="pl-6 flex-1 flex items-center gap-3">
             <Search className="w-5 h-5 text-gray-300" />
             <input 
               type="text" 
               placeholder="Enter your course code (e.g., CSE342)..." 
               className="w-full bg-transparent outline-none font-bold text-sm md:text-base placeholder:text-gray-300"
             />
          </div>
          <button className="bg-black text-white px-8 py-4 rounded-full font-black text-sm md:text-base hover:opacity-90 active:scale-95 transition-all">
            Find Group
          </button>
        </div>
      </div>

      {/* Bento Grid (Asymmetric) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
        {/* Card 1: Find a Partner (Yellow) */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-4 bg-bento-yellow squircle p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="text-2xl font-black font-heading">Find a Partner</div>
          <div className="relative z-10">
             <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between border border-white/50">
                <span className="text-xs font-bold text-black/50 italic">Sumon H...</span>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                  <ArrowRight className="w-4 h-4" />
                </div>
             </div>
          </div>
          <motion.div 
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-10 right-10 opacity-20"
          >
            <MousePointer2 className="w-16 h-16" fill="black" />
          </motion.div>
        </motion.div>

        {/* Card 2: Create a Focus Group (Mint Green, Tall) */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-4 md:row-span-2 bg-bento-green squircle p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="text-2xl md:text-3xl font-black font-heading mb-12 text-center leading-tight">Create a<br />Focus Group</div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="w-48 h-64 bg-white/30 border border-white/50 rounded-[2rem] p-4 flex flex-col gap-4 relative">
               {[
                 { name: 'Adiba R.', src: 'https://ui-avatars.com/api/?name=Adiba+R&background=FFB8D6&bold=true' },
                 { name: 'Zubayer F.', src: 'https://ui-avatars.com/api/?name=Zubayer+F&background=D6EFFF&bold=true' },
                 { name: 'Sumi A.', src: 'https://ui-avatars.com/api/?name=Sumi+A&background=D6FFE4&bold=true' }
               ].map((user, i) => (
                 <div key={user.name} className="flex items-center gap-3">
                    <img src={user.src} className="w-10 h-10 rounded-full border-2 border-white" alt="avatar" />
                    <div className="h-2 w-16 bg-black/10 rounded-full" />
                 </div>
               ))}
               
               <div className="mt-auto">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">+</div>
               </div>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-full bg-white/20 -rotate-45 -z-10" />
        </motion.div>

        {/* Card 3: Share Resources (Lavender) */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-4 bg-bento-lavender squircle p-8 md:p-10 flex flex-col justify-between relative overflow-hidden"
        >
           <div className="text-2xl font-black font-heading">Share Resources</div>
           <div className="bg-white/30 backdrop-blur-md rounded-2xl h-40 border border-white/50 p-6">
              <Share2 className="w-8 h-8 mb-4 rotate-12" />
              <div className="space-y-2">
                 <div className="h-2 w-full bg-black/10 rounded-full" />
                 <div className="h-2 w-[70%] bg-black/10 rounded-full" />
              </div>
           </div>
        </motion.div>

        {/* Card 4: Sync Pomodoro (Blue) */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-5 bg-bento-blue squircle p-8 md:p-10 flex items-center justify-between relative overflow-hidden"
        >
           <div>
              <div className="text-2xl font-black font-heading mb-6">Sync your<br />Pomodoro</div>
              <button className="bg-black text-white px-8 py-3 rounded-full font-black text-xs hover:opacity-80 transition-all">
                Connect
              </button>
           </div>
           
           <div className="relative group">
              <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="w-24 h-24 md:w-32 md:h-32 border-4 border-dashed border-black/10 rounded-full flex items-center justify-center"
              >
                 <Timer className="w-12 h-12 opacity-30" />
              </motion.div>
              <div className="absolute top-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white shadow-lg">+</div>
           </div>
        </motion.div>
        
        {/* Fillers for layout feel */}
        <div className="md:col-span-3 bg-white border border-gray-100 squircle flex items-center justify-center text-4xl p-8 hover:bg-gray-50 transition-colors cursor-pointer">
           📚
        </div>
      </div>
    </section>
  );
};

export default BentoHero;
