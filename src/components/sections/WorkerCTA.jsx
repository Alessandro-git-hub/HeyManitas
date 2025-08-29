import React from 'react';
import { Link } from 'react-router-dom';
import ActionButton from '../common/ActionButton';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

// Constants for better maintainability
const ANIMATION_CONFIG = {
  selector: '.worker-cta-element',
  staggerDelay: 100,
  transition: 'all 0.6s ease',
  translateY: 30
};

const CONTENT = {
  title: 'Join Our Network of Professionals',
  description: 'Grow your business with a trusted platform that connects you with customers who need your services.',
  buttons: [
    {
      to: '/signup',
      text: 'Become a Professional',
      variant: 'secondary'
    },
    {
      to: '/about',
      text: 'Learn More',
      variant: 'outline'
    }
  ]
};

const STYLES = {
  section: 'py-16 bg-primary-600 text-white relative overflow-hidden',
  container: 'max-w-4xl mx-auto px-4 text-center',
  title: 'worker-cta-element text-3xl md:text-4xl font-bold mb-6',
  description: 'worker-cta-element text-xl mb-8 text-primary-100',
  buttonContainer: 'worker-cta-element flex flex-col sm:flex-row gap-4 justify-center',
  button: 'bg-secondary-600 text-primary-700 hover:bg-secondary-700 transform hover:scale-105 transition-all duration-200'
};

// Extracted component for individual CTA button
const CTAButton = ({ to, text, variant, className }) => (
  <Link to={to}>
    <ActionButton
      variant={variant}
      size="large"
      className={className}
    >
      {text}
    </ActionButton>
  </Link>
);

export default function WorkerCTA() {
  // Use the scroll animation hook for the CTA elements
  useScrollAnimation(ANIMATION_CONFIG.selector, ANIMATION_CONFIG.staggerDelay);

  return (
    <section className={STYLES.section}>
      <style jsx>{`
        ${ANIMATION_CONFIG.selector} {
          opacity: 0;
          transition: ${ANIMATION_CONFIG.transition};
          transform: translateY(${ANIMATION_CONFIG.translateY}px);
        }

        ${ANIMATION_CONFIG.selector}.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      
      <div className={STYLES.container}>
        <h2 className={STYLES.title}>
          {CONTENT.title}
        </h2>
        <p className={STYLES.description}>
          {CONTENT.description}
        </p>
        <div className={STYLES.buttonContainer}>
          {CONTENT.buttons.map((button, index) => (
            <CTAButton
              key={index}
              to={button.to}
              text={button.text}
              variant={button.variant}
              className={STYLES.button}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
