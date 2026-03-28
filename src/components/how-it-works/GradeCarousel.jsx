import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Clock, MessageCircle, GraduationCap } from 'lucide-react';

const GradeCarousel = () => {
  const cards = [
    { icon: <BookOpen className="w-12 h-12" />, color: 'bg-bento-yellow', title: 'Study Hub' },
    { icon: <Clock className="w-12 h-12" />, color: 'bg-bento-blue', title: 'Timer Sync' },
    { icon: <MessageCircle className="w-12 h-12" />, color: 'bg-bento-green', title: 'Live Chat' },
    { icon: <GraduationCap className="w-12 h-12" />, color: 'bg-bento-lavender', title: 'Resource Share' },
  ];

  return (
    <section className="px-6 md:px-12 py-32 bg-white max-w-7xl mx-auto w-full overflow-hidden">
      <div className="relative mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="relative">
           {/* Decorative 4-point stars */}
           <div className="absolute -top-10 -left-10 text-bento-yellow animate-float opacity-50">✦</div>
           <div className="absolute top-1/2 -right-16 text-bento-blue animate-pulse opacity-40">✦</div>
           
           <h2 className="text-4xl md:text-7xl font-black font-heading leading-tight max-w-2xl">
              Level Up Your <span className="relative inline-block px-10 py-2"><div className="absolute inset-0 bg-bento-lavender rounded-full -rotate-2 -z-10" />Grades</span> with Our Focus Rooms
           </h2>
        </div>
        
        <div className="flex flex-col items-center md:items-start gap-6">
           <div className="flex items-center gap-3">
              <span className="text-sm font-bold opacity-40 italic">With more than 2K+ students & 500+ study sessions.</span>
              <button className="bg-white border border-gray-100 p-4 rounded-full shadow-lg hover:shadow-xl transition-all">
                <span className="font-black text-xs uppercase tracking-widest flex items-center gap-2">Join us <div className="w-5 h-5 bg-black rounded-full text-white flex items-center justify-center -rotate-45">→</div></span>
              </button>
           </div>
           
           <div className="flex gap-4">
              <button className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:shadow-lg transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>

      <div className="flex -mx-4 gap-8 overflow-x-auto snap-x no-scrollbar md:pb-12">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className={`flex-shrink-0 w-80 md:w-96 aspect-[4/3] ${card.color} squircle p-12 flex flex-col items-center justify-center gap-6 shadow-xl snap-center first:ml-4`}
          >
             <div className="w-24 h-24 bg-white/40 border border-white/50 rounded-[1.5rem] flex items-center justify-center text-black">
                {card.icon}
             </div>
             <div className="text-2xl font-black font-heading tracking-widest uppercase italic">{card.title}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GradeCarousel;
