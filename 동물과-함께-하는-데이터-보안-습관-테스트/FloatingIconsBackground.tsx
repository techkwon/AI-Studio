
import React from 'react';

// 아이콘 개수 24개, 각각 다른 이모티콘으로 변경
const icons = [
  '💖', '✨', '🌟', '🌈', '🌸', '💎', '🍀', '🎈', 
  '🎀', '🔑', '🛡️', '💡', '📚', '💻', '🔒', '🌿', 
  '🍄', '🧁', '🍭', '🧸', '🪁', '🔮', '🌠', '🧩'
]; 

const FloatingIconsBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]" aria-hidden="true"> {/* Ensure this z-index is above gradient (0) and below root (2) */}
      {icons.map((icon, index) => (
        <span
          key={index}
          className="floating-icon"
          style={{
            left: `${Math.random() * 90 + 5}%`, 
            top: `${Math.random() * 90 + 5}%`,
            fontSize: `${Math.random() * 1.0 + 1.2}rem`, 
            animationDelay: `${Math.random() * 2}s`,  
            animationDuration: `${Math.random() * 8 + 10}s`, 
          }}
          aria-hidden="true"
        >
          {icon}
        </span>
      ))}
    </div>
  );
};

export default FloatingIconsBackground;
