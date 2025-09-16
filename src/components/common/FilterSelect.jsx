import React from 'react';

/**
 * FilterSelect - Reusable select component for job filters
 * @param {Object} props
 * @param {string} props.label - Label text for the select
 * @param {string} props.value - Current selected value
 * @param {Function} props.onChange - Change handler function
 * @param {Array} props.options - Array of {value, label} objects for options
 */
const FilterSelect = ({ label, value, onChange, options }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-primary-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-white border border-primary-700 rounded-lg text-sm 
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                 transition-all duration-200 hover:border-primary-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
