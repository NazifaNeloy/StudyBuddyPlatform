import React from 'react';
import { Mail, MessageCircle, Globe } from 'lucide-react';

const CommunityBanner = () => {
  return (
    <section className="bg-white flex flex-col items-center justify-end pt-8 md:pt-10 pb-16 md:pb-24 w-full relative">
      
      {/* Top right floating arrows from the image */}
      <div className="w-full max-w-5xl flex justify-end px-12 mb-4 text-gray-500 gap-2">
         <span className="cursor-pointer hover:text-black">←</span>
         <span className="cursor-pointer hover:text-black font-bold">→</span>
      </div>

      {/* Massive Centered White Card */}
      <div className="w-full max-w-5xl bg-white rounded-[50px] md:rounded-[60px] p-12 md:px-24 md:py-16 flex flex-col items-center justify-center relative border border-gray-200 z-10 mx-6 md:mx-12">
        
        {/* Lavender Star Upper Left */}
        <div className="absolute top-[35%] md:top-[30%] left-[8%] md:left-[5%] text-[#8E78A6]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        {/* Small Elegant Subtitle */}
        <div className="text-[14px] font-medium text-[#8E78A6] mb-6 tracking-wide">
          - Ruang Study Class -
        </div>

        {/* Bold Geometric Headline (Forced 2 lines perfectly like reference) */}
        <h2 className="text-3xl md:text-5xl lg:text-[52px] font-medium font-heading text-[#333333] text-center leading-[1.3] max-w-4xl tracking-tight mb-8">
          Helps you learn and hone your skills<br className="hidden md:block" />
          <span className="inline-block mt-2 md:mt-0">through a trusted</span> 
          <span className="relative inline-block mx-3">
             {/* Peach Pill Highlight */}
             <div className="absolute inset-0 bg-[#FFD7AD] rounded-full scale-105" />
             <span className="relative z-10 font-medium">StudyBuddy</span>
          </span> 
          community
        </h2>

        {/* Small Light-Grey Paragraph (Forced 2 lines perfectly like reference) */}
        <p className="text-[#888888] text-sm md:text-base font-medium max-w-xl text-center leading-relaxed mb-24">
          Come join us and not only increase your knowledge but<br className="hidden md:block"/>
          also your family because we are solid team
        </p>

        {/* Lavender Star Lower Right */}
        <div className="absolute bottom-[28%] md:bottom-[32%] right-[10%] md:right-[5%] text-[#8E78A6]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        {/* Thin Horizontal Line */}
        <div className="w-full h-px bg-gray-100 mb-6" />

        {/* Metadata Row */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between text-[#BBBBBB] text-xs font-medium tracking-wide px-4 gap-6">
          <div className="flex-1 text-center md:text-left text-transparent select-none">
            {/* Blank left side per user request (don't mention Webaire agency), kept div for flex spacing */}
            Hidden Text
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

    </section>
  );
};

export default CommunityBanner;
