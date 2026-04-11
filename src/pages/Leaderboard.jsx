import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import { Footer } from '../components/landing/FooterAndReg';
import { motion } from 'framer-motion';
import { Search, Trophy, Timer, Users as UsersIcon, Star, Filter, ArrowUpRight } from 'lucide-react';

// Import all authentic student photos
import asset_adnan from '../assets/asset_adnan.png';
import asset_nusrat from '../assets/asset_nusrat.png';
import asset_tanvir from '../assets/asset_tanvir.png';
import asset_anika from '../assets/asset_anika.png';
import asset_siam from '../assets/asset_siam.png';
import asset_nabila from '../assets/asset_nabila.png';
import asset_sami from '../assets/asset_sami.png';
import asset_fariha from '../assets/asset_fariha.png';

const leaderboardData = [
  { id: 1, name: "Siam Rahman", uni: "BUET", time: "192 hours", circles: 105, points: 1215, avatar: asset_siam },
  { id: 2, name: "Nusrat Jahan", uni: "Dhaka University", time: "186 hours", circles: 97, points: 1190, avatar: asset_nusrat },
  { id: 3, name: "Adnan Sami", uni: "North South University", time: "160 hours", points: 1080, circles: 72, avatar: asset_adnan },
  { id: 4, name: "Nabila Islam", uni: "BRAC University", time: "142 hours", circles: 89, points: 980, avatar: asset_nabila },
  { id: 5, name: "Tanvir Ahmed", uni: "IUT", time: "123 hours", circles: 85, points: 975, avatar: asset_tanvir },
  { id: 6, name: "Anika Tabassum", uni: "East West University", time: "120 hours", circles: 82, points: 865, avatar: asset_anika },
  { id: 7, name: "Samiul Haque", uni: "Chittagong University", time: "115 hours", circles: 76, points: 760, avatar: asset_sami },
  { id: 8, name: "Fariha Ahmed", uni: "Jahangirnagar University", time: "102 hours", circles: 74, points: 755, avatar: asset_fariha },
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('This month');
  const tabs = ['All time', 'This month', 'This week'];

  return (
    <div className="bg-[#F9FAFB] min-h-screen text-black selection:bg-brand-purple selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Leaderboard Container - Bento style */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="p-8 md:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight mb-2">General Leaderboard</h1>
              <p className="text-gray-400 font-medium">Top performers across Bangladesh this season.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search student..." 
                  className="w-full bg-[#F3F4F6] border-none rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium placeholder:text-gray-400"
                />
              </div>

              {/* Tabs */}
              <div className="bg-[#F3F4F6] p-1.5 rounded-2xl flex items-center gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                      activeTab === tab 
                        ? 'bg-white text-brand-purple shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">
                  <th className="px-10 py-6 font-black">#</th>
                  <th className="px-6 py-6 font-black">Name</th>
                  <th className="px-6 py-6 font-black">University</th>
                  <th className="px-6 py-6 font-black">Learning Time</th>
                  <th className="px-6 py-6 font-black">Circles Joined</th>
                  <th className="px-6 py-6 font-black">Total Point</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leaderboardData.map((student, idx) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-gray-50/50 transition-colors cursor-default"
                  >
                    {/* Rank */}
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full font-black text-lg">
                        {idx === 0 ? (
                          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-yellow-200">
                            1
                          </div>
                        ) : idx === 1 ? (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white shadow-lg shadow-gray-200">
                            2
                          </div>
                        ) : idx === 2 ? (
                          <div className="w-10 h-10 bg-[#CD7F32] rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-100">
                            3
                          </div>
                        ) : (
                          <span className="text-gray-300">#{idx + 1}</span>
                        )}
                      </div>
                    </td>

                    {/* Name & Photo */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={student.avatar} 
                            alt={student.name} 
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform" 
                          />
                          {idx < 3 && (
                            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                              <Trophy size={12} className={idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : "text-orange-500"} />
                            </div>
                          )}
                        </div>
                        <span className="font-black text-brand-black text-lg tracking-tight group-hover:text-brand-purple transition-colors">
                          {student.name}
                        </span>
                      </div>
                    </td>

                    {/* University */}
                    <td className="px-6 py-6">
                      <span className="text-gray-500 font-bold bg-gray-100/50 px-4 py-1.5 rounded-full text-xs">
                        {student.uni}
                      </span>
                    </td>

                    {/* Learning Time */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 font-black text-gray-700">
                        <Timer size={16} className="text-brand-purple/40" />
                        {student.time}
                      </div>
                    </td>

                    {/* Circles */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 font-black text-gray-700">
                        <UsersIcon size={16} className="text-brand-purple/40" />
                        {student.circles} circles
                      </div>
                    </td>

                    {/* Points */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <Star size={18} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-black font-heading tracking-tight text-brand-black">{student.points}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-10 py-6 text-right">
                      <button className="p-3 rounded-xl bg-gray-100 text-gray-400 hover:bg-brand-purple hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                        <ArrowUpRight size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer of the Bento */}
          <div className="bg-gray-50/50 p-8 flex items-center justify-between border-t border-gray-50">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Updating live · Next season in 12 days</p>
            <div className="flex gap-2">
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">Your Stats</button>
              <button className="px-6 py-3 bg-brand-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10">Share Profile</button>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
