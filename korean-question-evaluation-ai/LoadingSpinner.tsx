
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-8" aria-label="로딩 중">
      <div className="w-12 h-12 border-4 border-slate-400 border-t-sky-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
