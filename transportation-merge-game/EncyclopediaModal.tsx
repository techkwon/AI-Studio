import React from 'react';
import { TransportationInfo } from '../types';
import Button from './Button';
import FloatingEmojisOverlay from './FloatingEmojisOverlay';
import { TRANSPORTATION_DATA } from '../constants';

export type DiscoveryModalItem = TransportationInfo & { _isNewlyDiscoveredAndDroppable?: boolean };

interface EncyclopediaModalProps {
  item: DiscoveryModalItem | null;
  onClose: () => void;
}

const EncyclopediaModal: React.FC<EncyclopediaModalProps> = ({ item, onClose }) => {
  const emojiList = React.useMemo(() => Object.values(TRANSPORTATION_DATA).map(i => i.emoji), []);
  if (!item) return null;

  const titleTextColorClass = item.textColor.includes('800') || item.textColor.includes('700') ? item.textColor : `${item.textColor.split('-')[0]}-700`;

  return (
    <div className="fixed inset-0 animated-overlay-bg flex items-center justify-center z-50 p-4 font-korean">
      <FloatingEmojisOverlay emojiList={emojiList} count={15}/>
      <div className="glass-pane p-6 sm:p-8 rounded-4xl shadow-2xl w-full max-w-md text-center transform transition-all animate-pulse-once relative z-10"> {/* Added relative z-10 */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div 
            className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center text-7xl sm:text-8xl 
                        ${item.color} ${item.textColor} shadow-xl border-4 border-white/50`}
          >
            {item.emoji}
          </div>
        </div>
        <h3 className={`text-4xl sm:text-5xl font-bold mb-1 ${titleTextColorClass} font-korean`}>{item.koreanName}</h3>
        <p className="text-slate-500 text-base mb-3 sm:mb-4 font-english">(Level {item.level + 1})</p>
        
        <p className="text-slate-700 text-lg sm:text-xl mb-6 leading-relaxed px-2">
          {item.description}
        </p>

        {item._isNewlyDiscoveredAndDroppable && (
          <div className="mb-6 p-3 bg-green-500/30 border border-green-500/50 rounded-2xl">
            <p className="text-base text-green-800 font-semibold font-korean">
              ✨ 이제 이 교통수단도 떨어뜨릴 수 있어요! ✨
            </p>
          </div>
        )}

        <Button onClick={onClose} size="lg" variant="primary" className="w-full">
          알겠어요! 👍
        </Button>
      </div>
    </div>
  );
};

export default EncyclopediaModal;