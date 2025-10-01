import React from 'react';

/**
 * Reusable Form Field Component
 * 
 * Provides consistent styling and behavior for form inputs across modals
 */

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  disabled = false, 
  required = false,
  placeholder,
  className = '',
  options = [], // for select fields
  rows = 3, // for textarea
  min,
  max,
  step,
  children, // for custom content inside field
  ...props 
}) => {
  const baseInputClasses = `w-full p-3 border rounded-lg text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent disabled:opacity-50 ${
    error ? 'border-red-500' : 'border-primary-700'
  } ${className}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            rows={rows}
            className={`${baseInputClasses} placeholder-gray-400`}
            placeholder={placeholder}
            {...props}
          />
        );
      
      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              disabled={disabled}
              className="mr-2"
              {...props}
            />
            <span className="text-sm text-white">{label}</span>
          </label>
        );
      
      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={baseInputClasses}
            placeholder={placeholder}
            {...props}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="mb-4">
        {renderInput()}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">
        {label} {required && '*'}
      </label>
      {renderInput()}
      {children}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;