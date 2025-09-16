import React from 'react';

/**
 * DottedBackground - A reusable component for the subtle dots background pattern
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render on top of the background
 * @param {string} props.className - Additional CSS classes to apply to the container
 * @param {boolean} props.fullHeight - Whether to use min-h-screen (default: true)
 */
export default function DottedBackground({ 
  children, 
  className = '', 
  fullHeight = true 
}) {
  const containerClasses = `
    relative
    ${fullHeight ? 'min-h-screen' : ''}
    bg-gradient-to-br from-primary-50 to-primary-100
    ${className}
  `.trim();

  return (
    <div className={containerClasses}>
      {/* Subtle dots pattern overlay */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle,rgba(205,169,97,0.2)_1px,transparent_1px)]
        bg-[length:22px_22px]" />
      
      {/* Content with relative positioning to appear above the background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
