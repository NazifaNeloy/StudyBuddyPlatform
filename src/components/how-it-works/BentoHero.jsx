import React from 'react';
import { motion } from 'framer-motion';
import { Search, Link, Users, Sparkles, Video, Plus, Link2, Download, Bell, UserPlus } from 'lucide-react';

import asset_hero_boy from '../../assets/asset_hero_boy.png';
import asset_anika from '../../assets/asset_anika.png';
import asset_tanvir from '../../assets/asset_tanvir.png';
import asset_siam from '../../assets/asset_siam.png';
import asset_nusrat from '../../assets/asset_nusrat.png';

const BentoHero = () => {
  return (
    <section className="px-6 md:px-12 pt-16 pb-12 md:pb-16 max-w-[1400px] mx-auto w-full bg-[#FDFCF8]">
      
      {/* Header Section */}
      <div className="text-center mb-16">
        <span className="text-[12px] font-bold text-gray-500 mb-4 block">
          Collaborative studying in minutes using AI-powered tools.
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold font-heading leading-[1.1] tracking-tight max-w-4xl mx-auto text-black">
          One group is all it takes<br/>to excel.
        </h1>
        
        {/* Main Search Bar */}
        <div className="relative w-full max-w-3xl mx-auto mt-12 bg-white rounded-full p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center">
          <div className="pl-6 flex-1 flex items-center gap-3">
             <Link className="w-5 h-5 text-gray-400" />
             <input 
               type="text" 
               placeholder="Drop your course invite link..." 
               className="w-full bg-transparent outline-none font-medium text-sm md:text-base placeholder:text-gray-400 text-black"
             />
          </div>
          <button className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm md:text-base hover:opacity-90 transition-all">
            Join Circle
          </button>
        </div>
      </div>

      {/* 3-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] max-w-6xl mx-auto">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6 row-span-2">
          
          {/* Top Left: Yellow Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex-1 bg-[#FDE25A] rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group border border-transparent hover:border-black/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center">
                <Link2 className="w-3 h-3 text-black" />
              </div>
              <span className="font-bold text-lg text-black">Join via Link</span>
            </div>
            
            {/* Swirly Arrow SVG */}
            <svg className="absolute top-[30%] right-[30%] w-16 h-16 text-white stroke-white rotate-12" viewBox="0 0 100 100" fill="none">
              <path d="M10,10 Q50,10 50,50 T90,90" strokeWidth="3" strokeLinecap="round" />
              <path d="M70,90 L90,90 L90,70" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Inner Pill */}
            <div className="bg-white/40 backdrop-blur-md rounded-full p-2 mt-auto border border-white/50 flex items-center shadow-sm">
              <div className="pl-4 flex-1 flex items-center gap-2">
                <Link className="w-3 h-3 text-black/40" />
                <span className="text-[10px] font-bold text-black/40">Paste invite link...</span>
              </div>
              <div className="bg-black text-white text-[10px] font-bold px-4 py-2 rounded-full">Explore</div>
            </div>

            {/* Decorative background curve */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 border-[20px] border-black/5 rounded-full pointer-events-none" />
          </motion.div>

          {/* Bottom Left: Light Blue Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex-1 bg-[#C4EDFB] rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group border border-transparent hover:border-black/5"
          >
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3 text-black" />
              </div>
              <span className="font-bold text-lg text-black">Find Partner</span>
            </div>

            <div className="relative z-10 flex justify-center mt-auto">
              {/* Profile Card Mockup */}
              <div className="w-full bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/50 flex gap-4 h-32 items-center shadow-sm">
                <img src={asset_anika} alt="Anika" className="w-[70px] h-[70px] object-cover rounded-xl" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3 w-3/4 bg-white rounded-full"></div>
                  <div className="h-2 w-1/2 bg-white rounded-full"></div>
                  <div className="h-2 w-full bg-white rounded-full mt-2"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white z-20 hover:scale-110 transition-transform cursor-pointer shadow-lg">
              <Plus className="w-5 h-5" />
            </div>

            {/* Decorative wave */}
            <svg className="absolute bottom-0 left-0 w-full h-32 text-white/30" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
               <path d="M0,50 Q25,80 50,50 T100,50 L100,100 L0,100 Z" />
            </svg>
          </motion.div>
        </div>

        {/* MIDDLE COLUMN: Tall Green Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="row-span-2 bg-[#BAF1C9] rounded-[2rem] p-8 flex flex-col relative overflow-hidden group border border-transparent hover:border-black/5"
        >
          <div className="flex items-center gap-2 mb-2 relative z-20">
            <div className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-black" />
            </div>
            <span className="font-bold text-lg text-black leading-tight">Create New<br/>Circle</span>
          </div>

          {/* Overlapping Avatar Stack (Left side) */}
          <div className="absolute left-6 top-[30%] flex flex-col -space-y-4 z-20">
            <img src={asset_tanvir} className="w-12 h-12 rounded-full border-[3px] border-[#BAF1C9] object-cover shadow-sm hover:-translate-y-1 transition-transform" />
            <img src={asset_siam} className="w-12 h-12 rounded-full border-[3px] border-[#BAF1C9] object-cover shadow-sm hover:-translate-y-1 transition-transform" />
            <img src={asset_nusrat} className="w-12 h-12 rounded-full border-[3px] border-[#BAF1C9] object-cover shadow-sm hover:-translate-y-1 transition-transform" />
            <div className="w-12 h-12 rounded-full border-[3px] border-[#BAF1C9] bg-black flex items-center justify-center text-white mt-4 cursor-pointer hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
          </div>

          {/* Background curved path */}
          <svg className="absolute inset-0 w-full h-full text-white/40 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="15">
             <path d="M20,-10 C20,30 40,50 40,110" />
          </svg>

          {/* Large Hero Portrait generated for this section */}
          <div className="absolute -bottom-4 -right-12 w-[110%] h-[75%] z-10">
            <img 
              src={asset_hero_boy} 
              alt="Student" 
              className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6 row-span-2">
          
          {/* Top Right: Lavender Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex-1 bg-[#C8C2FE] rounded-[2rem] p-8 flex flex-col relative overflow-hidden group border border-transparent hover:border-black/5"
          >
             <div className="flex items-center gap-2 mb-6 relative z-10">
              <div className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center">
                <Video className="w-3 h-3 text-black" />
              </div>
              <span className="font-bold text-lg text-black">Use a Preset</span>
            </div>

            <div className="relative z-10 flex justify-center mt-auto mb-10 w-full">
               <div className="w-[85%] bg-white rounded-[2rem] p-4 flex items-center gap-4 shadow-xl border border-white/20 h-28 relative">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white relative">
                     <Video className="w-5 h-5" />
                     <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-[8px]">⚙️</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-3 w-full bg-gray-100 rounded-full"></div>
                    <div className="h-3 w-full bg-gray-100 rounded-full"></div>
                    <div className="h-3 w-[60%] bg-gray-100 rounded-full"></div>
                  </div>
               </div>
            </div>

             {/* Background decorative elements */}
             <div className="absolute top-1/2 left-1/4 w-full h-1/2 bg-white/10 rounded-full filter blur-[20px]" />
          </motion.div>

          {/* Bottom Right: Dark Yellow Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex-[0.7] bg-[#FACC15] rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group border border-transparent hover:border-black/5"
          >
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center">
                <UserPlus className="w-3 h-3 text-black" />
              </div>
              <span className="font-bold text-lg text-black">Connect Campus</span>
            </div>

            <div className="mt-auto relative z-10 flex justify-end">
               <div className="bg-white rounded-full py-2 px-3 pl-5 flex items-center gap-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors border border-black/5">
                  <span className="font-bold text-xs">Connect</span>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                    <Plus className="w-4 h-4" />
                  </div>
               </div>
            </div>

            {/* Background wavy stripes */}
            <svg className="absolute inset-0 w-full h-full text-white/20 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
               <path d="M0,80 Q25,90 50,70 T100,80 L100,100 L0,100 Z" />
               <path d="M0,0 Q25,10 50,-10 T100,0 L100,100 L0,100 Z" opacity="0.3" />
            </svg>
          </motion.div>
        </div>

      </div>

    </section>
  );
};

export default BentoHero;
