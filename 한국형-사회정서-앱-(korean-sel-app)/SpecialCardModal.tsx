import React from 'react';
import { SpecialType } from '../../types';

interface SpecialCardModalProps {
  content: string;
  type: SpecialType;
  onClose: () => void;
}

const SpecialCardModal: React.FC<SpecialCardModalProps> = ({ content, type, onClose }) => {
  const isCompliment = type === SpecialType.COMPLIMENT;
  const isHeart = type === SpecialType.HEART;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full text-center transform transition-all animate-pop-in">
        <h3 className={`text-xl font-bold mb-4 ${isCompliment ? 'text-sky-500' : 'text-pink-500'}`}>
          {isCompliment ? '✨ 칭찬 카드! ✨' : '💖 하트 카드! 💖'}
        </h3>
        {isHeart && <div className="text-6xl animate-ping-once">❤️</div>}
        <p className="text-2xl text-gray-800 my-6 leading-relaxed">{content}</p>
        <button
          onClick={onClose}
          className="bg-amber-500 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-md hover:bg-amber-600 transition-colors"
        >
          확인 (다음 차례로)
        </button>
      </div>
    </div>
  );
};

export default SpecialCardModal;
