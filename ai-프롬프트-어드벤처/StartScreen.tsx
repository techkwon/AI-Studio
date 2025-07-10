import React from 'react';
import { IMAGE_GENERATION_ERROR_PLACEHOLDER, IMAGE_GENERATION_LOADING_PLACEHOLDER } from '../constants';

interface StartScreenProps {
  onStart: () => void;
  imageUrl: string | null;
  isLoadingImage: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, imageUrl, isLoadingImage }) => {
  const imageToDisplay = isLoadingImage 
    ? IMAGE_GENERATION_LOADING_PLACEHOLDER 
    : (imageUrl || IMAGE_GENERATION_ERROR_PLACEHOLDER);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center">
      <div className="bg-neutral-800/30 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 w-full max-w-2xl">
        <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60 mb-6 sm:mb-8 rounded-full shadow-2xl overflow-hidden flex items-center justify-center bg-neutral-800/20 border-2 border-white/30 mx-auto">
          {isLoadingImage && (
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-pink-300"></div>
          )}
          {!isLoadingImage && (
            <img 
              src={imageToDisplay} 
              alt="AI 프롬프트 어드벤처 시작화면" 
              className="w-full h-full object-cover" 
            />
          )}
        </div>
        {isLoadingImage && <p className="text-xl sm:text-2xl text-pink-200 mb-4">멋진 모험을 준비 중이에요...</p>}
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4">AI 프롬프트 어드벤처</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-10 max-w-lg mx-auto">
          AI와 함께 떠나는 신나는 프롬프트 탐험!<br />최고의 프롬프트 마스터가 되어보세요!
        </p>
        <button
          onClick={onStart}
          disabled={isLoadingImage}
          className="bg-white/5 backdrop-blur-md border-2 border-pink-500 text-pink-300 hover:bg-pink-500 hover:text-white font-bold py-3 px-6 sm:py-4 sm:px-10 rounded-xl text-xl sm:text-2xl md:text-3xl shadow-lg hover:shadow-xl hover:shadow-pink-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-neutral-500/10 disabled:backdrop-blur-sm disabled:text-gray-400/80 disabled:border-gray-500/50 disabled:shadow-none disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
        >
          모험 시작! ✨
        </button>
        <p className="mt-8 sm:mt-12 text-sm sm:text-base text-gray-300">
          이 앱은 Gemini API를 사용하여 프롬프트를 평가하고 이미지를 생성합니다.
        </p>
      </div>
    </div>
  );
};

export default StartScreen;