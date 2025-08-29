import React, { useRef } from 'react';
import Icon from './Icon';

/**
 * Reusable carousel component with navigation arrows and indicators
 * @param {Array} items - Array of items to display
 * @param {number} currentIndex - Current active index
 * @param {boolean} prefersReducedMotion - User's motion preference
 * @param {Function} onTouchStart - Touch start handler
 * @param {Function} onTouchMove - Touch move handler
 * @param {Function} onTouchEnd - Touch end handler
 * @param {Function} onKeyDown - Keyboard handler
 * @param {Function} onPrevious - Previous button handler
 * @param {Function} onNext - Next button handler
 * @param {Function} onGoToIndex - Go to specific index handler
 * @param {Function} renderItem - Function to render each item
 * @param {string} ariaLabel - Accessibility label
 */
export default function Carousel({
  items,
  currentIndex,
  prefersReducedMotion,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onKeyDown,
  onPrevious,
  onNext,
  onGoToIndex,
  renderItem,
  ariaLabel = 'Carousel'
}) {
  const carouselRef = useRef(null);

  return (
    <div 
      ref={carouselRef}
      className="relative max-w-lg mx-auto"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      tabIndex="0"
    >
      {/* Main Carousel */}
      <div className="relative overflow-hidden">
        <div 
          className={`flex ${prefersReducedMotion ? '' : 'transition-transform duration-700 ease-out'}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {items.map((item, index) => (
            <div 
              key={index} 
              className="w-full flex-shrink-0 p-8 pt-0"
              role="group"
              aria-label={`Item ${index + 1} of ${items.length}`}
              aria-hidden={index !== currentIndex}
            >
              {renderItem(item, index, index === currentIndex)}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={onPrevious}
          className={`absolute left-2 top-20 w-10 h-10 bg-primary-700 hover:bg-white rounded-full shadow-lg flex items-center justify-center backdrop-blur-sm`}
          aria-label="Previous item"
          aria-controls="carousel-content"
        >
          <Icon name="arrowRight" size={20} className="text-white transform rotate-180" />
        </button>
        
        <button
          onClick={onNext}
          className={`absolute right-2 top-20 w-10 h-10 bg-primary-700 hover:bg-white rounded-full shadow-lg flex items-center justify-center backdrop-blur-sm`}
          aria-label="Next item"
          aria-controls="carousel-content"
        >
          <Icon name="arrowRight" size={20} className="text-white" />
        </button>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center mt-6 space-x-2" role="tablist" aria-label="Carousel pagination">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => onGoToIndex(index)}
            className={`w-2.5 h-2.5 rounded-full $${
              index === currentIndex
                ? 'bg-primary-600 w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to item ${index + 1}`}
            aria-controls="carousel-content"
          />
        ))}
      </div>

      {/* Status for screen readers */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {`Showing item ${currentIndex + 1} of ${items.length}`}
      </div>
    </div>
  );
}
