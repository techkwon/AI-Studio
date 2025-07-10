
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full bg-slate-800/50 rounded-full h-5 md:h-6 shadow-inner overflow-hidden border border-white/10 glass-card-soft" style={{padding: '2.5px', backgroundClip: 'padding-box'}}>
      <div
        className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.25,1.25,0.5,1)] text-xs md:text-sm text-white/90 flex items-center justify-center font-bold relative overflow-hidden animated-shine"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`진행률 ${Math.round(percentage)}%`}
      >
       {current > 0 && total > 0 && `${current} / ${total}`}
      </div>
    </div>
  );
};

export default ProgressBar;