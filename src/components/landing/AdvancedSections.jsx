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
  Send,
  Plus,
  Bell,
  Coffee,
  Book,
  Heart
} from 'lucide-react';

import iphoneImg from '../../assets/iphone_15.png';
import asset_nusrat from '../../assets/asset_nusrat.png';
import asset_tanvir from '../../assets/asset_tanvir.png';
import asset_adnan from '../../assets/asset_adnan.png';
import asset_anika from '../../assets/asset_anika.png';

export const AppShowcase = () => {
  return (
    <section className="px-6 md:px-12 py-32 bg-white border-y border-black/5 max-w-7xl mx-auto w-full relative overflow-visible flex flex-col items-center">

      <div className="mb-20 text-center relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 block">Visual Interface</span>
        <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tight italic">everything is connected.</h2>
      </div>

      {/* Floating UI Stickers ("Chaos" Layer) around the phone */}
      <div className="absolute inset-0 pointer-events-none overflow-visible z-0">
        
        {/* Mint Circular Sticker */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[5%] md:left-[15%] w-28 h-28 bg-[#D6FFE4] rounded-full flex items-center justify-center border-4 border-black sticker-shadow"
        >
          <svg viewBox="0 0 100 100" className="absolute w-full h-full">
            <path id="curve-mint" d="M 15, 50 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
            <text className="text-[11px] font-black uppercase tracking-widest" fill="black">
              <textPath href="#curve-mint" startOffset="0%">FOCUS NOW • FOCUS NOW •</textPath>
            </text>
          </svg>
        </motion.div>

        {/* Pink Circular Sticker */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[3%] md:right-[15%] w-32 h-32 bg-[#FFD6F3] rounded-full flex items-center justify-center border-4 border-black sticker-shadow"
        >
          <svg viewBox="0 0 100 100" className="absolute w-full h-full">
            <path id="curve-pink" d="M 10, 50 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="transparent" />
            <text className="text-[11px] font-black uppercase tracking-widest" fill="black">
              <textPath href="#curve-pink" startOffset="0%">STUDY HARD • STUDY HARD •</textPath>
            </text>
          </svg>
        </motion.div>

        {/* Yellow Circular Sticker */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] right-[8%] md:right-[12%] w-24 h-24 bg-[#FFF8D6] rounded-full flex items-center justify-center border-[3px] border-black sticker-shadow-sm"
        >
          <svg viewBox="0 0 100 100" className="absolute w-full h-full">
            <path id="curve-yellow" d="M 20, 50 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" fill="transparent" />
            <text className="text-[10px] font-black uppercase tracking-widest" fill="black">
              <textPath href="#curve-yellow" startOffset="0%">KEEP GOING • KEEP GOING •</textPath>
            </text>
          </svg>
        </motion.div>

        {/* Pill Stickers */}
        <motion.div 
          animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-[20%] md:left-[25%] bg-white border-2 border-black rounded-full px-5 py-2.5 flex items-center gap-3 sticker-shadow"
        >
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
            <Coffee size={14} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Coffee Break</span>
        </motion.div>

        <motion.div 
          animate={{ rotate: [3, -3, 3], y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[18%] right-[20%] md:right-[25%] bg-white border-2 border-black rounded-full px-5 py-2.5 flex items-center gap-3 sticker-shadow"
        >
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
            <Book size={14} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Exam Prep</span>
        </motion.div>

        <motion.div 
          animate={{ rotate: [-8, 8, -8], y: [0, 5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[35%] left-[8%] md:left-[22%] bg-white border-2 border-black rounded-full px-5 py-2.5 flex items-center gap-3 sticker-shadow"
        >
          <div className="w-8 h-8 bg-[#FFD6F3] border-2 border-black rounded-full flex items-center justify-center text-black">
            <Heart size={14} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Group Study</span>
        </motion.div>
        
        {/* Hand-drawn flourish (Scribble) on the right */}
        <motion.svg 
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute top-[50%] right-[15%] md:right-[20%] w-24 h-40 text-black drop-shadow-lg" 
          viewBox="0 0 100 150"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M 10 10 C 90 20, 80 60, 40 80 C 10 100, 30 130, 90 140" />
        </motion.svg>
      </div>

      {/* Professional CSS-based iPhone 15 Pro Shell Wrapper */}
      <div className="relative w-[300px] md:w-[320px] aspect-[9/19] z-10 p-[12px] bg-black rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-4 border-gray-900 group">
        
        {/* Dynamic Island (The Notch) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-center gap-1 overflow-hidden">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
        </div>

        {/* App Screen Content Overlay (Professional nesting) */}
        <div className="relative h-full w-full rounded-[2.8rem] overflow-hidden bg-white px-5 pt-8 flex flex-col z-10 transition-transform group-hover:scale-[0.99] duration-500">
          
          {/* Status Bar Section */}
          <div className="flex justify-between items-center mb-6 pt-2">
            <div className="flex items-center gap-2">
               <div className="relative">
                 <img src={asset_nusrat} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="profile" />
                 <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#E0DAFF] rounded-full flex items-center justify-center border-2 border-white">
                   <Plus size={10} className="text-[#6C5CE7]" />
                 </div>
               </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-black/5 shadow-sm">
               <Bell size={18} className="text-gray-400" />
            </div>
          </div>

          {/* Lime Green Header Card */}
          <div className="bg-brand-lime p-5 tracking-tight mb-6 flex flex-col gap-4 rounded-[2.5rem] border-2 border-black sticker-shadow-sm min-h-[140px]">
             <div className="flex items-center gap-2 mb-1">
               <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                 <Sparkles size={8} className="text-brand-lime" />
               </div>
               <span className="text-[11px] font-black uppercase text-black/60">Ready to Ace?</span>
             </div>
             <h3 className="text-xl md:text-2xl font-black leading-[1.1] text-black">What are we<br/>studying next?</h3>
             <div className="relative mt-auto">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30">
                 <Search size={14} />
               </div>
               <input 
                 disabled
                 placeholder="Search a subject..." 
                 className="w-full bg-white/40 border border-black/10 rounded-2xl py-3 pl-10 text-[10px] font-bold text-black placeholder:text-black/30 outline-none" 
               />
             </div>
          </div>

          {/* Timeline Countdown Section */}
          <div className="px-1 mb-6">
             <div className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-4 px-2">Next Milestone</div>
             <div className="flex items-center justify-between p-3 bg-white border-2 border-black/5 rounded-3xl shadow-sm group/item cursor-pointer hover:border-black/10">
                <div className="flex items-center gap-4">
                   <div className="text-xl">🇧🇩</div>
                   <div>
                     <div className="text-[10px] font-black leading-none mb-1">CSE342 Final Exam</div>
                     <div className="text-[9px] font-bold text-black/40">In 2 days • East Delta University</div>
                   </div>
                </div>
                <div className="text-gray-300 group-hover/item:text-black transition-colors">
                   <Send className="rotate-45" size={14} />
                </div>
             </div>
          </div>

          {/* Vertical Study Group Cards (The "Mosaics") */}
          <div className="px-1 flex flex-col gap-2 flex-1 overflow-hidden">
             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                {[
                  { color: 'bg-brand-lavender', title: 'Group Study', label: '12 Online', icon: '💜' },
                  { color: 'bg-brand-skyblue', title: 'Solo Focus', label: 'Live Now', icon: '💎' },
                  { color: 'bg-brand-yellow', title: 'Library', label: 'Quiet Room', icon: '🏛️' },
                ].map((card, i) => (
                  <div key={i} className={`${card.color} min-w-[140px] h-44 rounded-[2.5rem] p-5 border-2 border-black sticker-shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 cursor-pointer`}>
                     <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-xl bg-white/40 border border-black/5 flex items-center justify-center shadow-inner">
                           {card.icon}
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                     </div>
                     <div className="mt-4">
                        <div className="text-[11px] font-black uppercase mb-1">{card.title}</div>
                        <div className="flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-[9px] font-bold text-black/40 uppercase tracking-widest">{card.label}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             {/* Bottom Filters */}
             <div className="pt-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-3 px-2">Next circles</div>
                <div className="flex gap-2 px-1">
                   {['All', 'Theory', 'Quiz', 'Lab'].map((tag, i) => (
                     <div key={i} className={`px-4 py-2 rounded-full border-2 border-black text-[9px] font-black uppercase tracking-widest shadow-sm ${i === 0 ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        {tag}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const TypographyBreak = () => {
  const pillars = [
    {
      title: "Deep Focus Sessions",
      desc: "Sync your Pomodoro timers with friends to eliminate distractions and stay in the deep-work zone for hours.",
      icon: <Timer className="w-6 h-6 text-brand-purple" />,
      color: "bg-pastel-pink/30",
      tag: "Deep Work"
    },
    {
      title: "Collaborative Circles",
      desc: "Join live study rooms with students from BUET, DU, EDU and more. Share resources and ace exams together.",
      icon: <UsersIcon className="w-6 h-6 text-brand-purple" />,
      color: "bg-pastel-blue/30",
      tag: "Community"
    },
    {
      title: "Gamified Progress",
      desc: "Earn focus points, climb the university leaderboards, and celebrate every academic milestone with your peers.",
      icon: <TrendingUp className="w-6 h-6 text-brand-purple" />,
      color: "bg-pastel-green/30",
      tag: "Growth"
    }
  ];

  return (
    <section className="px-6 md:px-12 py-40 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-24">
        <div className="max-w-xl">
           <h2 className="text-4xl md:text-6xl font-black font-heading leading-[1.05] tracking-tight mb-8">
             Stay focused without<br />ever feeling <span className="text-brand-purple italic">alone.</span>
           </h2>
           <p className="text-lg text-[#555555] font-medium font-body leading-relaxed">
             We bridge the gap between solo studying and group excellence. Built for students who want to stay focused while staying connected.
           </p>
        </div>
        <div className="hidden lg:block pb-5">
           <div className="flex -space-x-4">
              {[asset_adnan, asset_nusrat, asset_tanvir, asset_anika].map((img, i) => (
                <img key={i} src={img} className="w-14 h-14 rounded-full border-4 border-white shadow-xl object-cover" alt="user" />
              ))}
              <div className="w-14 h-14 rounded-full bg-brand-purple border-4 border-white shadow-xl flex items-center justify-center text-white text-xs font-black">
                +1k
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((pillar, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="group p-10 rounded-[3.5rem] bg-[#F9FAFB] border border-gray-100/50 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-default"
          >
            <div className={`w-16 h-16 ${pillar.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
              {pillar.icon}
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-brand-purple/5 text-[#6C5CE7] text-[9px] font-black uppercase tracking-widest mb-4">
              {pillar.tag}
            </div>
            <h3 className="text-2xl font-black font-heading mb-4 tracking-tight text-black">{pillar.title}</h3>
            <p className="text-[#666666] leading-relaxed font-body text-sm">
              {pillar.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const NodeGraph = () => {
  const users = [
    { name: 'Adnan', x: 10, y: 15, color: 'bg-pastel-pink', avatar: asset_adnan },
    { name: 'Nusrat', x: 85, y: 20, color: 'bg-pastel-blue', avatar: asset_nusrat },
    { name: 'Tanvir', x: 15, y: 75, color: 'bg-pastel-green', avatar: asset_tanvir },
    { name: 'Anika', x: 80, y: 80, color: 'bg-pastel-yellow', avatar: asset_anika },
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
