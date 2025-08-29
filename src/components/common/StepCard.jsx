import React from 'react';
import Icon from './Icon';

/**
 * Reusable step card component for displaying process steps
 * @param {Object} step - Step data with icon, title, description, details
 * @param {number} index - Step index for connecting lines
 * @param {number} totalSteps - Total number of steps
 * @param {boolean} prefersReducedMotion - User's motion preference
 * @param {boolean} showConnectingLine - Whether to show connecting line (default: true)
 * @param {string} variant - Card variant: 'desktop' or 'mobile'
 */
export default function StepCard({ 
  step, 
  index, 
  totalSteps, 
  prefersReducedMotion, 
  showConnectingLine = true,
  variant = 'desktop'
}) {
  const isDesktop = variant === 'desktop';
  const isMobile = variant === 'mobile';
  
  return (
    <div className={`text-center ${isDesktop ? 'group' : ''}`}>
      {/* Icon */}
      <div className="relative mb-6">
        <div 
          className={`
            ${isMobile ? 'bg-white border border-primary-700' : 'bg-white border border-primary-700'}
            ${isMobile ? 'w-20 h-20' : 'w-20 h-20 lg:w-24 lg:h-24'}
            rounded-full flex items-center justify-center mx-auto shadow-lg
            ${!prefersReducedMotion && isDesktop ? 'group-hover:scale-110 transition-all duration-300' : ''}
          `}
        >
          <Icon 
            name={step.icon} 
            size={isMobile ? 28 : 32} 
            className={`text-primary-600 ${isDesktop ? 'lg:w-10 lg:h-10' : ''}`}
          />
        </div>
        
        {/* Connecting line for desktop */}
        {showConnectingLine && isDesktop && index < totalSteps - 1 && (
          <div className="absolute top-10 lg:top-12 -right-4 lg:-right-8 w-8 lg:w-16 h-0.5 bg-gradient-to-r from-primary-300 to-transparent hidden lg:block" />
        )}
      </div>

      {/* Content */}
      <h3 className={`
        ${isMobile ? 'text-2xl' : 'text-xl lg:text-2xl'}
        font-bold text-primary-700 mb-4
        ${!prefersReducedMotion && isDesktop ? 'transition-colors duration-300 group-hover:text-primary-600' : ''}
      `}>
        {step.title}
      </h3>
      
      <p className="text-primary-700 mb-4">
        {step.description}
      </p>
      
      <p className="text-sm text-primary-700 leading-relaxed">
        {step.details}
      </p>
    </div>
  );
}
