import React from 'react';

const icons = {
  arrowRight: (
    <path d="M16.175 13H5C4.71667 13 4.47917 12.9042 4.2875 12.7125C4.09583 12.5208 4 12.2833 4 12C4 11.7167 4.09583 11.4792 4.2875 11.2875C4.47917 11.0958 4.71667 11 5 11H16.175L11.275 6.09999C11.075 5.89999 10.9792 5.66665 10.9875 5.39999C10.9958 5.13332 11.1 4.89999 11.3 4.69999C11.5 4.51665 11.7333 4.42082 12 4.41249C12.2667 4.40415 12.5 4.49999 12.7 4.69999L19.3 11.3C19.4 11.4 19.4708 11.5083 19.5125 11.625C19.5542 11.7417 19.575 11.8667 19.575 12C19.575 12.1333 19.5542 12.2583 19.5125 12.375C19.4708 12.4917 19.4 12.6 19.3 12.7L12.7 19.3C12.5167 19.4833 12.2875 19.575 12.0125 19.575C11.7375 19.575 11.5 19.4833 11.3 19.3C11.1 19.1 11 18.8625 11 18.5875C11 18.3125 11.1 18.075 11.3 17.875L16.175 13Z" />
  ),
  arrowLeft: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  ),
  chevronRight: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  ),
  chevronLeft: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  ),
  pause: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
  ),
  play: (
    <path d="M8 5v14l11-7z"/>
  ),
  close: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  ),
  menu: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  ),
  search: (
    <g>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeLinejoin="round" fill="none"/>
      <path d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z" fill="currentColor"/>
    </g>
  ),
  calendar: (
    <g>
      <path d="M3 9H21M9 15L11 17L15 13M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </g>
  ),
  checkComplete: (
    <path d="M9.54972 15.15L18.0247 6.675C18.2247 6.475 18.4622 6.375 18.7372 6.375C19.0122 6.375 19.2497 6.475 19.4497 6.675C19.6497 6.875 19.7497 7.1125 19.7497 7.3875C19.7497 7.6625 19.6497 7.9 19.4497 8.1L10.2497 17.3C10.0497 17.5 9.81639 17.6 9.54972 17.6C9.28305 17.6 9.04972 17.5 8.84972 17.3L4.54972 13C4.34972 12.8 4.25389 12.5625 4.26222 12.2875C4.27055 12.0125 4.37472 11.775 4.57472 11.575C4.77472 11.375 5.01222 11.275 5.28722 11.275C5.56222 11.275 5.79972 11.375 5.99972 11.575L9.54972 15.15Z" fill="currentColor"/>
  )
};

export default function Icon({ 
  name, 
  size = 24, 
  className = "", 
  fill = "currentColor",
  stroke = "none",
  ...props 
}) {
  const iconPath = icons[name];
  
  if (!iconPath) {
    console.warn(`Icon "${name}" not found. Available icons: ${Object.keys(icons).join(', ')}`);
    return null;
  }

  // Determine if icon should use stroke or fill based on the icon type
  const useStroke = ['arrowLeft', 'chevronRight', 'chevronLeft', 'pause', 'close', 'menu', 'search', 'calendar'].includes(name);
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={useStroke ? "none" : fill}
      stroke={useStroke ? "currentColor" : stroke}
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      {iconPath}
    </svg>
  );
}
