import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for carousel functionality with auto-play, touch gestures, and keyboard navigation
 * @param {Array} items - Array of items to display in carousel
 * @param {number} autoPlayDelay - Delay in milliseconds for auto-play (default: 8000)
 * @returns {Object} Carousel state and controls
 */
export function useCarousel(items, autoPlayDelay = 8000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const intervalRef = useRef(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!prefersReducedMotion && items?.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, autoPlayDelay);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [prefersReducedMotion, items?.length, autoPlayDelay]);

  // Navigation functions
  const goToIndex = useCallback((index) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
    }
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Touch handlers for swipe gestures
  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  }, [touchStart, touchEnd, goToNext, goToPrevious]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      default:
        break;
    }
  }, [goToPrevious, goToNext]);

  return {
    // State
    currentIndex,
    prefersReducedMotion,
    totalItems: items.length,
    
    // Navigation
    goToIndex,
    goToNext,
    goToPrevious,
    
    // Touch handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    
    // Keyboard handler
    handleKeyDown,
    
    // Utility
    isFirst: currentIndex === 0,
    isLast: currentIndex === items.length - 1
  };
}
