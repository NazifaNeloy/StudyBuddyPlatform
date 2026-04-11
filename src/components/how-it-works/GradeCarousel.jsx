import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, MoveUpRight } from 'lucide-react';

import asset_algo from '../../assets/asset_3d_algo.png';
import asset_webdev from '../../assets/asset_3d_webdev.png';
import asset_ielts from '../../assets/asset_3d_ielts.png';
import asset_accounting from '../../assets/asset_3d_accounting.png';

const GradeCarousel = () => {
  const cards = [
    { 
      title: 'Algorithm & DSA', 
      color: 'bg-[#FF72B4]', // Pinkish
      shadow: 'shadow-[#FF72B4]/40',
      image: asset_algo
    },
    { 
      title: 'Web Dev', 
      color: 'bg-[#B097ED]', // Purple
      shadow: 'shadow-[#B097ED]/40',
      image: asset_webdev
    },
    { 
      title: 'IELTS Prep', 
      color: 'bg-[#6EDDF5]', // Cyan
      shadow: 'shadow-[#6EDDF5]/40',
      image: asset_ielts
    },
    { 
      title: 'Accounting', 
      color: 'bg-[#FFAB5E]', // Orange
      shadow: 'shadow-[#FFAB5E]/40',
      image: asset_accounting
    },
  ];

  return (
    <section className="px-6 md:px-12 py-32 bg-white max-w-6xl mx-auto w-full relative overflow-visible flex flex-col items-center">
      
      {/* Top Right Label Pills */}
      <div className="absolute top-10 right-0 md:right-10 flex flex-col items-end gap-2 z-10">
        <div className="bg-[#8E78A6] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
          StudyBuddy App
        </div>
        <div className="bg-[#8E78A6] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide opacity-80 shadow-sm">
          2026.11
        </div>
      </div>

      {/* Hero Text */}
      <div className="text-center w-full max-w-4xl relative mt-16 mb-24">
        
        {/* Top Left Star */}
        <div className="absolute top-0 left-[10%] text-[#8E78A6]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        {/* Top Right Star */}
        <div className="absolute top-4 right-[15%] text-[#8E78A6]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        {/* Bottom Right Star */}
        <div className="absolute -bottom-8 right-[10%] text-[#8E78A6]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        <h2 className="text-5xl md:text-7xl lg:text-[80px] font-medium font-heading leading-tight tracking-tight text-[#333333]">
          Level Up Your
          <div className="flex items-center justify-center gap-4 mt-2">
            Focus
            {/* Orange Pill */}
            <div className="bg-[#FFBE74] rounded-full px-8 py-3 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
            with Our
          </div>
          <div className="relative inline-block mt-2">
            {/* Swoosh Underline */}
            <svg className="absolute -left-20 top-1/2 -translate-y-1/2 w-24 h-24 text-[#8E78A6]" viewBox="0 0 100 100" fill="none">
              <path d="M90 60 Q40 80 10 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Study Class
          </div>
        </h2>
      </div>

      {/* Info & CTA Row */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-12 mb-12 gap-8">
        <div className="text-sm font-bold text-[#333333] leading-relaxed">
          With more than<br />
          2K + MEMBERS<br />
          500 + TUTORIALS
        </div>

        <div className="flex items-center bg-white border-2 border-[#FFBE74] rounded-full p-1 pl-6 gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <span className="font-bold text-[#333333]">Join us</span>
          <div className="w-10 h-10 bg-[#FFBE74] rounded-full flex items-center justify-center text-[#333333]">
             <MoveUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Carousel Area */}
      <div className="w-full flex items-center justify-center gap-4 md:gap-8 relative px-4">
        
        {/* Left Arrow */}
        <button className="hidden md:flex w-14 h-14 bg-[#D3C7EE] rounded-full items-center justify-center text-white hover:scale-105 transition-transform shrink-0">
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Cards container */}
        <div className="flex gap-6 md:gap-8 overflow-x-auto snap-x no-scrollbar py-8 px-4 w-full justify-start md:justify-center">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className={`flex-shrink-0 w-48 h-48 md:w-[220px] md:h-[220px] rounded-[2.5rem] flex items-center justify-center snap-center shadow-xl ${card.color} ${card.shadow} relative overflow-hidden`}
            >
              {/* Realistic 3D floating icons imported successfully */}
              <div className="w-full h-full flex items-center justify-center hover:scale-110 transition-transform duration-500 hover:brightness-110">
                <img src={card.image} alt={card.title} className="w-[85%] h-[85%] object-contain drop-shadow-2xl" />
              </div>
              
              {/* Optional visually hidden text for screen readers */}
              <span className="sr-only">{card.title}</span>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <button className="hidden md:flex w-14 h-14 bg-[#D3C7EE] rounded-full items-center justify-center text-white hover:scale-105 transition-transform shrink-0">
          <ArrowRight className="w-6 h-6" />
        </button>

      </div>

      {/* Bottom decorative star */}
      <div className="absolute -bottom-10 right-[15%] text-[#8E78A6] opacity-60">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

    </section>
  );
};

export default GradeCarousel;
