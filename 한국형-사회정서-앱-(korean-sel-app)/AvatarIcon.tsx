import React from 'react';

interface AvatarIconProps {
  icon: string;
  className?: string;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ icon, className }) => {
  const commonProps = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: className,
  };

  switch (icon) {
    case 'CAT':
      return (
        <svg {...commonProps}>
          <path d="M12 2a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm-3.5 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-3.5 6c-2.5 0-4.6-1.5-5.2-3.5h10.4c-.6 2-2.7 3.5-5.2 3.5z"/>
        </svg>
      );
    case 'DOG':
      return (
        <svg {...commonProps}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-6h-2v4h2V10zm-3-4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
        </svg>
      );
    case 'BEAR':
      return (
        <svg {...commonProps}>
            <path d="M12 2a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zM7.5 9A1.5 1.5 0 116 10.5 1.5 1.5 0 017.5 9zm9 0a1.5 1.5 0 11-1.5 1.5A1.5 1.5 0 0116.5 9zM12 14c-1.93 0-3.5 1.57-3.5 3.5h7c0-1.93-1.57-3.5-3.5-3.5z"/>
        </svg>
      );
    case 'RABBIT':
      return (
        <svg {...commonProps}>
          <path d="M12 2a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm-2-1a1 1 0 011 1v3a1 1 0 11-2 0V2a1 1 0 011-1zm4 0a1 1 0 011 1v3a1 1 0 11-2 0V2a1 1 0 011-1zm-2 10a2 2 0 110-4 2 2 0 010 4z"/>
        </svg>
      );
    case 'PANDA':
      return (
        <svg {...commonProps}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 8A2.5 2.5 0 116 10.5 2.5 2.5 0 018.5 8zm7 0a2.5 2.5 0 11-2.5 2.5A2.5 2.5 0 0115.5 8zM12 17.5c-2.04 0-3.8-1.25-4.55-3.08h9.1c-.75 1.83-2.51 3.08-4.55 3.08z"/>
        </svg>
      );
    case 'FOX':
      return (
        <svg {...commonProps}>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM8.5 14.5c-1.5 0-2.5-1.5-2.5-2.5s1-2.5 2.5-2.5 2.5 1.5 2.5 2.5-1 2.5-2.5 2.5zm7 0c-1.5 0-2.5-1.5-2.5-2.5s1-2.5 2.5-2.5 2.5 1.5 2.5 2.5-1 2.5-2.5 2.5zM7.5 4l-2 4h4l-2-4zm9 0l-2 4h4l-2-4z"/>
        </svg>
      );
    default:
      return null;
  }
};