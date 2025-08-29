import React from 'react';
import AppHeader from '../components/layout/AppHeader';
import HeroSection from '../components/sections/HeroSection';
import PopularServices from '../components/sections/PopularServices';
import HowItWorks from '../components/sections/HowItWorks';
import WorkerCTA from '../components/sections/WorkerCTA';
import Footer from '../components/sections/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full" style={{ maxWidth: '100vw' }}>
      <AppHeader showPublicNav={true} />
      <HeroSection />
      <PopularServices />
      <HowItWorks />
      <WorkerCTA />
      <Footer />
    </div>
  );
}
