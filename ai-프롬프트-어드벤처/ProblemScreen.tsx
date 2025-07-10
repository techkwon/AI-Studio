import React, { useState, useEffect } from 'react';
import { Question, ScoreFeedback } from '../types';
// import LoadingSpinner from './LoadingSpinner'; // Replaced with inline loading display
import { IMAGE_GENERATION_ERROR_PLACEHOLDER, IMAGE_GENERATION_LOADING_PLACEHOLDER } from '../constants';

interface ProblemScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSubmitPrompt: (prompt: string) => Promise<void>;
  onNext: () => void;
  isLoading: boolean; // Loading for scoring
  currentScoreFeedback: ScoreFeedback | null;
  selectedMentorName?: string;
  mentorExpressionImage?: string | null; // Null initially, then URL or placeholder
  isExpressionImageLoading: boolean;
}

const ProblemScreen: React.FC<ProblemScreenProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onSubmitPrompt,
  onNext,
  isLoading, // For scoring
  currentScoreFeedback,
  selectedMentorName,
  mentorExpressionImage,
  isExpressionImageLoading,
}) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setUserPrompt('');
    setSubmitted(false);
  }, [question.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) {
      alert('프롬프트를 입력해주세요!');
      return;
    }
    setSubmitted(true); 
    await onSubmitPrompt(userPrompt);
  };
  
  const expressionImageToShow = isExpressionImageLoading
    ? IMAGE_GENERATION_LOADING_PLACEHOLDER
    : (mentorExpressionImage || IMAGE_GENERATION_ERROR_PLACEHOLDER);

  const getLoadingButtonText = () => {
    if (isLoading) return `${selectedMentorName || 'AI 조교'}님 채점 중...`;
    if (isExpressionImageLoading) return `${selectedMentorName || '멘토'} 표정 준비 중...`;
    return '제출하고 점수 확인하기';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
      <div className="bg-neutral-800/30 backdrop-blur-lg rounded-2xl shadow-xl p-5 sm:p-8 w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-pink-300 font-semibold text-sm sm:text-base">질문 {questionNumber} / {totalQuestions}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1">{question.topic}</h2>
          <p className="text-gray-200 mt-2 sm:mt-3 text-base sm:text-lg md:text-xl">{question.text}</p>
        </div>

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="userPrompt" className="block text-lg sm:text-xl font-medium text-gray-100 mb-1">
                AI에게 보낼 프롬프트를 작성해보세요:
              </label>
              <textarea
                id="userPrompt"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={4} 
                className="w-full p-2.5 sm:p-3 border-2 border-white/30 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-base sm:text-lg bg-neutral-900/40 text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="여기에 프롬프트를 입력하세요..."
                disabled={isLoading || isExpressionImageLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || isExpressionImageLoading}
              className="w-full bg-white/5 backdrop-blur-md border-2 border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out text-lg sm:text-xl disabled:bg-neutral-500/10 disabled:backdrop-blur-sm disabled:text-gray-400/80 disabled:border-gray-500/50 disabled:shadow-none disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              {getLoadingButtonText()}
            </button>
          </form>
        )}
        
        {submitted && (isLoading || isExpressionImageLoading) && (
          <div className="flex flex-col justify-center items-center my-6 sm:my-8 p-4">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-b-4 border-pink-300 mb-3"></div>
            <p className="text-pink-200 font-semibold text-center text-base sm:text-lg">
              {isLoading 
                ? `${selectedMentorName || 'AI 조교'}님이 열심히 채점 중이에요...`
                : (isExpressionImageLoading ? `${selectedMentorName || '멘토'}님의 표정을 준비하고 있어요...` : '잠시만 기다려주세요...')}
            </p>
          </div>
        )}
        
        {submitted && !isLoading && !isExpressionImageLoading && currentScoreFeedback && (
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-neutral-800/20 backdrop-blur-md rounded-lg border border-white/20 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 sm:mb-4 border-4 border-white/30 overflow-hidden flex items-center justify-center bg-neutral-800/10"> {/* Adjusted inner image container too */}
               {/* This inner loading for image should ideally not show if outer isExpressionImageLoading is false, but kept for safety */}
               {isExpressionImageLoading && ( 
                 <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-pink-300"></div>
               )}
               {!isExpressionImageLoading && (
                 <img 
                    src={expressionImageToShow}
                    alt={selectedMentorName ? `${selectedMentorName}의 표정` : '멘토 표정'} 
                    className="w-full h-full object-cover"
                 />
                )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-pink-200">
              {selectedMentorName ? `${selectedMentorName}의 ` : ''}채점 결과
            </h3>
            <p className="text-5xl sm:text-6xl font-bold text-white my-2 sm:my-3">{currentScoreFeedback.score}점</p>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed text-left px-1 sm:px-2 md:px-4">{currentScoreFeedback.feedback}</p>
            <button
              onClick={onNext}
              className="mt-5 sm:mt-6 w-full bg-white/5 backdrop-blur-md border-2 border-pink-500 text-pink-300 hover:bg-pink-500 hover:text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl hover:shadow-pink-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out text-lg sm:text-xl"
            >
              {questionNumber < totalQuestions ? '다음 문제로' : '결과 보기'}
            </button>
          </div>
        )}
         {submitted && !isLoading && !isExpressionImageLoading && !currentScoreFeedback && (
           <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-red-800/30 backdrop-blur-md rounded-lg border border-red-400/50 text-center">
            <img 
                src={IMAGE_GENERATION_ERROR_PLACEHOLDER}
                alt={'오류 발생'} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 sm:mb-4 border-4 border-red-400/50 object-cover opacity-70" 
            />
            <h3 className="text-xl sm:text-2xl font-bold text-red-300">오류</h3>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed px-1 sm:px-2 md:px-4">채점 결과를 가져오는 데 실패했습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.</p>
             <button
              onClick={() => { 
                setSubmitted(false); 
              }}
              className="mt-5 sm:mt-6 w-full bg-white/5 backdrop-blur-md border-2 border-red-500 text-red-300 hover:bg-red-500 hover:text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl hover:shadow-red-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out text-lg sm:text-xl"
            >
              다시 시도
            </button>
           </div>
         )}
      </div>
    </div>
  );
};

export default ProblemScreen;