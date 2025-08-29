import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import HeroSection from '../components/sections/HeroSection';
import PopularServices from '../components/sections/PopularServices';
import HowItWorks from '../components/sections/HowItWorks';
import WorkerCTA from '../components/sections/WorkerCTA';
import Footer from '../components/sections/Footer';

export default function Home() {
  return (
    <div className="bg-white overflow-x-hidden w-full" style={{ maxWidth: '100vw' }}>
      <AppLayout showPublicNav={true} className="bg-white">
        <HeroSection />
        <PopularServices />
        <HowItWorks />
        <WorkerCTA />
        <Footer />
      </AppLayout>
    </div>
  );
}
