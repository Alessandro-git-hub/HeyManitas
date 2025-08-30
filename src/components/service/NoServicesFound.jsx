import React from 'react';
import Icon from '../common/Icon';

const NoServicesFound = () => {
  return (
    <div className="text-center py-16 relative z-1">
      <div className="text-primary-700 mb-4 flex justify-center">
        <Icon name="search" size={64} />
      </div>
      <h3 className="text-2xl font-bold text-primary-700 mb-2">
        No services found
      </h3>
      <p className="text-primary-700">
        Try searching with different keywords
      </p>
    </div>
  );
};

export default NoServicesFound;
