import React, { useState, useMemo } from 'react';
import { TransportationInfo, TransportationType } from '../types';
import { TRANSPORTATION_DATA } from '../constants';
import EncyclopediaModal from './EncyclopediaModal';
import Button from './Button';
import SoundService, { SoundType } from '../services/SoundService';
import FloatingEmojisOverlay from './FloatingEmojisOverlay';

interface EncyclopediaScreenProps {
  unlockedItems: Set<TransportationType>;
  onClose: () => void;
}

const EncyclopediaScreen: React.FC<EncyclopediaScreenProps> = ({ unlockedItems, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<TransportationInfo | null>(null);
  const allItems = Object.values(TRANSPORTATION_DATA).sort((a,b) => a.level - b.level);
  const emojiList = useMemo(() => Object.values(TRANSPORTATION_DATA).map(item => item.emoji), []);

  const handleItemClick = (item: TransportationInfo) => {
    if (unlockedItems.has(item.id)) {
      setSelectedItem(item);
      SoundService.playSound(SoundType.ENCYCLOPEDIA_SELECT);
    }
  };

  return (
    <div className="fixed inset-0 animated-overlay-bg p-4 sm:p-6 z-40 overflow-y-auto font-korean">
      <FloatingEmojisOverlay emojiList={emojiList} count={25} />
      <div className="max-w-4xl mx-auto glass-pane rounded-4xl p-4 sm:p-6 shadow-2xl relative z-10"> {/* Added relative z-10 to content pane */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-sky-700 font-korean">📚 교통수단 도감 & 게임 방법 🚗💨</h2>
          <Button onClick={onClose} variant="secondary" size="lg">닫기 👋</Button>
        </div>

        {/* 게임 방법 섹션 추가 */}
        <div className="mb-8 p-4 sm:p-6 glass-pane !bg-sky-500/20 rounded-3xl shadow-lg">
          <h3 className="text-2xl sm:text-3xl font-bold text-sky-600 mb-4 text-center font-korean">🎮 게임 방법 🕹️</h3>
          <ul className="list-disc list-inside space-y-2 text-slate-700 text-base sm:text-lg">
            <li><span className="font-semibold">다음 아이템 확인:</span> 화면 위쪽에 다음에 떨어뜨릴 교통수단이 표시됩니다.</li>
            <li><span className="font-semibold">아이템 떨어뜨리기:</span> 게임 영역 안에서 원하는 위치를 마우스로 클릭하거나 손가락으로 탭하여 아이템을 떨어뜨리세요.</li>
            <li><span className="font-semibold">교통수단 합치기:</span> 같은 종류의 교통수단 두 개가 부딪히면 합쳐지면서 다음 단계의 새로운 교통수단으로 변신해요! (예: 🚲 + 🚲 = 🛵)</li>
            <li><span className="font-semibold">점수 획득:</span> 교통수단을 합칠 때마다 점수를 얻어요. 더 높은 단계일수록 더 많은 점수를 받습니다!</li>
            <li><span className="font-semibold">새로운 발견:</span> 새로운 교통수단을 만들면 이 도감에 자동으로 기록되고, 때로는 게임에서 떨어뜨릴 수 있는 아이템 종류가 늘어나기도 합니다.</li>
            <li><span className="font-semibold">게임 오버 조건:</span> 교통수단이 화면 상단의 핑크색 경고선 위로 넘어가 더 이상 떨어뜨릴 공간이 없으면 게임이 종료되니 조심하세요!</li>
            <li><span className="font-semibold">최종 목표:</span> 가장 높은 단계인 우주선(🌌)을 만들고 최고 점수에 도전해보세요!</li>
          </ul>
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-4 text-center font-korean">📖 발견한 교통수단 목록 📖</h3>
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
          role="listbox"
          aria-label="교통수단 목록"
        >
          {allItems.map((item) => {
            const isUnlocked = unlockedItems.has(item.id);
            // Ensure text color has good contrast for items
            const itemTextColor = item.textColor.includes('700') || item.textColor.includes('800') ? item.textColor : `${item.textColor.split('-')[0]}-700`;
            return (
              <div
                key={item.id}
                role="option"
                aria-selected={selectedItem?.id === item.id}
                aria-disabled={!isUnlocked}
                tabIndex={isUnlocked ? 0 : -1}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(item);}}
                className={`p-3 sm:p-4 rounded-3xl aspect-square flex flex-col items-center justify-center text-center 
                            transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-75
                  ${isUnlocked 
                    ? `glass-pane !bg-opacity-50 ${item.color.replace('bg-', 'bg-opacity-70 ')} ${itemTextColor} cursor-pointer focus:ring-sky-400 shadow-lg hover:shadow-xl` 
                    : 'glass-pane !bg-slate-500/30 !backdrop-blur-none cursor-default opacity-60 shadow-md'
                  }`}
              >
                {isUnlocked ? (
                  <>
                    <span className="text-5xl sm:text-6xl mb-1 sm:mb-2" aria-hidden="true">{item.emoji}</span>
                    <p className={`text-sm sm:text-base font-semibold ${itemTextColor}`}>{item.koreanName}</p>
                  </>
                ) : (
                  <>
                    <span className="text-5xl sm:text-6xl text-slate-500" aria-hidden="true">🤫</span>
                    <p className="text-sm sm:text-base font-semibold text-slate-600">아직 비밀!</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-center text-slate-600 mt-8 text-base sm:text-lg font-korean">
          💡 새로운 교통수단을 계속 발견해서 도감을 완성하고, 교통 박사가 되어보세요! 🎓
        </p>
      </div>
      {selectedItem && <EncyclopediaModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

export default EncyclopediaScreen;