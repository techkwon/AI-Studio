
import React from 'react';
import { TRANSPORTATION_DATA } from '../constants';
import { TransportationInfo, TransportationType } from '../types';

interface ProgressionSidebarProps {
  unlockedItems: Set<TransportationType>;
  highestUnlockedLevel: number;
  onItemClick: (item: TransportationInfo) => void;
}

const ProgressionSidebar: React.FC<ProgressionSidebarProps> = ({ unlockedItems, highestUnlockedLevel, onItemClick }) => {
  const allItems = Object.values(TRANSPORTATION_DATA).sort((a, b) => a.level - b.level);
  
  let nextToDiscoverLevel = -1;
  const maxPossibleLevel = TRANSPORTATION_DATA[TransportationType.Spaceship].level;
  if (highestUnlockedLevel < maxPossibleLevel) {
    nextToDiscoverLevel = highestUnlockedLevel + 1;
  }

  return (
    <div className="glass-pane rounded-4xl shadow-lg p-3 flex flex-col font-korean" style={{ minHeight: '250px' }}>
      <h3 className="text-lg font-bold text-sky-700 mb-2 sticky top-0 glass-pane !bg-opacity-80 py-2 z-10 text-center rounded-xl shadow-sm font-korean">
        ✨ 진화 순서 ✨
      </h3>
      <div className="space-y-0.5 flex-grow">
        {allItems.map((item) => {
          const isUnlocked = unlockedItems.has(item.id);
          const isNextToDiscover = item.level === nextToDiscoverLevel;
          const itemTextColor = item.textColor.includes('700') || item.textColor.includes('800') ? item.textColor : `${item.textColor.split('-')[0]}-700`;
          
          return (
            <div
              key={item.id}
              title={isUnlocked ? item.koreanName : '미발견'}
              aria-label={`${item.koreanName}${isUnlocked ? '' : ' (미발견)'}`}
              role={isUnlocked ? "button" : undefined}
              tabIndex={isUnlocked ? 0 : -1}
              onClick={() => {
                if (isUnlocked) {
                  onItemClick(item);
                }
              }}
              onKeyDown={(e) => {
                if (isUnlocked && (e.key === 'Enter' || e.key === ' ')) {
                  onItemClick(item);
                }
              }}
              className={`p-1.5 rounded-2xl flex items-center space-x-3 w-full transition-all duration-150 text-left focus:outline-none transform hover:scale-103
                ${isNextToDiscover ? 'ring-4 ring-amber-400 bg-amber-400/50 shadow-xl scale-105' : ''}
                ${isUnlocked 
                  ? `bg-white/40 hover:bg-white/60 ${item.color.replace('bg-', 'border-b-4 border-') } border-opacity-50 cursor-pointer focus:ring-2 focus:ring-sky-400 focus:ring-offset-1 shadow-md hover:shadow-lg` 
                  : 'bg-slate-400/40 opacity-60 cursor-not-allowed shadow-sm'
                }
              `}
            >
              <span className={`text-xl p-1 rounded-lg shadow-md ${isUnlocked ? item.color : 'bg-slate-500'}`}>
                {isUnlocked ? item.emoji : '🤫'}
              </span>
              <div className="flex-grow overflow-hidden">
                <p className={`text-xs font-semibold truncate ${isUnlocked ? itemTextColor : 'text-slate-100'}`}>
                  {isUnlocked ? item.koreanName : '아직 비밀!'}
                </p>
                 {isUnlocked && <p className={`text-xs ${itemTextColor} opacity-80`}>레벨 {item.level + 1}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressionSidebar;