import React from 'react';
import { Mentor } from '../types';
import { IMAGE_GENERATION_ERROR_PLACEHOLDER, IMAGE_GENERATION_LOADING_PLACEHOLDER } from '../constants';

interface MentorCardProps {
  mentor: Mentor;
  onSelect: () => void;
  isLoadingImage: boolean;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, onSelect, isLoadingImage }) => {
  const imageToShow = isLoadingImage 
    ? IMAGE_GENERATION_LOADING_PLACEHOLDER 
    : (mentor.generatedImage || IMAGE_GENERATION_ERROR_PLACEHOLDER);

  return (
    <button
      onClick={onSelect}
      disabled={isLoadingImage}
      className="bg-transparent border-2 border-neutral-600/50 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 m-2 sm:m-4 w-full sm:w-60 md:w-64 text-center hover:bg-neutral-700/40 hover:border-neutral-500/70 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-400/70 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-lg disabled:bg-transparent disabled:border-neutral-700/30"
    >
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 border-4 border-white/40 overflow-hidden flex items-center justify-center bg-neutral-800/20">
        {isLoadingImage && (
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-pink-300"></div>
        )}
        {!isLoadingImage && (
          <img
            src={imageToShow}
            alt={mentor.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{mentor.name}</h3>
      <p className="text-sm sm:text-base text-gray-200">{mentor.description}</p>
       {isLoadingImage && <p className="text-sm sm:text-base text-pink-200 mt-2">멘토 이미지 준비 중...</p>}
    </button>
  );
};

export default MentorCard;