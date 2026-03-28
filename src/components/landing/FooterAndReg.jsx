import React from 'react';
import { motion } from 'framer-motion';

export const RegistrationStrip = () => {
  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto w-full text-center">
      <h2 className="text-4xl md:text-6xl font-black font-heading mb-4 px-2">Create Your <span className="text-brand-purple">Academic</span> Profile</h2>
      <p className="text-gray-500 mb-12 max-w-md mx-auto">
        Join the hub to connect with students from BUET, DU, EDU and more.
      </p>

      <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
        <input type="text" placeholder="First Name" className="bg-pastel-pink rounded-2xl py-5 px-6 font-bold placeholder:text-black/30 outline-none border border-transparent focus:border-black/10 transition-all text-sm shadow-sm" />
        <input type="text" placeholder="Last Name" className="bg-pastel-blue rounded-2xl py-5 px-6 font-bold placeholder:text-black/30 outline-none border border-transparent focus:border-black/10 transition-all text-sm shadow-sm" />
        <input type="email" placeholder="University Email" className="bg-pastel-yellow rounded-2xl py-5 px-6 font-bold placeholder:text-black/30 outline-none border border-transparent focus:border-black/10 transition-all text-sm shadow-sm" />
        <input type="password" placeholder="Password" className="bg-pastel-green rounded-2xl py-5 px-6 font-bold placeholder:text-black/30 outline-none border border-transparent focus:border-black/10 transition-all text-sm shadow-sm" />
        <button className="bg-black text-white rounded-2xl py-5 px-6 font-black text-sm shadow-brutal hover:bg-gray-900 transition-all md:col-span-4 lg:col-span-1 border-2 border-black">
          JOIN HUB
        </button>
      </div>
    </section>
  );
};

export const Footer = () => {
  const studentTags = [
    { title: 'Night Owl', color: 'bg-pastel-pink', x: -300, y: -50, rotate: -15 },
    { title: 'CSE Major', color: 'bg-pastel-green', x: 250, y: -80, rotate: 10 },
    { title: 'IELTS Prep', color: 'bg-pastel-orange', x: -250, y: 150, rotate: -5 },
    { title: 'Math Tutor', color: 'bg-pastel-blue', x: 0, y: 180, rotate: 0 },
    { title: 'Competitive Programmer', color: 'bg-pastel-yellow', x: 300, y: 150, rotate: 12 },
  ];

  return (
    <footer className="bg-black text-white py-40 px-6 md:px-12 text-center relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-10 flex items-center gap-2 opacity-50">
        <span className="text-xl font-black font-heading tracking-tight italic">StudyBuddy</span>
      </div>
      
      <div className="relative z-10 w-full">
        <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-black font-heading leading-none tracking-tighter mb-4">
          LET'S FIND YOUR<br />STUDY PARTNER
        </h2>
        
        {/* Floating tags */}
        <div className="absolute inset-0 pointer-events-none">
          {studentTags.map((tag, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              animate={{ 
                y: [tag.y, tag.y - 15, tag.y],
                x: [tag.x, tag.x + 10, tag.x]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
              className={`absolute top-1/2 left-1/2 ${tag.color} text-black font-black text-[10px] md:text-xs uppercase tracking-widest px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl`}
              style={{ transform: `translate(${tag.x}px, ${tag.y}px) rotate(${tag.rotate}deg)` }}
            >
              {tag.title}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-20 pt-20 border-t border-white/10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest gap-6">
         <div>Copyright © 2026 StudyBuddy - Empowering Bangladeshi Students</div>
         <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Dribbble</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
         </div>
      </div>
    </footer>
  );
};
