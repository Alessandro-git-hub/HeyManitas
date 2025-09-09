import React from 'react';
import ActionButton from './ActionButton';

/**
 * Styled button component for Quick Actions section
 * Provides consistent white background with purple hover styling
 */
const QuickActionButton = ({ children, onClick, ...props }) => {
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#cda961';
    e.target.style.color = 'white';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = 'white';
    e.target.style.color = '#1F2937';
  };

  return (
    <ActionButton 
      onClick={onClick}
      style={{ 
        backgroundColor: 'white', 
        color: '#1F2937', 
        border: '1px solid white',
        transition: 'all 0.2s'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </ActionButton>
  );
};

export default QuickActionButton;
