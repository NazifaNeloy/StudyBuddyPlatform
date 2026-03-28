import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import SocialProof, { TiltedCards } from '../components/landing/Sections';
import { AppShowcase, TypographyBreak, NodeGraph } from '../components/landing/AdvancedSections';
import { RegistrationStrip, Footer } from '../components/landing/FooterAndReg';

const LandingPage = () => {
  return (
    <div className="bg-brand-white min-h-screen text-brand-black selection:bg-brand-purple selection:text-white">
      <Navbar />
      <Hero />
      <SocialProof />
      <TiltedCards />
      <AppShowcase />
      <TypographyBreak />
      <NodeGraph />
      <RegistrationStrip />
      <Footer />
    </div>
  );
};

export default LandingPage;
