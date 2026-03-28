import React from 'react';
import { motion } from 'framer-motion';

export const RegistrationStrip = () => {
  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto w-full text-center">
      <h2 className="text-4xl md:text-6xl font-black font-heading mb-4">Register your Account</h2>
      <p className="text-gray-500 mb-12 max-w-md mx-auto">
        Regularly update your link searching to find more available job that matches your skill.
      </p>

      <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
        <input type="text" placeholder="First Name" className="bg-pastel-pink rounded-2xl py-5 px-6 font-bold placeholder:text-black/30 outline-none border border-transparent focus:border-black/10 transition-all text-sm" />
        <input type="text" placeholder="Last Name" className="bg-pastel-blue rounded-2xl py-5 px-6 font-bold placeholder:text-black/30 outline-none border border-transparent focus:border-black/10 transition-all text-sm" />
        <input type="email" placeholder="Your Email" className="bg-pastel-yellow rounded-2xl py-5 px-6 font-bold placeholder:text-black/30 outline-none border border-transparent focus:border-black/10 transition-all text-sm" />
        <input type="password" placeholder="Password" className="bg-pastel-green rounded-2xl py-5 px-6 font-bold placeholder:text-black/30 outline-none border border-transparent focus:border-black/10 transition-all text-sm" />
        <button className="bg-black text-white rounded-2xl py-5 px-6 font-black text-sm shadow-brutal hover:bg-gray-900 transition-all md:col-span-4 lg:col-span-1">
          SUBMIT NOW
        </button>
      </div>
    </section>
  );
};

export const Footer = () => {
  const jobTags = [
    { title: '3D Illustrator', color: 'bg-pastel-pink', x: -300, y: -50, rotate: -15 },
    { title: 'UI Designer', color: 'bg-pastel-green', x: 250, y: -80, rotate: 10 },
    { title: 'Graphic Designer', color: 'bg-pastel-orange', x: -250, y: 150, rotate: -5 },
    { title: 'Marketing', color: 'bg-pastel-blue', x: 0, y: 180, rotate: 0 },
    { title: 'UX Designer', color: 'bg-pastel-yellow', x: 300, y: 150, rotate: 12 },
  ];

  return (
    <footer className="bg-black text-white py-40 px-6 md:px-12 text-center relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-10 flex items-center gap-2 opacity-50">
        <span className="text-xl font-black font-heading tracking-tight italic">JobForge</span>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-black font-heading leading-none tracking-tighter mb-4">
          LET'S DISCOVER<br />YOUR JOB
        </h2>
        
        {/* Floating tags */}
        <div className="absolute inset-0 pointer-events-none">
          {jobTags.map((tag, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              animate={{ 
                y: [tag.y, tag.y - 10, tag.y],
                x: [tag.x, tag.x + 5, tag.x]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              className={`absolute top-1/2 left-1/2 ${tag.color} text-black font-black text-[10px] md:text-xs uppercase tracking-widest px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl`}
              style={{ transform: `translate(${tag.x}px, ${tag.y}px) rotate(${tag.rotate}deg)` }}
            >
              {tag.title}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-20 pt-20 border-t border-white/10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest gap-6">
         <div>Copyright © 2024 JobForge - Made by StudyBuddy</div>
         <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Dribbble</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
         </div>
      </div>
    </footer>
  );
};
