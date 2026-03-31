import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users as UsersIcon } from 'lucide-react';

const SocialProof = () => {
  const testimonials = [
    {
      text: "The Pomodoro timers are a lifesaver for my CSE midterm preps!",
      name: "Rahim M.",
      role: "BUET Student",
      avatar: "https://ui-avatars.com/api/?name=Rahim+M&background=E0DAFF&color=6B4EFE&bold=true"
    },
    {
      text: "Sharing resources in StudyBuddy is so much easier than WhatsApp groups.",
      name: "Fatema A.",
      role: "East Delta University",
      avatar: "https://ui-avatars.com/api/?name=Fatema+A&background=D6FFE4&color=000&bold=true"
    },
    {
      text: "Found my IELTS speaking partner here. We study every evening!",
      name: "Tanvir H.",
      role: "NSU Student",
      avatar: "https://ui-avatars.com/api/?name=Tanvir+H&background=FFF8D6&color=000&bold=true"
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
            <p className="text-lg md:text-xl font-bold leading-tight italic">"{testi.text}"</p>
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
    { title: "CSE342 Data Structures", info: "5 Members - Focus Active", color: "bg-pastel-pink", rotate: "-5deg" },
    { title: "IELTS Speaking Practice", info: "8 Members - Live Sync", color: "bg-pastel-blue", rotate: "2deg" },
    { title: "SQL Midterm Prep", info: "12 Members - Resource Rich", color: "bg-pastel-orange", rotate: "-3deg" },
    { title: "BBA Finance", info: "4 Members - Deep Focus", color: "bg-pastel-green", rotate: "5deg" },
  ];

  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div>
           <h2 className="text-4xl md:text-6xl font-black font-heading leading-tight mb-4 max-w-lg">
             Explore Thousands of Study Groups
           </h2>
        </div>
        <div className="relative w-full max-w-sm">
          <input 
            type="text" 
            placeholder="Search groups (e.g. CSE, BBA)..." 
            className="w-full bg-white border border-gray-100 rounded-full py-4 pl-6 pr-14 shadow-xl focus:ring-2 focus:ring-brand-purple outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white">
            <Search className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-8 lg:gap-12 items-center justify-center py-12">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, zIndex: 50, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-full max-w-[300px] h-[360px] ${card.color} rounded-[2.5rem] p-8 shadow-xl border border-black/5 flex flex-col justify-between cursor-pointer`}
            style={{ rotate: card.rotate }}
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <UsersIcon className="w-7 h-7" />
            </div>
            
            <div>
              <h3 className="text-xl md:text-2xl font-black font-heading leading-tight mb-4">{card.title}</h3>
              <p className="text-[10px] md:text-xs font-black bg-black/5 inline-block px-3 py-1.5 rounded-full uppercase tracking-widest">
                {card.info}
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-black/5 flex items-center justify-between group">
               <div className="text-xs font-black uppercase tracking-widest group-hover:text-brand-purple transition-colors">Join Circle</div>
               <div className="w-10 h-10 bg-black/10 group-hover:bg-brand-purple group-hover:text-white transition-colors rounded-full flex items-center justify-center">
                 <Search className="w-5 h-5 translate-x-[2px] -translate-y-[2px]" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SocialProof;
