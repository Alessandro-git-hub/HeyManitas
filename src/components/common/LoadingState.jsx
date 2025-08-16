import React from 'react';

/**
 * Loading State Component
 * 
 * A reusable loading component that provides consistent loading states across the app
 * 
 * Props:
 * @param {string} size - Size of the spinner: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} text - Loading text to display (optional)
 * @param {boolean} fullScreen - Whether to take full screen space (default: false)
 * @param {string} className - Additional CSS classes
 */
export default function LoadingState({ 
  size = 'md', 
  text, 
  fullScreen = false, 
  className = '' 
}) {
  
  // Size configuration for spinner
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3', 
    lg: 'h-12 w-12 border-4'
  };

  // Container classes
  const containerClasses = fullScreen 
    ? 'min-h-screen bg-light flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        {/* Spinner */}
        <div 
          className={`
            animate-spin rounded-full border-blue-600 border-t-transparent mx-auto
            ${sizeClasses[size]}
          `}
        />
        
        {/* Loading text */}
        {text && (
          <p className="mt-4 text-gray-600 text-sm md:text-base">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Auth Loading Component
 * Specialized loading state for authentication checks
 */
export function AuthLoadingState() {
  return (
    <LoadingState 
      size="lg"
      text="Checking authentication..."
      fullScreen={true}
    />
  );
}

/**
 * Page Loading Component  
 * Specialized loading state for page content
 */
export function PageLoadingState({ text = "Loading..." }) {
  return (
    <LoadingState 
      size="md"
      text={text}
      fullScreen={false}
      className="py-12"
    />
  );
}
