import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Timer, 
  CheckCircle2, 
  Users as UsersIcon, 
  TrendingUp, 
  Send 
} from 'lucide-react';

export const AppShowcase = () => {
  return (
    <section className="px-6 md:px-12 py-32 bg-[#FEEADB]/30 border-y border-orange-100 max-w-7xl mx-auto w-full relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-10 left-10 w-24 h-24 bg-pastel-blue rounded-full -rotate-12 flex items-center justify-center border border-white/50 text-2xl shadow-xl">
        <Sparkles className="text-white" />
      </div>
      <div className="absolute bottom-20 right-10 w-28 h-28 bg-pastel-green rounded-full rotate-12 flex items-center justify-center border border-white/50 text-3xl shadow-xl">
        ⚡
      </div>

      <h2 className="text-xl font-black font-heading tracking-widest uppercase mb-12 italic">studybuddy</h2>

      {/* Phone Mockup */}
      <div className="relative w-72 md:w-80 h-[600px] bg-black rounded-[3.5rem] p-4 shadow-2xl border-8 border-gray-900 overflow-hidden group">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-50 flex items-center justify-center gap-1">
          <div className="w-8 h-2 bg-gray-800 rounded-full" />
        </div>
        
        <div className="bg-brand-white h-full rounded-[2.5rem] p-6 pt-10 flex flex-col gap-4 overflow-y-auto no-scrollbar">
           {/* Focus Orb Mockup */}
           <div className="glass p-4 rounded-3xl text-center border border-brand-purple/20">
              <div className="w-20 h-20 bg-brand-purple/10 rounded-full mx-auto flex items-center justify-center mb-2 animate-pulse">
                <Timer className="w-10 h-10 text-brand-purple" />
              </div>
              <div className="text-xl font-bold font-mono">24:59</div>
              <div className="text-[10px] uppercase font-black tracking-widest text-gray-400">Deep Focus</div>
           </div>

           {/* Chat Mockup */}
           <div className="flex-1 bg-white/50 rounded-2xl p-4 flex flex-col gap-3">
             <div className="flex gap-2 items-end">
               <div className="w-6 h-6 rounded-full bg-pastel-blue text-[8px] flex items-center justify-center font-bold">R</div>
               <div className="bg-pastel-blue/20 p-2 rounded-xl rounded-bl-none text-[9px] font-bold max-w-[80%]">
                 Let's solve problem 5 together!
               </div>
             </div>
             <div className="flex gap-2 items-end justify-end">
                <div className="bg-brand-purple text-white p-2 rounded-xl rounded-br-none text-[9px] font-bold max-w-[80%]">
                 Ready! I found the logic.
               </div>
               <div className="w-6 h-6 rounded-full bg-brand-purple text-[8px] flex items-center justify-center font-bold text-white">Y</div>
             </div>
           </div>
        </div>
        
        {/* Floating stickers */}
        <motion.div 
          animate={{ x: [-10, 10, -10], y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/2 -right-12 w-32 h-14 bg-white rounded-full flex items-center justify-center gap-2 shadow-xl z-30 border border-pastel-purple/50 px-4"
        >
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-black uppercase tracking-tighter italic">+50 Points</span>
        </motion.div>

        <motion.div 
          animate={{ x: [5, -5, 5], y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 -left-12 w-36 h-14 bg-brand-black text-white rounded-full flex items-center justify-center gap-2 shadow-xl z-30 px-4"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-black uppercase italic tracking-tighter">Streak Maintained</span>
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
           <span className="text-8xl md:text-[10rem] font-black font-heading leading-none tracking-tighter italic">studybuddy</span>
           <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-purple rounded-3xl shadow-brutal" />
        </div>
        <p className="text-xl md:text-3xl font-bold leading-tight max-w-lg mb-8">
           We bridge the gap between solo studying and group excellence.
        </p>
        <p className="text-gray-500 leading-relaxed max-w-md">
           Built for university students who want to stay focused while staying connected. Experience deep-work sessions that are actually fun.
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
          <div className="text-6xl md:text-8xl font-black">🎓</div>
        </div>
      </div>
    </section>
  );
};

export const NodeGraph = () => {
  const users = [
    { name: 'Rahim', x: 10, y: 15, color: 'bg-pastel-pink', avatar: 'https://ui-avatars.com/api/?name=Rahim+M&background=E0DAFF&bold=true' },
    { name: 'Fatema', x: 85, y: 20, color: 'bg-pastel-blue', avatar: 'https://ui-avatars.com/api/?name=Fatema+A&background=D6FFE4&bold=true' },
    { name: 'Tanvir', x: 15, y: 75, color: 'bg-pastel-green', avatar: 'https://ui-avatars.com/api/?name=Tanvir+H&background=FFF8D6&bold=true' },
    { name: 'Anika', x: 80, y: 80, color: 'bg-pastel-yellow', avatar: 'https://ui-avatars.com/api/?name=Anika+J&background=FFD6F3&bold=true' },
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
          Collaborate, Track<br />and Succeed with 
          <div className="bg-brand-purple text-white px-4 py-1 rounded-full text-3xl md:text-4xl inline-block mt-4 italic mx-2">Focus Groups</div>
        </h2>
        <div className="relative w-full max-w-sm mt-8">
           <input type="text" placeholder="your.university@domain.edu" className="w-full bg-white border border-gray-100 rounded-full py-4 px-6 pr-32 outline-none shadow-xl text-sm" />
           <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-black flex items-center gap-2">
             Find Hub <Send className="w-3 h-3" />
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
          <div className="text-[10px] font-black uppercase tracking-tighter italic">{user.name}</div>
        </motion.div>
      ))}
    </section>
  );
};
