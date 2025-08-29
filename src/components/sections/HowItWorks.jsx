import React, { useRef } from 'react';
import SectionHeader from '../common/SectionHeader';
import StepCard from '../common/StepCard';
import Carousel from '../common/Carousel';
import { useCarousel } from '../../hooks/useCarousel';
import { HOW_IT_WORKS_STEPS, HOW_IT_WORKS_CONFIG } from '../../utils/howItWorksConfig';

export default function HowItWorks() {
  const sectionRef = useRef(null);
  
  const {
    currentIndex,
    prefersReducedMotion,
    goToIndex,
    goToNext,
    goToPrevious,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleKeyDown
  } = useCarousel(HOW_IT_WORKS_STEPS, HOW_IT_WORKS_CONFIG.autoPlayDelay);

  const renderMobileStep = (step, index) => (
    <StepCard 
      step={step}
      index={index}
      totalSteps={HOW_IT_WORKS_STEPS.length}
      prefersReducedMotion={prefersReducedMotion}
      showConnectingLine={false}
      variant="mobile"
    />
  );

  return (
    <section 
      ref={sectionRef}
      className="py-16 pb-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
    >
      <div 
        className="max-w-6xl mx-auto px-4 py-16 relative z-10"
        style={{ 
          maxWidth: '100vw',
          ...HOW_IT_WORKS_CONFIG.sectionStyles
        }}
      >       
        <SectionHeader 
          title="How It Works"
          subtitle="Get your tasks done in 3 simple steps"
          titleClassName='text-primary-700'
        />

        {/* Desktop: Side-by-side layout (md+) */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <StepCard 
                key={index}
                step={step}
                index={index}
                totalSteps={HOW_IT_WORKS_STEPS.length}
                prefersReducedMotion={prefersReducedMotion}
                showConnectingLine={true}
                variant="desktop"
              />
            ))}
          </div>
        </div>

        {/* Mobile: Carousel (sm and below) */}
        <div className="md:hidden">
          <Carousel
            items={HOW_IT_WORKS_STEPS}
            currentIndex={currentIndex}
            prefersReducedMotion={prefersReducedMotion}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onGoToIndex={goToIndex}
            renderItem={renderMobileStep}
            ariaLabel="How it works steps"
          />
        </div>
      </div>
    </section>
  );
}
