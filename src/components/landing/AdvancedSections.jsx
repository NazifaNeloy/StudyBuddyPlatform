import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, Send } from 'lucide-react';

export const AppShowcase = () => {
  return (
    <section className="px-6 md:px-12 py-32 bg-[#FEEADB]/30 border-y border-orange-100 max-w-7xl mx-auto w-full relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-10 left-10 w-24 h-24 bg-pastel-blue rounded-full -rotate-12 flex items-center justify-center border border-white/50 text-2xl shadow-xl">
        <Sparkles className="text-white" />
      </div>
      <div className="absolute bottom-20 right-10 w-28 h-28 bg-pastel-green rounded-full rotate-12 flex items-center justify-center border border-white/50 text-3xl shadow-xl">
        🌴
      </div>

      <h2 className="text-xl font-black font-heading tracking-widest uppercase mb-12 italic">buddy</h2>

      {/* Phone Mockup */}
      <div className="relative w-72 md:w-80 h-[600px] bg-black rounded-[3.5rem] p-4 shadow-2xl border-8 border-gray-900 overflow-hidden group">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-50 flex items-center justify-center gap-1">
          <div className="w-8 h-2 bg-gray-800 rounded-full" />
          <div className="w-2 h-2 bg-gray-800 rounded-full" />
        </div>
        
        <div className="bg-brand-white h-full rounded-[2.5rem] p-6 pt-10 flex flex-col gap-4 overflow-y-auto no-scrollbar">
           <div className="flex items-center gap-2 mb-4">
             <img src="https://i.pravatar.cc/150?u=a" className="w-8 h-8 rounded-full border-2 border-brand-purple" alt="user" />
             <div className="flex-1 bg-pastel-yellow rounded-full px-4 py-2 text-[10px] font-bold">
               Hi, where we studying today?
             </div>
           </div>

           <div className="relative mb-6">
             <input type="text" placeholder="Search for circles..." className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-4 pr-10 text-[10px] outline-none" />
             <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
           </div>

           <div className="space-y-4">
             <div className="bg-pastel-pink p-4 rounded-3xl flex flex-col gap-2">
               <div className="text-[10px] font-black uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> Berlin, Germany</div>
               <div className="text-xs font-bold font-heading">Math Circle: Geometry</div>
             </div>
             <div className="bg-pastel-blue p-4 rounded-3xl flex flex-col gap-2">
               <div className="text-[10px] font-black uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> Remote</div>
               <div className="text-xs font-bold font-heading">History: Dark Ages</div>
             </div>
           </div>
        </div>
        
        {/* Floating stickers */}
        <motion.div 
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 -right-10 w-24 h-24 bg-brand-purple rounded-full flex items-center justify-center text-4xl shadow-xl z-30"
        >
          🎓
        </motion.div>
      </div>
    </section>
  );
};

export const TypographyBreak = () => {
  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-20 items-center">
      <div>
        <div className="flex items-baseline gap-4 mb-10">
           <span className="text-8xl md:text-[10rem] font-black font-heading leading-none tracking-tighter italic">buddy</span>
           <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-purple rounded-3xl shadow-brutal" />
        </div>
        <p className="text-xl md:text-3xl font-bold leading-tight max-w-lg mb-8">
           We provide an extraordinary experience and recommendations worth to try.
        </p>
        <p className="text-gray-500 leading-relaxed max-w-md">
           Streamline your study life with our app, offering seamless booking, personalized recommendations, and real-time updates for hassle-free sessions anywhere in the world.
        </p>
      </div>
      <div className="hidden md:block">
        <div className="w-full aspect-square bg-white rounded-full border border-gray-100 flex items-center justify-center p-12 relative">
          <div className="absolute inset-0 bg-brand-purple opacity-5 blur-3xl animate-pulse" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-full h-full border-2 border-dashed border-brand-purple/20 rounded-full flex items-center justify-center"
          >
             <div className="w-4 h-4 bg-brand-purple rounded-full absolute top-0" />
             <div className="w-4 h-4 bg-pastel-pink rounded-full absolute bottom-0" />
          </motion.div>
          <div className="text-6xl md:text-8xl font-black">🌟</div>
        </div>
      </div>
    </section>
  );
};

export const NodeGraph = () => {
  const users = [
    { name: 'Angela', x: 10, y: 15, color: 'bg-pastel-pink', avatar: 'https://i.pravatar.cc/150?u=20' },
    { name: 'James', x: 85, y: 20, color: 'bg-pastel-blue', avatar: 'https://i.pravatar.cc/150?u=21' },
    { name: 'Drake', x: 15, y: 75, color: 'bg-pastel-green', avatar: 'https://i.pravatar.cc/150?u=22' },
    { name: 'Sasha', x: 80, y: 80, color: 'bg-pastel-yellow', avatar: 'https://i.pravatar.cc/150?u=23' },
  ];

  return (
    <section className="px-6 md:px-12 py-32 bg-brand-white border-y border-gray-100 max-w-7xl mx-auto w-full relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Node SVG Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-gray-200 stroke-2" style={{ strokeDasharray: '4 4' }}>
        {users.map((user, i) => (
          <line key={i} x1={`${user.x}%`} y1={`${user.y}%`} x2="50%" y2="50%" />
        ))}
      </svg>
      
      {/* Central Hub */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="relative z-10 text-center glass-pill p-10 md:p-16 rounded-[4rem] flex flex-col items-center shadow-brutal"
      >
        <h2 className="text-4xl md:text-6xl font-black font-heading leading-tight mb-4">
          Collaborate, <span className="text-brand-purple italic">Track</span><br />and Succeed with 
          <div className="bg-brand-purple text-white px-4 py-1 rounded-full text-3xl md:text-4xl inline-block mt-4">TaskTide</div>
        </h2>
        <div className="relative w-full max-w-sm mt-8">
           <input type="text" placeholder="name@yourcompany.com" className="w-full bg-white border border-gray-100 rounded-full py-4 px-6 pr-32 outline-none shadow-xl" />
           <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-black flex items-center gap-2">
             Get Started <Send className="w-3 h-3" />
           </button>
        </div>
      </motion.div>

      {/* User Nodes */}
      {users.map((user, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: i * 0.3 }}
          className="absolute flex items-center gap-3 p-1 rounded-full pr-6 shadow-xl border border-white/50 bg-white"
          style={{ top: `${user.y}%`, left: `${user.x}%`, zIndex: 10 }}
        >
          <img src={user.avatar} className={`w-12 h-12 rounded-full border-2 border-white ${user.color}`} alt={user.name} />
          <div className="text-[10px] font-black uppercase tracking-tighter">{user.name}</div>
        </motion.div>
      ))}
    </section>
  );
};
