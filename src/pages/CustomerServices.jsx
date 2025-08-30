import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import CustomerNavigation from '../components/layout/CustomerNavigation';
import ServiceSearchSection from '../components/service/ServiceSearchSection';
import PopularServicesSection from '../components/service/PopularServicesSection';
import ServicesGrid from '../components/service/ServicesGrid';
import NoServicesFound from '../components/service/NoServicesFound';
import { useAuth } from '../contexts/AuthContext';
import { getServiceCategories, filterServices, createServiceNavigation } from '../components/service/serviceHelpers';

const CustomerServices = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Load search query from URL parameters
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Get all service categories
  const allCategories = getServiceCategories();
  
  // Filter categories based on search term
  const filteredCategories = filterServices(allCategories, searchTerm);
  
  // Create navigation handler
  const handleServiceSelect = createServiceNavigation(navigate, user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Custom styles for mobile carousel */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Subtle dots background pattern */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle,rgba(205,169,97,0.2)_1px,transparent_1px)]
        bg-[length:22px_22px]" />

      {/* Header */}
      <div className="relative z-20">
        <AppHeader showPublicNav={!user} />
      </div>
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4 pt-16 md:pt-20 relative z-10">
        {/* Navigation - only show for authenticated users */}
        {user && <CustomerNavigation />}
        
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-2 mt-8">Find Services</h1>
          <p className="text-lg text-primary-700">Choose the service you need</p>
          {!user && (
            <p className="text-sm text-primary-700 mt-2">
              Sign in after selecting a service to book professionals
            </p>
          )}
        </div>

        {/* Search Section */}
        <ServiceSearchSection 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Popular This Week Section */}
        <PopularServicesSection
          categories={allCategories}
          onServiceSelect={handleServiceSelect}
        />

        {/* All Services Grid */}
        <ServicesGrid
          categories={filteredCategories}
          onServiceSelect={handleServiceSelect}
        />

        {/* No Results */}
        {filteredCategories.length === 0 && <NoServicesFound />}
      </div>
    </div>
  );
};

export default CustomerServices;
