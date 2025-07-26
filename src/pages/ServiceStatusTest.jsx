import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

export default function ServiceStatusTest() {
  const [allServices, setAllServices] = useState([]);
  const [activeServices, setActiveServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        // Fetch all services
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesData = [];
        querySnapshot.forEach((doc) => {
          servicesData.push({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          });
        });
        
        setAllServices(servicesData);
        
        // Filter active services (same logic as JobFormModal)
        const activeOnly = servicesData.filter(service => service.isActive);
        setActiveServices(activeOnly);
        
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Status Test</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* All Services */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              All Services ({allServices.length})
            </h2>
            <div className="space-y-3">
              {allServices.map(service => (
                <div 
                  key={service.id}
                  className={`p-3 rounded border ${
                    service.isActive 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.category}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Services Only (Job Creation View) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Services Available for Jobs ({activeServices.length})
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These are the services that appear in the job creation dropdown.
            </p>
            <div className="space-y-3">
              {activeServices.length > 0 ? (
                activeServices.map(service => (
                  <div 
                    key={service.id}
                    className="p-3 rounded border border-blue-200 bg-blue-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.category}</p>
                        <p className="text-sm text-blue-600 font-medium">€{service.basePrice}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No active services available for job creation.</p>
                  <p className="text-sm mt-1">Activate some services to see them here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All services are stored in Firestore with an `isActive` field</li>
            <li>• When you deactivate a service, it's marked as `isActive: false` in the database</li>
            <li>• The job creation modal only fetches services where `isActive: true`</li>
            <li>• Inactive services won't appear in the job creation dropdown</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
