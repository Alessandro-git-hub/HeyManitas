import { useState, useCallback } from 'react';

/**
 * Custom hook for form validation
 * 
 * Provides reusable form validation logic with error handling
 */
export const useFormValidation = (validationRules) => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;

    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return rule.requiredMessage || `${name} is required`;
    }

    if (rule.min && value < rule.min) {
      return rule.minMessage || `${name} must be at least ${rule.min}`;
    }

    if (rule.max && value > rule.max) {
      return rule.maxMessage || `${name} must be at most ${rule.max}`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.patternMessage || `${name} format is invalid`;
    }

    if (rule.custom && !rule.custom(value)) {
      return rule.customMessage || `${name} is invalid`;
    }

    return null;
  }, [validationRules]);

  const validateForm = useCallback((formData) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, validationRules]);

  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateForm,
    validateField,
    clearFieldError,
    clearAllErrors,
    setErrors
  };
};

// Common validation rules
export const ValidationRules = {
  required: (message) => ({ required: true, requiredMessage: message }),
  minNumber: (min, message) => ({ min, minMessage: message }),
  maxNumber: (max, message) => ({ max, maxMessage: message }),
  pattern: (pattern, message) => ({ pattern, patternMessage: message }),
  custom: (fn, message) => ({ custom: fn, customMessage: message }),
  
  // Predefined common rules
  requiredText: (fieldName) => ({
    required: true,
    requiredMessage: `${fieldName} is required`
  }),
  
  positiveNumber: (fieldName) => ({
    required: true,
    requiredMessage: `${fieldName} is required`,
    custom: (value) => value > 0,
    customMessage: `${fieldName} must be greater than 0`
  }),
  
  email: {
    required: true,
    requiredMessage: 'Email is required',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: 'Please enter a valid email address'
  }
};