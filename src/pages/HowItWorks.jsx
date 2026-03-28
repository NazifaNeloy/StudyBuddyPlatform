import React from 'react';
import BentoNavbar from '../components/how-it-works/BentoNavbar';
import BentoHero from '../components/how-it-works/BentoHero';
import GradeCarousel from '../components/how-it-works/GradeCarousel';
import FeatureGrid from '../components/how-it-works/FeatureGrid';
import CommunityBanner from '../components/how-it-works/CommunityBanner';
import { Footer } from '../components/landing/FooterAndReg';

const HowItWorks = () => {
  return (
    <div className="bg-[#FDFCF8] min-h-screen text-black selection:bg-black selection:text-white">
      <BentoNavbar />
      <BentoHero />
      <GradeCarousel />
      <FeatureGrid />
      <CommunityBanner />
      <Footer />
    </div>
  );
};

export default HowItWorks;
