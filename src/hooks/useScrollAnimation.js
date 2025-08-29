import { useEffect } from 'react';

export const useScrollAnimation = (selector = '.service-card', staggerDelay = 50) => {
  useEffect(() => {
    function debounce(func, wait = 10, immediate = true) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          timeout = null;
          if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
      };
    }

    function checkSlide() {
      const sliderCards = document.querySelectorAll(`${selector}:not(.animated)`);
      
      sliderCards.forEach((card, index) => {
        const slideInAt = (window.scrollY + window.innerHeight) - card.offsetHeight / 2;
        const isHalfShown = slideInAt > card.offsetTop;

        if (isHalfShown) {
          // Add staggered delay
          setTimeout(() => {
            card.classList.add('active');
            card.classList.add('animated'); // Mark as animated to prevent re-processing
          }, index * staggerDelay);
        }
      });
    }

    // Initial check in case elements are already in view
    checkSlide();
    
    const debouncedCheckSlide = debounce(checkSlide);
    window.addEventListener('scroll', debouncedCheckSlide);

    return () => {
      window.removeEventListener('scroll', debouncedCheckSlide);
    };
  }, [selector, staggerDelay]);
};
