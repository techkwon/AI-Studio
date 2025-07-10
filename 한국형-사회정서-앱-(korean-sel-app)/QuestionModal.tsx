import React from 'react';

interface QuestionModalProps {
  content: string;
  onClose: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full text-center transform transition-all animate-pop-in">
        <h3 className="text-xl font-bold text-amber-600 mb-2">질문 카드</h3>
        <p className="text-2xl text-gray-800 my-6 leading-relaxed">{content}</p>
        <button
          onClick={onClose}
          className="bg-amber-500 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-md hover:bg-amber-600 transition-colors"
        >
          답변 완료 (다음 차례로)
        </button>
      </div>
    </div>
  );
};

export default QuestionModal;
