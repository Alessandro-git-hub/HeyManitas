// Example of how ServiceCard can be reused in different contexts

import React from 'react';
import ServiceCard from './ServiceCard';

// Example 1: Read-only service display (for customer view)
export function CustomerServiceCard({ service }) {
  return (
    <ServiceCard 
      service={service}
      showActions={false} // Hide edit/delete/toggle actions for customers
    />
  );
}

// Example 2: Service card with custom actions
export function ServiceCardWithBooking({ service, onBook }) {
  return (
    <div className="relative">
      <ServiceCard 
        service={service}
        showActions={false} // Hide default actions
      />
      {/* Custom booking action overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => onBook && onBook(service)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Book This Service
        </button>
      </div>
    </div>
  );
}

// Example 3: Minimal service card for dashboard/summary views
export function MiniServiceCard({ service }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium text-gray-900">{service.name}</h4>
          <p className="text-sm text-gray-600">{service.category}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">€{service.basePrice}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${
            service.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}
