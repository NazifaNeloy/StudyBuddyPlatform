import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import SocialProof, { TiltedCards } from '../components/landing/Sections';
import { AppShowcase, TypographyBreak, NodeGraph } from '../components/landing/AdvancedSections';
import { RegistrationStrip, Footer } from '../components/landing/FooterAndReg';

const LandingPage = () => {
  return (
    <div className="bg-brand-white min-h-screen text-brand-black selection:bg-brand-purple selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <div id="about"><SocialProof /></div>
      <div id="features">
        <TiltedCards />
        <AppShowcase />
      </div>
      <div id="leaderboard"><TypographyBreak /></div>
      <div id="groups"><NodeGraph /></div>
      <RegistrationStrip />
      <Footer />
    </div>
  );
};

export default LandingPage;
