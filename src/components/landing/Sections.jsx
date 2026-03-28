import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const SocialProof = () => {
  const testimonials = [
    {
      text: "No more boring meeting. We always having fun and laughs!",
      name: "Teresha",
      role: "User",
      avatar: "https://i.pravatar.cc/150?u=10"
    },
    {
      text: "Thanks a lot for this. It's a lifesaver every morning! Teams love it.",
      name: "Ryan Wilson",
      role: "Lead Designer",
      avatar: "https://i.pravatar.cc/150?u=11"
    },
    {
      text: "Everyone became exciting to do virtual meeting. Thanks!",
      name: "Kayla Smith",
      role: "User",
      avatar: "https://i.pravatar.cc/150?u=12"
    }
  ];

  return (
    <section className="px-6 md:px-12 py-24 bg-white/50 border-y border-gray-100 max-w-7xl mx-auto w-full">
      <h2 className="text-3xl font-black font-heading mb-16 text-center">Everyone loves it!</h2>
      <div className="grid md:grid-cols-3 gap-12">
        {testimonials.map((testi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2 }}
            className="flex flex-col gap-6"
          >
            <p className="text-lg md:text-xl font-bold leading-tight">"{testi.text}"</p>
            <div className="flex items-center gap-4">
              <img src={testi.avatar} alt={testi.name} className="w-12 h-12 rounded-full border border-gray-100 shadow-lg" />
              <div>
                <div className="font-black text-sm">{testi.name}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{testi.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const TiltedCards = () => {
  const cards = [
    { role: "Senior UI/UX Designer", tags: ["Full Time", "Remote", "120K"], color: "bg-pastel-pink", rotate: "-5deg" },
    { role: "Junior UI/UX Designer", tags: ["Part Time", "Remote", "45K"], color: "bg-pastel-blue", rotate: "2deg" },
    { role: "Senior Motion Designer", tags: ["Contract", "Hybrid", "110K"], color: "bg-pastel-yellow", rotate: "-3deg" },
    { role: "Senior Graphic Designer", tags: ["Full Time", "Office", "90K"], color: "bg-pastel-green", rotate: "5deg" },
  ];

  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div>
           <h2 className="text-4xl md:text-6xl font-black font-heading leading-tight mb-4 max-w-md">
             Explore a Thousand Of New Job Everyday
           </h2>
        </div>
        <div className="relative w-full max-w-sm">
          <input 
            type="text" 
            placeholder="Search roles or companies..." 
            className="w-full bg-white border border-gray-100 rounded-full py-4 pl-6 pr-14 shadow-xl focus:ring-2 focus:ring-brand-purple outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white">
            <Search className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex -mx-4 pb-12 overflow-x-auto snap-x no-scrollbar md:flex-row flex-col gap-8 md:gap-0 items-center justify-center">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, zIndex: 50, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`flex-shrink-0 w-80 h-[380px] ${card.color} rounded-[2.5rem] p-10 shadow-xl border border-black/5 -ml-4 first:ml-0 snap-center flex flex-col justify-between`}
            style={{ rotate: card.rotate }}
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <span className="font-black text-2xl">✨</span>
            </div>
            
            <div>
              <h3 className="text-2xl font-black font-heading leading-tight mb-6">{card.role}</h3>
              <div className="flex flex-wrap gap-2">
                {card.tags.map(tag => (
                   <span key={tag} className="bg-white/30 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full">
                     {tag}
                   </span>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-black/5 flex items-center justify-between">
               <div className="text-xs font-black">Apply Now</div>
               <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                 <Search className="w-4 h-4 translate-x-[2px] -translate-y-[2px]" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SocialProof;
