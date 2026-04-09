import React from 'react';
import { motion } from 'framer-motion';
import { Search, Users as UsersIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import adnanImg from '../../assets/asset_adnan.png';
import nusratImg from '../../assets/asset_nusrat.png';
import tanvirImg from '../../assets/asset_tanvir.png';

const SocialProof = () => {
  const testimonials = [
    {
      text: "No more boring solo study. StudyBuddy makes prep feel like a team sport!",
      name: "Arif Ahmed",
      role: "CSE Student, EDU",
      avatar: adnanImg,
      bgColor: "bg-[#FFF8D6]" // Yellow
    },
    {
      text: "The synced timer is a total gamechanger for my web dev prep. Team love it!",
      name: "Nabila Islam",
      role: "Web Developer",
      avatar: nusratImg,
      bgColor: "bg-[#D6FFE4]" // Mint Green
    },
    {
      text: "Meeting study partners across Dhaka and beyond is so easy now. Thanks!",
      name: "Siam Rahman",
      role: "Admissions Aspirant",
      avatar: tanvirImg,
      bgColor: "bg-[#E0DAFF]" // Lavender
    }
  ];

  return (
    <section className="px-6 md:px-12 py-32 bg-[#F9FAFB] border-y border-gray-50">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-black font-heading mb-20 text-[#1A1A1A]">Everyone loves it!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {testimonials.map((testi, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col gap-8 h-full"
            >
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-[#555555] font-body">"{testi.text}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className={`w-14 h-14 rounded-full ${testi.bgColor} flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0`}>
                  <img src={testi.avatar} alt={testi.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-black text-lg text-[#1A1A1A] leading-tight mb-1">{testi.name}</div>
                  <div className="text-[10px] text-[#A1A1A1] font-black uppercase tracking-[0.15em]">{testi.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TiltedCards = () => {
  const [cards, setCards] = React.useState([
    { title: "CSE342 Data Structures", info: "5 Members - Focus Active", color: "bg-[#FFD6F3]", rotate: "-5deg" },
    { title: "IELTS Speaking Practice", info: "8 Members - Live Sync", color: "bg-[#B8E1FF]", rotate: "2deg" },
    { title: "SQL Midterm Prep", info: "12 Members - Resource Rich", color: "bg-[#FFEADB]", rotate: "-3deg" },
    { title: "BBA Finance", info: "4 Members - Deep Focus", color: "bg-[#C1FF72]", rotate: "5deg" },
  ]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLiveCircles = async () => {
      try {
        const { data, error } = await supabase
          .from('study_circles')
          .select(`
            *,
            member_count:circle_members(count)
          `)
          .limit(4);
        
        if (data && data.length > 0) {
          const colors = ["bg-[#FFD6F3]", "bg-[#B8E1FF]", "bg-[#FFEADB]", "bg-[#C1FF72]"];
          const rotates = ["-5deg", "2deg", "-3deg", "5deg"];
          
          const transformed = data.map((circle, i) => ({
            title: circle.name,
            info: `${circle.member_count?.[0]?.count || 0} Members - ${circle.priority} Priority`,
            color: colors[i % colors.length],
            rotate: rotates[i % rotates.length]
          }));
          setCards(transformed);
        }
      } catch (err) {
        console.error('Failed to sync live cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveCircles();
  }, []);

  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto w-full overflow-visible">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
        <div className="max-w-2xl">
           <h2 className="text-4xl md:text-7xl font-black font-heading leading-[0.95] tracking-tight mb-6">
             Explore Thousands<br/>Of New Study Circles<br/>Everyday
           </h2>
        </div>
        <div className="relative w-full max-w-sm">
          <input 
            type="text" 
            placeholder="Search name or company name..." 
            className="w-full bg-white border-2 border-gray-50 rounded-full py-5 pl-8 pr-16 shadow-2xl focus:ring-4 focus:ring-[#6C5CE7]/10 outline-none transition-all placeholder:opacity-50"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform">
            <Search className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-row overflow-x-auto lg:overflow-visible gap-8 lg:gap-12 items-stretch justify-start lg:justify-center py-20 no-scrollbar -mx-6 px-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.08, zIndex: 50, rotate: "0deg" }}
            initial={{ rotate: card.rotate }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-[320px] min-w-[320px] h-[400px] ${card.color} rounded-[3rem] p-10 shadow-2xl border-[6px] border-white flex flex-col justify-between cursor-pointer relative overflow-hidden`}
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-100/50">
              <UsersIcon className="w-8 h-8 text-black" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black font-heading leading-[1.1] mb-6 tracking-tight">{card.title}</h3>
              <div className="flex flex-wrap gap-2">
                {card.info.split(' - ').map((tag, idx) => (
                  <span key={idx} className="text-[9px] font-black bg-white/40 px-3 py-1.5 rounded-full uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-auto pt-8 border-t border-black/5 flex items-center justify-between group">
               <div className="text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">Join Circle</div>
               <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                 <Search className="w-5 h-5" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SocialProof;
