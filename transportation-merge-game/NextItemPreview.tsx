
import React from 'react';
import { TransportationInfo } from '../types';
import { TRANSPORTATION_DATA } from '../constants';

interface NextItemPreviewProps {
  itemType: TransportationInfo | null;
  positionX: number; // For positioning the preview at the top
  gameWidth: number;
}

const NextItemPreview: React.FC<NextItemPreviewProps> = ({ itemType, positionX, gameWidth }) => {
  if (!itemType) return null;

  const itemSize = itemType.radius * 2;
  const itemStyle: React.CSSProperties = {
    left: `${Math.max(itemType.radius, Math.min(positionX, gameWidth - itemType.radius)) - itemType.radius}px`,
    width: `${itemSize}px`,
    height: `${itemSize}px`,
    // Removed top from here, apply it in className
  };

  return (
    <div
      className="absolute top-[2px] flex items-center justify-center rounded-full pointer-events-none no-select transition-all duration-100 ease-out"
      style={itemStyle}
      aria-hidden="true"
    >
      <div 
        className={`w-full h-full rounded-full flex items-center justify-center text-2xl shadow-lg shadow-inner
                    ${itemType.color} bg-opacity-70 backdrop-blur-sm border border-white/30`} // Glassy effect for preview
        style={{ 
          fontSize: `${Math.max(10, itemType.radius * 0.8)}px`, // Slightly larger emoji
        }}
      >
        <span className={`${itemType.textColor} opacity-100`}>{itemType.emoji}</span>
      </div>
    </div>
  );
};

export default NextItemPreview;