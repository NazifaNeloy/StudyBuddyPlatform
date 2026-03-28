import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const floatingAvatars = [
    { src: 'https://i.pravatar.cc/150?u=1', size: 'w-20 h-20 md:w-28 md:h-28', top: '5%', left: '10%' },
    { src: 'https://i.pravatar.cc/150?u=2', size: 'w-16 h-16 md:w-24 md:h-24', top: '40%', left: '0%' },
    { src: 'https://i.pravatar.cc/150?u=3', size: 'w-24 h-24 md:w-32 md:h-32', top: '10%', right: '0%' },
    { src: 'https://i.pravatar.cc/150?u=4', size: 'w-20 h-20 md:w-28 md:h-28', bottom: '10%', left: '25%' },
    { src: 'https://i.pravatar.cc/150?u=5', size: 'w-16 h-16 md:w-24 md:h-24', bottom: '5%', right: '15%' },
  ];

  const floatingEmojis = [
    { emoji: '🌭', top: '25%', left: '35%' },
    { emoji: '🛟', bottom: '30%', right: '5%' },
    { emoji: '💎', top: '15%', left: '50%' },
  ];

  const chatBubbles = [
    { text: 'LOL!', top: '10%', left: '40%', color: 'bg-black text-white' },
    { text: 'NICE!', bottom: '40%', left: '55%', color: 'bg-pastel-blue text-black' },
  ];

  return (
    <section className="relative px-6 md:px-12 pt-16 pb-32 max-w-7xl mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="relative z-10 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black font-heading leading-[1.05] tracking-tight mb-8"
          >
            Virtual<br />meeting<br />more fun<br />
            <span className="relative inline-block mt-2">
              with 
              <span className="relative z-10 ml-4">activity</span>
              <svg className="absolute -inset-2 md:-inset-4 w-[110%] h-[150%] text-red-500 -z-10 opacity-70" viewBox="0 0 200 60" fill="none" preserveAspectRatio="none">
                <path d="M5,30 Q50,5 100,5 T195,30 T100,55 T5,30" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-lg md:text-xl max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed"
          >
            Experience a new way of collaborative studying that feels more like a game than a chore.
          </motion.p>
          
          <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="bg-brand-purple text-white px-10 py-5 rounded-full font-black text-lg md:text-xl shadow-lg shadow-brand-purple/20 transition-all shadow-brutal active:translate-y-1"
          >
            Get Started
          </motion.button>
        </div>

        {/* Right Column: Floating Masonry */}
        <div className="relative h-[400px] md:h-[600px] w-full hidden sm:block">
          {floatingAvatars.map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.size} rounded-full border-4 border-white shadow-xl overflow-hidden`}
              style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
            >
              <img src={item.src} className="w-full h-full object-cover" alt="avatar" />
            </motion.div>
          ))}

          {floatingEmojis.map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl md:text-5xl"
              style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
            >
              {item.emoji}
            </motion.div>
          ))}

          {chatBubbles.map((item, i) => (
            <motion.div
              key={i}
              className={`absolute px-4 py-2 rounded-2xl font-black text-sm md:text-lg shadow-lg ${item.color}`}
              style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
              animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: i * 0.3 }}
            >
              {item.text}
            </motion.div>
          ))}
          
          {/* Background decorative circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full -z-20 opacity-40 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
