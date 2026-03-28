import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Timer, 
  Trophy, 
  Calendar, 
  ChevronRight, 
  Plus,
  Zap,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  const stats = [
    { label: 'Focus Hours', value: '12.4H', icon: Timer, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total XP', value: '2,450', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Study Circles', value: '4', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Badges', value: '7', icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const circles = [
    { name: 'Advanced Calculus', members: 12, active: true, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=200' },
    { name: 'Quantum Physics', members: 8, active: true, image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=200' },
    { name: 'Neurobiology 101', members: 15, active: false, image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=200' },
  ];

  const sessions = [
    { time: '14:00 - 15:30', title: 'Deep Work: Vector Spaces', date: 'Today', icon: BookOpen },
    { time: '17:45 - 19:00', title: 'Exam Prep: Cell Division', date: 'Tomorrow', icon: Calendar },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Focus Mode: <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent italic">Activated</span>
          </h1>
          <p className="text-gray-400 decoration-gray-600 underline underline-offset-4 font-medium">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-white/90 transition-all shadow-xl active:scale-95 text-sm md:text-base">
          <Plus className="w-5 h-5" />
          Create New Circle
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-5 rounded-3xl border border-white/5 hover:border-white/20 transition-all group"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Study Circles List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              My Study Circles
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">Active Now</span>
            </h2>
            <button className="text-sm text-gray-500 hover:text-white flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {circles.map((circle, i) => (
              <motion.div
                key={circle.name}
                whileHover={{ y: -5 }}
                className="glass p-4 rounded-[2rem] border border-white/5 flex items-center gap-4 cursor-pointer"
              >
                <div className="relative">
                  <img src={circle.image} alt={circle.name} className="w-16 h-16 rounded-2xl object-cover" />
                  {circle.active && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0c0c0e] rounded-full animate-bounce" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{circle.name}</h3>
                  <p className="text-xs text-gray-500">{circle.members} members</p>
                  <div className="mt-2 flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0c0c0e] bg-gray-800" />
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-[#0c0c0e] bg-white/10 flex items-center justify-center text-[8px] font-bold text-gray-400">
                      +{circle.members - 3}
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions & Badges */}
        <div className="space-y-8">
          <div className="glass p-6 rounded-[2rem] border border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              Next Sessions
              <Calendar className="w-5 h-5 text-blue-400" />
            </h2>
            <div className="space-y-6">
              {sessions.map((session, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-black transition-all">
                      <session.icon className="w-5 h-5" />
                    </div>
                    {i < sessions.length - 1 && <div className="flex-1 w-0.5 bg-white/5 my-2" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{session.date}</div>
                    <div className="font-bold text-sm mb-1 group-hover:text-blue-400 transition-colors">{session.title}</div>
                    <div className="text-xs text-gray-500">{session.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold border border-white/5 transition-all active:scale-[0.98]">
              View Schedule
            </button>
          </div>

          {/* Gamification Badges Preview */}
          <div className="glass bg-gradient-to-br from-yellow-500/10 to-transparent p-6 rounded-[2rem] border border-yellow-500/10 overflow-hidden relative group cursor-pointer">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 relative">
              Your Artifacts
              <Trophy className="w-5 h-5 text-yellow-500" />
            </h2>
            <div className="flex gap-3 relative overflow-hidden">
               {['🔥', '🛡️', '⚡', '🌌'].map((emoji, i) => (
                 <div key={i} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl border border-white/5 hover:scale-110 transition-transform">
                   {emoji}
                 </div>
               ))}
               <div className="w-12 h-12 bg-yellow-500/20 text-yellow-500 rounded-2xl flex items-center justify-center text-xs font-bold border border-yellow-500/20">
                 +12
               </div>
            </div>
            <p className="text-xs text-yellow-500/80 mt-4 font-bold tracking-widest uppercase">78% to level 12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
