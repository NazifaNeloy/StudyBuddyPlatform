import React from 'react';
import Navbar from '../components/landing/Navbar';
import SocialProof, { TiltedCards } from '../components/landing/Sections';
import { AppShowcase, TypographyBreak, NodeGraph } from '../components/landing/AdvancedSections';
import { RegistrationStrip, Footer } from '../components/landing/FooterAndReg';

import CommunityHero from '../components/landing/CommunityHero';

const LandingPage = () => {
  return (
    <div className="bg-background text-on-surface transition-colors duration-300">
      <Navbar />
      
      {/* 1. Community Bento Section */}
      <CommunityHero />

      {/* 2. Study Group Boxes (The Boxes of groups) */}
      <div id="features">
        <TiltedCards />
      </div>

      {/* 4. Original Footer Components */}
      <div className="bg-white">
        <div id="leaderboard"><TypographyBreak /></div>
        <AppShowcase />
        {/* 2. Social Proof / Testimonials moved here */}
        <div id="about" className="bg-surface-container-low transition-colors duration-300 py-20 px-6 md:px-12">
          <SocialProof />
        </div>

        <div id="groups"><NodeGraph /></div>

        <RegistrationStrip />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
