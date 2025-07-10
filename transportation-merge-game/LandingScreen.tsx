import React from 'react';
import Button from './Button';
import SoundService, { SoundType } from '../services/SoundService';

interface LandingScreenProps {
  onStartGame: () => void;
  onShowInstructions: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStartGame, onShowInstructions }) => {
  
  React.useEffect(() => {
    // Attempt to initialize audio context on component mount by playing a very brief,
    // possibly silent or near-silent sound. This is a common workaround for browsers
    // that block audio until a user interaction.
    // Ensure SoundService handles this gracefully if context can't be created immediately.
    // A more robust way is for SoundService._getAudioContext() to be called on first actual sound play.
    // For now, a gentle attempt:
    SoundService.playSound(SoundType.BUTTON_CLICK); // Use an existing quiet sound.
                                                     // This call to playSound will internally try to get/resume the audio context.
  }, []);

  const handleStartGame = () => {
    SoundService.playSound(SoundType.BUTTON_CLICK); // Or a specific "start game" sound
    onStartGame();
  };

  const handleShowInstructions = () => {
    SoundService.playSound(SoundType.BUTTON_CLICK); 
    onShowInstructions();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto font-korean">
      <div className="glass-pane p-8 sm:p-12 rounded-5xl shadow-2xl text-center w-full">
        <div 
          className="w-48 h-48 sm:w-60 sm:h-60 mx-auto mb-6 sm:mb-8 rounded-full shadow-lg border-4 border-white/50 
                     bg-sky-200 flex items-center justify-center"
          aria-label="게임 로고 - 귀여운 우주선 캐릭터"
        >
          <span className="text-7xl sm:text-8xl">🚀</span> {/* 로고 변경: 트럭 -> 우주선 */}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-700 mb-2 font-korean">
          🌈 교통수단 합치기! 🚗
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-12 font-korean">
          같은 교통수단을 합쳐 새로운 것을 발견해보세요!
        </p>
        
        <div className="space-y-5 flex flex-col items-center">
          <Button 
            onClick={handleStartGame} 
            size="xl" 
            variant="success" 
            className="w-full sm:w-3/4"
            aria-label="게임 시작하기"
          >
            🚀 시작하기!
          </Button>
          <Button 
            onClick={handleShowInstructions} 
            size="lg" 
            variant="secondary" 
            className="w-full sm:w-3/4"
            aria-label="게임 방법 보기" // 버튼 텍스트와 aria-label 변경
          >
            🎮 게임 방법 보기
          </Button>
        </div>

        <p className="text-sm text-slate-500 mt-10 sm:mt-16 font-korean">
          ✨ 가장 큰 우주선까지 만들어보세요! ✨
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;