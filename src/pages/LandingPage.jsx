import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import SocialProof, { TiltedCards } from '../components/landing/Sections';
import { AppShowcase, TypographyBreak, NodeGraph } from '../components/landing/AdvancedSections';
import { RegistrationStrip, Footer } from '../components/landing/FooterAndReg';

import CommunityHero from '../components/landing/CommunityHero';

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen text-brand-black selection:bg-brand-lime overflow-x-hidden">
      <Navbar />
      
      {/* 1. Community Bento Section */}
      <CommunityHero />

      {/* 2. Social Proof / Testimonials */}
      <div id="about" className="bg-[#F8F9FA] py-20 px-6 md:px-12">
        <SocialProof />
      </div>

      {/* 3. Study Group Boxes (The Boxes of groups) */}
      <div id="features" className="py-32 px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-black text-center mb-16 tracking-tight">Explore a Thousand<br/>Of New Study Circles Everyday</h2>
        <TiltedCards />
      </div>

      {/* 4. 'Buddy' Sticker & Identity Section (The Final Statement) */}
      <div className="bg-[#F2EFE9] border-t border-black/5">
        <Hero />
      </div>

      {/* 5. Original Footer Components */}
      <div className="bg-white">
        <div id="leaderboard"><TypographyBreak /></div>
        <div id="groups"><NodeGraph /></div>
        <AppShowcase />
        <RegistrationStrip />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
