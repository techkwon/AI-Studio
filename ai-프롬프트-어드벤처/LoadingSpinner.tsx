import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center my-8 p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-300 mb-3"></div>
      <p className="text-lg text-pink-200 font-semibold">잠시만 기다려주세요...</p>
    </div>
  );
};

export default LoadingSpinner;