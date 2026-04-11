import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Target, Share, Sliders } from 'lucide-react';

const FeatureGrid = () => {
  const cards = [
    { icon: <Lightbulb className="w-6 h-6 text-brand-purple" />, title: 'Start Inspired', text: 'Get specialized group templates for your major and course codes.' },
    { icon: <Target className="w-6 h-6 text-orange-500" />, title: 'Stay on Track', text: 'Smart Pomodoro syncing keeps everyone focused on the same task.' },
    { icon: <Share className="w-6 h-6 text-emerald-500" />, title: 'Share Notes', text: 'Instantly upload PDFs and images directly to your circle.' },
    { icon: <Sliders className="w-6 h-6 text-sky-500" />, title: 'Easy Controls', text: 'A simple, intuitive UI designed specifically for university life.' },
  ];

  return (
    <section className="px-6 md:px-12 pt-12 md:pt-16 pb-4 bg-white max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-20 items-center overflow-hidden">
      <div>
         <h2 className="text-4xl md:text-7xl font-black font-heading leading-[1.05] tracking-tighter mb-8">
            How To Build The<br />Perfect Study Routine
         </h2>
         <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-md mb-12">
            Say goodbye to disorganized WhatsApp groups. Our smart templates give your team a centralized blueprint for excellence.
         </p>
         <button className="bg-black text-white px-10 py-5 rounded-full font-black text-lg md:text-xl shadow-lg hover:shadow-2xl transition-all">
            Learn More
         </button>
      </div>

      <div className="relative p-12 md:p-20">
         {/* Organic Yellow Background Shape */}
         <div className="absolute inset-0 bg-bento-yellow rounded-[5rem] -rotate-6 scale-90 -z-10 opacity-70" />
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {cards.map((card, i) => (
               <motion.div
                 key={i}
                 whileHover={{ y: -5, scale: 1.05 }}
                 className="bg-white squircle p-8 shadow-xl border border-gray-50 flex flex-col gap-4 text-center md:text-left"
               >
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                     {card.icon}
                  </div>
                  <h3 className="text-lg font-black font-heading">{card.title}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em]">{card.text}</p>
               </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
