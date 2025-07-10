
import React from 'react';
import SoundService, { SoundType } from '../services/SoundService';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
  lastAddedScore: number | null; 
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, highScore, lastAddedScore }) => {
  const [displayScore, setDisplayScore] = React.useState(score);
  const [showPop, setShowPop] = React.useState(false);

  React.useEffect(() => {
    if (score > displayScore && lastAddedScore) {
      setShowPop(true);
      SoundService.playSound(SoundType.SCORE_UP);
      setTimeout(() => setShowPop(false), 300); 
    }
    setDisplayScore(score);
  }, [score, lastAddedScore, displayScore]);

  return (
    <div className="flex justify-around items-center p-3 sm:p-4 glass-pane rounded-4xl shadow-lg select-none">
      <div className="text-center">
        <p className="text-base sm:text-lg text-sky-700 font-semibold font-korean" id="current-score-label">
          🌈 점수
        </p>
        <p 
          className={`text-4xl sm:text-5xl font-bold text-sky-600 font-english ${showPop ? 'score-popup' : ''}`}
          aria-labelledby="current-score-label"
        >
          {displayScore}
        </p>
      </div>
      <div className="text-center">
        <p className="text-base sm:text-lg text-amber-700 font-semibold font-korean" id="high-score-label">
          🏆 최고 점수
        </p>
        <p 
          className="text-4xl sm:text-5xl font-bold text-amber-500 font-english"
          aria-labelledby="high-score-label"
        >
          {highScore}
        </p>
      </div>
    </div>
  );
};

export default ScoreDisplay;