import React from 'react';
import ServiceSearch from '../common/ServiceSearch';

export default function HeroSection() {
  return (
    <section
      className="pt-16 md:py-16 relative overflow-hidden w-full"
      style={{ backgroundColor: '#f4dfb8', maxWidth: '100vw' }}
    >
      {/* Wavy Background - positioned in front of image but behind text */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden" style={{ width: '100%', maxWidth: '100vw' }}>
        <svg 
          viewBox="0 0 1440 320" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          style={{ maxWidth: '100%', width: '100%' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <path 
            d="M0,96L48,122.7C96,149,192,203,288,208C384,213,480,171,576,165.3C672,160,768,192,864,186.7C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L0,320Z" 
            fill="#e2c89f" 
            fillOpacity="0.4"
          />
        </svg>
      </div>

      {/* Optional: Additional wave layer for more depth */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden" style={{ width: '100%', maxWidth: '100vw' }}>
        <svg 
          viewBox="0 0 1440 320" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          style={{ maxWidth: '100%', width: '100%', transform: 'translateY(10px)' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <path 
            d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L0,320Z" 
            fill="#e2c89f" 
            fillOpacity="0.2"
          />
        </svg>
      </div>

      {/* Grid: no z-index on the container */}
      <div className="max-w-6xl mx-auto px-4 relative w-full" style={{ maxWidth: '100%' }}>
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-12 items-center w-full">
          {/* Text above waves */}
          <div className="order-1 lg:order-1 relative z-30 w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-700 mb-6">
              Find trusted professionals for any home service
            </h1>
            <div className="w-full">
              <ServiceSearch />
            </div>
            
            {/* Trust/Safety Message */}
            <div className="flex items-center justify-start mt-2 gap-2 text-primary-700">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24"
                className="text-primary-700 flex-shrink-0"
              >
                <path d="M12 2L3 7V12C3 16.97 7.03 21 12 21S21 16.97 21 12V7L12 2ZM19 12C19 15.86 15.86 19 12 19S5 15.86 5 12V8.5L12 4.5L19 8.5V12ZM15.5 9L11 13.5L8.5 11L7 12.5L11 16.5L17 10.5L15.5 9Z"/>
              </svg>
              <span className="text-sm text-primary-700">
                Secure payments, verified professionals, and no hidden fees
              </span>
            </div>
          </div>

          {/* Image under waves */}
          <div className="order-2 lg:order-2 relative z-10 py-8 w-full">
            <img
              src="/HeroSectionImage.png"
              alt="Professional handyman at work"
              className="w-[300px] md:w-auto mx-auto max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
