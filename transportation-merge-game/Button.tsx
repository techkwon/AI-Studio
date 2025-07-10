
import React from 'react';
import SoundService, { SoundType } from '../services/SoundService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success'; // Added success
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Added xl
  noSound?: boolean;
  glass?: boolean; // Option for glassmorphic style
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  noSound = false, 
  onClick, 
  glass = true, // Default to glassmorphic
  ...props 
}) => {
  const baseStyle = `font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-opacity-75 
                     transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`;

  // Glassmorphic Styles
  const glassBase = `border border-white/30 shadow-lg backdrop-blur-sm`;
  const glassVariants = {
    primary: "bg-blue-500/70 hover:bg-blue-500/90 text-white focus:ring-blue-400/80",
    secondary: "bg-slate-400/60 hover:bg-slate-400/80 text-slate-800 focus:ring-slate-400/80",
    danger: "bg-red-500/70 hover:bg-red-500/90 text-white focus:ring-red-400/80",
    success: "bg-green-500/70 hover:bg-green-500/90 text-white focus:ring-green-400/80",
  };

  // Solid (non-glass) Styles (example, can be expanded)
  const solidVariants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-700 focus:ring-slate-400",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
  };
  
  const sizeStyles = {
    sm: "px-4 py-2 text-base rounded-xl",       // Was: px-3 py-1.5 text-sm
    md: "px-6 py-3 text-lg rounded-2xl",       // Was: px-5 py-2.5 text-base
    lg: "px-8 py-3.5 text-xl rounded-3xl",    // Was: px-7 py-3 text-lg
    xl: "px-10 py-4 text-2xl rounded-4xl",    // Was: px-8 py-4 text-xl
  };

  const currentVariantStyle = glass ? glassVariants[variant] : solidVariants[variant];
  const glassStyle = glass ? glassBase : "";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!noSound) {
      SoundService.playSound(SoundType.BUTTON_CLICK);
    }
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={`${baseStyle} ${currentVariantStyle} ${sizeStyles[size]} ${glassStyle} ${className || ''} font-korean`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;