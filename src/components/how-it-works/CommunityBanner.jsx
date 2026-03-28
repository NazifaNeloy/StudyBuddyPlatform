import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MessageSquare, Share2, Mail } from 'lucide-react';

const CommunityBanner = () => {
  return (
    <section className="px-6 md:px-12 py-32 bg-white max-w-7xl mx-auto w-full flex flex-col items-center">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="relative w-full border border-gray-100 p-12 md:p-24 rounded-[3.5rem] md:rounded-[5rem] overflow-hidden text-center flex flex-col items-center justify-center gap-12"
      >
         {/* Floating Stars */}
         <div className="absolute top-10 left-10 md:left-20 text-bento-lavender text-4xl animate-float">✦</div>
         <div className="absolute bottom-20 right-10 md:right-20 text-bento-yellow text-4xl animate-pulse">✦</div>
         
         <div className="text-[10px] md:text-sm uppercase font-black tracking-[0.2em] opacity-30 italic">
            - StudyBuddy Community -
         </div>
         
         <h2 className="text-3xl md:text-6xl font-black font-heading leading-tight max-w-4xl tracking-tight">
            Helps you learn and hone your skills through a trusted 
            <span className="relative inline-block px-10 py-1 mx-2">
              <div className="absolute inset-0 bg-bento-yellow rounded-full -rotate-1 -z-10" />
              StudyBuddy
            </span> 
            community
         </h2>
         
         <p className="text-gray-400 font-bold text-sm md:text-base max-w-xl">
            Come join us and not only increase your knowledge but also your study network because we are one team.
         </p>
         
         {/* Social Footer inside Banner */}
         <div className="pt-20 border-t border-gray-100 w-full flex flex-col md:flex-row items-center justify-between gap-12 mt-12 opacity-40 grayscale flex-wrap">
            <div className="text-[10px] font-black uppercase tracking-widest">Part of StudyBuddy</div>
            <div className="flex gap-10">
               <Globe className="w-5 h-5 cursor-pointer hover:grayscale-0" />
               <MessageSquare className="w-5 h-5 cursor-pointer hover:grayscale-0" />
               <Share2 className="w-5 h-5 cursor-pointer hover:grayscale-0" />
               <Mail className="w-5 h-5 cursor-pointer hover:grayscale-0" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest">Archived by nelozahn - 2026</div>
         </div>
         
         {/* Background Subtle Gradient */}
         <div className="absolute -inset-20 bg-gradient-to-tr from-bento-white via-white to-bento-white opacity-50 -z-20" />
      </motion.div>
    </section>
  );
};

export default CommunityBanner;
