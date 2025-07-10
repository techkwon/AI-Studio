import React, { useState } from 'react';
import { Character } from '../types';
import { IMAGE_GENERATION_ERROR_PLACEHOLDER } from '../constants';

interface ResultScreenProps {
  totalScore: number;
  character: Character | null;
  onTryAgain: () => void;
  selectedMentorName?: string;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ 
  totalScore, 
  character, 
  onTryAgain, 
  selectedMentorName,
}) => {
  const [showManualCopyTextarea, setShowManualCopyTextarea] = useState(false);
  const [manualCopyText, setManualCopyText] = useState('');

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-900/50 backdrop-blur-md p-4 sm:p-6 text-center">
        <div className="bg-neutral-800/20 p-6 sm:p-8 rounded-xl shadow-xl border border-red-400/50">
          <h2 className="text-3xl sm:text-4xl font-bold text-red-300 mb-4">결과를 불러올 수 없어요!</h2>
          <p className="text-red-200 mb-6 sm:mb-8 text-base sm:text-lg">오류가 발생했습니다. 다시 시도해주세요.</p>
          <button
            onClick={onTryAgain}
            className="bg-white/5 backdrop-blur-md border-2 border-red-500 text-red-300 hover:bg-red-500 hover:text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg text-xl sm:text-2xl shadow-lg hover:shadow-xl hover:shadow-red-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            처음으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const characterImageToShow = character.imageUrl || IMAGE_GENERATION_ERROR_PLACEHOLDER;
  const appUrl = "https://ai-207798740007.us-west1.run.app/"; // Updated to the fixed URL
  const shareMessage = `제가 AI 프롬프트 어드벤처에서 ${totalScore}점을 받고 '${character.name}'(${character.animal})가 되었어요! 여러분도 도전해보세요! 이 앱은 초등학생들이 재미있게 프롬프트 작성법을 배우도록 도와준답니다. 지금 바로 참여해보세요: ${appUrl}`;

  const displayManualCopyFallback = (message: string) => {
    alert(message);
    setManualCopyText(shareMessage);
    setShowManualCopyTextarea(true);
  };

  const copyToClipboard = async () => {
    setShowManualCopyTextarea(false); // Reset first
    try {
      await navigator.clipboard.writeText(shareMessage);
      alert('공유 내용이 클립보드에 복사되었어요! 직접 붙여넣어 친구들에게 자랑해보세요! 🎉');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      displayManualCopyFallback('자동으로 클립보드에 복사하는 데 실패했어요. 브라우저가 HTTPS 환경이거나 권한이 허용되었는지 확인해주세요. 아래 텍스트를 직접 선택하여 복사해주세요.');
    }
  };

  const handleShare = async () => {
    if (!character) return;
    
    setShowManualCopyTextarea(false); // Reset any previous manual copy display

    const shareData: {
        title: string;
        text: string;
        url?: string;
    } = {
      title: 'AI 프롬프트 어드벤처 결과!',
      text: shareMessage,
    };

    if (appUrl && (appUrl.startsWith('http://') || appUrl.startsWith('https://'))) {
      shareData.url = appUrl;
    } else {
      console.warn('App URL is not a valid web URL for sharing or is missing:', appUrl);
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('결과 공유 성공 (Web Share API)');
      } catch (error: any) {
        console.warn('Web Share API 실패 또는 취소:', error);
        if (error.name === 'AbortError' || (error.message && error.message.toLowerCase().includes('share canceled'))) {
          displayManualCopyFallback('공유가 취소되었습니다. 대신 아래 텍스트를 직접 복사하여 공유할 수 있습니다.');
        } else {
          displayManualCopyFallback('공유 기능을 사용할 수 없습니다. 대신 아래 텍스트를 직접 복사하여 공유해 주세요.');
        }
      }
    } else {
      // Fallback if Web Share API is not supported
      await copyToClipboard();
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center">
      <div className="bg-neutral-800/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 w-full max-w-lg">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 sm:mb-3">최종 결과!</h2>
        {selectedMentorName && <p className="text-lg sm:text-xl text-gray-200 mb-1">{selectedMentorName} 멘토와의 여정 완료!</p>}
        <p className="text-6xl sm:text-7xl font-bold text-pink-300 my-4 sm:my-6">{totalScore}점</p>
        
        <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full mx-auto mb-4 sm:mb-6 border-4 sm:border-8 border-white/40 overflow-hidden flex items-center justify-center bg-neutral-800/20 shadow-lg">
          <img
            src={characterImageToShow}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-3xl sm:text-4xl font-bold text-white">{character.name} ({character.animal})</h3>
        <p className="text-lg sm:text-xl text-gray-200 mt-2 sm:mt-3 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-4">
          "{character.message}"
        </p>
        
        {showManualCopyTextarea && (
          <div className="my-4 p-3 bg-neutral-700/50 rounded-lg">
            <p className="text-sm text-gray-200 mb-2 text-left">아래 내용을 직접 복사하여 공유해주세요:</p>
            <textarea
              readOnly
              value={manualCopyText}
              className="w-full h-32 p-2 text-sm text-gray-100 bg-neutral-900/60 border border-neutral-600 rounded-md resize-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400"
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={() => setShowManualCopyTextarea(false)}
              className="mt-2 text-xs text-sky-300 hover:text-sky-200 underline"
            >
              닫기
            </button>
          </div>
        )}

        <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
          <button
            onClick={onTryAgain}
            className="w-full bg-white/5 backdrop-blur-md border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-slate-800 font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-xl text-xl sm:text-2xl shadow-lg hover:shadow-xl hover:shadow-yellow-400/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            다시 도전하기! 🚀
          </button>
          <button
            onClick={handleShare}
            className="w-full bg-white/5 backdrop-blur-md border-2 border-sky-500 text-sky-300 hover:bg-sky-500 hover:text-white font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-xl text-lg sm:text-xl shadow-lg hover:shadow-xl hover:shadow-sky-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
            aria-label="결과 공유하기"
          >
            결과 공유하기 📣
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;