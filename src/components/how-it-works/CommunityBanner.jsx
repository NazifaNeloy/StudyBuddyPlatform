import React from 'react';
import { Mail, MessageCircle, Globe } from 'lucide-react';

const CommunityBanner = () => {
  return (
    <section className="bg-[#FDFCF8] flex flex-col items-center justify-end pt-32 w-full relative">
      
      {/* Massive Centered White Card */}
      <div className="w-full max-w-5xl bg-white rounded-[60px] p-12 md:p-24 flex flex-col items-center justify-center relative shadow-sm border border-gray-100 z-10 mx-6 md:mx-12">
        
        {/* Lavender Star Upper Left */}
        <div className="absolute top-[20%] left-[8%] md:left-[10%] text-[#8E78A6]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        {/* Small Elegant Subtitle */}
        <div className="text-[14px] font-medium text-[#8E78A6] mb-8">
          - Ruang Study Class -
        </div>

        {/* Bold Geometric Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-[56px] font-medium font-heading text-[#333333] text-center leading-[1.3] max-w-4xl tracking-tight mb-8">
          Helps you learn and hone your skills<br/>through a trusted 
          <span className="relative inline-block mx-3">
             {/* Peach Pill Highlight */}
             <div className="absolute inset-0 bg-[#FFD7AD] rounded-full scale-105" />
             <span className="relative z-10 font-medium">StudyBuddy</span>
          </span> 
          community
        </h2>

        {/* Small Light-Grey Paragraph */}
        <p className="text-[#888888] text-sm md:text-base font-normal max-w-lg text-center leading-relaxed mb-24">
          Come join us and not only increase your knowledge but also your family because we are solid team
        </p>

        {/* Lavender Star Lower Right */}
        <div className="absolute bottom-[35%] right-[10%] md:right-[15%] text-[#8E78A6]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        {/* Thin Horizontal Line */}
        <div className="w-full h-px bg-gray-200/60 mb-6" />

        {/* Metadata Row */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between text-[#BBBBBB] text-xs font-normal tracking-wide px-4 gap-6">
          <div className="flex-1 text-center md:text-left">
            Part of Webaire Agency
          </div>
          
          <div className="flex-1 flex justify-center gap-6">
            <Mail className="w-5 h-5 stroke-[1.5]" />
            <MessageCircle className="w-5 h-5 stroke-[1.5]" />
            <Globe className="w-5 h-5 stroke-[1.5]" />
          </div>

          <div className="flex-1 text-center md:text-right">
            Archived by ashzahh • 2026
          </div>
        </div>

      </div>

      {/* Scalloped Cloud Border transitioning into black */}
      {/* This sits right below the card filling the bottom gap before the true Footer component */}
      <div className="w-full translate-y-[2px] mt-24">
        {/* SVG Scalloped Pattern that matches bg-[#FDFCF8] and draws white clouds over a black backing */}
        <div className="w-full h-16 bg-white shrink-0 relative overflow-hidden" style={{ maskImage: 'radial-gradient(12px at bottom, transparent 97%, black 100%)', maskSize: '40px 100%', maskPosition: 'bottom' }}>
          <div className="w-full h-full bg-[#000000] absolute bottom-0 left-0 transform translate-y-1/2 rounded-[100%]" style={{ filter: 'url(#goo)' }} />
          <svg className="absolute inset-0 w-full h-full text-black" fill="currentColor" preserveAspectRatio="none" viewBox="0 0 1200 60">
             <path d="M0,60 C 25,20 75,20 100,60 C 125,20 175,20 200,60 C 225,20 275,20 300,60 C 325,20 375,20 400,60 C 425,20 475,20 500,60 C 525,20 575,20 600,60 C 625,20 675,20 700,60 C 725,20 775,20 800,60 C 825,20 875,20 900,60 C 925,20 975,20 1000,60 C 1025,20 1075,20 1100,60 C 1125,20 1175,20 1200,60 L 1200,100 L 0,100 Z" />
          </svg>
        </div>
      </div>

    </section>
  );
};

export default CommunityBanner;
