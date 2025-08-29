import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, getCategoryInfo } from '../../utils/serviceCategories';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function PopularServices() {
  const navigate = useNavigate();
  const serviceCategories = getAllCategories();
  
  // Use the scroll animation hook
  useScrollAnimation('.service-card', 50);

  return (
    <section className="py-16 bg-white">
      <style jsx>{`
        .service-card {
          opacity: 0;
          transition: all 0.5s ease;
          transform: scale(0.95);
        }
        
        .service-card.active {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Services
          </h2>
          <p className="text-xl text-gray-600">
            Most requested services in your area
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {serviceCategories.slice(0, 12).map((categoryName) => {
            const categoryInfo = getCategoryInfo(categoryName);
            
            return (
              <button
                key={categoryName}
                onClick={() => navigate(`/services?category=${categoryName}`)}
                className="service-card bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl text-left group hover:border-primary-300 relative overflow-hidden transition-all duration-300"
              >
                {/* Subtle accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-700 transition-colors duration-300 mb-2">
                    {categoryName}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                    {categoryInfo.description}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="mt-3 flex justify-end">
                    <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
