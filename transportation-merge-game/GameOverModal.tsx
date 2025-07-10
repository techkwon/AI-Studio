import React from 'react';
import Button from './Button';
import FloatingEmojisOverlay from './FloatingEmojisOverlay';
import { TRANSPORTATION_DATA } from '../constants';
import { TransportationInfo } from '../types'; // Added import for TransportationInfo

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onShowEncyclopedia: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, highScore, onRestart, onShowEncyclopedia }) => {
  const emojiList = React.useMemo(() => Object.values(TRANSPORTATION_DATA).map((item: TransportationInfo) => item.emoji), []);

  return (
    <div className="fixed inset-0 animated-overlay-bg flex items-center justify-center z-50 p-4 font-korean">
      <FloatingEmojisOverlay emojiList={emojiList} count={15} />
      <div className="glass-pane p-6 sm:p-8 rounded-4xl shadow-2xl text-center w-full max-w-lg relative z-10"> {/* Added relative z-10 */}
        <h2 className="text-5xl sm:text-6xl font-bold text-red-500 mb-2 font-korean">앗! 게임 오버!</h2>
        <img src="https://i.imgur.com/tmVOeYJ.png" alt="Crying face" className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4" /> {/* Larger Sad Emoji */}
        
        <div className="mb-6 sm:mb-8 space-y-2">
          <p className="text-2xl text-slate-700">
            최종 점수: <span className="font-bold text-4xl text-sky-600 font-english">{score}</span>
          </p>
          {score > highScore && score > 0 && (
             <p className="text-2xl text-amber-500 font-semibold animate-pulse">🎉 최고 기록 달성! 🎉</p>
          )}
           {score <= highScore && (
             <p className="text-xl text-slate-600">
                최고 점수: <span className="font-bold text-3xl text-amber-600 font-english">{highScore}</span>
             </p>
           )}
        </div>
        <div className="space-y-3 sm:space-y-4 flex flex-col items-center">
          <Button onClick={onRestart} size="lg" variant="success" className="w-full sm:w-auto">
            다시 시작! 🚀
          </Button>
          <Button onClick={onShowEncyclopedia} size="md" variant="secondary" className="w-full sm:w-auto">
            교통수단 구경하기 📚
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;