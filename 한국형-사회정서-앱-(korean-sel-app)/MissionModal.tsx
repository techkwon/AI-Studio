import React from 'react';

interface MissionModalProps {
  mission: string;
  onSuccess: () => void;
  onFailure: () => void;
}

const MissionModal: React.FC<MissionModalProps> = ({ mission, onSuccess, onFailure }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full text-center transform transition-all animate-pop-in">
        <h3 className="text-xl font-bold text-amber-600 mb-2">🚀 미션 카드 🚀</h3>
        <p className="text-2xl text-gray-800 my-6 leading-relaxed">{mission}</p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onFailure}
            className="bg-gray-400 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-md hover:bg-gray-500 transition-colors"
          >
            실패 (뒤로)
          </button>
          <button
            onClick={onSuccess}
            className="bg-green-500 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-md hover:bg-green-600 transition-colors"
          >
            성공
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionModal;
