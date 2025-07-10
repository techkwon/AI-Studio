
import React from 'react';

const LoadingPage: React.FC = () => {
  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3 animate-pulse">
        Gemini AI가 선생님만을 위한 리포트를 만들고 있어요...
      </h2>
      <p className="text-gray-600">
        세상에 단 하나뿐인 분석을 위해 잠시만 기다려주세요.
      </p>
    </div>
  );
};

export default LoadingPage;
