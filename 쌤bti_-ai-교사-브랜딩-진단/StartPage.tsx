
import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface StartPageProps {
  onStart: () => void;
}

const StartPage: React.FC<StartPageProps> = ({ onStart }) => {
  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center animate-fade-in-up">
      <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-6">
        <BrainCircuit size={48} />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">쌤BTI</h1>
      <h2 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-4">AI 교사 브랜딩 리포트</h2>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        정해진 유형에 나를 맞추는 진단은 이제 그만!
        <br />
        Gemini AI가 선생님의 답변을 실시간으로 분석하여, 세상에 단 하나뿐인 브랜딩 리포트를 만들어 드립니다.
      </p>
      <button
        onClick={onStart}
        className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-10 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        내 브랜딩 분석 시작하기
      </button>
      <p className="text-xs text-gray-400 mt-8">
        분석에는 약 10~15초가 소요될 수 있습니다.
      </p>
    </div>
  );
};

export default StartPage;
