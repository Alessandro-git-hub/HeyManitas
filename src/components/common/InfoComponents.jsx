import React from 'react';

/**
 * InfoField - Reusable component for displaying label-value pairs
 */
export const InfoField = ({ label, value, className = "", valueClassName = "" }) => {
  if (!value) return null;
  
  return (
    <div className={className}>
      <p className="text-sm text-white">{label}</p>
      <p className={`font-medium text-primary-700 ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
};

/**
 * InfoGrid - Reusable grid container for info fields
 */
export const InfoGrid = ({ children, columns = 2 }) => {
  const gridClass = columns === 1 ? 'grid-cols-1' : 'grid grid-cols-1 md:grid-cols-2 gap-4';
  
  return (
    <div className={gridClass}>
      {children}
    </div>
  );
};

/**
 * InfoSection - Reusable section with header and content
 */
export const InfoSection = ({ 
  title, 
  children, 
  showBorder = true,
  icon = null 
}) => {
  return (
    <div className={showBorder ? "border-b border-white pb-4" : ""}>
      <h3 className="text-lg font-semibold text-primary-700 mb-3 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>
      {children}
    </div>
  );
};

/**
 * StatusBadgeField - Special field for status display
 */
export const StatusBadgeField = ({ status, getStatusStyles }) => {
  if (!status) return null;
  
  return (
    <div>
      <p className="text-sm text-white">Status</p>
      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusStyles(status, true)}`}>
        {status}
      </span>
    </div>
  );
};

/**
 * PriceField - Special field for price/money display
 */
export const PriceField = ({ label, amount, currency = "€", suffix = "", large = false }) => {
  if (!amount) return null;
  
  const valueClass = large ? "font-medium text-primary-700 text-lg" : "font-medium text-primary-700";
  const displayValue = typeof amount === 'number' ? `${currency}${amount}${suffix}` : amount;
  
  return (
    <div>
      <p className="text-sm text-white">{label}</p>
      <p className={valueClass}>{displayValue}</p>
    </div>
  );
};

/**
 * ConditionalField - Wrapper that only renders if condition is met
 */
export const ConditionalField = ({ condition, children }) => {
  return condition ? children : null;
};
