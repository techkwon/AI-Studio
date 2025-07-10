import React from 'react';
import { Player } from '../../types';

interface WinnerModalProps {
  winner: Player;
  onRestart: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center transform transition-all animate-pop-in relative overflow-hidden">
        <h2 className="text-4xl font-bold text-amber-600 mb-4">🎉 승리! 🎉</h2>
        <p className="text-2xl text-gray-800 my-6">
          <span className={`font-bold text-3xl ${winner.textColor}`}>{winner.name}</span>님이 도착 지점에 가장 먼저 도착했습니다!
        </p>
        <p className="text-lg text-gray-600">모두 함께 즐거운 시간을 보냈어요. 축하합니다!</p>
        <button
          onClick={onRestart}
          className="mt-8 bg-amber-500 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-md hover:bg-amber-600 transition-colors"
        >
          새 게임 시작하기
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
