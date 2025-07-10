
import React from 'react';

interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tab' | 'option';
  fullWidth?: boolean;
  active?: boolean; // For tab variant
}

const StyledButton: React.FC<StyledButtonProps> = ({ children, variant = 'primary', fullWidth = false, className, active, ...props }) => {
  const baseStyle = "font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-60 transition-all duration-300 ease-[cubic-bezier(0.25,1.25,0.5,1)] transform hover:scale-[1.04] active:scale-[0.97]"; // Cuter ease, more rounded
  const glassBase = "backdrop-blur-lg border border-white/20 hover:border-white/30";
  
  let variantStyle = "";

  if (variant === 'primary') {
    variantStyle = `px-7 py-3.5 md:px-9 md:py-4 text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-500 hover:via-purple-600 hover:to-indigo-700 focus:ring-purple-400/70 button-primary-glow interactive-glow-button hover:shadow-xl`;
  } else if (variant === 'secondary') {
    variantStyle = `px-6 py-3 md:px-7 md:py-3.5 text-slate-100 bg-slate-700/60 hover:bg-slate-600/80 focus:ring-slate-400/70 button-secondary-glow ${glassBase} interactive-glow-button hover:shadow-lg`;
  } else if (variant === 'tab') {
     variantStyle = `px-3.5 py-2.5 sm:px-4 text-sm sm:text-base rounded-t-lg focus:ring-pink-400/60 ${glassBase} interactive-glow-button shadow-sm hover:shadow-md ${
      active 
        ? 'bg-white/25 text-pink-200 font-bold shadow-inner-md border-b-2 border-pink-300' // Softer active tab
        : 'bg-white/10 hover:bg-white/15 text-slate-300 hover:text-pink-200 hover:border-b-2 hover:border-pink-300/50'
    }`;
  } else if (variant === 'option') { // For question options - cuter
    variantStyle = `text-left justify-start py-3.5 px-4 sm:py-4 sm:px-5 !text-sm !md:text-base !text-slate-50 bg-white/10 hover:bg-pink-400/40 focus:!ring-pink-300/80 ${glassBase} border-white/15 hover:border-pink-300/70 hover:shadow-pink-400/30 hover:shadow-lg interactive-glow-button active:!bg-pink-500/50`;
  }


  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${widthStyle} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default StyledButton;